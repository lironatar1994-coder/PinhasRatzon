from pathlib import Path
import shutil,json,hashlib
from PIL import Image
base=Path(__file__).resolve().parent
mapping=json.loads((base/'generated.json').read_text(encoding='utf-8-sig'))
out=base/'corrected'; out.mkdir(exist_ok=True)
manifest=[]
for name,src in mapping.items():
 shutil.copy2(src,out/(name+'.png'))
 original=Image.open(base/'originals'/'img'/(name+'.jpg'))
 im=Image.open(src).convert('RGB').resize(original.size,Image.Resampling.LANCZOS)
 for ext in ['jpg','webp']:
  dest=out/(name+'.'+ext)
  im.save(dest,quality=94)
  Image.open(dest).verify()
  manifest.append({'name':dest.name,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'size':list(original.size)})
(base/'manifest.json').write_text(json.dumps(manifest,indent=2))
print('Validated',len(manifest),'web assets')

