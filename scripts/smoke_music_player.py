"""Real browser playback, persistence and failure handling for the Codex player."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://127.0.0.1:8030/')
    parser.add_argument('--output', type=Path, default=Path('/tmp/ashenfall-music/validation'))
    args = parser.parse_args()
    base = args.base_url.rstrip('/') + '/'
    args.output.mkdir(parents=True, exist_ok=True)
    checks, errors, missing = [], [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        context = browser.new_context(viewport={'width':1536,'height':1100})
        page = context.new_page()
        page.set_default_timeout(12000)
        audio_requests = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('response', lambda r: missing.append(r.url) if r.status >= 400 and r.url.startswith(base) else None)
        page.on('request', lambda r: audio_requests.append(r.url) if '.mp3' in r.url else None)
        page.goto(base + '#/rempart', wait_until='networkidle')
        expect(page.locator('.codex-music')).to_be_visible()
        assert not audio_requests, audio_requests
        assert page.locator('audio').evaluate('a=>a.paused')
        checks.append('no autoplay or MP3 download on first visit')
        page.locator('.music-dock-tools [data-music="playlist"]').click()
        expect(page.locator('[data-track-id]')).to_have_count(10)
        page.locator('[data-music-filter="bataille"]').click()
        expect(page.locator('[data-track-id]')).to_have_count(3)
        page.locator('[data-track-id="jungle-de-fer"]').click()
        page.wait_for_function('document.querySelector("audio[data-codex-audio]").currentTime>0')
        expect(page.locator('[data-music-title]')).to_have_text('Jungle de fer')
        expect(page.locator('[data-music="play"]')).to_have_attribute('aria-label','Mettre la musique en pause')
        page.evaluate('window.originalAudio=document.querySelector("audio[data-codex-audio]")')
        for route in ['#/brise-fer','#/elfes','#/arcaniste/maitrises','#/home']:
            page.goto(base + route)
            page.wait_for_function('!document.querySelector("audio[data-codex-audio]").paused')
            assert page.evaluate('originalAudio===document.querySelector("audio[data-codex-audio]")')
        checks.append('real MP3 playback persists across class, people and mastery routes')
        page.locator('[data-music="play"]').click()
        assert page.locator('audio').evaluate('a=>a.paused')
        page.locator('[data-music-volume]').evaluate("e=>{e.value='0.2';e.dispatchEvent(new Event('input',{bubbles:true}))}")
        assert abs(page.locator('audio').evaluate('a=>a.volume')-.2)<.001
        page.locator('[data-music="mute"]').click()
        assert page.locator('audio').evaluate('a=>a.muted')
        page.locator('[data-music="mute"]').click()
        assert not page.locator('audio').evaluate('a=>a.muted')
        page.locator('[data-music-seek]').evaluate("e=>{e.value='45';e.dispatchEvent(new Event('input',{bubbles:true}))}")
        page.wait_for_function('Math.abs(document.querySelector("audio").currentTime-45)<1')
        page.keyboard.press('Escape')
        expect(page.locator('.music-panel')).not_to_be_visible()
        expect(page.locator('.music-dock-tools [data-music="playlist"]')).to_be_focused()
        page.reload(wait_until='networkidle')
        expect(page.locator('[data-music-title]')).to_have_text('Jungle de fer')
        expect(page.locator('[data-music-elapsed]')).to_have_text('0:45')
        assert page.locator('audio').evaluate('a=>a.paused')
        assert abs(page.locator('audio').evaluate('a=>a.volume')-.2)<.001
        page.locator('[data-music="play"]').click()
        page.wait_for_function('document.querySelector("audio").currentTime>=45&&!document.querySelector("audio").paused')
        page.locator('[data-music="minimize"]').click()
        expect(page.locator('.music-launcher')).to_be_visible()
        assert not page.locator('audio').evaluate('a=>a.paused')
        page.locator('.music-launcher').click()
        expect(page.locator('.music-dock')).to_be_visible()
        checks.append('pause, volume, mute, seeking, saved selection/time and minimization')
        page.locator('[data-music="next"]').click()
        expect(page.locator('[data-music-title]')).to_have_text('Guerriers de la Dalle')
        page.wait_for_function('!document.querySelector("audio").paused&&document.querySelector("audio").currentTime>0')
        page.locator('audio').evaluate('a=>a.currentTime=a.duration-.2')
        expect(page.locator('[data-music-title]')).to_have_text('Face à la tempête')
        page.wait_for_function('document.querySelector("audio").readyState>=1&&!document.querySelector("audio").paused')
        page.locator('audio').evaluate('a=>a.currentTime=a.duration-.2')
        page.wait_for_function('document.querySelector("audio").paused')
        expect(page.locator('[data-music-status]')).to_have_text('Fin de la playlist.')
        checks.append('actual ended events advance tracks and stop at playlist end')
        page.locator('.music-dock-tools [data-music="playlist"]').click()
        page.locator('[data-music-filter="all"]').click()
        for button in page.locator('[data-track-id]').all():
            title = button.locator('strong').inner_text()
            button.click()
            page.wait_for_function('document.querySelector("audio").readyState>=2&&!document.querySelector("audio").paused&&document.querySelector("audio").currentTime>0')
            expect(page.locator('[data-music-title]')).to_have_text(title)
            assert page.locator('audio').evaluate('a=>Number.isFinite(a.duration)&&a.duration>100')
        checks.append('all ten MP3s decode and start in the browser')
        page.locator('[data-music="play"]').click()
        for width,height in [(1536,1100),(820,1180),(390,844),(320,700)]:
            page.set_viewport_size({'width':width,'height':height})
            page.wait_for_timeout(250)
            box = page.locator('.codex-music').bounding_box()
            assert box['x']>=0 and box['y']>=0 and box['x']+box['width']<=width+1 and box['y']+box['height']<=height+1, (width,box)
            assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'), width
            page.screenshot(path=str(args.output/f'music-{width}.png'))
        checks.append('desktop/tablet/mobile and 320px layout fit viewport')
        context.close()
        # Blocked storage must not disable the player.
        context = browser.new_context()
        context.add_init_script("Storage.prototype.getItem=function(){throw new DOMException('Blocked','SecurityError')};Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError')}")
        blocked = context.new_page()
        blocked.on('pageerror', lambda e: errors.append(str(e)))
        blocked.goto(base)
        blocked.locator('[data-music="play"]').click()
        blocked.wait_for_function('!document.querySelector("audio").paused')
        context.close()
        checks.append('storage denied or full does not prevent playback')
        # A real network failure gives feedback; the next valid track remains playable.
        context = browser.new_context()
        context.route('**/below-the-mountain.mp3',lambda route:route.abort())
        failed = context.new_page()
        failed.on('pageerror', lambda e: errors.append(str(e)))
        failed.goto(base)
        failed.locator('[data-music="play"]').click()
        expect(failed.locator('[data-music-status]')).to_contain_text('Ce morceau ne peut pas être chargé')
        context.unroute('**/below-the-mountain.mp3')
        failed.locator('[data-music="play"]').click()
        failed.wait_for_function('!document.querySelector("audio").paused&&document.querySelector("audio").currentTime>0')
        failed.locator('[data-music="play"]').click()
        failed.locator('[data-music="next"]').click()
        failed.locator('[data-music="play"]').click()
        failed.wait_for_function('!document.querySelector("audio").paused&&document.querySelector("audio").currentTime>0')
        context.close()
        checks.append('network failure is visible and recoverable')
        browser.close()
    assert not errors, errors
    assert not missing, missing
    report={'checks':checks,'javascript_errors':errors,'missing_resources':missing,'result':'passed'}
    (args.output/'results.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))


if __name__ == '__main__': main()
