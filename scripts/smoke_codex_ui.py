"""Browser checks for the illustrated Codex (optional dependency: Playwright + Chromium).

Run against the public-only local staging server. Never serve Knowledge.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://127.0.0.1:8000/')
    parser.add_argument('--output', type=Path, default=Path('/tmp/ashenfall-redesign'))
    parser.add_argument('--chromium', default='/usr/bin/chromium')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=args.chromium, args=['--no-sandbox'])
        for name, width, height in [('desktop', 1536, 1100), ('tablet', 820, 1180), ('mobile', 390, 844)]:
            page = browser.new_page(viewport={'width': width, 'height': height})
            errors, missing = [], []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('response', lambda response: missing.append(response.url) if response.status >= 400 and response.url.startswith(args.base_url) else None)
            response = page.goto(args.base_url + '#/rempart', wait_until='networkidle')
            assert response.status == 200
            expect(page.locator('.atlas-title h1')).to_have_text('Rempart')
            expect(page.locator('.atlas-stage')).to_have_count(6)
            assert 'undefined' not in page.locator('body').inner_text()
            assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), name
            page.screenshot(path=str(args.output / (name + '-rempart.png')), full_page=True)

            # Equipment inspection, circular keyboard navigation, Escape and focus restoration.
            first = page.locator('[data-stage-index="0"]')
            first.click()
            expect(page.locator('.atlas-stage-dialog')).to_be_visible()
            expect(page.locator('#atlas-stage-title')).to_contain_text('Départ')
            page.keyboard.press('ArrowLeft')
            expect(page.locator('#atlas-stage-title')).to_contain_text('Armure de maître')
            page.keyboard.press('Escape')
            expect(page.locator('.atlas-stage-dialog')).not_to_be_visible()
            expect(first).to_be_focused()

            # Section tabs must reveal content, rather than corrupting the hash route.
            page.locator('[data-dossier-tab="skills"]').click()
            expect(page.locator('#class-skills')).to_be_visible()
            expect(page.locator('#class-equipment')).not_to_be_visible()
            assert page.url.endswith('#/rempart')
            expect(page.locator('.spellbook-grid')).to_be_visible()
            page.locator('[data-dossier-tab="tree"]').click()
            expect(page.locator('.atlas-tree-panel a')).to_have_attribute('href', 'simulateur/rempart/')
            page.locator('[data-dossier-tab="art"]').click()
            page.locator('.atlas-art-panel [data-portrait-open]').click()
            expect(page.locator('#portrait-viewer')).to_be_visible()
            page.keyboard.press('Escape')
            page.locator('.atlas-art-panel [data-equipment-open]').click()
            expect(page.locator('#equipment-viewer')).to_be_visible()
            page.keyboard.press('Escape')
            page.locator('[data-dossier-tab="equipment"]').click()

            # Existing alternative-style composition still works behind its disclosure.
            page.locator('.atlas-alternative-studies > summary').click()
            page.locator('[data-armor-pick="2"]').click()
            expect(page.locator('[data-armor-name]')).to_have_text('Seigneur des montagnes')
            page.locator('[data-armor-slot="0"]').select_option('1')
            expect(page.locator('[data-armor-name]')).to_have_text('Armure composite')

            # Preserve the other three dwarf class pages and their original equipment sheets.
            for route in ['brise-fer', 'artilleur-runique', 'accordeur']:
                page.goto(args.base_url + '#/' + route, wait_until='networkidle')
                expect(page.locator('.atlas-stage')).to_have_count(6)
                assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')

            # Sample every category of retained route, including the newer peoples.
            for route in ['home', 'peuples', 'classes', 'competences', 'bestiaire', 'regions', 'equipements', 'lore', 'nains', 'elfes', 'humains', 'kharun', 'vaelith', 'orynth', 'gardien-des-racines', 'porte-faille', 'rempart-garde', 'chroniques-rupture']:
                page.goto(args.base_url + '#/' + route, wait_until='networkidle')
                assert page.locator('#view').inner_text().strip(), route
            page.goto(args.base_url + '#/home', wait_until='networkidle')
            page.locator('#search').fill('Rempart')
            expect(page.locator('#view h2').first).to_contain_text('Résultats de recherche')
            if name == 'mobile':
                page.locator('#menu').click()
                expect(page.locator('#menu')).to_have_attribute('aria-expanded', 'true')
                page.keyboard.press('Escape')
                expect(page.locator('#menu')).to_have_attribute('aria-expanded', 'false')
            assert not errors, errors
            assert not missing, missing
            results.append({'viewport': name, 'result': 'passed', 'javascript_errors': errors, 'missing_resources': missing})
            page.close()
        browser.close()
    (args.output / 'browser-results.json').write_text(json.dumps(results, indent=2) + '\n')
    print(json.dumps(results, indent=2))


if __name__ == '__main__':
    main()
