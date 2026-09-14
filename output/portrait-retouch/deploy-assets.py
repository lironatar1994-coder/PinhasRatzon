from pathlib import Path
import json,hashlib,shutil,re,datetime,os
base=Path('/tmp/ratzon-retouch-20260914')
root=Path('/var/www/PinhasRatzon-domain')
source=Path('/root/PinhasRatzon/site/public/assets/img')
manifest=json.loads((base/'manifest.json').read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
for item in manifest:
 assert sha(base/'corrected'/item['name'])==item['sha256']
backup=Path('/root/portrait-retouch-backups')/datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
backup.mkdir(parents=True)
shutil.copytree(root,backup/'web-root')
shutil.copytree(source,backup/'source-images')
config=Path('/root/Manager_Site/data/clients/pinhas_ratzon/client.config.json')
config_hash=sha(config)
shutil.copy2(config,backup/'client.config.json')
old={str(p.relative_to(root)):sha(p) for p in root.rglob('*') if p.is_file()}
changed=set()
for item in manifest:
 for destdir in [root/'assets/img',source]:
  dest=destdir/item['name']; temp=dest.with_name(dest.name+'.retouch-tmp')
  shutil.copyfile(base/'corrected'/item['name'],temp); os.chmod(temp,0o644); os.replace(temp,dest)
 changed.add('assets/img/'+item['name'])
names='|'.join(re.escape(i['name']) for i in manifest)
pattern=re.compile(r'(/assets/img/(?:'+names+r'))(?:\?[^\s"<>]*)?')
for p in root.rglob('*.html'):
 original=p.read_text(); edited=pattern.sub(r'\1?v=retouch-20260914',original)
 if original!=edited:
  temp=p.with_name(p.name+'.retouch-tmp'); temp.write_text(edited); os.chmod(temp,0o644); os.replace(temp,p)
  changed.add(str(p.relative_to(root)))
assert sha(config)==config_hash
for name,h in old.items():
 if name not in changed: assert sha(root/name)==h,name
for item in manifest: assert sha(root/'assets/img'/item['name'])==item['sha256']
print(json.dumps({'backup':str(backup),'changed':sorted(changed),'cms_config_unchanged':True,'unrelated_files_unchanged':True},indent=2))
