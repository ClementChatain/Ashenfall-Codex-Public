"""Private Ashenfall workshop. Standard-library server; deploy behind HTTPS proxy."""
import argparse
import getpass
import hashlib
import hmac
import json
import mimetypes
import os
import re
from pathlib import Path
import secrets
import sqlite3
import time
import unicodedata
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import quote, unquote, urlsplit

WEB = Path(__file__).parent / 'web'
MAX_BODY = 4 * 1024 * 1024
MAX_FILE = 20 * 1024 * 1024
STATUSES = {'ideas', 'deepen', 'review', 'rework'}


def password_hash(password, salt=None):
    salt = salt or secrets.token_hex(16)
    return salt + ':' + hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 600_000).hex()


def password_ok(password, stored):
    return hmac.compare_digest(password_hash(password, stored.split(':')[0]), stored)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def node_hash(node):
    # Layout changes do not invalidate the reviewed text; all editorial fields do.
    return hashlib.sha256(canonical({k: v for k, v in node.items() if k not in ('x', 'y')}).encode()).hexdigest()


class PrivateDB(sqlite3.Connection):
    def __exit__(self, *args):
        try:
            return super().__exit__(*args)
        finally:
            self.close()


def connect(path):
    db = sqlite3.connect(path, timeout=15, factory=PrivateDB)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    return db


def init_db(path):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with connect(path) as db:
        db.executescript('''
        PRAGMA journal_mode=WAL;
        CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('author','reviewer')));
        CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), csrf TEXT NOT NULL, expires REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS workspace(id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, document TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS files(id TEXT PRIMARY KEY, name TEXT NOT NULL, mime TEXT NOT NULL, content BLOB NOT NULL, user_id TEXT REFERENCES users(id), created REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS comments(id TEXT PRIMARY KEY, node_id TEXT NOT NULL, user_id TEXT REFERENCES users(id), body TEXT NOT NULL, created REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS approvals(id TEXT PRIMARY KEY, node_id TEXT NOT NULL, digest TEXT NOT NULL, snapshot TEXT NOT NULL, user_id TEXT REFERENCES users(id), created REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS history(id INTEGER PRIMARY KEY, revision INTEGER NOT NULL, document TEXT NOT NULL, user_id TEXT REFERENCES users(id), created REAL NOT NULL);
        ''')
        db.execute('INSERT OR IGNORE INTO workspace VALUES(1,0,?)', (canonical({'nodes': [], 'edges': [], 'strokes': []}),))
    os.chmod(path, 0o600)


def add_user(path, name, password, role):
    if not 1 <= len(name.strip()) <= 80 or len(password) < 12 or role not in {'author', 'reviewer'}:
        raise ValueError('Nom requis ; mot de passe de 12 caractères minimum ; rôle author ou reviewer.')
    with connect(path) as db:
        db.execute('INSERT INTO users VALUES(?,?,?,?)', (secrets.token_hex(16), name.strip(), password_hash(password), role))


