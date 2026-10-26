# Cadrage M13 : assets de qualité et polish

**Mise à jour du 2026-10-26 : le lot M13.1 est AUTORISÉ avec modifications (D314 à D317). Le texte d'origine (proposition) est conservé ; en cas de différence, D314 à D317 font foi.**

> **Modifications validées par Clément** : (1) style **fantasy réaliste et épique**, le Web n'impose pas le low-poly stylisé (le « stylisé lisible » recommandé plus bas est écarté) ; (2) méthode : Blender sans achat ni prestataire, licences vérifiées (D315) ; (3) les seuils 15 Mo / 60 Mo et l'enveloppe +2 / +6 Mo ne sont **plus bloquants** (D317) ; (4) réalisation sans validation intermédiaire ; (5) backlog M12 conservé séparément (D313).

## (Texte d'origine) Proposition

Rédigé le 2026-10-26, **documentation seulement** : aucune implémentation, aucun asset produit, aucun achat engagé. Tout ce qui suit est une **recommandation soumise à Clément** ; les décisions à prendre sont listées en fin de document.

## Ce que dit le plan

Feuille de route : « M13 | Assets de qualité et polish | À planifier après les mesures de M10 et M11 ». Aucun critère d'acceptation n'existe : il est à définir. Les mesures de M10 (mission de 3 min 02, équilibrage non réglé, R53) et de M11 (budget Web, `PERF_M11.md`) sont disponibles.

Contraintes du projet qui s'appliquent (`CLAUDE.md`, décisions et risques) : direction artistique « pierre, acier usé, cuir, bronze, fourrure, runes discrètes », silhouettes lisibles en vue isométrique, **cohérence, lisibilité, animation et performances avant la quantité d'assets** ; les scripts ne produisent pas automatiquement de modèles de qualité professionnelle (règle 14, R1, R19) ; licences des assets tiers vérifiées avant usage commercial (règle 15) ; aucun téléchargement, paquet ni dépense sans accord (règles 6 et 9) ; pas de réseau dans le MVP mais objectif multijoueur final.

## État visuel actuel (constat, pas un audit)

| Élément | État | Durable ou temporaire |
|---|---|---|
| Nain joueur | Prototype en formes simples (aspect « jouet », R19), squelette commun de 21 os, deux torses interchangeables, palette 256 x 128 px | **Durable pour le squelette et le principe modulaire** ; le modèle sera remplacé |
| Ennemis | Matériaux unis par famille (`Enemy_*.mat`), formes provisoires | Temporaire |
| Décor (Sandbox, arène de la mission) | Primitives grises, sol gris foncé (`Placeholder_Ground`), étendard provisoire | Temporaire pour la disposition ; **les modules (mur, sol, brasero) seront durables** |
| Butin au sol, lance, effets | Cubes colorés, lance provisoire fixée au joueur | Temporaire |
| Interface | IMGUI provisoire | Temporaire |
| Lumière, ambiance, profils | Trois profils URP (Basse, Moyenne, Haute) validés en M11.1 ; peu d'ambiance | **Durable** : les réglages persistent quels que soient les modèles |

## Principe recommandé

1. **Ne pas peaufiner ce qui sera remplacé** : interface IMGUI, butin, lance, effets, disposition de la Sandbox.
2. **Fixer la direction visuelle sur un très petit ensemble** avant de multiplier les assets : palette, matériaux, lumière, échelle de détail, budget de triangles et de textures.
3. **Commencer par ce qui persiste** : les matériaux de référence, l'ambiance et les profils graphiques servent à tout ce qui viendra ensuite ; un module de décor modulaire sert quelle que soit la disposition finale.
4. **Ne pas figer la méthode de modélisation des personnages avant que Clément ait choisi** (R19, décision ouverte depuis M3b.1). Les personnages viennent donc après le premier lot.
5. **Rien de visuel ne touche au gameplay** : colliders, NavMesh, portées et dimensions de jeu restent identiques (les ennemis, la détection et les zones M4 à M10 en dépendent).

## Recommandation : premier lot « M13.1 : direction visuelle et un module d'arène »

### Résultat visible attendu

Un coin de la forteresse de la mission « Défense de la forteresse » qui **ressemble au monde décrit** (pierre usée, acier terni, bronze, braises) au lieu de boîtes grises : lumière chaude locale, brume, sol et murs en pierre, un brasero, des ombres lisibles. Le jeu se joue exactement comme avant. Un cliché « avant / après » dans les trois profils graphiques.

### Contenu (limité)

| # | Livrable | Mode de production | Volume |
|---|---|---|---|
| 1 | **Planche de direction** : palette, 5 à 6 matériaux de référence (pierre, acier usé, cuir, bronze, bois, tissu), échelle de détail | Document + matériaux URP dans Unity ; couleurs et textures tuilables ; références fournies par Clément si possible | 1 page, 6 matériaux |
| 2 | **Ambiance** : lumière principale chaude, ciel ou fond sombre, brume légère, couleur des ombres, adaptée aux trois profils (Basse sans ombres ni HDR) | Réglages dans Unity (URP, éclairage), aucun asset externe | Réglages seulement |
| 3 | **Module d'arène étalon** : dalle de sol, pan de mur, créneau ou pilier, brasero (4 à 6 pièces modulaires) | Modélisation Blender avec la chaîne existante (`ashenfall_shapes.py`, export FBX, import documenté dans `ART_PIPELINE.md`), textures tuilables | 4 à 6 modèles, 1 à 2 textures |
| 4 | **Intégration sans changer le jeu** : les pièces visuelles sont des maillages **sans collider** posés sur la géométrie de jeu actuelle, ou reprennent exactement ses colliders ; NavMesh et placement des ennemis inchangés | Éditeur Unity | Une zone de l'arène |

