"""Check the full deployed file set and V2 receipts against frozen legacy content."""
import argparse
import hashlib
import json
from pathlib import Path
import re


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(value):
    return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',', ':')).encode()).hexdigest()


def read_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def records_from_html(text):
    matches=list(re.finditer(r'const records\s*=\s*(\[.*?\]);\s*const data=records\.map',text,re.S))
    require(len(matches)==1, 'Ambiguous or missing records block')
    records=json.loads(matches[0].group(1))
    require(isinstance(records,list),'Invalid records')
    require(all(isinstance(e,dict) and {'id','category','title','summary','body'} <= set(e) and set(e) <= {'id','category','title','summary','body','artwork','usageGuide'} and all(isinstance(e[k],str) for k in ('id','category','title','summary','body')) for e in records),'Invalid public schema')
    require(len({e['id'] for e in records})==len(records),'Duplicate record ids')
    return records


def files_digest(root):
    site=Path(root)/'site'
    require(site.is_dir() and not site.is_symlink(),'Invalid site directory')
    files={}
    for path in sorted(site.rglob('*')):
        require(not path.is_symlink(),'Symlinks forbidden')
        if path.is_file():
            data=path.read_bytes()
            files[path.relative_to(root).as_posix()]=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
    return files


def verify(root, for_deployment=False):
    root=Path(root)
    approved=read_json(root/'publication/v2-release.json')
    baseline=read_json(root/'publication/legacy-baseline.json')
    require(set(approved)=={'schema_version','source_commit','files','receipts'},'Invalid release manifest')
    require(approved['schema_version']==2,'Invalid release version')
    require(re.fullmatch(r'[0-9a-f]{40}',approved['source_commit'] or ''),'Missing source commit')
    require(files_digest(root)==approved['files'],'Unapproved site bytes or assets')
    records=records_from_html((root/'site/index.html').read_text(encoding='utf-8'))
    receipts=approved['receipts']
    require(isinstance(receipts,list) and len({r['id'] for r in receipts})==len(receipts),'Invalid receipts')
    indexed={r['id']:r for r in receipts}
    used=set()
    for entry in records:
        key=entry['id']
        if baseline['records'].get(key)==digest(entry) and key not in indexed:
            continue  # Frozen historical records remain unchanged; not reclassified as V2 canon.
        projection={k:entry[k] for k in ('id','category','title','summary','body')}
        inherited={k:v for k,v in entry.items() if k not in projection}
        require(baseline.get('metadata',{}).get(key,digest({}))==digest(inherited),'Unapproved ancillary record fields')
        require(key in indexed,'New or changed record requires a V2 receipt')
        receipt=indexed[key]; used.add(key)
        require(set(receipt)=={'id','version','status','visibility','projection_sha256','validated_by','publication_authorized_by'},'Unexpected receipt metadata')
        require(receipt['status']=='VALIDE' and receipt['visibility']=='PUBLIC','Nonvalidated public content')
        require(receipt['validated_by']=='ClementChatain' and receipt['publication_authorized_by']=='ClementChatain' and receipt['version'],'Missing authorization')
        require(receipt['projection_sha256']==digest(projection),'Stale receipt')
    require(used==set(indexed),'Unused or duplicate receipt')
    require(set(baseline['records']) <= {e['id'] for e in records},'Historical record removed without migration')
    return len(records)


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]);p.add_argument('--for-deployment',action='store_true');args=p.parse_args()
    print(f'Public V2 preflight OK: {verify(args.root, args.for_deployment)} records')
