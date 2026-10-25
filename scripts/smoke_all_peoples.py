"""Exercise six peoples and all 24 classes in the actual browser presentation."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def capture(page, path):
    # Full-page captures must load off-screen portraits and start above fixed navigation.
    page.locator('#view img[loading="lazy"]').evaluate_all("images => images.forEach(image => image.loading = 'eager')")
    page.wait_for_function("[...document.querySelectorAll('#view img')].every(image => image.complete && image.naturalWidth > 0)")
    for image in page.locator('#view img:visible').all():
        image.scroll_into_view_if_needed()
        image.evaluate('image => image.decode().catch(() => {})')
    page.evaluate("document.activeElement?.blur(); window.scrollTo({top: 0, behavior: 'instant'});")
    page.wait_for_timeout(100)
    page.screenshot(path=str(path), full_page=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
    parser.add_argument('--output', type=Path, default=Path('/tmp/ashenfall-all-peoples/validation'))
    parser.add_argument('--chromium', default='/usr/bin/chromium')
    parser.add_argument('--partial', action='store_true', help='Exercise only prepared classes during authoring.')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    summary = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=args.chromium, args=['--no-sandbox'])
        for device, width, height in [('desktop', 1536, 1100), ('tablet', 820, 1180), ('mobile', 390, 844)]:
            page = browser.new_page(viewport={'width': width, 'height': height})
            page.set_default_timeout(12000)
            errors, missing = [], []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('response', lambda response: missing.append(response.url) if response.status >= 400 and response.url.startswith(args.base_url) else None)
            page.goto(args.base_url, wait_until='networkidle')
            config = page.evaluate('window.AshenfallPeopleVisuals')
            assert len(config['peoples']) == 6
            if not args.partial:
                assert len(config['classes']) == 23, len(config['classes'])
            checked = 0
            for race, people in config['peoples'].items():
                page.goto(args.base_url + '#/' + race, wait_until='networkidle')
                expect(page.locator('.world-people-hero h1')).to_have_text(people['title'])
                expect(page.locator('.people-class-card')).to_have_count(4)
                assert page.evaluate('document.body.dataset.worldRace') == race
                assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), (device, race)
                capture(page, args.output / (device + '-' + race + '.png'))

                for id in people['classes']:
                    if id == 'rempart' or (args.partial and id not in config['classes']):
                        continue
                    entry = config['classes'][id]
                    page.goto(args.base_url + '#/' + id, wait_until='networkidle')
                    expect(page.locator('.atlas-title h1')).to_have_text(entry['title'])
                    expect(page.locator('.atlas-class-selector a')).to_have_count(4)
                    expect(page.locator('[data-world-art="skins"]')).to_have_count(6)
                    expect(page.locator('[data-world-art="base"]')).to_have_count(6)
                    expect(page.locator('[data-world-gallery="skins"]')).to_be_visible()
                    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), (device, id)
                    assert 'undefined' not in page.locator('#view').inner_text(), id
                    images = page.locator('[data-world-gallery="skins"] img')
                    images.last.scroll_into_view_if_needed()
                    page.wait_for_function("[...document.querySelectorAll('[data-world-gallery=skins] img')].every(i => i.complete && i.naturalWidth > 0)")

                    first = page.locator('[data-world-art="skins"][data-world-art-index="0"]')
                    first.click()
                    expect(page.locator('.world-art-dialog')).to_be_visible()
                    expect(page.locator('#world-art-title')).to_contain_text(entry['skinLabels'][0])
                    page.keyboard.press('ArrowLeft')
                    expect(page.locator('#world-art-title')).to_contain_text(entry['skinLabels'][5])
                    page.keyboard.press('Escape')
                    expect(first).to_be_focused()
                    page.locator('[data-world-gallery-tab="base"]').click()
                    expect(page.locator('[data-world-gallery="base"]')).to_be_visible()
                    page.locator('[data-world-art="base"][data-world-art-index="0"]').click()
                    expect(page.locator('#world-art-title')).to_contain_text('Départ')
                    page.keyboard.press('Escape')
                    page.locator('[data-world-tab="skills"]').click()
                    expect(page.locator('#class-skills')).to_be_visible()
                    assert page.locator('.spellbook-grid').inner_text().strip(), id
                    page.locator('[data-world-tab="overview"]').click()
                    assert page.locator('[data-world-panel="overview"]').inner_text().strip(), id
                    page.locator('[data-world-tab="lore"]').click()
                    original = page.evaluate('(id)=>records.find(r=>r.id===id).body', id)
                    assert page.locator('.world-source-body').text_content() == original, id
                    page.locator('[data-world-tab="tree"]').click()
                    expect(page.locator('.atlas-tree-panel a')).to_have_attribute('href', 'simulateur/classes/?classe=' + id)
                    page.locator('[data-world-tab="art"]').click()
                    page.locator('[data-portrait-open]').first.click()
                    expect(page.locator('#portrait-viewer')).to_be_visible()
                    page.keyboard.press('Escape')
                    page.locator('[data-world-tab="equipment"]').click()
                    expect(page.locator('[data-world-gallery="base"]')).to_be_visible()
                    page.locator('[data-world-art="details"]').first.click()
                    expect(page.locator('#world-art-title')).to_contain_text('Détail I')
                    page.keyboard.press('Escape')
                    page.locator('[data-world-gallery-tab="skins"]').click()
                    if id == people['classes'][0] or race == 'nains':
                        capture(page, args.output / (device + '-' + id + '.png'))
                    checked += 1

            if device == 'desktop':
                for people in config['peoples'].values():
                    for id in people['classes']:
                        page.goto(args.base_url + 'simulateur/classes/?classe=' + id, wait_until='domcontentloaded')
                        expect(page.locator('#class')).to_have_value(id)

            page.goto(args.base_url + '#/peuples', wait_until='networkidle')
            expect(page.locator('.world-people-index-card')).to_have_count(6)
            page.locator('#search').fill('Garde')
            expect(page.locator('#view h2').first).to_contain_text('Résultats de recherche')
            page.locator('#search').fill('')
            assert not errors, errors
            assert not missing, missing
            summary.append({'viewport': device, 'peoples': 6, 'classes': checked, 'javascript_errors': errors, 'missing_resources': missing, 'result': 'passed'})
            print(json.dumps(summary[-1]), flush=True)
            page.close()
        browser.close()
    (args.output / 'browser-results.json').write_text(json.dumps(summary, indent=2) + '\n')


if __name__ == '__main__':
    main()
