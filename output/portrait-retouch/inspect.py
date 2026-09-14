import pathlib,re,json
root=pathlib.Path('/var/www/PinhasRatzon-domain')
refs=set()
for p in root.rglob('*.html'):
 refs.update(re.findall(r'/assets/img/[^\s"<>]+',p.read_text()))
print('\n'.join(sorted(refs)))
p=pathlib.Path('/root/Manager_Site/data/clients/pinhas_ratzon/client.config.json')
if p.exists():
 d=json.loads(p.read_text()); print('CMS keys:',list(d)); print(json.dumps(d.get('images',[]),ensure_ascii=False))
print(json.dumps(d.get('imageSlots',[]),ensure_ascii=False))
