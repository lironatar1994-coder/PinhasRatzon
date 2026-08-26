// Read the stored contact-form submissions.
//
//   node leads.mjs           the last 20, newest first
//   node leads.mjs 100       the last 100
//   node leads.mjs --unsent  only the ones no email went out for
//
// The file is the record of every submission; the notification email is only a
// convenience on top of it.

import { readFile } from 'node:fs/promises';

const FILE = process.env.LEADS_FILE || '/var/lib/pinhas-ratzon/leads.jsonl';
const args = process.argv.slice(2);
const unsentOnly = args.includes('--unsent');
const limit = Number(args.find((a) => /^\d+$/.test(a)) || 20);

let raw;
try {
  raw = await readFile(FILE, 'utf8');
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log(`No submissions yet (${FILE} does not exist).`);
    process.exit(0);
  }
  throw e;
}

const rows = raw
  .split('\n')
  .filter(Boolean)
  .map((line, i) => {
    try {
      return JSON.parse(line);
    } catch {
      console.error(`[warn] line ${i + 1} is not valid JSON, skipped`);
      return null;
    }
  })
  .filter(Boolean)
  .filter((r) => (unsentOnly ? r.mailed === false : true));

const shown = rows.slice(-limit).reverse();
const when = (iso) => new Date(iso).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

for (const r of shown) {
  const flag = r.mailed === false ? '  [לא נשלח מייל]' : '';
  console.log('─'.repeat(60));
  console.log(`${when(r.at)}${flag}`);
  console.log(`${r.name}   ${r.phone}   ${r.topic || '—'}`);
  if (r.message) console.log('\n' + r.message);
  if (r.mailError) console.log(`\n(שגיאת שליחה: ${r.mailError})`);
}
console.log('─'.repeat(60));
console.log(`${shown.length} of ${rows.length} submission(s)${unsentOnly ? ' with no email sent' : ''}.`);
