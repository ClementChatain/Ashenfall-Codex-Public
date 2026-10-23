"""Apply an approved V2 bundle to a public checkout and bind the exact deployment bytes."""
import argparse
import json
from pathlib import Path
import re
import sys


def apply(root,bundle,source_commit):
    root=Path(root)
    sys.path.insert(0,str(root/'scripts'))
    from verify_public_v2 import require, records_from_html, digest, files_digest, verify
    verify(root)  # Never silently bless a dirty public checkout.
    require(set(bundle)=={'schema_version','records','receipts'} and bundle['schema_version']==2,'Invalid bundle')
    entries=bundle['records']; receipts=bundle['receipts']
    require(len({e['id'] for e in entries})==len(entries),'Duplicate incoming ids')
    require(len({e['id'] for e in receipts})==len(receipts),'Duplicate incoming receipts')
    require({e['id'] for e in entries}=={r['id'] for r in receipts},'Missing receipt')
    require(bool(entries),'Empty export: no public change authorized')
    for entry in entries:
        receipt=next(r for r in receipts if r['id']==entry['id'])
        require(receipt['projection_sha256']==digest(entry),'Projection mismatch')
    html_path=root/'site/index.html'; original=html_path.read_text(encoding='utf-8')
    existing=records_from_html(original)
    incoming={e['id']:e for e in entries}
    # Preserve order and every historical record; replace only selected ids.
    records=[{**e, **incoming.pop(e['id'],{})} for e in existing]+list(incoming.values())
    payload=json.dumps(records,ensure_ascii=False).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
    updated=re.sub(r'(const records\s*=\s*)\[.*?\](;\s*const data=records\.map)',lambda m:m.group(1)+payload+m.group(2),original,count=1,flags=re.S)
    old_manifest=(root/'publication/v2-release.json').read_text(encoding='utf-8')
    previous=json.loads(old_manifest)
    old_receipts={r['id']:r for r in previous['receipts']}
    old_receipts.update({r['id']:r for r in receipts})
    baseline=json.loads((root/'publication/legacy-baseline.json').read_text(encoding='utf-8'))
    current={e['id']:e for e in records}
    all_receipts=[r for key,r in sorted(old_receipts.items()) if digest(current[key])!=baseline['records'].get(key)]
    try:
        html_path.write_text(updated,encoding='utf-8')
        manifest={'schema_version':2,'source_commit':source_commit,'files':files_digest(root),'receipts':all_receipts}
        (root/'publication/v2-release.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        verify(root)
    except Exception:
        html_path.write_text(original,encoding='utf-8')
        (root/'publication/v2-release.json').write_text(old_manifest,encoding='utf-8')
        raise


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--public-root',type=Path,required=True);p.add_argument('--bundle',type=Path,required=True);p.add_argument('--source-commit',required=True);a=p.parse_args()
    apply(a.public_root,json.loads(a.bundle.read_text(encoding='utf-8')),a.source_commit)
