# Planche de direction visuelle M13.1 : la forteresse

Rédigée le 2026-10-26 au lancement de M13.1 (D314 à D317). **Elle guide le lot ; ce n'est pas une direction artistique finale validée.** Les images de référence : `Docs/Art/M13/planche_materiaux.png` (textures du lot), `Docs/Art/M13/apercu_modules_blender.png` (modules vus dans Blender).

## Intention

Une forteresse naine **réaliste et épique, sombre et usée**, vue de la caméra de jeu (3e personne à 9 m par défaut, isométrique à 22 m) : de la pierre taillée usée par les sièges, du métal travaillé, des braises. Le contraste est **maîtrisé** : la lumière froide de la lune donne le relief, les braseros donnent les points chauds ; les ennemis, les annonces d'attaque (télégraphes), le butin et le personnage restent les éléments les plus lisibles de l'image.

Ce que M13.1 **n'est pas** : un décor complet, ni des personnages, ni un style « low-poly » imposé par le Web (D314). Le travail est volontairement limité à une **petite portion** : l'arène de la mission, sa piste d'accès et le mur du départ.

## Palette

| Rôle | Couleur de référence (sRGB moyen mesuré sur la texture) | Usage |
|---|---|---|
| Dalles | 0,23 / 0,22 / 0,21 (gris brun chaud, plus clair que le sol) | sol de l'arène et piste |
| Pierre taillée usée | 0,32 / 0,29 / 0,26 | mur, piliers, bordures, gravats |
| Terre battue | 0,20 / 0,17 / 0,15 | sol du monde |
| Fer forgé | 0,07 / 0,08 / 0,08 (métallique) | braseros |
| Bronze terni | 0,38 / 0,25 / 0,12, vert-de-gris dans les creux | bandes et rivets des piliers, bord des braseros |
| Braises | croûte 0,03, fissures orange (1,0 / 0,3 à 0,65 / 0,05) en émission | cuve des braseros |
| Brume et vide | 0,075 / 0,082 / 0,105 | brume, couleur de fond au-delà du monde |
| Lune (lumière principale) | 0,78 / 0,82 / 0,96, intensité 1,05, ombres douces | relief général |
| Braseros (points lumineux) | 1,0 / 0,52 / 0,20, intensité 7,5, portée 16 m, vacillement ±16 % | chaleur locale, sans ombres portées |

Règle de contraste : le sol reste **plus clair que le fer du personnage** et plus sombre que les télégraphes (rouge et jaune opaques) ; aucun aplat saturé dans le décor.

## Matériaux (6 + 1 variante)

| Matériau | Textures (créées pour le projet) | Lissage | Remarque |
|---|---|---|---|
| `Env_Flagstone` | albédo et normale 1024, dallage en appareil décalé, motif de 4 m | 0,30 | sol de l'arène et de la piste |
| `Env_StoneWorn` | albédo et normale 1024, pierre sans joints (le relief vient de la géométrie), motif de 4 m, décalage aléatoire par bloc | 0,22 | mur, piliers, bordures, gravats |
| `Env_Mortar` (variante) | texture de la pierre assombrie (0,30) | 0,08 | noyau du mur, visible dans les joints et les moellons manquants |
| `Env_IronWorked` | albédo, métal-lisse et normale 512 (martelage, rayures, rouille discrète) | par texture | braseros |
| `Env_BronzeAged` | albédo et métal-lisse 512, normale du fer | par texture | bandes et rivets |
| `Env_Embers` | albédo, émission et normale 512, émission HDR x2,6 | 0,15 | braises |
| `Env_Ground` | albédo et normale 1024, terre et gravier, motif de 8 m | 0,08 | sol du monde (le collider ne change pas) |

Plus deux matériaux de particules additives (flamme, étincelles). Toutes les textures sont **générées par script** (`Blender/Scripts/m13_textures.py`, graines fixes, raccords sans couture) : aucune ressource externe, aucune licence à vérifier (voir `ASSETS_LICENSES.md`).

## Modules (6)