Hors lot (non réalisé, non promis) : personnages, ennemis, armes, apparences de tête, bottes et arme (M12), interface, icônes, effets, animations, audio, mobile.

### Budget Web

Mesuré en M11.1 : diffusion **10,32 Mo à télécharger / 45,35 Mo décompressés** pour un plafond de 15 Mo / 60 Mo (D296), soit environ 4,7 Mo et 14,7 Mo de marge. Enveloppe proposée pour ce lot : **au plus +2 Mo à télécharger et +6 Mo décompressés** (textures de 512 px au plus, formats compressés, maillages de quelques centaines à quelques milliers de triangles par pièce), pour garder de la marge aux personnages. Profils : Basse et Moyenne doivent rester lisibles.

### Multijoueur

Tout est de la **présentation locale** : aucune donnée de décor n'est sauvegardée ni échangée ; aucun identifiant ni règle de jeu ne change ; les pièces ne portent aucun état. Le squelette du nain et le principe d'apparences par identifiants (M12) ne sont pas touchés. Le futur serveur ne verra pas le décor.

### Critères de validation proposés

1. **Visuel (jugé par Clément)** : captures avant / après dans Basse, Moyenne et Haute ; le coin d'arène évoque pierre, acier usé et braises ; le style est cohérent entre les 4 à 6 pièces.
2. **Lisibilité du combat** (R21) : joueur, ennemis, annonces d'attaque (télégraphes), cibles et butin restent distingués sur le nouveau sol, dans les trois profils.
3. **Aucune régression de jeu** : suite PlayMode complète toujours verte (603 tests au dernier état) ; la mission se joue comme avant ; NavMesh et colliders inchangés.
4. **Performance** : mesure F4 (méthode de `PERF_M11.md`) en profil Moyenne dans la zone traitée ; pas de dégradation notable du « 1 % bas » par rapport à la référence M11 (117 à 123 images/s sur le poste de mesure, plafonné à 144), mesure à refaire aussi en Basse ; limite connue : un seul poste puissant.
5. **Taille** : build de diffusion dans l'enveloppe du lot (au plus +2 Mo téléchargés et +6 Mo décompressés) et sous le plafond D296.
6. **Licences** : un fichier `Docs/ASSETS_LICENSES.md` indique la source et la licence de chaque texture ou asset non créé par nous ; rien d'externe sans vérification (règle 15).
7. **Validation manuelle de Clément** dans le navigateur (développement et diffusion), avec une recette courte.

### Éléments externes et dépenses éventuelles (aucune engagée)

| Besoin | Option sans dépense | Option payante (à ne pas engager sans accord) |
|---|---|---|
| Modèles et textures du lot 1 | Blender est installé (5.2, d'après `ART_PIPELINE.md`) ; formes simples scriptées ; textures générées par script ou issues de bibliothèques libres de droits (par exemple des textures CC0 : **licence à vérifier à la source au moment de l'usage**, téléchargement soumis à accord) | Pack d'environnement dark fantasy sous licence commerciale, ou artiste indépendant : coût, licence et style cohérent à examiner |
| Références visuelles | Quelques images de référence ou concepts 2D choisis par Clément (aucune reprise d'éléments protégés, `PROJECT_BRIEF.md`) | — |
| Personnages (lots suivants) | Modélisation manuelle dans Blender (travail long) | Assets sous licence ou prestation : c'est précisément la décision ouverte de R19 |

**Franchement :** avec les seules formes scriptées, le décor aura un style « low-poly lisible » cohérent et chaud, **pas** une qualité professionnelle. Une qualité supérieure demande soit un long travail manuel dans Blender, soit des assets ou un artiste externes.

## Suite probable (indicative, non planifiée)

M13.2 : le nain héros dans la méthode retenue par Clément (R19) ; M13.3 : un ennemi étalon ; puis interface et icônes remplaçant l'IMGUI et le butin cubique. Ces étapes dépendent de la décision de méthode et des résultats du lot 1 ; elles ne sont **pas** décidées.

## Décisions à prendre par Clément

1. **Valider ou modifier le lot M13.1** (ambiance + matériaux + un module d'arène, sans personnage).
2. **Style visuel** : stylisé lisible (peu de textures, palette, cohérent avec le nain actuel ; recommandé pour le Web et le mobile) ou plus réaliste (textures plus lourdes, budget et mobile plus risqués).
3. **Méthode de production** : Blender scripté + textures libres de droits (gratuit, qualité limitée), assets sous licence (payant), prestataire (payant), ou mélange ; à trancher au plus tard avant les personnages (R19).
4. **Enveloppe de taille** du lot (proposition : +2 Mo téléchargés, +6 Mo décompressés).
5. **Références visuelles** : fournir ou non des images de référence.
6. **M12** : rattacher ou non les apparences de tête, de bottes et d'arme à M13, à un jalon M12 ultérieur ou les abandonner ; aucune de ces options n'est décidée.
