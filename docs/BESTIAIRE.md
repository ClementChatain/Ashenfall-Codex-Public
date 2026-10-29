# Bestiaire en développement

Le mini-site fourni par Clément le 29 octobre 2026 est conservé dans `site/bestiaire/` et publié à `/bestiaire/` par le workflow Pages existant, depuis `main`. La rubrique `#/bestiaire` du Codex propose le lien ; le mini-site propose le retour.

Seuls les cinq fichiers de `Site/` de l’archive reçue sont importés : HTML, CSS, deux scripts et `img/golem.png` (rendu Unity fourni). Aucun modèle 3D, projet Unity, document interne ou asset source sous licence n’est importé. Les mentions de source et de licence sont conservées.

Cette fiche de développement conserve « Prévu », le rôle à confirmer et les statistiques à définir ; elle ne modifie ni les fiches narratives existantes ni leur validation canonique.

Prévisualisation : `python3 -m http.server 8041 --directory site`, puis `/bestiaire/` et `/#/bestiaire`. Aucune dépendance ni construction. Pour les mises à jour, modifier uniquement les fichiers web publics, actualiser les empreintes de `publication/v2-release.json`, lancer les vérifications du dépôt, puis suivre le déploiement Pages manuel avec le SHA exact. Vérifier ensuite l’URL et les ressources publiques.
