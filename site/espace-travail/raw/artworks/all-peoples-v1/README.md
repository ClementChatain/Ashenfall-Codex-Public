# Codex illustré — extension aux six peuples et 24 classes

Sources artistiques de l’extension demandée le 25 octobre 2026 avec autorisation de publication directe. Le Rempart conserve ses galeries existantes ; 23 nouvelles planches comportent chacune deux rangées de six personnages (progression visuelle, puis skins alternatifs). Cinq panoramas complètent le décor nain déjà présent. Les portraits publics existants ont servi de références de silhouette, de rôle et d’équipement.

Ces visuels sont des concepts artistiques. Ils n’ajoutent aucune validation narrative, statistique, niveau requis, personnage canonique ou lieu nommé. Les 278 fiches publiques et leurs métadonnées sont conservées.

`sources/` conserve les 28 PNG originaux ; `manifest.json` leurs empreintes ; `results/` les descriptions de génération et chemins de reconstruction ; `jobs.json` les classes et références publiques.

Depuis le dépôt public, les dérivés peuvent être reconstruits avec Pillow :

```sh
python3 scripts/prepare_all_peoples_artwork.py --results ../Ashenfall-Knowledge/artworks/all-peoples-v1/results --jobs ../Ashenfall-Knowledge/artworks/all-peoples-v1/jobs.json
```

Le script prépare les WebP et la configuration sous `site/assets/classes/peoples-v1/`. Ne jamais servir ce dossier de sources privées par HTTP. Les vérifications du rendu et de publication concernent le dépôt public et son domaine.

## Révision Brise-Fer du 26 octobre 2026

La reconstruction courante du Brise-Fer pointe vers [la planche V2](../brise-fer-v2/README.md). Les originaux V1 sont préservés. Le job fournit une séparation à y=492, les détails de la colonne VI de base, six libellés descriptifs de skins et une version d’URL pour éviter les anciennes images en cache. Les nouvelles sources et références utilisent des chemins relatifs à la racine Knowledge.
