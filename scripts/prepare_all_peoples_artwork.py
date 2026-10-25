"""Build public concept-art derivatives and visual configuration for all peoples.

Sources are 2-row by 6-column class boards and panoramic landscapes.
Pillow is an optional authoring dependency; the deployed site stays static.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image


GROUPS = {
    'nains': ['rempart', 'brise-fer', 'artilleur-runique', 'accordeur'],
    'elfes': ['gardien-des-racines', 'danse-lame', 'traqueur-sylvestre', 'tisseur-de-vie'],
    'humains': ['sentinelle', 'duelliste', 'arcaniste', 'thaumaturge'],
    'kharun': ['porte-faille', 'fendeur', 'eclateur', 'lieur'],
    'vaelith': ['enlaceur', 'mue-lame', 'aiguilleur', 'eveilleur'],
    'orynth': ['brise-courant', 'sillonneur', 'lance-rive', 'passeur'],
}
TITLES = {'nains': 'Nains', 'elfes': 'Elfes', 'humains': 'Humains', 'kharun': 'Kharûn', 'vaelith': 'Vaelith', 'orynth': 'Orynth'}
ACCENTS = {'nains': '#d6ae70', 'elfes': '#a7c5a0', 'humains': '#b9a5d4', 'kharun': '#b9a085', 'vaelith': '#b4c6ad', 'orynth': '#86b6c7'}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--results', type=Path, required=True)
    parser.add_argument('--jobs', type=Path, required=True)
    parser.add_argument('--allow-partial', action='store_true', help='Local preparation only; strict mode is required before publication.')
    parser.add_argument('--output', type=Path, default=Path('site/assets/classes/peoples-v1'))
    args = parser.parse_args()
    jobs = {job['id']: job for job in json.loads(args.jobs.read_text())}
    results = {path.stem: json.loads(path.read_text()) for path in args.results.glob('*.json')}
    required = set(jobs) | {'landscape-' + race for race in GROUPS if race != 'nains'}
    missing = sorted(required - results.keys())
    if missing and not args.allow_partial:
        raise ValueError('Missing reviewed image sources: ' + ', '.join(missing))
    args.output.mkdir(parents=True, exist_ok=True)
    relative = lambda path: path.relative_to(Path('site')).as_posix()

    def save(image, path):
        path.parent.mkdir(parents=True, exist_ok=True)
        image.save(path, quality=88, method=6)

    peoples = {}
    for race, ids in GROUPS.items():
        landscape = Path('site/assets/classes/redesign-v1/dwarf-city.webp')
        result = results.get('landscape-' + race)
        if result:
            target = args.output / 'landscapes' / (race + '.webp')
            if not target.exists():
                save(Image.open(result['path']).convert('RGB'), target)
            landscape = target
        peoples[race] = {'title': TITLES[race], 'classes': ids, 'accent': ACCENTS[race], 'landscape': relative(landscape)}

    # Reuse already public names for the three remaining dwarf classes; no new canon names.
    text = Path('site/index.html').read_text()
    import re
    names = json.loads(re.search(r'const dwarfMasterSets=(\{.*?\});', text, re.S)[1])
    classes = {}
    source_manifest = []
    for id, job in jobs.items():
        if id not in results:
            continue
        source = Path(results[id]['path'])
        sha = digest(source)
        folder = args.output / id
        metadata_path = folder / 'artwork.json'
        metadata = json.loads(metadata_path.read_text()) if metadata_path.exists() else {}
        if metadata.get('source_sha256') != sha:
            board = Image.open(source).convert('RGB')
            if board.width < 1200 or board.height < 800:
                raise ValueError(f'{id}: insufficient source dimensions for the reviewed 2×6 layout')
            save(board, folder / 'board.webp')
            for row, mode in enumerate(['base', 'skins']):
                for index in range(6):
                    tile = board.crop((round(index * board.width / 6), round(row * board.height / 2), round((index + 1) * board.width / 6), round((row + 1) * board.height / 2)))
                    save(tile, folder / f'{mode}-{index + 1:02}.webp')
            master = board.crop((0, round(board.height / 2), round(board.width / 6), board.height))
            boxes = [(.18, .03, .82, .29), (.05, .18, .95, .45), (.20, .30, .80, .62),
                     (.15, .50, .85, .78), (.00, .20, .55, .78), (.00, .00, 1., 1.)]
            for index, box in enumerate(boxes):
                save(master.crop(tuple(round(value * (master.width if axis % 2 == 0 else master.height)) for axis, value in enumerate(box))), folder / f'details-{index + 1:02}.webp')
            metadata = {'id': id, 'status': 'concept', 'source_sha256': sha, 'width': board.width, 'height': board.height, 'layout': '2 rows × 6 columns: base progression, then alternative skins', 'reference_sha256': digest(Path(job['reference']))}
            metadata_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
        classes[id] = {'title': job['title'], 'race': job['race'], 'board': relative(folder / 'board.webp'),
                       'base': [relative(folder / f'base-{i + 1:02}.webp') for i in range(6)],
                       'skins': [relative(folder / f'skins-{i + 1:02}.webp') for i in range(6)],
                       'details': [relative(folder / f'details-{i + 1:02}.webp') for i in range(6)],
                       'skinLabels': [item[0] for item in names[id]] if id in names else ['Variante ' + x for x in ['I', 'II', 'III', 'IV', 'V', 'VI']]}
        source_manifest.append(metadata)

    config = {'version': 'all-peoples-v1', 'status': 'concept', 'peoples': peoples, 'classes': classes}
    (args.output / 'visual-data.js').write_text('window.AshenfallPeopleVisuals = ' + json.dumps(config, ensure_ascii=False, separators=(',', ':')) + ';\n')
    manifest = {'version': 'all-peoples-v1', 'status': 'concept', 'sources': source_manifest,
                'scope': 'Illustrated presentation only. Existing records, roles, mechanics and canonical validation are unchanged.',
                'files': [{'file': path.relative_to(args.output).as_posix(), 'sha256': digest(path)} for path in sorted(args.output.rglob('*.webp'))]}
    (args.output / 'artwork-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'Prepared {len(classes)} class galleries and {len(peoples)} peoples; {len(manifest["files"])} images. Missing: {missing}')


if __name__ == '__main__':
    main()
