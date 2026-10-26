# Tester M5.3 : deux armes, équipement hors combat

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT (2026-10-23)** (équipement hors combat, différence de portée, verrouillage en combat, retour hors combat, ciblage monocible). 357 tests PlayMode réussis (dont 22 nouveaux de `M53EquipmentTests`), build WebDev réussi et vérifié dans le navigateur (HUD, équipement avec R, lance visible, estoc). Aucune rencontre du Sandbox n'a été modifiée. La vitesse du joueur et la distance d'esquive **ne sont pas modifiées** (R37 : passe de réglage après M5.3). M6 et M7 : non commencés.

## La règle (décision de gameplay validée)

**On ne change d'arme qu'hors combat.** Pas de changement rapide en plein combat : on choisit son arme avant l'affrontement.

| Commande | Effet |
|---|---|
| **R** (clavier) ou bouton **Nord** (manette) | Passe à l'arme suivante : hache, lance, hache, etc. |
| **1** (inchangée) | Attaque avec l'arme équipée |

Le changement est **refusé**, avec un message à l'écran, dans cet ordre de priorité :

| Situation | Message |
|---|---|
| Vous êtes KO | « Impossible : vous êtes KO » |
| **En combat** | « Impossible en combat : changez d'arme à l'écart des ennemis » |
| Une attaque est en cours (jusqu'à la fin de sa récupération) | « Impossible pendant une attaque » |
| Une esquive est en cours | « Impossible pendant une esquive » |

Un refus ne change rien : ni l'arme, ni le cooldown, ni l'attaque en cours.

### Qu'est-ce que « en combat » ?

Vous êtes **en combat tant qu'au moins un ennemi vivant vous a pour cible et est engagé contre vous**, c'est-à-dire qu'il est en **poursuite**, en **attaque** ou en **réaction à un coup** (Stagger). Un ennemi **au repos**, **en train de rentrer à son point de départ** (retour protégé) ou **mort** ne compte pas. Il n'y a **aucun minuteur** « depuis le dernier coup » : frapper un mannequin ne vous met jamais en combat, et un ennemi qui vous poursuit en silence, si.

Vous sortez du combat : en **tuant** les ennemis qui vous poursuivent, en vous **éloignant** (à plus de 14 m d'un ennemi ordinaire, 16 m de l'élite, il abandonne et rentre), ou si l'ennemi dépasse sa **laisse** (18 à 20 m de son point de départ). Une fois les ennemis rentrés, vous êtes hors combat : l'état n'est jamais bloqué.

Le HUD (bas gauche, au-dessus des barres) affiche l'arme équipée. Hors combat : « [R] changer d'arme ». En combat : la ligne devient rouge, « En combat : changement d'arme verrouillé ».

## Les deux armes (valeurs provisoires)

| | Hache de guerre naine | Lance à deux mains |
|---|---|---|
| Portée | 2,2 m | **3,4 m** |
| Dégâts | **20** | 16 |
| Arc de frappe | 110° | **40°** (estoc étroit) |
| Préparation / phase active | 0,10 s / 0,10 s | 0,15 s / 0,10 s |
| Cooldown | **0,45 s** | 0,55 s |
| Dégâts par seconde (théorique) | environ 44 | environ 29 |
| Décor | bloque le coup | bloque le coup |

Identité : la **hache** est l'arme de mêlée rapide et puissante, au contact. La **lance** touche de plus loin (+1,2 m), ce qui permet de frapper un ennemi avant qu'il n'arrive au contact, mais elle frappe moins fort, plus lentement, et son estoc est annoncé un peu plus longtemps. Avec une cible choisie (clic, Tab), la zone est centrée sur la cible : l'arc étroit de la lance compte surtout en frappe libre. Les deux armes partagent tout le reste : ciblage manuel ou automatique, un seul ennemi touché, ligne de vue, stamina, esquive, Stagger.

## Recette courte

Lancer le build Web (voir plus bas) et laisser le Sandbox se charger.

| # | À faire | À juger |
|---|---|---|
| 1 | Regarder le HUD au départ | L'arme équipée est la **hache** ; la ligne indique « [R] changer d'arme ». |
| 2 | Appuyer sur **R** au départ (aucun ennemi n'est réveillé) | Message vert « Arme équipée : Lance à deux mains (provisoire) » ; la hache disparaît, **une lance** apparaît sur le côté du nain. R de nouveau : retour à la hache. |
| 3 | Équiper la **lance**, aller au **mannequin A** (à droite, devant le départ), le sélectionner (clic ou Tab), reculer à environ 3 m et appuyer sur **1** | La lance **touche à 3 m** : le mannequin recule ou clignote, la lance part en **estoc** (recul puis poussée). Avec la **hache** équipée, à la même distance : « Hors de portée ». |
| 4 | Comparer les deux armes sur les mannequins | Sentiment de la hache (rapide, puissante, au contact) contre la lance (portée, plus lente) : deux armes vraiment différentes ? |
| 5 | **Mannequins D et E** (paire alignée, devant et derrière) : sélectionner E (le plus loin) avec la lance | Seul **E** est touché, D intact (cible choisie respectée, même derrière un autre). |
| 6 | **Mannequin C** (derrière le mur) avec la lance | La lance **ne traverse pas le mur** malgré sa portée. |
| 7 | Appuyer sur **R** en plein coup (juste après avoir appuyé sur 1) | « Impossible pendant une attaque », l'arme ne change pas ; quelques instants plus tard R fonctionne. |
| 8 | Appuyer sur **R** pendant une esquive (Espace) | « Impossible pendant une esquive ». |
| 9 | Réveiller un ennemi (par exemple la rencontre A à l'est, ou la brute) et appuyer sur **R** pendant qu'il vous poursuit | Le HUD passe au rouge et R est refusé : « Impossible en combat ». |
| 10 | Tuer l'ennemi (ou vous éloigner de plus de 14 m) puis appuyer sur **R** | R refonctionne tout de suite après la mort de l'ennemi, ou quand il a abandonné. **Jamais bloqué.** |
| 11 | Équiper la **lance** puis affronter un ennemi, l'élite par exemple | La lance permet de frapper avant le contact, mais l'élite punit les erreurs de placement : jouable ? |
| 12 | Plaisir de jeu | Le choix d'arme avant le combat est-il intéressant et lisible ? La règle « hors combat seulement » est-elle claire grâce au message ? |

## Limites connues

- **Visuel provisoire** : la lance est un objet simple (hampe et pointe), pas encore attaché à la main du nain ; le corps rejoue l'animation d'attaque de la hache pendant l'estoc. Une vraie animation d'estoc viendra avec les vrais assets (R39).
- **Valeurs de départ** non équilibrées (R39), à régler avec la passe de mobilité (R37), pas avant.
- **Deux armes seulement**, dans une liste provisoire du joueur (l'inventaire est prévu en M7) ; pas de restriction par classe pour l'instant.
- Un ennemi qui vous poursuit **verrouille** le changement d'arme jusqu'à sa mort, son abandon ou son retour (R40) : c'est voulu.
- Pas de son ni d'effet visuel dédié à l'équipement.
