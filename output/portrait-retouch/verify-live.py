from pathlib import Path
import json,hashlib,urllib.request,re
base=Path(__file__).resolve().parent
manifest=json.loads((base/'manifest.json').read_text())
for item in manifest:
 url='https://pinhasratzon.co.il/assets/img/'+item['name']+'?v=retouch-20260914'
 with urllib.request.urlopen(url) as r:
  data=r.read(); assert r.status==200; assert r.headers['Content-Type'].startswith('image/')
 assert hashlib.sha256(data).hexdigest()==item['sha256'],item['name']
for route in ['/','/about/','/contact/','/faq/','/practice-areas/']:
 with urllib.request.urlopen('https://pinhasratzon.co.il'+route) as r:
  html=r.read().decode(); assert r.status==200
 refs=re.findall(r'/assets/img/[^\s"<>]+',html)
 names={i['name'] for i in manifest}
 for ref in refs:
  if ref.split('/')[-1].split('?')[0] in names: assert '?v=retouch-20260914' in ref,ref
 print(route,'HTTP 200, corrected image URLs verified')
print('All',len(manifest),'public image hashes match delivered files')
