# Bestiaire en développement

Les données fournies par Clément le 29 octobre 2026 sont dans `site/bestiaire/bestiaire-data.js`, le rendu fourni dans `site/bestiaire/img/golem.png`. Les modèles 3D, sources Unity et documents internes ne sont pas importés.

Le bestiaire est natif dans `site/index.html` : carte illustrée à `#/bestiaire`, fiche à `#/golem-pierre-blinde`, recherche globale, navigation et lecteur musical conservés. L’ancienne URL `/bestiaire/` redirige vers la rubrique native. Les caractéristiques, références et réserves du fichier fourni sont conservées ; aucune validation du canon narratif n’est ajoutée.

Prévisualisation : `python3 -m http.server 8041 --directory site`, puis `/#/bestiaire`. Aucune dépendance ni construction. Les scripts et styles du mini-site original sont conservés comme sources mais ne sont plus exécutés.

Publication : workflow Pages existant, manuel sur `main` avec SHA exact. Actualiser les empreintes `publication/v2-release.json` après modification. Lancer les contrôles du dépôt et vérifier ensuite l’URL et les ressources publiques.