def validate_document(doc, db):
    if not isinstance(doc, dict) or set(doc) != {'nodes', 'edges', 'strokes'}:
        raise ValueError('Document invalide.')
    if any(not isinstance(doc[k], list) for k in doc):
        raise ValueError('Listes attendues.')
    if len(doc['nodes']) > 1500 or len(doc['edges']) > 4000 or len(doc['strokes']) > 2000:
        raise ValueError('Espace trop volumineux : répartir les idées dans plusieurs exports.')
    ids = set()
    for n in doc['nodes']:
        if not isinstance(n, dict) or set(n) != {'id','parent','title','body','status','tag','color','x','y','attachments'}:
            raise ValueError('Fiche invalide.')
        if not isinstance(n['id'], str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,80}', n['id']) or n['id'] in ids:
            raise ValueError('Identifiant invalide ou doublon.')
        ids.add(n['id'])
        for key, limit in [('title',180),('body',100_000),('tag',80),('parent',80)]:
            if not isinstance(n[key],str) or len(n[key]) > limit: raise ValueError('Texte trop long ou invalide.')
        if not n['title'].strip() or n['status'] not in STATUSES or n['color'] not in {'gold','sage','rose','blue'}:
            raise ValueError('Titre, état ou couleur invalide.')
        for k in ('x','y'):
            if type(n[k]) not in (int,float) or not -10000 <= n[k] <= 10000: raise ValueError('Position invalide.')
        if not isinstance(n['attachments'],list) or len(n['attachments']) > 100 or not all(isinstance(a,str) for a in n['attachments']):
            raise ValueError('Pièces jointes invalides.')
        for a in n['attachments']:
            if not db.execute('SELECT 1 FROM files WHERE id=?',(a,)).fetchone(): raise ValueError('Pièce jointe absente.')
    parents = {n['id']:n['parent'] for n in doc['nodes']}
    for node, parent in parents.items():
        seen={node}
        while parent:
            if parent not in ids or parent in seen: raise ValueError('Parent absent ou boucle dans les sous-idées.')
            seen.add(parent); parent=parents[parent]
    edge_ids=set()
    for e in doc['edges']:
        if not isinstance(e,dict) or set(e)!={'id','from','to','label'} or e['from'] not in ids or e['to'] not in ids or e['from']==e['to'] or not isinstance(e['id'],str) or e['id'] in edge_ids or not isinstance(e['label'],str) or len(e['label'])>120:
            raise ValueError('Lien invalide.')
        edge_ids.add(e['id'])
    stroke_ids=set()
    for s in doc['strokes']:
        if not isinstance(s,dict) or set(s)!={'id','points','color'} or not isinstance(s['id'],str) or s['id'] in stroke_ids or s['color'] not in {'gold','sage','rose','blue'} or not isinstance(s['points'],list) or not 2<=len(s['points'])<=2000:
            raise ValueError('Dessin invalide.')
        stroke_ids.add(s['id'])
        for p in s['points']:
            if not isinstance(p,list) or len(p)!=2 or any(type(v) not in (int,float) or not -10000<=v<=10000 for v in p): raise ValueError('Point invalide.')
    return doc


class WorkshopServer(ThreadingHTTPServer):
    daemon_threads=True
    def __init__(self, address, database, secure=False, origin=''):
        self.database=database; self.secure=secure; self.origin=origin; self.attempts={}
        super().__init__(address, Handler)


