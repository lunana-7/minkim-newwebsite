from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
with ZipFile(root/'public/alignment-world/unity-project.zip','w',ZIP_DEFLATED) as z:
 for p in (root/'unity/AlignmentWorld').rglob('*'):
  if p.is_file() and not any(x in p.parts for x in ['Library','Temp','Logs','Obj','UserSettings']):z.write(p,p.relative_to(root/'unity'))
print('Packaged Unity project source, not a compiled player.')
