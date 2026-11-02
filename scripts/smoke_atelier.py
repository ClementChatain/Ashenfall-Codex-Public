"""Real browser exercise of the private workshop, with disposable synthetic data."""
import importlib.util
from pathlib import Path
import secrets
import sys
import tempfile
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('atelier_server',ROOT/'atelier/server.py')
app=importlib.util.module_from_spec(spec);spec.loader.exec_module(app)

def run():
    with tempfile.TemporaryDirectory() as temp:
        db=Path(temp)/'private.sqlite';app.init_db(db);password=secrets.token_urlsafe(24)
        app.add_user(db,'Clement',password,'reviewer');app.add_user(db,'Frere',password,'author')
        server=app.WorkshopServer(('127.0.0.1',0),db);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();base=f'http://127.0.0.1:{server.server_address[1]}'
        try:
            with sync_playwright() as p:
                browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);context=browser.new_context(viewport={'width':1536,'height':1050});page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
                def login(page,name):
                    page.goto(base);page.locator('[name=name]').fill(name);page.locator('[name=password]').fill(password);page.get_by_role('button',name='Entrer dans l’atelier →').click();page.wait_for_selector('#app:not([hidden])')
                def edit(page):
                    if not page.locator('.idea-editor').evaluate('(e)=>e.open'):page.locator('.idea-editor > summary').click()
                def saved(page):page.wait_for_function('()=>document.querySelector("#sync").textContent==="Enregistré · privé"')
                login(page,'Clement');assert page.get_by_text('Tout commence par une idée.').is_visible()
                page.get_by_role('button',name='＋ Nouvelle idée',exact=True).click();page.locator('#node-title').fill('Cité-test · exemple non canonique');page.locator('#node-body').fill('Une proposition de test, jamais du lore validé.');page.locator('#node-tag').fill('Lieu');saved(page)
                page.get_by_role('button',name='＋ Ajouter une sous-idée').click();page.locator('#node-title').fill('Tradition-test');page.locator('#node-body').fill('Sous-idée synthétique');saved(page)
                page.locator('#node-status').select_option('review');saved(page)
                # Real attachment upload through the UI; download is authenticated.
                image=ROOT/'site/bestiaire/img/golem.png'
                page.locator('.idea-resources > summary').click();page.locator('#attachment-input').set_input_files(str(image));page.wait_for_selector('.attachment img');saved(page)
                with page.expect_download() as download_info:page.locator('.attachment a').click()
                download=download_info.value;assert Path(download.path()).read_bytes()==image.read_bytes()
                page.locator('#comment-body').fill('Un commentaire de relecture de test.');page.get_by_role('button',name='Ajouter mon commentaire').click();page.wait_for_selector('.comment')
                page.get_by_role('button',name='✓ Valider cette version').click();page.wait_for_function('()=>document.querySelector(".status").textContent.includes("VERSION VALIDÉE")')
                page.locator('#node-body').fill('Version modifiée : la validation doit devenir obsolète.');saved(page);page.get_by_role('button',name='Fermer la fiche').click()
                page.get_by_role('button',name='⌘ Arborescence').click();assert page.locator('.tree-row').count()==2
                page.get_by_role('button',name='✧ Toile libre').click();page.get_by_role('button',name='✎ Dessiner',exact=True).click();box=page.locator('.canvas-shell').bounding_box();x,y=box['x']+850,box['y']+420
                page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+70,y+20,steps=8);page.mouse.move(x+100,y+80,steps=8);page.mouse.up();saved(page);assert page.locator('polyline').count()==1
                page.get_by_role('button',name='⌁ Relier',exact=True).click();page.once('dialog',lambda d:d.accept('Dépend de'));page.locator('[data-node]').nth(0).click();page.locator('[data-node]').nth(1).click();saved(page);assert page.locator('svg text').text_content()=='Dépend de'
                page.get_by_role('button',name='↖ Déplacer',exact=True).click();card=page.locator('[data-node]').first;box=card.bounding_box();page.mouse.move(box['x']+40,box['y']+30);page.mouse.down();page.mouse.move(box['x']+130,box['y']+75,steps=10);page.mouse.up();saved(page)
                # Ensure read-only author cannot see validation button; both share the same server data.
                other=browser.new_context();brother=other.new_page();login(brother,'Frere');brother.locator('[data-node]').first.click();edit(brother);assert brother.get_by_role('button',name='✓ Valider cette version').count()==0
                # API collision: no silent overwrite by a stale client.
                async_state=brother.evaluate('async()=>await(await fetch("/api/state")).json()')
                page.get_by_role('button',name='▤ Tableau').click();page.locator('[data-node]').first.click();edit(page);page.locator('#node-title').fill('Cité-test · version récente');saved(page)
                status=brother.evaluate('async s=>(await fetch("/api/workspace",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":s.csrf},body:JSON.stringify({revision:s.revision,document:s.document})})).status',async_state);assert status==409,status
                brother.locator('#node-body').fill('Version concurrente à conserver dans l’onglet');brother.wait_for_selector('#conflict:not([hidden])');assert brother.locator('#node-body').input_value()=='Version concurrente à conserver dans l’onglet'
                with brother.expect_download() as exported:brother.get_by_role('button',name='Exporter ma version',exact=True).click()
                assert 'Version concurrente' in Path(exported.value.path()).read_text()
                brother.once('dialog',lambda d:d.accept());brother.get_by_role('button',name='Charger la version partagée…').click();brother.wait_for_selector('#conflict[hidden]',state='attached')
                page.get_by_role('button',name='Fermer la fiche').click();page.get_by_role('button',name='▤ Tableau').click();page.screenshot(path='/tmp/atelier-board.png',full_page=True)
                page.get_by_role('button',name='✧ Toile libre').click();page.screenshot(path='/tmp/atelier-canvas.png',full_page=True)
                page.locator('[data-node]').nth(1).click();page.screenshot(path='/tmp/atelier-inspector.png',full_page=True)
                for w,h in [(820,1180),(390,844),(320,700)]:
                    page.set_viewport_size({'width':w,'height':h});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),w;page.screenshot(path=f'/tmp/atelier-{w}.png',full_page=True)
                page.get_by_role('button',name='Fermer la fiche').click();page.get_by_role('button',name='Ouvrir le menu').click();assert page.get_by_role('button',name='Exporter le travail',exact=True).is_visible();page.get_by_role('button',name='◇ Le vrac').click()
                page.reload();page.wait_for_selector('#app:not([hidden])');assert page.locator('[data-node]').count()==2
                assert not errors,errors
                browser.close();print('PASS: comptes, idées imbriquées, PJ/image, commentaires, validation/révision, 3 vues, dessin, liens, déplacement, conflit, persistance et mobile ; exemples de test privés et temporaires.')
        finally:server.shutdown();server.server_close();thread.join()

if __name__=='__main__':run()
