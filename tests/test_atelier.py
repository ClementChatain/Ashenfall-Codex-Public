"""Private atelier boundary and collaboration tests; synthetic data only."""
import hashlib
import http.client
import importlib.util
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest

spec=importlib.util.spec_from_file_location('atelier_server',Path(__file__).resolve().parents[1]/'atelier/server.py')
app=importlib.util.module_from_spec(spec);spec.loader.exec_module(app)
PASSWORD='synthetic-test-only-password'
HASH=app.password_hash(PASSWORD)


def node(ident='test-node',parent=''):
    return {'id':ident,'parent':parent,'title':'Test, non canonique','body':'Contenu synthétique','status':'ideas','tag':'Test','color':'gold','x':10,'y':20,'attachments':[]}


class WorkshopTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.db=Path(self.temp.name)/'workshop.sqlite';app.init_db(self.db)
        with app.connect(self.db) as db:
            db.executemany('INSERT INTO users VALUES(?,?,?,?)',[('a','Author',HASH,'author'),('r','Reviewer',HASH,'reviewer')])
        self.server=app.WorkshopServer(('127.0.0.1',0),self.db);self.port=self.server.server_address[1];self.origin=f'http://127.0.0.1:{self.port}'
        self.thread=threading.Thread(target=self.server.serve_forever,daemon=True);self.thread.start()
        self.cookie='';self.csrf=''
    def tearDown(self):
        self.server.shutdown();self.server.server_close();self.thread.join();self.temp.cleanup()
    def request(self,path,body=None,headers=None):
        h={'Origin':self.origin,'Cookie':self.cookie,'X-CSRF-Token':self.csrf,**(headers or {})}
        if body is not None and not isinstance(body,bytes):body=json.dumps(body).encode();h['Content-Type']='application/json'
        conn=http.client.HTTPConnection('127.0.0.1',self.port,timeout=10);conn.request('GET' if body is None else 'POST',path,body,h);r=conn.getresponse();raw=r.read();rh=dict(r.getheaders());status=r.status;conn.close()
        try:data=json.loads(raw)
        except (ValueError,UnicodeDecodeError):data=raw
        return status,data,rh
    def login(self,name='Author'):
        status,_,headers=self.request('/api/login',{'name':name,'password':PASSWORD});self.assertEqual(status,200);self.cookie=headers['Set-Cookie'].split(';')[0];status,state,_=self.request('/api/state');self.csrf=state['csrf'];return state
    def put(self,nodes=None,revision=0,**extras):
        return self.request('/api/workspace',{'revision':revision,'document':{'nodes':nodes or [node()],'edges':extras.get('edges',[]),'strokes':extras.get('strokes',[])}})
    def test_private_state_files_exports_require_session(self):
        for route in ['/api/state','/api/files/anything','/api/export']:
            self.assertEqual(self.request(route)[0],401)
        self.assertEqual(self.request('/server.py')[0],404)
        self.assertEqual(self.request('/../server.py')[0],404)
    def test_login_cookie_logout_and_csrf(self):
        status,_,h=self.request('/api/login',{'name':'Author','password':PASSWORD});self.assertEqual(status,200);self.assertIn('HttpOnly',h['Set-Cookie']);self.assertIn('SameSite=Strict',h['Set-Cookie'])
        self.login();self.assertEqual(self.request('/api/logout',{},headers={'X-CSRF-Token':''})[0],403)
        self.assertEqual(self.request('/api/logout',{})[0],200);self.assertEqual(self.request('/api/state')[0],401)
    def test_wrong_origin_and_no_csrf_block_writes(self):
        self.assertEqual(self.request('/api/login',{'name':'Author','password':PASSWORD},headers={'Origin':'https://evil.invalid'})[0],403)
        self.login()
        self.assertEqual(self.request('/api/comments',{},headers={'X-CSRF-Token':'bad'})[0],403)
    def test_revision_conflict_preserves_shared_work_and_history(self):
        self.login();self.assertEqual(self.put()[0],200)
        replacement=node();replacement['body']='Do not overwrite'
        self.assertEqual(self.put([replacement],revision=0)[0],409)
        self.assertEqual(self.request('/api/state')[1]['document']['nodes'][0]['body'],'Contenu synthétique')
        with app.connect(self.db) as db:self.assertEqual(db.execute('SELECT count(*) FROM history').fetchone()[0],1)
    def test_cycles_or_missing_parents_rejected(self):
        self.login()
        for nodes in [[node('one','one')],[node('one','absent')],[node('one','two'),node('two','one')]]:self.assertEqual(self.put(nodes)[0],400)
        self.assertEqual(self.put([node('one'),node('two','one')])[0],200)
    def test_document_rejects_injected_validation_and_invalid_ids(self):
        self.login();n=node();n['approved']=True;self.assertEqual(self.put([n])[0],400)
        n=node('bad\"]');self.assertEqual(self.put([n])[0],400)
        n=node();n['x']=float('nan');self.assertEqual(self.put([n])[0],400)
    def test_only_reviewer_validates_exact_revision_without_children(self):
        self.login();self.put([node('parent'),node('child','parent')]);self.assertEqual(self.request('/api/validate',{'node':'parent','revision':1})[0],403)
        self.login('Reviewer');self.assertEqual(self.request('/api/validate',{'node':'parent','revision':0})[0],409)
        self.assertEqual(self.request('/api/validate',{'node':'parent','revision':1})[0],201)
        approvals=self.request('/api/state')[1]['approvals'];self.assertEqual(len(approvals),1);self.assertEqual(approvals[0]['node_id'],'parent');self.assertEqual(approvals[0]['digest'],app.node_hash(node('parent')))
    def test_editorial_change_invalidates_but_layout_preserves_hash(self):
        n=node();original=app.node_hash(n);n['x']=999;self.assertEqual(app.node_hash(n),original)
        n['body']+=' changed';self.assertNotEqual(app.node_hash(n),original)
    def test_validation_keeps_immutable_snapshot_after_edit(self):
        self.login('Reviewer');self.put();self.request('/api/validate',{'node':'test-node','revision':1});n=node();n['body']='Nouvelle version';self.assertEqual(self.put([n],revision=1)[0],200)
        with app.connect(self.db) as db:
            record=db.execute('SELECT * FROM approvals').fetchone();self.assertEqual(json.loads(record['snapshot'])['body'],'Contenu synthétique');self.assertNotEqual(record['digest'],app.node_hash(n))
    def test_attachment_never_executes_html_and_requires_login(self):
        self.login();status,f,_=self.request('/api/files',b'<svg onload="alert(1)"></svg>',{'X-File-Name':'../../evil.svg'});self.assertEqual(status,201);self.assertEqual(f['name'],'evil.svg');self.assertEqual(f['mime'],'application/octet-stream')
        status,_,h=self.request('/api/files/'+f['id']+'/preview');self.assertEqual(status,200);self.assertIn('attachment',h['Content-Disposition']);self.assertEqual(h['X-Content-Type-Options'],'nosniff')
        n=node();n['attachments']=[f['id']];self.assertEqual(self.put([n])[0],200)
        self.cookie='';self.assertEqual(self.request('/api/files/'+f['id'])[0],401)
    def test_attachment_preview_and_missing_references(self):
        self.login();status,f,_=self.request('/api/files',b'\x89PNG\r\n\x1a\nsynthetic',{'X-File-Name':'test.png'});self.assertEqual(f['mime'],'image/png');_,_,h=self.request('/api/files/'+f['id']+'/preview');self.assertEqual(h['Content-Disposition'],'inline')
        n=node();n['attachments']=['absent'];self.assertEqual(self.put([n])[0],400)
    def test_comments_author_comes_from_session(self):
        self.login();self.put();self.assertEqual(self.request('/api/comments',{'node':'test-node','body':'Avis','author':'Reviewer'})[0],201);self.assertEqual(self.request('/api/state')[1]['comments'][0]['author'],'Author')
    def test_exports_exclude_credentials_and_csrf(self):
        self.login();status,export,_=self.request('/api/export');self.assertEqual(status,200);self.assertNotIn('csrf',export);self.assertNotIn('user',export);self.assertNotIn(HASH,json.dumps(export))
    def test_edges_strokes_are_checked_and_persist(self):
        self.login();edge={'id':'link','from':'a','to':'b','label':'Relation'};stroke={'id':'stroke','points':[[1,2],[3,4]],'color':'gold'}
        self.assertEqual(self.put([node('a'),node('b')],edges=[edge],strokes=[stroke])[0],200)
        self.assertEqual(self.request('/api/state')[1]['document']['strokes'],[stroke])
        edge['to']='absent';self.assertEqual(self.put([node('a')],revision=1,edges=[edge])[0],400)
    def test_backup_contains_attachments_and_history(self):
        self.login();self.put();self.request('/api/files',b'private attachment',{'X-File-Name':'test.txt'})
        backup=Path(self.temp.name)/'backup.sqlite'
        with app.connect(self.db) as source,sqlite3.connect(backup) as target:source.backup(target)
        with app.connect(backup) as db:
            self.assertEqual(db.execute('SELECT content FROM files').fetchone()[0],b'private attachment');self.assertEqual(db.execute('SELECT count(*) FROM history').fetchone()[0],1)

if __name__=='__main__':unittest.main()
