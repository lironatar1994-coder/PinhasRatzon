// Local preview of dist/. Run `node build.mjs && node serve.mjs`, then open
// http://localhost:4173. Not for production — any static host serves dist/ directly.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_PATH } from './src/site.mjs';

const DIST = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  let path = decodeURIComponent(req.url.split('?')[0]);
  // The build prefixes every URL with BASE_PATH (the live site lives under
  // lawebs.co.il/PinhasRatzon). Locally we serve dist/ at the root, so the
  // prefix is stripped — both /x and /PinhasRatzon/x resolve.
  if (BASE_PATH && path.startsWith(BASE_PATH)) path = path.slice(BASE_PATH.length) || '/';
  const candidates = extname(path)
    ? [join(DIST, path)]
    : [join(DIST, path, 'index.html'), join(DIST, path.replace(/\/$/, '') + '.html')];

  for (const file of candidates) {
    try {
      const buf = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
      return res.end(buf);
    } catch { /* try next */ }
  }

  try {
    const buf = await readFile(join(DIST, '404.html'));
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    return res.end(buf);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(PORT, () => console.log(`preview: http://localhost:${PORT}`));
