import { access, copyFile, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [stageArgument, liveArgument, configArgument] = process.argv.slice(2);
if (!stageArgument || !liveArgument || !configArgument) {
  throw new Error('Usage: node apply-manager-content.mjs <stage-root> <live-root> <client-config>');
}

const stageRoot = path.resolve(stageArgument);
const liveRoot = path.resolve(liveArgument);
const configPath = path.resolve(configArgument);

if (!(await exists(configPath)) || !(await exists(liveRoot))) {
  console.log('[INFO] No existing Manager Site content to preserve.');
  process.exit(0);
}

const config = JSON.parse(await readFile(configPath, 'utf8'));
const configuredRoot = path.resolve(String(config.siteRoot || ''));
let imageCount = 0;
let textCount = 0;
let referenceCount = 0;

for (const slot of Array.isArray(config.imageSlots) ? config.imageSlots : []) {
  const configuredPath = path.resolve(String(slot.currentPath || ''));
  if (!isInside(configuredRoot, configuredPath)) continue;
  const relativePath = path.relative(configuredRoot, configuredPath);
  const livePath = path.join(liveRoot, relativePath);
  if (!isInside(liveRoot, livePath) || !(await exists(livePath))) continue;
  const stagePath = path.join(stageRoot, relativePath);
  if (!isInside(stageRoot, stagePath) || !(await exists(stagePath))) {
    throw new Error(`Managed image is missing from the staged build: ${slot.id || livePath}`);
  }
  await copyFile(livePath, stagePath);
  imageCount += 1;
}

for (const slot of Array.isArray(config.textSlots) ? config.textSlots : []) {
  const configuredPath = path.resolve(String(slot.filePath || ''));
  if (!isInside(configuredRoot, configuredPath)) continue;
  const relativePath = path.relative(configuredRoot, configuredPath);
  const livePath = path.join(liveRoot, relativePath);
  if (!isInside(liveRoot, livePath) || !(await exists(livePath))) continue;
  const stagePath = path.join(stageRoot, relativePath);
  if (!isInside(stageRoot, stagePath) || !(await exists(stagePath))) {
    throw new Error(`Managed text file is missing from the staged build: ${slot.id || livePath}`);
  }
  const marker = String(slot.marker || slot.id || '').trim();
  const liveHtml = await readFile(livePath, 'utf8');
  const liveMatches = markerMatches(liveHtml, marker);
  if (liveMatches.length === 0) continue;
  if (liveMatches.length !== 1) throw new Error(`Live text marker must be unique: ${marker}`);
  const stageHtml = await readFile(stagePath, 'utf8');
  const stageMatches = markerMatches(stageHtml, marker);
  if (stageMatches.length !== 1) throw new Error(`Staged text marker must be unique: ${marker}`);
  const match = stageMatches[0];
  const nextHtml = `${stageHtml.slice(0, match.index)}${match[1]}${liveMatches[0][3]}${match[4]}${stageHtml.slice(match.index + match[0].length)}`;
  await writeFile(stagePath, nextHtml);
  textCount += 1;
}

const liveHtmlFiles = await listHtmlFiles(liveRoot);
for (const livePath of liveHtmlFiles) {
  const stagePath = path.join(stageRoot, path.relative(liveRoot, livePath));
  if (!isInside(stageRoot, stagePath) || !(await exists(stagePath))) continue;
  const liveHtml = await readFile(livePath, 'utf8');
  let stageHtml = await readFile(stagePath, 'utf8');
  let changed = false;
  for (const slot of Array.isArray(config.imageSlots) ? config.imageSlots : []) {
    const publicPath = String(slot.publicPath || '').trim();
    if (!publicPath) continue;
    const escapedPath = escapeRegExp(publicPath);
    const liveReference = liveHtml.match(new RegExp(`${escapedPath}\\?v=[^"'\\s>]+`))?.[0];
    if (!liveReference) continue;
    const stagePattern = new RegExp(`${escapedPath}(?:\\?v=[^"'\\s>]+)?`, 'g');
    const nextHtml = stageHtml.replace(stagePattern, liveReference);
    if (nextHtml !== stageHtml) {
      stageHtml = nextHtml;
      changed = true;
      referenceCount += 1;
    }
  }
  if (changed) await writeFile(stagePath, stageHtml);
}

// Approved editorial migrations only replace the known old wording. A newer
// client edit wins, and subsequent releases leave the approved text in place.
const updatesPath = fileURLToPath(new URL('./managed-text-updates.json', import.meta.url));
if (await exists(updatesPath)) {
  const { updates } = JSON.parse(await readFile(updatesPath, 'utf8'));
  for (const update of updates) {
    if (typeof update.from !== 'string' || typeof update.to !== 'string') throw new Error('Invalid managed text update');
    const slot = config.textSlots.find(slot => (slot.marker || slot.id) === update.marker);
    if (!slot) throw new Error(`Unknown managed text update: ${update.marker}`);
    const configuredPath = path.resolve(slot.filePath);
    if (!isInside(configuredRoot, configuredPath)) throw new Error('Managed text update escapes site root');
    const target = path.join(stageRoot, path.relative(configuredRoot, configuredPath));
    if (!isInside(stageRoot, target)) throw new Error('Managed text update escapes staged root');
    const html = await readFile(target, 'utf8');
    const matches = markerMatches(html, update.marker);
    if (matches.length !== 1) throw new Error(`Managed text update marker must be unique: ${update.marker}`);
    const match = matches[0];
    if (match[3] === update.from) {
      await writeFile(target, `${html.slice(0, match.index)}${match[1]}${update.to}${match[4]}${html.slice(match.index + match[0].length)}`);
      console.log(`[INFO] Applied approved text update: ${update.marker}`);
    } else if (match[3] !== update.to) {
      console.log(`[INFO] Retained newer client wording: ${update.marker}`);
    }
  }
}

console.log(`[INFO] Preserved Manager Site content: images=${imageCount}, text=${textCount}, references=${referenceCount}`);

async function exists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function isInside(root, targetPath) {
  const relative = path.relative(root, targetPath);
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function markerMatches(html, marker) {
  const markerPattern = escapeRegExp(marker);
  const pattern = new RegExp(`(<([a-zA-Z][\\w:-]*)(?=[^>]*\\sdata-manager-text=["']${markerPattern}["'])[^>]*>)([\\s\\S]*?)(<\\/\\2>)`, 'g');
  return [...html.matchAll(pattern)];
}

async function listHtmlFiles(root) {
  const files = [];
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.resolve(directory, entry.name);
      if (!isInside(root, entryPath)) continue;
      if (entry.isDirectory()) await walk(entryPath);
      if (entry.isFile() && /\.html?$/i.test(entry.name)) files.push(entryPath);
    }
  }
  await walk(root);
  return files;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
