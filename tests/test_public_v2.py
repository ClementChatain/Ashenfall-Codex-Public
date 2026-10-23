import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from verify_public_v2 import digest,files_digest,verify,records_from_html

class PublicTests(unittest.TestCase):
    def fixture(self,root):
        (root/'site').mkdir();(root/'publication').mkdir()
        entry={'id':'existing','category':'lore','title':'TEST','summary':'TEST','body':'Texte historique TEST'}
        self.write_records(root,[entry])
        (root/'publication/legacy-baseline.json').write_text(json.dumps({'records':{entry['id']:digest(entry)}}))
        (root/'publication/v2-release.json').write_text(json.dumps({'schema_version':2,'source_commit':'a'*40,'files':files_digest(root),'receipts':[]}))
        return entry
    def write_records(self,root,records):
        (root/'site/index.html').write_text('const records='+json.dumps(records)+';\nconst data=records.map(e=>e.id);')
    def resign_files(self,root):
        p=root/'publication/v2-release.json';m=json.loads(p.read_text());m['files']=files_digest(root);p.write_text(json.dumps(m));return m
    def test_baseline_passes(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);self.fixture(r);self.assertEqual(verify(r),1)
    def test_unchanged_legacy_records_can_be_redeployed(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);self.fixture(r)
            self.assertEqual(verify(r,for_deployment=True),1)
    def test_changed_legacy_record_still_requires_receipt_at_deployment(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);e=self.fixture(r)
            e['body']='unauthorized edit';self.write_records(r,[e]);self.resign_files(r)
            with self.assertRaises(ValueError):verify(r,for_deployment=True)
    def test_new_record_still_requires_receipt_at_deployment(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);e=self.fixture(r)
            self.write_records(r,[e,dict(e,id='new')]);self.resign_files(r)
            with self.assertRaises(ValueError):verify(r,for_deployment=True)
    def test_direct_html_change_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);e=self.fixture(r);e['body']='change';self.write_records(r,[e])
            with self.assertRaises(ValueError):verify(r)
    def test_changed_record_needs_receipt_even_with_new_file_hash(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);e=self.fixture(r);e['body']='change';self.write_records(r,[e]);self.resign_files(r)
            with self.assertRaises(ValueError):verify(r)
    def test_new_asset_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);self.fixture(r);(r/'site/private.txt').write_text('CANARY')
            with self.assertRaises(ValueError):verify(r)
    def test_symlinks_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);self.fixture(r);(r/'site/link').symlink_to(r/'site/index.html')
            with self.assertRaises(ValueError):verify(r)
    def test_valid_new_record(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);e=self.fixture(r);new=dict(e,id='new');self.write_records(r,[e,new])
            m=self.resign_files(r);m['receipts']=[{'id':'new','version':'1.0','status':'VALIDE','visibility':'PUBLIC','projection_sha256':digest(new),'validated_by':'ClementChatain','publication_authorized_by':'ClementChatain'}]
            (r/'publication/v2-release.json').write_text(json.dumps(m));self.assertEqual(verify(r),2)
            for field,value in [('status','PROPOSITION'),('visibility','SECRET_AUTEUR'),('projection_sha256','bad')]:
                bad=copy.deepcopy(m);bad['receipts'][0][field]=value;(r/'publication/v2-release.json').write_text(json.dumps(bad))
                with self.subTest(field=field),self.assertRaises(ValueError):verify(r)
    def test_duplicate_and_private_fields_rejected(self):
        e={'id':'test','category':'lore','title':'TEST','summary':'TEST','body':'TEST'}
        for records in ([e,e],[dict(e,internal_notes='PRIVATE')]):
            with self.assertRaises(ValueError):records_from_html('const records='+json.dumps(records)+';const data=records.map(e=>e.id);')
    def test_historical_deletion_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);self.fixture(r);self.write_records(r,[]);self.resign_files(r)
            with self.assertRaises(ValueError):verify(r)


class ApplyTests(unittest.TestCase):
    fixture=PublicTests.fixture
    write_records=PublicTests.write_records
    resign_files=PublicTests.resign_files
    def test_apply_preserves_artwork_and_guides(self):
        from apply_public_v2 import apply
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);e=self.fixture(r)
            e.update(artwork={'src':'existing.webp'},usageGuide={'objective':'historical'})
            self.write_records(r,[e]);b=json.loads((r/'publication/legacy-baseline.json').read_text());b['records'][e['id']]=digest(e);b['metadata']={e['id']:digest({k:e[k] for k in ('artwork','usageGuide')})};(r/'publication/legacy-baseline.json').write_text(json.dumps(b));self.resign_files(r)
            projection={k:e[k] for k in ('id','category','title','summary','body')};projection['body']='Updated public test text'
            receipt={'id':e['id'],'version':'1.0','status':'VALIDE','visibility':'PUBLIC','projection_sha256':digest(projection),'validated_by':'ClementChatain','publication_authorized_by':'ClementChatain'}
            apply(r,{'schema_version':2,'records':[projection],'receipts':[receipt]},'b'*40)
            result=records_from_html((r/'site/index.html').read_text())[0]
            self.assertEqual(result['artwork'],e['artwork']);self.assertEqual(result['usageGuide'],e['usageGuide']);self.assertEqual(result['body'],projection['body']);self.assertEqual(verify(r),1)
    def test_failed_apply_rolls_back_files(self):
        from apply_public_v2 import apply
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);e=self.fixture(r);original=(r/'site/index.html').read_bytes();manifest=(r/'publication/v2-release.json').read_bytes()
            projection=dict(e,body='changed');receipt={'id':e['id'],'version':'1.0','status':'PROPOSITION','visibility':'PUBLIC','projection_sha256':digest(projection),'validated_by':'ClementChatain','publication_authorized_by':'ClementChatain'}
            with self.assertRaises(ValueError):apply(r,{'schema_version':2,'records':[projection],'receipts':[receipt]},'b'*40)
            self.assertEqual((r/'site/index.html').read_bytes(),original);self.assertEqual((r/'publication/v2-release.json').read_bytes(),manifest)
    def test_empty_bundle_does_not_change_site(self):
        from apply_public_v2 import apply
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);self.fixture(r)
            with self.assertRaises(ValueError):apply(r,{'schema_version':2,'records':[],'receipts':[]},'b'*40)
    def test_script_breakout_is_escaped(self):
        from apply_public_v2 import apply
        with tempfile.TemporaryDirectory() as d:
            r=Path(d);e=self.fixture(r);new=dict(e,id='new',body='</script><script>CANARY</script>')
            receipt={'id':'new','version':'1.0','status':'VALIDE','visibility':'PUBLIC','projection_sha256':digest(new),'validated_by':'ClementChatain','publication_authorized_by':'ClementChatain'}
            apply(r,{'schema_version':2,'records':[new],'receipts':[receipt]},'b'*40)
            self.assertNotIn(new['body'],(r/'site/index.html').read_text());self.assertEqual(verify(r),2)

if __name__=='__main__':unittest.main()
