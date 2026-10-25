"""Functional audit of the existing static planners; never changes application code.

Requires Playwright and Chromium. Run against an isolated local copy, not user data.
Exit 1 means an expected safety/consistency contract was violated, not a runner error.
"""
import argparse
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://127.0.0.1:8020/')
    parser.add_argument('--output', type=Path, default=Path('/tmp/ashenfall-simulator-audit/results.json'))
    parser.add_argument('--chromium', default='/usr/bin/chromium')
    args = parser.parse_args()
    checks, observations = [], []

    def check(id, condition, evidence):
        checks.append({'id': id, 'result': 'pass' if condition else 'fail', 'evidence': evidence})

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=args.chromium, args=['--no-sandbox'])

        def scenario(kind='classes', seed=None, init=None, query=''):
            context = browser.new_context(viewport={'width': 1440, 'height': 1000})
            if seed is not None:
                key = 'ashenfall-all-masteries-v1-rempart' if kind == 'classes' else 'ashenfall-rempart-v8'
                value = seed if isinstance(seed, str) else json.dumps(seed)
                context.add_init_script('try { localStorage.setItem(' + json.dumps(key) + ',' + json.dumps(value) + '); } catch {}')
            if init:
                context.add_init_script(init)
            page = context.new_page()
            errors, dialogs = [], []
            page.on('pageerror', lambda error: errors.append(str(error)))
            def accept(dialog):
                dialogs.append(dialog.message)
                dialog.accept()
            page.on('dialog', accept)
            page.goto(args.base_url + 'simulateur/' + kind + '/' + (query or ('?classe=rempart' if kind == 'classes' else '')), wait_until='domcontentloaded')
            return context, page, errors, dialogs

        # The common engine, all classes, tiers, budget and public skill references.
        context, page, errors, dialogs = scenario()
        ids = page.evaluate('classes.map(c=>c.id)')
        coverage = []
        for id in ids:
            page.goto(args.base_url + 'simulateur/classes/?classe=' + id, wait_until='domcontentloaded')
            result = page.evaluate('''() => {
              state={ranks:{},choices:{},synergies:[]}; render();
              const locked=document.querySelector('[data-plus="0-3"]').disabled;
              for(const id of ['0-0','0-1']){add(id,1);add(id,1);}
              const at4=document.querySelector('[data-plus="0-3"]').disabled;
              add('0-2',1);
              const at5=!document.querySelector('[data-plus="0-3"]').disabled;
              state={ranks:{},choices:{},synergies:[]};
              for(const node of nodes(0)){add(node.id,1);add(node.id,1);}
              for(const id of ['1-0','1-1']){add(id,1);add(id,1);}
              const before=spent();add('1-2',1);
              return {id:current,talents:all().length,skills:skills().length,locked,at4,at5,spent:spent(),remaining:left(),overflowBlocked:spent()===before,valid:valid()};
            }''')
            coverage.append(result)
        check('ALL_24_CLASSES_BUDGET_AND_TIERS', len(coverage) == 24 and all(r['talents'] == 24 and r['skills'] == 10 and r['locked'] and r['at4'] and r['at5'] and r['spent'] == 20 and r['remaining'] == 0 and r['overflowBlocked'] and r['valid'] for r in coverage), coverage)
        context.close()

        context, page, errors, dialogs = scenario()
        page.evaluate("add('0-0',1)")
        before = page.locator('[data-choice="0-0"]').count()
        page.evaluate("add('0-0',1)")
        available = page.locator('[data-choice="0-0"]').count()
        page.locator('[data-choice="0-0"][value="a"]').check()
        chosen = page.evaluate('state.choices["0-0"]')
        page.evaluate("add('0-0',-1)")
        cleared = page.evaluate('!("0-0" in state.choices)')
        check('GENERAL_RANK2_CHOICES_AND_REFUND', before == 0 and available == 2 and chosen == 'a' and cleared, {'rank1_choices': before, 'rank2_choices': available, 'choice_before_refund': chosen, 'cleared_after_refund': cleared})
        context.close()

        for kind, node in [('classes', '0-0'), ('rempart', 'b-0')]:
            context, page, errors, dialogs = scenario(kind)
            button = page.locator('[data-plus="' + node + '"]')
            button.focus(); button.press('Space')
            active = page.evaluate('({tag:document.activeElement.tagName,node:document.activeElement.dataset.plus})')
            check(kind.upper() + '_ALLOCATION_PRESERVES_KEYBOARD_FOCUS', active.get('node') == node, active)
            context.close()

        context, page, errors, dialogs = scenario()
        page.evaluate("() => {for(const id of ['0-0','0-1','1-0','1-1']){add(id,1);add(id,1);}add('0-2',1);add('1-2',1);}")
        page.locator('[data-combo="0-1"]').click()
        result = page.evaluate('({spent:spent(),owned:state.synergies.slice(),left:left()})')
        check('GENERAL_SYNERGY_REQUIRES_5_PLUS_5_AND_COSTS_2', result['spent'] == 12 and result['owned'] == ['0-1'] and result['left'] == 8, result)
        page.reload(wait_until='domcontentloaded')
        check('GENERAL_AUTOSAVE_ROUNDTRIP', page.evaluate('spent()') == 12, page.evaluate('({spent:spent(),owned:state.synergies.slice()})'))
        context.close()

        context, page, errors, dialogs = scenario()
        page.evaluate("() => {for(const id of ['0-0','0-1']){add(id,1);add(id,1);}add('0-2',1);add('0-3',1);}")
        page.locator('[data-minus="0-2"]').click()
        result = page.evaluate('({rank:state.ranks["0-2"],valid:valid(),spent:spent()})')
        check('GENERAL_PROTECTED_REFUND', result['rank'] == 1 and result['valid'], result)
        check('GENERAL_REFUND_EXPLAINS_REJECTION', bool(dialogs) or page.locator('[role="alert"]').count() > 0, {'dialogs': dialogs, 'rank_after_attempt': result['rank']})
        context.close()

        for label, seed in [
            ('NEGATIVE', {'ranks': {'0-0': -4}}),
            ('FRACTIONAL', {'ranks': {'0-0': .5}}),
            ('OVER_MAX', {'ranks': {'0-0': 3}}),
            ('NON_NUMERIC', {'ranks': {'0-0': 'broken'}}),
            ('LOCKED_TIER', {'ranks': {'0-6': 1}}),
            ('UNKNOWN_ID', {'ranks': {'unknown-talent': 5}}),
        ]:
            context, page, errors, dialogs = scenario(seed=seed)
            result = page.evaluate('({rank:state.ranks["0-0"],ranks:state.ranks,spent:spent(),remaining:left(),valid:valid(),display:document.getElementById("points").textContent})')
            check('GENERAL_REJECTS_' + label + '_SAVE', result['spent'] == 0 and result['remaining'] == 20, result)
            context.close()

        context, page, errors, dialogs = scenario(seed='not valid json')
        check('GENERAL_RECOVERS_MALFORMED_JSON', page.evaluate('left()') == 20 and not errors, {'errors': errors, 'remaining': page.evaluate('left()')})
        context.close()

        context, page, errors, dialogs = scenario(init="Storage.prototype.setItem=function(){throw new DOMException('Audit quota exceeded','QuotaExceededError')};")
        page.locator('[data-plus="0-0"]').click()
        check('GENERAL_HANDLES_STORAGE_FAILURE', not errors and page.locator('#points').inner_text().startswith('19'), {'errors': errors, 'display': page.locator('#points').inner_text(), 'internal_remaining': page.evaluate('left()')})
        context.close()

        context, page, errors, dialogs = scenario(query='?classe=arcaniste')
        page.locator('#class').select_option('duelliste')
        url = page.url
        page.reload(wait_until='domcontentloaded')
        check('GENERAL_RELOAD_KEEPS_CURRENT_CLASS', page.locator('#class').input_value() == 'duelliste', {'url_after_switch': url, 'class_after_reload': page.locator('#class').input_value()})
        page.evaluate("location.hash='thaumaturge'")
        page.wait_for_timeout(100)
        check('GENERAL_HASH_NAVIGATION_UPDATES_CLASS', page.locator('#class').input_value() == 'thaumaturge', {'hash': page.evaluate('location.hash'), 'selected': page.locator('#class').input_value()})
        context.close()

        # Dedicated Rempart engine, manual persistence, malformed save shapes and action bars.
        context, page, errors, dialogs = scenario('rempart')
        result = page.evaluate('''() => {
          const tier=flat.find(t=>t.id==='b-3'),initial=!canAdd(tier);
          for(const id of ['b-0','b-1']){change(id,1);change(id,1);}
          const at4=!canAdd(tier);change('b-2',1);const at5=canAdd(tier);
          ranks=Object.fromEntries(flat.map(t=>[t.id,0]));owned=[];choices={};
          for(const t of flat.filter(t=>t.path==='b')){change(t.id,1);change(t.id,1);}
          for(const id of ['f-0','f-1']){change(id,1);change(id,1);}
          return {initial,at4,at5,spent:spent(),remaining:remaining(),allBlocked:flat.every(t=>!canAdd(t)),valid:valid()};
        }''')
        check('REMPART_BUDGET_AND_TIERS', result['initial'] and result['at4'] and result['at5'] and result['spent'] == 20 and result['remaining'] == 0 and result['allBlocked'] and result['valid'], result)
        context.close()

        context, page, errors, dialogs = scenario('rempart')
        page.evaluate("() => {for(const id of ['b-0','b-1','f-0','f-1']){change(id,1);change(id,1);}change('b-2',1);change('f-2',1);}")
        page.locator('[data-syn="0"]').click()
        acquired = page.evaluate('({owned:owned.slice(),spent:spent()})')
        page.evaluate("change('f-2',-1)")
        blocked = page.evaluate('ranks["f-2"]===1')
        page.locator('[data-syn="0"]').click()
        page.evaluate("change('f-2',-1)")
        refunded = page.evaluate('({owned:owned.slice(),rank:ranks["f-2"],spent:spent()})')
        check('REMPART_SYNERGY_COST_AND_PROTECTED_REFUND', acquired['owned'] == [0] and acquired['spent'] == 12 and blocked and refunded['owned'] == [] and refunded['rank'] == 0, {'acquired': acquired, 'refund_blocked_while_owned': blocked, 'after_removing_synergy': refunded})
        context.close()

        context, page, errors, dialogs = scenario('rempart')
        page.evaluate("change('b-0',1)")
        before = page.locator('[data-choice="b-0"]').count()
        page.evaluate("change('b-0',1)")
        available = page.locator('[data-choice="b-0"]').count()
        page.locator('[data-choice="b-0"][value="a"]').check()
        page.evaluate("change('b-0',-1)")
        check('REMPART_RANK2_CHOICES_AND_REFUND', before == 0 and available == 2 and page.evaluate('!("b-0" in choices)'), {'rank1_choices': before, 'rank2_choices': available, 'choice_cleared': page.evaluate('!("b-0" in choices)')})
        context.close()

        context, page, errors, dialogs = scenario('rempart')
        page.evaluate("change('b-0',1)")
        page.locator('#save').click(); page.locator('#reset').click(); page.locator('#load').click()
        result = page.evaluate('({rank:ranks["b-0"],spent:spent(),valid:valid()})')
        check('REMPART_MANUAL_SAVE_ROUNDTRIP', result['rank'] == 1 and result['spent'] == 1 and result['valid'], result)
        context.close()

        context, page, errors, dialogs = scenario('rempart', seed={'ranks': {'b-0': .5}, 'slots': [{'ability': '', 'key': ''}] * 30, 'weapon': 'Bouclier + arme à une main', 'count': '20'})
        page.locator('#load').click()
        result = page.evaluate('({rank:ranks["b-0"],spent:spent(),valid:valid()})')
        check('REMPART_REJECTS_FRACTIONAL_SAVE', result['rank'] == 0, result)
        context.close()

        ranks = {'b-0': 2, 'b-1': 2, 'b-2': 1, 'v-0': 2, 'v-1': 2, 'v-2': 1}
        context, page, errors, dialogs = scenario('rempart', seed={'ranks': ranks, 'owned': [1, 1], 'slots': [{'ability': '', 'key': ''}] * 30, 'weapon': 'Bouclier + arme à une main', 'count': '20'})
        page.locator('#load').click()
        result = page.evaluate('({owned,spent:spent(),valid:valid()})')
        check('REMPART_REJECTS_DUPLICATE_SYNERGIES', len(result['owned']) == len(set(result['owned'])), result)
        context.close()

        context, page, errors, dialogs = scenario('rempart', seed={'ranks': {'b-0': 1}, 'slots': [None] * 30, 'count': '20', 'weapon': 'Bouclier + arme à une main'})
        page.locator('#load').click()
        result = page.evaluate('({rank:ranks["b-0"],slot:slots[0]})')
        page.locator('[data-plus="b-0"]').click()
        check('REMPART_LOAD_IS_ATOMIC_AND_RECOVERABLE', result['rank'] == 0 and result['slot'] is not None and not errors, {'state_after_failed_load': result, 'dialogs': dialogs, 'errors_on_next_click': errors})
        context.close()

        context, page, errors, dialogs = scenario('rempart')
        page.locator('summary').filter(has_text='Configuration avancée').click()
        page.locator('#barCount').select_option('30')
        page.locator('[data-slot="29"]').click()
        page.locator('#barCount').select_option('10')
        page.locator('#shortcut').fill('AUDIT')
        page.locator('#assign').click()
        result = page.evaluate('({selected,visible:Number(document.getElementById("barCount").value),hiddenSlot:slots[29]})')
        check('REMPART_REDUCING_BAR_CLAMPS_SELECTION', result['selected'] < result['visible'], result)
        context.close()

        context, page, errors, dialogs = scenario('rempart')
        page.locator('summary').filter(has_text='Configuration avancée').click()
        page.locator('#shortcut').fill('<img src=x onerror="document.body.dataset.auditXss=\'yes\'">')
        page.locator('#assign').click()
        page.wait_for_timeout(150)
        injected = page.evaluate("document.body.dataset.auditXss==='yes'")
        check('REMPART_SHORTCUT_IS_RENDERED_AS_TEXT', not injected, {'html_executed': injected, 'scope': 'Synthetic shortcut entered in isolated local browser; no external payload or data transfer.'})
        context.close()

        context, page, errors, dialogs = scenario('rempart')
        before = page.evaluate('({abilities:abilities(),canBlock:canAdd(flat.find(t=>t.id==="b-2"))})')
        page.locator('#weapon').select_option(label='Arme à deux mains')
        after = page.evaluate('({abilities:abilities(),canBlock:canAdd(flat.find(t=>t.id==="b-2"))})')
        observations.append({'id': 'WEAPON_SELECT_HAS_NO_RULE_EFFECT', 'unchanged': before == after, 'before': before, 'after': after})
        page.evaluate("change('b-0',1)")
        observations.append({'id': 'EVERY_UNLOCKED_TALENT_IS_OFFERED_AS_ACTION', 'example_in_action_options': page.evaluate("[...document.getElementById('abilities').options].some(option=>option.value==='Pieds de Pierre')")})
        context.close()

        context, page, errors, dialogs = scenario()
        result = page.evaluate('''() => {
          for(const id of ['0-0','0-1','0-2','0-3','0-4']){add(id,1);add(id,1);}
          add('0-6',1);add('0-7',1);add('0-0',-1);
          return {lowerTierPoints:nodes(0).filter(t=>t.req<10).reduce((n,t)=>n+(state.ranks[t.id]||0),0),upperRanks:[state.ranks['0-6'],state.ranks['0-7']],pathPoints:pts(0),valid:valid()};
        }''')
        observations.append({'id': 'THRESHOLDS_USE_ALL_OTHER_POINTS_NOT_ONLY_LOWER_TIERS', 'evidence': result, 'classification': 'Design decision to clarify; current label says points in path, not points in lower tiers.'})
        context.close()

        for kind in ['classes', 'rempart']:
            for device, width, height in [('desktop', 1440, 1000), ('mobile', 390, 844)]:
                context, page, errors, dialogs = scenario(kind)
                page.set_viewport_size({'width': width, 'height': height})
                page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
                overflow = page.evaluate('document.documentElement.scrollWidth>innerWidth')
                image_path = args.output.parent / (kind + '-' + device + '.png')
                image_path.parent.mkdir(parents=True, exist_ok=True)
                page.screenshot(path=str(image_path), full_page=True)
                check(kind.upper() + '_' + device.upper() + '_LAYOUT', not errors and not overflow, {'javascript_errors': errors, 'horizontal_overflow': overflow, 'viewport': [width, height]})
                context.close()
        browser.close()

    report = {'checks': checks, 'observations': observations, 'passed': sum(c['result'] == 'pass' for c in checks), 'failed': sum(c['result'] == 'fail' for c in checks)}
    def portable(value):
        if isinstance(value, float) and not math.isfinite(value):
            return str(value)
        if isinstance(value, dict):
            return {key: portable(item) for key, item in value.items()}
        if isinstance(value, list):
            return [portable(item) for item in value]
        return value
    report = portable(report)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    for c in checks:
        print(c['result'].upper(), c['id'])
    print(json.dumps({'passed': report['passed'], 'failed': report['failed'], 'report': str(args.output)}))
    raise SystemExit(1 if report['failed'] else 0)


if __name__ == '__main__':
    main()