| Module | Remplit exactement | Triangles | Fichier source |
|---|---|---|---|
| `Floor_Tile` | dalle plate de 4 x 4 m posée à 1,4 cm du sol (sous les télégraphes, à 4 cm) | 2 | `Blender/m13_fortress_modules.blend` |
| `Kerb` | bordure de 2 x 0,5 x 0,28 m (**franchissable**, plus basse que le pas du personnage : 0,4 m) | 108 | idem |
| `Wall_Segment` | le mur du Sandbox, 10 x 3 x 1 m : assises d'appareil à fruit, joints décalés, haut ruiné, moellons manquants | 5 512 | idem |
| `Pier` | les 4 piliers de l'arène, 1,6 x 1,6 x 3 m : socle à degrés, fût en assises chanfreinées, bandes et rivets de bronze, chapiteau | 2 224 | idem |
| `Brazier` | posé **au-dessus** du pilier (3 m) : pied à trois jambes, cuve de fer, bord de bronze, braises, flamme, étincelles, lumière | 1 248 | idem |
| `Rubble` (3 tas) | tas de gravats de moins de 25 cm, sans collider | 924 | idem |

Scripts : `m13_modules.py` (construction et export FBX), `m13_preview.py` (aperçu Blender), `m13_sheet.py` (planche). Les FBX sont dans `Unity/Assets/_Ashenfall/Art/Environment/Models/`, remplaçables un par un : les matériaux Unity sont assignés **par indice** (pas ceux du FBX), les prefabs sont dans `.../Prefabs/`.

## Règles d'intégration (garde-fous de jeu, D316)

1. **Aucun collider ajouté** : le décor est une couche de présentation. Les anciens volumes de jeu (mur, piliers, sol) gardent leurs colliders ; seul leur **affichage** est masqué.
2. Les maillages **tiennent dans les volumes de jeu** existants (mur et piliers) ; les braseros sont **au-dessus** de 3 m.
3. Rien de haut ne se tient sur un point d'apparition ni sur l'étendard (testé).
4. Les dalles sont **sous** les télégraphes (4 cm) ; la bordure se franchit comme une marche et laisse l'entrée sud ouverte sur 8 m.
5. Lumières : 4 points lumineux **sans ombres**, flamme de 22 particules au plus : le décor ne masque ni ennemis ni attaques.
6. Les trois profils graphiques sont conservés ; **Basse reste sans ombres** (les braseros éclairent encore le sol).

## Ce que le lot ne fait pas (limites artistiques assumées)

- **Procédural, pas modélisé à la main** : les textures sont synthétisées par bruit et par Voronoï, la pierre et le métal ont un aspect crédible de loin mais **moins riche** qu'un travail de peintre ou de scan ; les modèles sont des assemblages de blocs chanfreinés, pas de la sculpture. C'est un **bon niveau de preuve**, pas la qualité finale visée.
- Pas d'occlusion ambiante cuite : l'ombrage vient de la lumière temps réel et de la normale.
- Le reste du monde (marqueurs de zone colorés des autres rencontres, piliers et blocs provisoires du départ, étendard, mannequins, ennemis, personnage, interface, butin) **reste provisoire** et paraîtra décalé à côté de la portion habillée.

## Résultat observé en jeu (2026-10-26)

Captures : `Docs/Art/M13/comparaison_*.png` (avant / après, trois vues, trois profils).

**Ce qui fonctionne :** le dallage en appareil décalé se lit comme de la pierre posée, le mur et les piliers ont du volume et des arêtes accrochant la lumière, les bandes de bronze et les braseros donnent des repères chauds, la brume fond l'horizon, le contraste reste maîtrisé ; les gobelins et l'annonce d'attaque rouge restent lisibles sur le dallage, y compris en Basse sans ombres ; la vue isométrique montre les ombres des piliers en Haute.

**Ce qui reste faible (honnêtement) :** la pierre est une texture synthétisée, un peu uniforme de près, sans occlusion ambiante cuite ; le brasero est un assemblage simple (pied à trois jambes, cuve) d'aspect de barbecue plus que d'objet forgé nain ; la flamme est un sprite additif ; les fûts de piliers paraissent rougeâtres sous la lumière des braseros ; le haut ruiné du mur est discret ; le reste du monde provisoire fait contraste. **C'est une preuve de direction (matière, lumière, échelle de détail), pas l'état final recherché.**
