"""Browser regression checks for the native mastery planner (local public server)."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://127.0.0.1:8030/')
    parser.add_argument('--output', default='/tmp/ashenfall-native-masteries')
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    base = args.base_url.rstrip('/') + '/'
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1536, 'height': 1000}, accept_downloads=True)
        errors, missing = [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: missing.append(response.url) if response.status >= 400 and response.url.startswith(base) else None)

        def visit(route, model=None):
            page.goto(base + route)
            expect(page.locator('.native-masteries')).to_be_visible()
            if model:
                expect(page.locator('.native-masteries')).to_have_attribute('data-model-id', model)

        def remaining(n):
            expect(page.locator('[data-ms-remaining]')).to_have_text(str(n))

        visit('#/rempart/maitrises', 'rempart:v8')
        expect(page.locator('.mastery-preset')).to_have_count(3)
        for preset_id in ['citadelle', 'broyeur', 'garde-du-corps']:
            page.locator('[data-preset="'+preset_id+'"]').click()
            remaining(0)
            expect(page.locator('.mastery-status')).to_have_text('Configuration cohérente')
            expect(page.locator('.mastery-synergy.is-owned')).to_have_count(1)
            expect(page.locator('[data-focus-key="preset:'+preset_id+'"]')).to_be_focused()
            page.locator('[data-ms="undo"]').click()
            remaining(20)
            page.locator('[data-ms="redo"]').click()
            remaining(0)
            page.locator('[data-ms="undo"]').click()
            remaining(20)
        page.set_viewport_size({'width':390,'height':844})
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        page.locator('.mastery-presets').screenshot(path=str(output / 'templates-mobile.png'))
        page.set_viewport_size({'width':1536,'height':1000})
        page.locator('.mastery-presets').screenshot(path=str(output / 'templates-desktop.png'))
        results.append('three complete default templates, undo/redo and responsive cards')
        node = page.locator('.mastery-node').first
        plus = node.locator('[data-delta="1"]')
        expect(node).to_have_attribute('data-ms-state', 'available')
        expect(node.locator('.mastery-effect-summary')).to_contain_text('valeur à définir')
        expect(page.locator('.mastery-node[data-ms-state="locked"]').first).to_contain_text('Verrouillé')
        plus.focus()
        page.keyboard.press('Enter')
        remaining(19)
        expect(node).to_have_attribute('data-ms-state', 'owned')
        expect(node.locator('.mastery-node-state')).to_contain_text('Acquis · 1 point')
        assert page.evaluate("document.activeElement.dataset.delta") == '1'
        page.keyboard.press('Enter')
        remaining(18)
        assert page.evaluate("document.activeElement.dataset.delta") == '-1'
        node.locator('input[value="a"]').check()
        expect(node.locator('.mastery-choice-effect').first).to_contain_text('valeur à définir')
        assert node.locator('input').first.evaluate('e => e.getBoundingClientRect().width') == 16
        page.locator('[data-ms="undo"]').click()
        expect(node.locator('input[value="a"]')).not_to_be_checked()
        page.locator('[data-ms="redo"]').click()
        expect(node.locator('input[value="a"]')).to_be_checked()
        page.reload()
        remaining(18)
        expect(node.locator('input[value="a"]')).to_be_checked()
        node.locator('[data-delta="-1"]').click()
        node.locator('[data-delta="-1"]').click()
        assert page.evaluate("document.activeElement.dataset.delta") == '1'
        node.locator('[data-delta="1"]').click()
        node.locator('[data-delta="1"]').click()
        node.locator('input[value="a"]').check()
        results.append('keyboard focus, choices, undo/redo, reload persistence')

        page.locator('.mastery-loadout summary').click()
        page.locator('[data-ms-count]').select_option('30')
        page.locator('[data-ms="slot-select"][data-slot="29"]').click()
        page.locator('[data-ms-count]').select_option('10')
        expect(page.locator('.mastery-slot-editor > strong')).to_have_text('Emplacement 10')
        option = page.locator('[data-ms-action-select] option').nth(1).get_attribute('value')
        page.locator('[data-ms-action-select]').select_option(option)
        page.locator('[data-ms-shortcut]').fill('ctrl+1')
        page.locator('[data-focus-key="assign"]').click()
        expect(page.locator('[data-slot="9"] small')).to_have_text('Ctrl+1')
        page.locator('[data-ms-shortcut]').fill('<b data-injected>test</b>')
        page.locator('[data-focus-key="assign"]').click()
        expect(page.locator('[data-ms-live]')).to_have_class('mastery-live is-error')
        assert page.locator('[data-injected]').count() == 0
        results.append('30→10 visible selection, assignments, safe shortcuts')

        with page.expect_download() as downloaded:
            page.locator('[data-ms="export"]').click()
        raw = Path(downloaded.value.path()).read_text()
        payload = json.loads(raw)
        page.locator('[data-ms="import"]').click()
        bad = json.loads(raw)
        bad['build']['ranks'][next(iter(bad['build']['ranks']))] = -1
        page.locator('[data-ms-import-text]').fill(json.dumps(bad))
        page.locator('[data-ms="import-confirm"]').click()
        expect(page.locator('[data-ms-import-error]')).not_to_be_empty()
        remaining(18)
        page.locator('[data-ms-import-text]').fill(raw)
        page.locator('[data-ms="import-confirm"]').click()
        expect(page.locator('.mastery-dialog')).not_to_be_visible()
        page.locator('[data-ms="share"]').click()
        link = page.locator('[data-ms-share-link]').input_value()
        visit(link.removeprefix(base), 'rempart:v8')
        remaining(18)
        page.locator('[data-ms="undo"]').click()
        results.append('atomic JSON import/export and share link')

        definitions = page.evaluate("async()=> (await import('./assets/classes/masteries-v1/definitions.mjs?v=native-v1')).definitions")
        for class_id in definitions['classes']:
            visit('#/' + class_id + '/maitrises', definitions['classes'][class_id]['defaultModel'])
            expect(page.locator('.mastery-node')).to_have_count(24)
            expect(page.locator('.mastery-preset')).to_have_count(3 if class_id=='rempart' else 0)
            assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), class_id
        visit('#/rempart/maitrises?mode=generic', 'rempart:generic')
        remaining(20)
        for path_index in [0, 1]:
            path = page.locator('.mastery-path').nth(path_index)
            for node_index, points in [(0, 2), (1, 2), (2, 1)]:
                for _ in range(points):
                    path.locator('.mastery-node').nth(node_index).locator('[data-delta="1"]').click()
        page.locator('.mastery-synergy button').first.click()
        remaining(8)
        page.locator('.mastery-path').first.locator('.mastery-node').nth(3).locator('[data-delta="1"]').click()
        remaining(7)
        page.locator('.mastery-path').first.locator('.mastery-node').first.locator('[data-delta="-1"]').click()
        remaining(7)
        expect(page.locator('[data-ms-live]')).to_have_class('mastery-live is-error')
        page.locator('[data-ms="reset"]').click()
        page.locator('[data-ms="reset-confirm"]').click()
        remaining(20)
        results.append('tier unlocks, paid synergies, dependency-safe refund explanation')
        page.locator('[data-ms-model]').select_option('rempart:v8')
        expect(page.locator('.native-masteries')).to_have_attribute('data-model-id', 'rempart:v8')
        remaining(18)
        page.locator('.atlas-class-selector a').nth(1).click()
        expect(page.locator('.native-masteries')).to_have_attribute('data-class-id', 'brise-fer')
        assert '/maitrises' in page.url
        page.go_back()
        expect(page.locator('.native-masteries')).to_have_attribute('data-class-id', 'rempart')
        remaining(18)
        page.locator('[data-dossier-tab="equipment"]').click()
        assert '/maitrises' not in page.url
        page.go_back()
        expect(page.locator('.native-masteries')).to_be_visible()
        results.append('all 25 models, class navigation, independent saves, browser history')

        visit('simulateur/classes/?classe=rempart#/arcaniste', 'arcaniste:generic')
        page.reload()
        expect(page.locator('.native-masteries')).to_have_attribute('data-class-id', 'arcaniste')
        visit('simulateur/rempart/', 'rempart:v8')
        results.append('legacy redirects and conflicting query/hash canonicalization')

        for width in [1536, 820, 390]:
            page.set_viewport_size({'width': width, 'height': 1000})
            visit('#/rempart/maitrises')
            assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), width
            page.screenshot(path=str(output / f'native-{width}.png'), full_page=True)
        results.append('desktop/tablet/mobile without horizontal overflow')
        page.close()
        for kind, initial in [('legacy', "localStorage.setItem('ashenfall-rempart-v8',JSON.stringify({ranks:{'b-0':1}}))"), ('corrupt', "localStorage.setItem('ashenfall-build-v2:rempart:v8','null')"), ('quota', "Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError')}")]:
            context = browser.new_context()
            context.add_init_script(initial)
            fresh = context.new_page()
            fresh.goto(base + '#/rempart/maitrises')
            expect(fresh.locator('.native-masteries')).to_be_visible()
            if kind == 'legacy':
                expect(fresh.locator('[data-ms-remaining]')).to_have_text('19')
                assert fresh.evaluate("JSON.parse(localStorage.getItem('ashenfall-rempart-v8')).ranks['b-0']") == 1
            else:
                fresh.locator('.mastery-node').first.locator('[data-delta="1"]').click()
                expect(fresh.locator('[data-ms-remaining]')).to_have_text('19')
                if kind == 'quota':
                    expect(fresh.locator('.mastery-storage-notice')).to_be_visible()
                else:
                    assert 'null' in fresh.evaluate('Object.values(localStorage)')
            context.close()
        results.append('legacy migration, corrupt backup, quota-safe interaction')
        assert not errors, errors
        assert not missing, missing
        browser.close()
    report = {'checks': results, 'javascript_errors': errors, 'missing_resources': missing, 'result': 'passed'}
    (output / 'results.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
