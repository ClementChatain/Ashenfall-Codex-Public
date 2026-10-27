# Lecteur des musiques du Codex

Le lecteur permanent est monté par `site/assets/music-player-v1/player.mjs`, en dehors de `#view`. Le même élément HTMLAudioElement reste actif pendant les changements de fiches `#/…`. Aucun démarrage automatique et aucun téléchargement MP3 au chargement : `preload="none"` et aucune source assignée à l’élément audio avant le clic Lecture ou le choix d’un titre ; la lecture commence après une action de l’utilisateur.

## Bibliothèque et classement

Dix MP3 fournis par Clément dans la session du 27 octobre 2026, environ 28 min 17 s et 40,8 Mo. `site/assets/audio/v1/` conserve leurs octets originaux, sans réencodage avec pertes. `data/music-library-v1.json` enregistre noms d’origine, tailles, durées, SHA-256 et mesures descriptives d’un extrait sonore. Les dix fichiers ont été décodés intégralement par FFmpeg et démarrés dans Chromium.

Le classement est **provisoire et éditorial, par ambiance**, suggéré à partir des titres. Les fichiers n’ont pas de genre renseigné et aucune écoute humaine vérifiée n’est revendiquée. Les mesures acoustiques ne constituent pas une reconnaissance de genre ; leurs estimations de pulsation peuvent notamment donner le double ou la moitié du tempo. Aucun auteur, instrument, texte chanté ou droit de diffusion n’est déduit des noms.

| Ambiance proposée | Morceaux |
|---|---|
| Profondeurs | Below the Mountain ; Beneath the Iron Keep ; The Weight of Ancient Stone |
| Épopée | Legacy of the High Throne ; The Sovereign’s Vigil |
| Taverne | The Deep Hall’s Toast |
| Aventure | L’acier et l’archet |
| Bataille | Jungle de fer ; Guerriers de la Dalle ; Face à la tempête |

Changer `group` et l’ordre des entrées de `library.mjs` pour ajuster ce classement après retour du créateur. Les filtres ne retirent pas les autres pistes de la file de lecture. Pour ajouter un morceau, conserver un identifiant et une URL stables, sa durée mesurée et son empreinte d’origine ; mettre à jour les tests de bibliothèque si le nombre change ; le compteur est automatique.

## Comportement

- Lecture/pause, précédent/suivant, progression, volume et sourdine. Le précédent revient au début du morceau si plus de trois secondes ont été lues, sinon au titre précédent.
- Les titres de la playlist démarrent au clic. Précédent/suivant préservent l’état en pause ; la fin naturelle enchaîne sur le titre suivant puis s’arrête à la fin de la liste.
- Répétition désactivée / toute la liste / un titre ; le mode aléatoire évite de rejouer un titre déjà parcouru dans le cycle et respecte l’arrêt en fin de liste lorsque la répétition est désactivée.
- Le lecteur peut être réduit en médaillon pendant que la musique continue. Échap ferme la playlist et restitue le focus. Les commandes et curseurs sont nommés pour les lecteurs d’écran ; les animations respectent la réduction de mouvement.
- Le stockage local conserve titre, position, volume, sourdine et modes sous `ashenfall-music-v1`. Au rechargement, le lecteur reste **en pause** ; la reprise à la position enregistrée attend le clic Lecture. Un stockage bloqué/saturé ne bloque pas l’écoute.
- La Media Session utilise le titre et le nom de bibliothèque pour les commandes système compatibles. Aucun nom d’artiste n’est inventé.
- Une erreur réseau est affichée dans le lecteur ; l’utilisateur peut réessayer ou choisir un autre morceau. Aucun enchaînement infini sur une piste défectueuse.

La continuité concerne la navigation interne du Codex. Un rechargement ou l’ouverture d’un autre document HTML, notamment le portail documentaire, termine cet élément audio ; la sélection et la position peuvent être reprises manuellement au retour. Aucun service de streaming, cookie tiers, télémétrie ou dépendance distante n’est ajouté.

## Prévisualisation et vérification

Assembler le dossier public comme dans le README, puis utiliser le serveur qui gère les requêtes HTTP Range (nécessaires aux tests de recherche dans le morceau) :

```sh
mkdir -p /tmp/ashenfall-public-dev
cp -R site/. /tmp/ashenfall-public-dev/
cp -R simulateur /tmp/ashenfall-public-dev/
python3 scripts/serve_preview.py --directory /tmp/ashenfall-public-dev --port 8031
```

Dans un autre terminal :

```sh
node --test tests/*.test.mjs
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -q
python3 scripts/verify_public_v2.py --for-deployment
python3 scripts/smoke_music_player.py --base-url http://127.0.0.1:8031/
```

Le serveur lie uniquement `127.0.0.1`. Lui fournir le dossier public assemblé, jamais la racine de Knowledge ou du dépôt Git. Il sert les plages d’octets, y compris les plages ouvertes et suffixes, et refuse les plages impossibles avec 416. Le serveur simple historique reste utilisable pour les pages, mais ne reproduit pas correctement la recherche audio.

Le contrôle navigateur exerce une lecture réelle, la navigation entre fiches, les dix MP3, les événements de fin, les préférences, les erreurs réseau et le stockage bloqué. Il vérifie aussi les formats ordinateur, tablette, mobile et 320 px. Les captures vont dans `/tmp/ashenfall-music/validation`.

## Publication

Le workflow Pages copie explicitement `assets/audio` et `assets/music-player-v1`, en conservant les chroniques, galeries, simulateurs et portail documentaire. Tous les nouveaux fichiers servis restent couverts par les empreintes de `publication/v2-release.json`. La fusion ne déploie pas : lancer `pages.yml` avec le SHA complet autorisé puis vérifier le domaine, les fichiers audio et les réponses Range. Les sources MP3 sont déjà optimisées à environ 192 kbit/s ; aucun transcodage supplémentaire n’est nécessaire pour ces dix pistes.

## Finition du lecteur V2

Le bouton lecture/pause dispose d’une géométrie fixe et non compressible : 56 × 56 px, ou 48 × 48 px sur les écrans peu hauts. La règle des petites commandes ne peut plus écraser sa largeur. Le cadre est plus fin, le médaillon est serti et la progression se colore en fonction de la position réelle. Sur mobile, les commandes occupent une ligne distincte du titre ; en paysage, une présentation compacte conserve l’accès aux pistes.

Le test navigateur vérifie les proportions avec un titre long, aux formats ordinateur, tablette, 390/320 px et paysage 812 × 390 / 480 × 320. La bibliothèque MP3, le stockage et les règles de lecture restent identiques.
