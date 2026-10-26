# Tester M13.1 : preuve visuelle de la forteresse

**Statut : LIVRÉ, EN ATTENTE DE LA VALIDATION VISUELLE ET MANUELLE DE CLÉMENT (non commité).** Première amélioration visuelle d'une petite portion de la forteresse (D314 à D317) : arène de la mission, piste d'accès, mur du départ. Le jeu se joue comme avant (aucun collider, aucune règle, aucun point d'apparition modifiés). Direction, matériaux et modules : `Docs/ART_DIRECTION_M13.md` ; origine des assets : `Docs/ASSETS_LICENSES.md` ; mesures : `Docs/PERF_M13.md`.

**Vérification automatique :** suite PlayMode complète **612 tests réussis sur 612** (dont 9 `M13VisualTests`) ; build de développement et build de diffusion réussis.

Deux adresses (serveurs locaux, depuis `C:\DEV\ASHENFALL`) :

| Build | Adresse | Serveur |
|---|---|---|
| **Développement** (outils F3, F8 à F11) | **http://127.0.0.1:8081** (ou :8085, même contenu) | `node Tools/serve-web.js Unity/Builds/WebDev 8081` |
| **Diffusion** (Brotli, sans outils de test) | **http://127.0.0.1:8082** (ou :8086, même contenu) | `node Tools/serve-web.js Unity/Builds/Web 8082` |
| **Avant M13**, pour comparer (développement) | http://127.0.0.1:8083 | `node Tools/serve-web.js Unity/Builds/_before_M13/WebDev 8083` |
| **Avant M13**, pour comparer (diffusion) | http://127.0.0.1:8084 | `node Tools/serve-web.js Unity/Builds/_before_M13/Web 8084` |

Chaque adresse a ses propres réglages et sa propre sauvegarde (le navigateur range les données par adresse).

## Ce qui a changé à l'écran

- **Arène de la mission** : dalles de pierre en appareil décalé (6 x 6 modules de 4 m), bordure basse franchissable (entrée sud ouverte sur 8 m), quatre piliers de pierre à bandes de bronze surmontés de **braseros** (flamme, étincelles, lumière chaude qui vacille).
- **Mur du départ** : pierre taillée à assises, joints, haut ruiné, quelques moellons manquants.
- **Piste** : dalles à la place des marqueurs orange. **Sol du monde** : terre battue et gravier. **Gravats** à quelques endroits.
- **Ambiance** : lumière froide de lune, brume légère, vide au-delà du monde à la couleur de la brume ; **le marqueur rouge de l'arène n'est plus affiché** (le dallage et les braseros marquent le lieu).

## Captures avant / après (même caméra, même profil)

Dans `Docs/Art/M13/` : `comparaison_<vue>_<profil>.png` (avant à gauche, après à droite) pour les vues **start** (départ), **gate** (devant l'étendard de l'arène), **arena** (dans l'arène) et les profils **Basse**, **Moyenne**, **Haute** ; les originales `before_*.png` et `after_*.png` ; combat : `after_combat1_Moyenne.png`, `after_combat2_Moyenne.png` ; vue isométrique : `after_iso_arena_Haute.png`. Le décalage de position d'un cliché à l'autre est de quelques dizaines de centimètres (déplacements à la durée), pas de repère exact.

## Observé dans le navigateur (build de développement, vraies touches, rechargement réel)

1. **Rendu** : les trois profils (Basse, Moyenne, Haute) affichent dalles, piliers, braseros, mur et sol ; **Basse reste lisible sans ombres** (les braseros éclairent toujours le sol).
2. **Lisibilité en déplacement** : joueur, mannequins et piliers distincts du sol ; le personnage reste la forme la plus lisible.
3. **Lisibilité en combat** (première vague, F11 puis E) : gobelins verts nets sur les dalles ; l'**annonce d'attaque (secteur rouge)** reste bien visible au-dessus du dallage ; états et barres au-dessus des ennemis intacts.
4. **Vue isométrique (V)** : les piliers projettent leur ombre en Haute ; pas de gêne ; le dallage se lit.
5. **Aucune obstruction constatée** sur le trajet de l'étendard jusqu'à l'intérieur de l'arène (entrée sud) ; les piliers et le mur occupent exactement leurs anciens volumes (la caméra libre se rapproche d'un pilier quand le personnage le longe, comme avec l'ancien bloc). **Le franchissement de la bordure n'a été vérifié que par test** (28 cm de haut pour un pas de 0,4 m), pas encore en jeu : c'est l'étape 3 de la recette.

**Observé sur le build de diffusion :** chargement et rendu au départ (mur, sol, piliers et braseros au loin), profils Basse, Moyenne et Haute (F7) ; **combat** contre un ennemi du jeu (secteur rouge lisible en Moyenne et en Basse) ; F6 : 144 images/s. Le parcours complet jusqu'à l'arène n'a **pas** été fait sur la diffusion (pas de téléportation F11 : l'arène y est vue de loin).

**Couvert par les tests seulement** (`M13VisualTests`, 9) : aucun collider ni obstacle de navigation dans le décor ; volumes de jeu inchangés (mur 10 x 3 x 1, piliers 1,6 x 3 x 1,6, sol 100 x 1 x 100) ; maillages dans ces volumes ; braseros à plus de 3 m ; dalles sous les annonces d'attaque (moins de 2 cm) ; bordure plus basse que le pas du personnage ; rien de haut sur un point d'apparition ni sur l'étendard ; quatre lumières sans ombres, vacillement borné ; flammes de 24 particules au plus ; ambiance (brume, lune froide, fond) ; matériaux (6, URP Lit, avec textures) ; budget de triangles (27 110 au total, toutes instances) ; types d'import des textures.

**Reste à vérifier par Clément** : le jugement artistique ; la lisibilité sur son écran et en plein écran ; un combat de mission complet (six vagues) dans la nouvelle arène ; les piliers et la caméra libre quand le personnage combat derrière un pilier ; la fluidité sur son poste (**F6**, **F4** : voir `PERF_M13.md`) ; le profil Basse sur une carte moins puissante si possible.

## Recette courte

| # | Action | Résultat attendu |
|---|---|---|
| 1 | Ouvrir **http://127.0.0.1:8081** puis, pour comparer, **http://127.0.0.1:8083** (avant M13) dans un autre onglet | Même jeu ; sur 8081 le mur du départ est en pierre taillée, le sol en terre et gravier, la lumière est froide et sombre |
| 2 | Sur 8081 : **F11** (devant l'étendard de l'arène) | Dallage, quatre piliers à braseros (flammes et lumière chaude qui vacille), bordure basse ; plus de zone rouge |
| 3 | Marcher dans l'arène (**W**, **A**, **S**, **D**), franchir la bordure, passer entre les piliers | Aucun passage bloqué ; les piliers bloquent comme avant (volume identique) ; la bordure se franchit |
| 4 | **F7** trois fois (Haute, Basse, Moyenne), en regardant les ombres | Haute : ombres des piliers ; Basse : sans ombres mais lisible, braseros toujours éclairants |
| 5 | **E** devant l'étendard : combat de la première vague | Gobelins bien visibles sur les dalles ; annonces d'attaque rouges nettes ; butin et barres lisibles |
| 6 | **V** (vue isométrique), regarder l'arène | Vue d'ensemble lisible, pas d'obstruction |
| 7 | **F6** puis **F4** (10 s) pendant une vague, dans chaque profil | Notez les images/s, le « 1 % bas » et la mémoire ; comparez avec 8083 si vous le souhaitez |
| 8 | Ouvrir **http://127.0.0.1:8082** (diffusion) : jouer et regarder le départ | Même rendu, sans les outils de test |

## Limites connues (réserves)

- **Qualité artistique : preuve, pas résultat final.** Textures et modèles sont générés par script (bruit, Voronoï, blocs chanfreinés) : ils donnent de la matière et du volume de loin, mais restent **plus pauvres** qu'un travail de peintre, de scan ou de sculpture ; le rendu **ne doit pas être présenté comme la direction artistique finale validée**. Détails dans `ART_DIRECTION_M13.md` et R57.
- Le reste du monde reste provisoire et paraît décalé : marqueurs colorés des autres rencontres, piliers et blocs du départ, étendard, mannequins, ennemis, personnage, interface, butin.
- Perf : un seul poste très rapide, plafonné à 144 images/s ; le surcoût sur une machine modeste ou un mobile n'est pas mesuré.
- Poids : +3,1 Mo à télécharger et +5 Mo décompressés en diffusion ; mémoire Unity +10 Mo.
- Le décor n'est pas sauvegardé ni synchronisé : présentation locale seulement.
