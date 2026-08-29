import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const [rootArgument, configArgument] = process.argv.slice(2);
if (!rootArgument || !configArgument) {
  throw new Error('Usage: node check-manager-content.mjs <site-root> <client-config>');
}

const siteRoot = path.resolve(rootArgument);
const config = JSON.parse(await readFile(path.resolve(configArgument), 'utf8'));
const configuredRoot = path.resolve(String(config.siteRoot || ''));
const htmlFiles = await listHtmlFiles(siteRoot);
const htmlDocuments = await Promise.all(htmlFiles.map(async (filePath) => ({
  filePath,
  html: await readFile(filePath, 'utf8'),
})));

let imageCount = 0;
for (const slot of Array.isArray(config.imageSlots) ? config.imageSlots : []) {
  const configuredPath = path.resolve(String(slot.currentPath || ''));
  if (!isInside(configuredRoot, configuredPath)) throw new Error(`Image slot escapes siteRoot: ${slot.id}`);
  const targetPath = path.join(siteRoot, path.relative(configuredRoot, configuredPath));
  if (!isInside(siteRoot, targetPath) || !(await exists(targetPath))) throw new Error(`Managed image is missing: ${slot.id}`);
  const publicPath = String(slot.publicPath || '').trim();
  if (!publicPath || !htmlDocuments.some(({ html }) => html.includes(publicPath))) {
    throw new Error(`Managed image is not referenced by generated HTML: ${slot.id}`);
  }
  imageCount += 1;
}

let textCount = 0;
for (const slot of Array.isArray(config.textSlots) ? config.textSlots : []) {
  const configuredPath = path.resolve(String(slot.filePath || ''));
  if (!isInside(configuredRoot, configuredPath)) throw new Error(`Text slot escapes siteRoot: ${slot.id}`);
  const targetPath = path.join(siteRoot, path.relative(configuredRoot, configuredPath));
  if (!isInside(siteRoot, targetPath) || !(await exists(targetPath))) throw new Error(`Managed text file is missing: ${slot.id}`);
  const html = await readFile(targetPath, 'utf8');
  const marker = String(slot.marker || slot.id || '').trim();
  if (markerMatches(html, marker).length !== 1) throw new Error(`Managed text marker must appear exactly once: ${marker}`);
  textCount += 1;
}

console.log(`[OK] Manager Site contract verified: images=${imageCount}, text=${textCount}`);

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
