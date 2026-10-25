"""Prepare web derivatives from the three regenerated Rempart concept boards.

Optional authoring dependency: Pillow. Original files are read only.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('base', 'skins', 'colors'):
        parser.add_argument('--' + name, type=Path, required=True)
    parser.add_argument('--output', type=Path, default=Path('site/assets/classes/rempart-equipment-v2'))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    boards = {key: Image.open(getattr(args, key)).convert('RGB') for key in ('base', 'skins', 'colors')}
    for key, board in boards.items():
        if board.width < 1200 or board.height < 600:
            raise ValueError(f'{key}: source resolution is too low for the reviewed layout')

    def save(image, name):
        image.save(args.output / (name + '.webp'), quality=90, method=6)

    for key, board in boards.items():
        save(board, key + '-board')
        count = 4 if key == 'colors' else 6
        for index in range(count):
            column = board.crop((round(board.width * index / count), 0, round(board.width * (index + 1) / count), board.height))
            prefix = {'skins': 'master', 'colors': 'color'}.get(key, key)
            save(column, f'{prefix}-{index + 1:02}')
            if key == 'skins':
                # The reviewed generated board places the full front figure in its top row.
                save(column.crop((0, 0, column.width, round(column.height * .51))), f'master-front-{index + 1:02}')

    master = boards['base'].crop((round(boards['base'].width * 5 / 6), 0, boards['base'].width, boards['base'].height))
    # Technical crops of the existing master figure, with no artistic transformation.
    crops = [(.37, .09, .75, .31), (.14, .22, .57, .42), (.35, .29, .72, .54),
             (.32, .47, .72, .65), (.62, .28, .98, .80), (.02, .52, .36, .85)]
    for index, box in enumerate(crops):
        save(master.crop(tuple(round(value * (master.width if axis % 2 == 0 else master.height)) for axis, value in enumerate(box))), f'detail-{index + 1:02}')

    manifest = {
        'version': 'rempart-equipment-v2', 'status': 'concept', 'created_at': '2026-10-25',
        'generation': 'OpenAI image generation, following the two visual references and the creator’s regeneration request.',
        'scope': 'Base equipment progression, six alternative master skins, four color examples. No new gameplay statistics or canonical validation.',
        'sources': {key: {'sha256': sha256(getattr(args, key)), 'width': image.width, 'height': image.height} for key, image in boards.items()},
        'derivatives': [{'file': path.name, 'sha256': sha256(path)} for path in sorted(args.output.glob('*.webp'))]
    }
    (args.output / 'artwork-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'Prepared {len(manifest["derivatives"])} WebP images with provenance manifest.')


if __name__ == '__main__':
    main()
