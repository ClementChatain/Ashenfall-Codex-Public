# Tester M5.1 : trois archétypes d'ennemis

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-23).** 318 tests PlayMode réussis (299 + 19 nouveaux de `M51ArchetypeTests`), build WebDev réussi et vérifié dans le navigateur (Briseur, Traqueur et sa bande de tir, projectile violet). M5.2 (élite) et M5.3 (deux armes) : non commencés. Commandes, ciblage monocible, esquive, Stagger, riposte R25, alerte de meute, retour protégé et réapparition : inchangés et testés avec les nouveaux ennemis.

## Principe

Une seule IA (`EnemyBrain`, `EnemyMeleeAttack`), trois **définitions** (données) : la différence vient de la **forme** de la menace, pas de son intensité. Les trois ont un débit de dégâts par seconde voisin de la brute (environ 5 à 5,5), des PV ordinaires (40 à 80) et sont donc rapides à tuer.

| | **Maraudeur** (pression rapide) | **Briseur** (menace lourde) | **Traqueur** (menace à distance) |
|---|---|---|---|
| Visuel provisoire | petit, doré | grand, gris fer | moyen, violet bleuté ; projectile violet |
| PV | 50 (3 coups) | 80 (4 coups) | 40 (2 coups) |
| Déplacement | **5,0 m/s** (brute 3,5 ; joueur 6) | **2,4 m/s** | 3,4 m/s, tient **7 m** |
| Attaque | coup bref, **zone 1,5 m / 90°** | coup lourd, **zone 2,5 m / 150°** | **projectile** en ligne (11 m, 12 m/s, largeur 0,8 m) |
| Anticipation (télégraphe) | **0,35 s** (fenêtre très courte) | **1,10 s** (bien visible), visée figée à 0,8 s | 0,80 s, visée figée à 0,6 s |
| Dégâts / rythme | 7 toutes les 1,3 s | 16 toutes les 3,2 s | 8 toutes les 1,7 s |
| Récupération | 0,40 s | **1,20 s visibles** + garde : longue fenêtre de contre-attaque | 0,50 s |
| Particularité | **Vulnérable après une attaque manquée** : esquivée, hors de portée ou bloquée par l'invulnérabilité, il ne peut plus attaquer pendant **0,9 s de plus** (éclat doré sur le corps) | oblige à **sortir de sa zone** : un petit pas en arrière ne suffit pas (zone 2,5 m) ; il faut s'éloigner à plus de 3 m ou passer sur le côté après la visée figée | **recule** si tu l'approches à moins de **4 m**, au plus **1,5 s**, puis plus du tout pendant **3 s** : il ne fuit jamais indéfiniment, et tire même au contact |

Règles du projectile : touche le joueur **une seule fois** (dégâts, ou bloqué par l'invulnérabilité de l'esquive), **arrêté par le décor**, **traverse les autres ennemis** (pas de tir fratricide, un allié ne te protège pas). La ligne de vue du Traqueur n'est coupée que par le décor. Télégraphe : **bande rouge** longue comme la portée, qui se remplit depuis l'ennemi (les deux autres : secteur rouge comme avant).

## Où essayer (Sandbox)

Au sud du départ, **tout droit** (maintenir **S+D** : le personnage descend vers le bas-droite de l'écran ; environ 3 s pour la rangée, 5 s pour la rencontre mixte), sans obstacle sur le chemin. Deux dalles de couleur au sol :

| Zone | Où | Contenu |
|---|---|---|
| Dalle ocre, à environ 24 m au sud | rangée de **trois ennemis isolés**, espacés de 16 m | **Maraudeur** côté bas-gauche de l'écran, **Briseur** au centre (face à toi), **Traqueur** côté haut-droite |
| Dalle violette, à environ 44 m au sud | **rencontre mixte** | Briseur devant, Maraudeur à l'ouest, Traqueur derrière ; **alerte collective** : si l'un te détecte, tous attaquent |

Les zones M4.4 (est : trois ennemis indépendants ; ouest : meute de gobelins), les mannequins D/E, la brute de référence et le ciblage sont conservés.

## Recette courte

| # | À faire | À juger |
|---|---|---|
| 1 | Aller à la dalle ocre ; affronter le **Maraudeur** seul (il vient à toi vite) | Il est rapide et ses coups partent vite : **esquive (Espace) au bon moment** ; une esquive réussie le laisse **expose ~1 s** (éclat doré) : contre-attaque libre. |
| 2 | Affronter le **Briseur** seul (face à toi au centre) | Sa préparation est **longue et visible** (grand secteur) : sors de la zone (côté ou loin), **pas un seul pas en arrière** ; après sa frappe, il est **immobile ~1,2 s+** : frappe-le. |
| 3 | Affronter le **Traqueur** seul (à l'est) | Une **bande rouge** montre la ligne de tir ; **pas de côté** après qu'elle s'est figée ; il tient ~7 m, **recule un peu** quand tu t'approches, puis tient bon : **rapproche-toi** et frappe-le (2 coups). Les murs et ton déplacement latéral l'évitent. |
| 4 | **Rencontre mixte** (dalle violette) | Le Briseur te bloque en zone lourde, le Maraudeur te presse, le Traqueur tire de loin : **qui frapper en premier ?** (Tab ou clic pour choisir ; le Traqueur est le plus fragile, le Maraudeur le plus pressant). Les trois télégraphes (secteur large, secteur bref, bande) restent distincts. |
| 5 | Mourir ou fuir à plus de 14 m, tuer un membre de la meute | Les règles M4.4 s'appliquent : retour protégé individuel ; réapparition de meute différée tant qu'un autre combat. |
| 6 | Plaisir de jeu | Les trois ennemis se **jouent différemment** (timing, positionnement, priorité) ? Les combinaisons sont-elles lisibles ou confuses ? |

## Limites connues

- **Visuels provisoires** : mêmes modèle et animation (clip d'attaque unique) avec teinte et échelle différentes ; le tir du Traqueur réutilise l'animation de frappe.
- **Pas de retour « esquivé » pour un projectile** (le vignettage ESQUIVÉ ! ne s'affiche que pour les coups de mêlée) ; une esquive par invulnérabilité est bien signalée par le retour « bloqué ».
- Le Maraudeur est « exposé » aussi quand l'invulnérabilité de l'esquive couvre le coup (une esquive réussie compte comme un coup manqué).
- Valeurs de départ, **non équilibrées** : vitesses, portées et timings sont à ajuster après ton essai. Source de vérité : `EnemyBuilder.BuildArchetypes` (réécrit les définitions à chaque reconstruction).
- Le Traqueur acculé contre un mur ne recule pas (il tient sa position et tire).
- Le décor basse (bloc de 1 m) arrête les projectiles comme un mur.