class Handler(BaseHTTPRequestHandler):
    server_version='AshenfallWorkshop'
    def setup(self):
        super().setup()
        self.connection.settimeout(30)

    def log_message(self, fmt, *args):
        # No credentials, bodies, query strings or file names in logs.
        pass

    def send(self, status, data, mime='application/json; charset=utf-8', headers=None):
        body=(canonical(data).encode() if mime.startswith('application/json') else data)
        self.send_response(status)
        for k,v in {'Content-Type':mime,'Content-Length':str(len(body)),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob:; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",**(headers or {})}.items(): self.send_header(k,v)
        self.end_headers();self.wfile.write(body)

    def read_body(self, limit=MAX_BODY):
        try: length=int(self.headers.get('Content-Length','0'))
        except ValueError: raise ValueError('Taille invalide.')
        if not 0<=length<=limit: raise ValueError('Fichier limité à 20 Mo ; document limité à 4 Mo.')
        return self.rfile.read(length)

    def session(self, db):
        c=cookies.SimpleCookie()
        try: c.load(self.headers.get('Cookie',''))
        except cookies.CookieError: return None
        token=c.get('ashenfall_session')
        if not token: return None
        digest=hashlib.sha256(token.value.encode()).hexdigest()
        return db.execute('SELECT users.id,users.name,users.role,sessions.csrf FROM sessions JOIN users ON users.id=sessions.user_id WHERE token=? AND expires>?',(digest,time.time())).fetchone()

    def state(self, db, user):
        row=db.execute('SELECT * FROM workspace WHERE id=1').fetchone()
        files=[dict(r) for r in db.execute('SELECT id,name,mime,length(content) AS size FROM files')]
        comments=[dict(r) for r in db.execute('SELECT comments.id,node_id,body,created,users.name AS author FROM comments JOIN users ON users.id=user_id ORDER BY created')]
        approvals=[dict(r) for r in db.execute('SELECT approvals.id,node_id,digest,created,users.name AS author FROM approvals JOIN users ON users.id=user_id ORDER BY created')]
        return {'revision':row['revision'],'document':json.loads(row['document']),'files':files,'comments':comments,'approvals':approvals,'user':{'name':user['name'],'role':user['role']},'csrf':user['csrf']}

    def do_GET(self):
        path=urlsplit(self.path).path
        with connect(self.server.database) as db:
            user=self.session(db)
            if path.startswith('/api/'):
                if not user: return self.send(401,{'error':'Connecte-toi pour ouvrir l’atelier.'})
                if path=='/api/state': return self.send(200,self.state(db,user))
                if path=='/api/export':
                    state=self.state(db,user);state.pop('csrf');state.pop('user');state['format']='ashenfall-atelier-v1'
                    state['notice']='Brouillons privés. Une validation ne constitue pas une publication. Les fichiers binaires restent dans la sauvegarde serveur.'
                    return self.send(200,state,headers={'Content-Disposition':'attachment; filename="atelier-prive.json"'})
                if path.startswith('/api/files/'):
                    parts=path.split('/');r=db.execute('SELECT * FROM files WHERE id=?',(parts[3],)).fetchone()
                    if not r:return self.send(404,{'error':'Fichier absent.'})
                    inline=len(parts)==5 and parts[4]=='preview' and r['mime'].startswith('image/')
                    return self.send(200,r['content'],r['mime'] if inline else 'application/octet-stream',{'Content-Disposition':'inline' if inline else "attachment; filename*=UTF-8''"+quote(r['name'])})
                return self.send(404,{'error':'Route absente.'})
        static={'/':'index.html','/app.mjs':'app.mjs','/style.css':'style.css'}
        if path in static:
            file=WEB/static[path]
            return self.send(200,file.read_bytes(),{'index.html':'text/html; charset=utf-8','app.mjs':'text/javascript; charset=utf-8','style.css':'text/css; charset=utf-8'}[file.name])
        return self.send(404,{'error':'Page absente.'})

    def do_POST(self):
        try:self.post()
        except (ValueError,KeyError,TypeError,json.JSONDecodeError) as e:self.send(400,{'error':str(e) if isinstance(e,ValueError) else 'Requête invalide.'})
        except sqlite3.Error:self.send(503,{'error':'Enregistrement indisponible. Conserve ton travail et réessaie.'})

    def post(self):
        path=urlsplit(self.path).path
        origin=self.headers.get('Origin','')
        expected=self.server.origin or ('https://' if self.server.secure else 'http://')+self.headers.get('Host','')
        if origin!=expected:return self.send(403,{'error':'Origine refusée.'})
        with connect(self.server.database) as db:
            def reply(status, data, **kwargs):
                # Never acknowledge a mutation before SQLite commits. A following
                # request (or another collaborator) must observe the confirmed write.
                if status < 400:
                    db.commit()
                else:
                    db.rollback()
                return self.send(status, data, **kwargs)

            if path=='/api/login':
                ip=self.client_address[0];now=time.time();attempts=[t for t in self.server.attempts.get(ip,[]) if now-t<300]
                if len(attempts)>=10:return reply(429,{'error':'Trop de tentatives. Réessaie dans cinq minutes.'})
                attempts.append(now);self.server.attempts[ip]=attempts
                data=json.loads(self.read_body(4096));name=data.get('name','');password=data.get('password','')
                if not isinstance(name,str) or not isinstance(password,str):raise ValueError('Identifiants invalides.')
                user=db.execute('SELECT * FROM users WHERE name=?',(name,)).fetchone()
                valid=password_ok(password,user['password'] if user else ('0'*32+':'+'0'*64))
                if not user or not valid:return reply(401,{'error':'Identifiants incorrects.'})
                token=secrets.token_urlsafe(32);csrf=secrets.token_urlsafe(24)
                db.execute('DELETE FROM sessions WHERE expires<?',(now,))
                db.execute('INSERT INTO sessions VALUES(?,?,?,?)',(hashlib.sha256(token.encode()).hexdigest(),user['id'],csrf,now+8*3600))
                return reply(200,{'ok':True},headers={'Set-Cookie':f'ashenfall_session={token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800'+('; Secure' if self.server.secure else '')})
            user=self.session(db)
            if not user:return reply(401,{'error':'Session expirée. Tes modifications restent dans cet onglet ; reconnecte-toi.'})
            if not hmac.compare_digest(self.headers.get('X-CSRF-Token',''),user['csrf']):return reply(403,{'error':'Protection de session : recharge l’atelier.'})
            if path=='/api/logout':
                db.execute('DELETE FROM sessions WHERE csrf=?',(user['csrf'],))
                return reply(200,{'ok':True},headers={'Set-Cookie':'ashenfall_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'+('; Secure' if self.server.secure else '')})
            if path=='/api/files':
                data=self.read_body(MAX_FILE)
                if not data:raise ValueError('Fichier vide.')
                name=unquote(self.headers.get('X-File-Name','fichier'))
                name=''.join(c for c in name.replace('\\','/').split('/')[-1] if unicodedata.category(c)[0]!='C')[:180] or 'fichier'
                mime='application/octet-stream'
                if data.startswith(b'\x89PNG\r\n\x1a\n'):mime='image/png'
                elif data.startswith(b'\xff\xd8\xff'):mime='image/jpeg'
                elif data[:6] in (b'GIF87a',b'GIF89a'):mime='image/gif'
                elif data[:4]==b'RIFF' and data[8:12]==b'WEBP':mime='image/webp'
                file_id=secrets.token_hex(16)
                db.execute('INSERT INTO files VALUES(?,?,?,?,?,?)',(file_id,name,mime,data,user['id'],time.time()))
                return reply(201,{'id':file_id,'name':name,'mime':mime,'size':len(data)})
            data=json.loads(self.read_body())
            if path=='/api/workspace':
                db.execute('BEGIN IMMEDIATE')
                row=db.execute('SELECT * FROM workspace WHERE id=1').fetchone()
                if data.get('revision')!=row['revision']:return reply(409,{'error':'L’atelier a été modifié ailleurs. Ton travail est conservé dans cet onglet : exporte-le avant de charger la version partagée.','revision':row['revision']})
                doc=validate_document(data['document'],db)
                db.execute('INSERT INTO history(revision,document,user_id,created) VALUES(?,?,?,?)',(row['revision'],row['document'],user['id'],time.time()))
                db.execute('UPDATE workspace SET revision=?,document=? WHERE id=1',(row['revision']+1,canonical(doc)))
                return reply(200,{'revision':row['revision']+1})
            if path=='/api/comments':
                node_id=data['node'];body=data['body']
                doc=json.loads(db.execute('SELECT document FROM workspace WHERE id=1').fetchone()[0])
                if not any(n['id']==node_id for n in doc['nodes']) or not isinstance(body,str) or not 1<=len(body.strip())<=10000:raise ValueError('Commentaire ou idée invalide.')
                db.execute('INSERT INTO comments VALUES(?,?,?,?,?)',(secrets.token_hex(16),node_id,user['id'],body.strip(),time.time()))
                return reply(201,{'ok':True})
            if path=='/api/validate':
                if user['role']!='reviewer':return reply(403,{'error':'Seul le compte de relecture peut valider.'})
                row=db.execute('SELECT * FROM workspace WHERE id=1').fetchone()
                if data.get('revision')!=row['revision']:return reply(409,{'error':'La version a changé. Relis-la avant de valider.'})
                node=next((n for n in json.loads(row['document'])['nodes'] if n['id']==data['node']),None)
                if not node:raise ValueError('Idée absente.')
                db.execute('INSERT INTO approvals VALUES(?,?,?,?,?,?)',(secrets.token_hex(16),node['id'],node_hash(node),canonical(node),user['id'],time.time()))
                return reply(201,{'ok':True})
            return reply(404,{'error':'Route absente.'})


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--data',default=os.environ.get('ATELIER_DB','/tmp/ashenfall-atelier/workshop.sqlite'))
    sub=p.add_subparsers(dest='command',required=True)
    add=sub.add_parser('user');add.add_argument('name');add.add_argument('--role',choices=['author','reviewer'],default='author')
    serve=sub.add_parser('serve');serve.add_argument('--host',default='127.0.0.1');serve.add_argument('--port',type=int,default=8050);serve.add_argument('--origin',default=os.environ.get('ATELIER_ORIGIN',''));serve.add_argument('--secure',action='store_true',default=os.environ.get('ATELIER_SECURE')=='1')
    backup=sub.add_parser('backup');backup.add_argument('destination')
    args=p.parse_args();init_db(args.data)
    if args.command=='user':
        password=getpass.getpass('Mot de passe (12 caractères minimum) : ')
        if password!=getpass.getpass('Confirmer : '):p.error('Les mots de passe diffèrent.')
        add_user(args.data,args.name,password,args.role);print('Compte créé. Aucun identifiant publié.')
    elif args.command=='backup':
        with connect(args.data) as source,sqlite3.connect(args.destination) as target:source.backup(target)
        os.chmod(args.destination,0o600);print('Sauvegarde privée créée (fichiers inclus).')
    else:
        if args.secure and not args.origin:p.error('--origin https://... requis en production.')
        print(f'Atelier sur {args.host}:{args.port}. Données privées hors du dépôt. Ctrl+C pour arrêter.',flush=True)
        WorkshopServer((args.host,args.port),args.data,args.secure,args.origin).serve_forever()

if __name__=='__main__':main()
