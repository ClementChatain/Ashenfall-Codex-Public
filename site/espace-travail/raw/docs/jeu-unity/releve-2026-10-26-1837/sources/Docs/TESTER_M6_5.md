# Tester M6.5 : intelligence tactique légère des ennemis

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT (2026-10-25) par le porteur du projet : rythme des attaques, Bond du Maraudeur, Écrasement du Briseur, mobilité du Traqueur, sensation générale, meute de cinq gobelins (trois au contact, deux en attente, remplacement d'un gobelin éliminé), aucun comportement bloquant. Difficulté encore relativement faible : acceptée pour le prototype, équilibrage reporté.** Suite complète : **476 tests PlayMode réussis sur 476** (dont 18 `M65TacticsTests` et 2 `M65SandboxPackTests` ; quelques tests anciens ont été ajustés parce que les attaques d'un groupe ne partent plus ensemble et que le Briseur a une attaque de plus) ; build WebDev réussi. Détection (6 m, 8 m, 7 m), distances de poursuite et de perte de cible, vitesses, dégâts et cooldowns de compétences, esquive, ciblage, effets temporaires, équipement et caméra sont **inchangés**. Les attaques de base du Maraudeur et du Briseur sont celles de M5.1, à l'identique.

## Ce qui change

| Règle | Ce que vous voyez |
|---|---|
| **Approche décalée** | Plusieurs ennemis qui vous rejoignent n'arrivent plus tous exactement au même point : ils se répartissent autour de vous (jusqu'à environ 70 degrés de part et d'autre de leur direction) |
| **Anneau de mêlée à trois places** | Au plus **trois** ennemis de mêlée à votre contact. Les suivants **attendent** juste derrière (environ 2 m), face à vous, sans attaquer, et entrent quand une place se libère (mort d'un allié, Stagger, vous qui reculez) |
| **Attaques espacées** | Deux ennemis ne lancent pas leur attaque dans le même quart de seconde (0,45 s minimum entre deux débuts) : chaque coup reste annoncé par son propre télégraphe et reste prévisible |
| **Bond du Maraudeur** | Si vous gardez vos distances (3 à 5,5 m, vous reculez), le Maraudeur annonce un **bond** : télégraphe en ligne **orange**, 0,55 s d'anticipation, 3,5 m de long, 9 dégâts. Un pas de côté après le verrouillage l'évite, et le Maraudeur reste alors exposé. Jamais en ouverture ni sur un joueur immobile |
| **Écrasement du Briseur** | Si vous restez collé au Briseur environ 2,5 s, il peut préparer un **écrasement** : cercle **magenta** de 3 m, **1,6 s** d'anticipation (le marteau habituel : 1,1 s), **24 dégâts** (le marteau : 16). Reculez de plus de 3 m ou esquivez. Au plus un toutes les 6 s |
| **Traqueur mobile** | Après chaque tir, le Traqueur se décale de côté sur son cercle de tir avant de tirer de nouveau (jamais vers vous) ; si vous vous approchez trop, son recul de M5.1 reste prioritaire |

Un ennemi **ralenti** garde ces comportements à sa vitesse ralentie (aucune accélération de compensation). Poison, aggro par poison, dissipation et Poison fragilise fonctionnent comme avant.

## Valeurs de réglage

| Réglage | Valeur | Où |
|---|---|---|
| Places de mêlée | 3 | `EnemyBrain.MeleeCapacity` |
| Attente derrière | 2 m au-delà de la distance d'arrêt | `EnemyBrain.HoldMargin` |
| Espacement des débuts d'attaque | 0,45 s | `EnemyBrain.GroupAttackSpacing` |
| Cône d'approche | +-70 degrés | `EnemyBrain` (constantes `Slot...`) |
| Bond | 9 dég., anticipation 0,55 s, 3,5 m, écart tenu 0,6 s, 2,8 à 5,5 m, délai 4 s | `EnemyBuilder` (Maraudeur) |
| Écrasement | 24 dég., anticipation 1,6 s, rayon 3 m, contact 2,5 s, délai 6 s, poids 3 | `EnemyBuilder` (Briseur) |
| Repositionnement du Traqueur | 35 degrés, 1,3 s au plus, délai 2 s | `EnemyBuilder` (Traqueur) |

## Recette courte (dans le Sandbox)

| # | À faire | À juger |
|---|---|---|
| 1 | **Meute de CINQ gobelins** (zone B, ouest) : voir la recette détaillée juste en dessous | Trois au contact, deux qui attendent, attaques espacées, un gobelin en attente prend la place d'un gobelin tombé |
| 2 | **Zone des trois archétypes isolés** (sud) : restez collé au **Briseur** quelques secondes | Marteau (secteur rouge, 1,1 s), puis au bout d'environ 3 s un **cercle magenta** plus lent : reculez de 3 m ou esquivez |
| 3 | Face au **Maraudeur** (sud-ouest), reculez en gardant 4 à 5 m | Un **télégraphe orange** annonce un bond ; faites un pas de côté juste avant : il rate et reste exposé |
| 4 | Face au **Traqueur** (sud-est), regardez-le tirer | Il tire (télégraphe), puis se décale de côté avant le tir suivant |
| 5 | **Rencontre mixte** (plus au sud, trois ennemis) | Menaces variées, jamais deux coups annoncés ensemble |
| 6 | **Ralentir** un ennemi (P) puis le laisser vous rejoindre ou se repositionner | Il reste cohérent, simplement plus lent |
| 7 | **Sentinelle de Fer** (arène au nord) | Charge, balayage et frappe inchangés |

### Recette « meute de cinq gobelins » (la meute de la zone B compte maintenant cinq gobelins : trois d'origine et deux de plus, dans la même meute)

Aucune commande cachée. Depuis le départ, la meute est à environ 28 m à l'ouest (touches **S+A**, bas-gauche de l'écran) ; le sol de la zone B est vert.

1. Approchez-vous de la meute par l'est jusqu'à ce que le premier gobelin vous voie (environ 6 m) : **les cinq** se mettent en route (alerte de groupe).
2. Laissez-les engager le combat sans attaquer d'abord.
3. Observez : **trois gobelins au maximum** à votre contact.
4. Les **deux autres attendent** à 2 m environ derrière, face à vous, sans se superposer ni se bloquer. Leurs attaques ne partent pas toutes ensemble.
5. Éliminez un gobelin **au contact** (touche 1, 60 PV chacun).
6. Observez : **un gobelin en attente prend sa place** ; l'anneau est de nouveau à trois.

Le gobelin qui meurt réapparaît seulement quand la meute est libre (règle de M4.4.3, inchangée).

## Limites connues

- **L'équilibrage des dégâts, des PV et de la difficulté sera réalisé plus tard** : les combats sont encore relativement faciles, accepté pour le prototype ; M6.5 n'a modifié aucun dégât, PV, cooldown ni difficulté.

- Au-delà de trois ennemis de mêlée, les suivants attendent : à ajuster si cela paraît trop passif (R46) ; la meute de cinq gobelins du Sandbox sert à le voir.
- Le Bond et l'Écrasement dépendent de la situation (écart tenu, contact prolongé) : ils peuvent paraître rares ou fréquents (R46).
- Seuls le Maraudeur, le Briseur et le Traqueur ont une variété propre ; les brutes, ordinaires et gobelins gardent une attaque unique.
- La perception et les distances restent celles de la caméra isométrique provisoire (D224).
