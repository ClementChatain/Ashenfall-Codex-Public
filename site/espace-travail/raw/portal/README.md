# Portail de travail Ashenfall

Décision de Clément, 26 octobre 2026 : conserver les sources dans un dépôt privé, rendre le contenu du projet consultable sur un site et permettre aux IA de lire les références actualisées.

Ce portail de travail accepte les propositions et documents internes avec leur statut d'origine. Leur présence sur le site ne les valide pas et ne les transforme pas en contenu officiel pour les joueurs. Le circuit de publication canonique V2 reste distinct. Clément a autorisé son déploiement le 26 octobre 2026, après avoir confirmé que le code du jeu devait rester privé.

## Lecture

- `index.html` : rubriques, recherche et documents.
- `ai/index.html` : point d'entrée statique pour toute IA disposant d'un accès web.
- `llms.txt` : consignes de lecture et liens relatifs.
- `llms-full.txt` : texte complet, découpé aussi par rubrique dans `ai/`.
- `manifest.json` : chemins, statuts déclarés, empreintes SHA-256 et révision source.
- `documents/` : pages HTML statiques, lisibles sans JavaScript.
- `raw/` : texte brut et illustrations, servis depuis le même domaine. Aucun lien privé nécessaire pour les lire.

Un accès web n'est pas une mémoire partagée : chaque IA doit relire l'index avant une mission et consulter les documents concernés. Les outils sans navigation doivent recevoir un paquet de contexte exporté. Aucun fonctionnement automatique de Gemini, Claude Code ou des projets ChatGPT n'est prétendu.

## Construire

Depuis la racine du dépôt :

```sh
python3 -m unittest discover -s tests -p 'test_portal.py' -v
python3 scripts/build_portal.py --output /tmp/ashenfall-workspace
python3 -m http.server 8000 --bind 127.0.0.1 --directory /tmp/ashenfall-workspace
```

Le constructeur ne lit que les fichiers suivis par Git dans les rubriques autorisées. Il produit des pages HTML et du texte, sans appel au dépôt privé depuis le navigateur ou jeton embarqué. Pillow (>=11.3,<13) prépare les images WebP de 1800 pixels maximum ; les originaux restent privés. La sortie doit être extérieure au dépôt ; aucun nettoyage récursif d'un dossier existant n'est effectué.

## Couverture et limites

Les rubriques couvrent les fiches, règles, décisions, propositions, archives de conception, illustrations et références techniques présentes dans Knowledge. Les textes et statuts ne sont pas réécrits. Le manifeste inventorie aussi les fichiers non exportés et leur motif.

Les conversations brutes de `sources/`, les journaux de validation, les secrets techniques, le code exécutable et les métadonnées Git ne sont pas publiés. Les décisions éditoriales déjà conservées restent accessibles dans `decisions/` et les documents. Les pages n'exécutent pas les HTML de propositions : ils sont présentés comme textes d'archive téléchargeables en `.txt`. Les sources d'images raster sont copiées ; les fichiers actifs comme SVG et scripts restent exclus. Le filtre de secrets refuse les formats de jetons et clés privées connus mais ne remplace pas une revue des textes.

Les documents Unity non présents dans Knowledge et les conversations non transférées ne peuvent pas être inventoriés par ce constructeur. `portal/etat-projet.md` doit rester explicite sur ces absences. Les fiches Unity de Knowledge sont des références de production, pas une preuve d'implémentation.

## Actualisation

À chaque évolution significative : mettre à jour la source concernée, le journal de changement et l'état courant, puis reconstruire et publier la même révision. Le manifeste expose la révision et la date de fabrication ; cette date ne certifie pas qu'un texte ancien est à jour. Un nouveau commit privé ne met pas à jour le site tant qu'il n'est pas déployé.

`portal/lecture-ia.md` contient le contrat commun. L'accès HTTP et la lecture réelle sont à vérifier dans chaque environnement ; ne pas annoncer « toutes les IA connectées » sur la seule existence des fichiers.

## Hébergement

Cette PR prépare un artefact autonome dans le dépôt privé. Le workflow `portal.yml` teste et assemble le portail, sans changer le domaine, la visibilité des dépôts, les secrets, ni le Codex en ligne. Le déploiement doit utiliser cet artefact depuis un hébergement relié au dépôt privé. GitHub Pages depuis un dépôt privé dépend du forfait GitHub ; ne pas rendre le dépôt public pour contourner cette limite. Aucun plan payant n'est présumé.

Le forfait GitHub actuel ne permet pas Pages directement depuis Knowledge privé. Le déploiement utilise donc le dépôt de diffusion du Codex existant : seuls les fichiers construits pour le site vont dans site/espace-travail/. Les sources du générateur, l'historique privé, le projet Unity et les sources Blender n'y vont jamais. Le workflow Pages doit inclure ce dossier et le manifeste public doit couvrir ses fichiers. Le portail et ses exports deviennent publiquement consultables, conformément à la décision, sans rendre Knowledge public.
