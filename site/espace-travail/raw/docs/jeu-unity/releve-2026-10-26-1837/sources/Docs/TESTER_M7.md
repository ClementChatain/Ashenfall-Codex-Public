# Tester M7 : caméra libre à la troisième personne

**Statut : VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-25).** Validé : course en regardant derrière soi, relâchement et reprise, sélection au clic gauche, direction au clic droit, caméra isométrique et bascule V, combat en caméra libre, meute de cinq gobelins (formation, trois au contact, remplacement, retour après fuite, réengagement), poison par un appui bref sur Y (déclenché à chaque essai) avec réaction fluide de la meute, y compris en caméra libre. **Non testé manuellement (couvert par les tests seulement)** : poison posé à plus de 14 m, gobelin à plus de 20 m de la meute (rattrapage), cas limites de la convergence. Texte historique de la vérification automatique : La caméra libre est le mode du Sandbox au lancement ; la caméra isométrique est conservée pour comparer (touche **V**). Suite PlayMode complète : **517 tests réussis sur 517** (dont 15 `M7FreeCameraTests`, 12 `M7FreeLookTests`, 7 `M7PackTests` sur la meute de cinq gobelins et 8 `M7PoisonPackTests` sur l'aggro au poison) ; build WebDev réussi. Vérifié dans le navigateur : clic gauche bref qui choisit la cible, bascule V dans les deux sens, zoom propre à chaque mode (libre 9 m, isométrique 22 m puis 28 m après trois crans, chacun retrouvé après la bascule), déplacement et combat. **Poison sur la meute, observé dans le navigateur (build final)** : caméra isométrique, joueur immobile à 9,3 m du gobelin 1 (aucun gobelin ne bougeait, panneau : « Idle · 9,3 m »), touche Y : environ 1 s plus tard le gobelin 1 passe en « Chase » (motif « poison », tick -8 affiché), les quatre autres s'alertent (« alerte de meute » dont un « converge ») ; on voit un « Attack », un « Chase » et deux « Attente ». Non observés dans le navigateur (tests seulement) : poison à plus de 14 m, membre au-delà de 20 m, caméra libre, enchaînement des ticks, retour puis nouveau poison ; avec l'outil du navigateur, un premier appui sur Y n'a rien déclenché et le second (touche tenue 0,3 s) a fonctionné ; cause non établie (probablement l'outil de vérification), à surveiller avec un vrai clavier. Meute de cinq gobelins, approche par détection naturelle, vérifiée dans le navigateur (build précédent) : approche par le sud-est, les cinq gobelins passent ensemble en « Chase », puis trois « Attack » au contact, un « Chase » en approche et un ou deux « Attente » derrière. Les autres directions d'approche et le remplacement d'un gobelin tombé ne sont couverts que par les tests. Le **regard libre** (clic gauche maintenu et glissé, avec W maintenu) et l'orbite au clic droit ne peuvent pas être reproduits avec l'outil du navigateur de vérification (il ne sait pas maintenir un bouton) : ils sont couverts par les tests avec le vrai Input System et sont **réservés à votre essai avec une vraie souris** (R47, R48). Combat, ciblage, esquive, endurance, équipement, effets, aggro et IA tactique de M6.5 sont **inchangés** : les deux caméras utilisent les mêmes systèmes.

## Commandes

| Action | Commande |
|---|---|
| **Diriger** avec la caméra | **Clic droit maintenu** + mouvement de la souris (360 degrés en lacet, inclinaison bornée) : le personnage suit la caméra. Le curseur est masqué et verrouillé pendant l'orbite, puis rendu au relâchement |
| **Regarder autour de soi** | **Clic gauche maintenu et glissé** (plus de 8 pixels) : la caméra tourne seule sur 360 degrés, **le personnage garde sa direction de course** (W maintenu : il continue tout droit même si la caméra regarde derrière lui) |
| Zoomer | **Molette** : caméra libre, un cran = 1,2 m, de 3 m à 18 m ; caméra isométrique, un cran = 2 m, de 12 m à 40 m. Chaque mode garde **son propre** zoom, progressif, conservé en déplacement et en combat |
| Avancer, reculer, strafe | **W A S D** (ZQSD sur un clavier AZERTY : mêmes positions physiques), relatifs à la vue ; diagonales à la même vitesse |
| Esquive, attaque, compétences, arme | **Espace**, **1**, **2 3 4**, **R** (inchangés) |
| Cibler | **Clic gauche bref** (sans glisser) sur un ennemi ou un mannequin, **Tab**, **Échap** (inchangés) ; le ciblage automatique reste actif. En caméra libre le choix se fait au relâchement du bouton ; un clic glissé ne choisit jamais de cible |
| Comparer les caméras | **V** (développement) : caméra libre ↔ isométrique, sans toucher au personnage |

## Regard libre (clic gauche glissé) : fonctionnement précis

1. **Clic bref = cible** : tant que la souris bouge de moins de 8 pixels, rien ne tourne ; au relâchement le clic choisit la cible sous le curseur.
2. **Glissement = regard libre** : au-delà de 8 pixels, la caméra tourne (mêmes sensibilités, mêmes limites d'inclinaison que le clic droit) et ce clic ne choisira **aucune** cible au relâchement. Le curseur est verrouillé et masqué pendant le glissement.
3. **Direction de référence verrouillée** : au début du glissement, la direction de déplacement est figée. Pendant tout le regard libre, W, A, S et D se lisent par rapport à cette direction (pas par rapport à la caméra), le personnage garde son orientation et sa trajectoire, l'esquive et la visée suivent la même direction.
4. **Relâcher le clic gauche** : ni retournement ni saut de caméra. Si vous courez toujours, la direction reste verrouillée jusqu'à ce que vous **lâchiez toutes vos touches de déplacement** ; une nouvelle course repart relative à la caméra (comme avant).
5. **Les deux boutons** : le **clic droit l'emporte** (on dirige) ; le personnage s'aligne progressivement sur la caméra et la course devient relative à elle. Si vous relâchez le clic droit en gardant le clic gauche, vous revenez au regard libre sans retournement.
6. **À l'arrêt**, le regard libre ne tourne jamais le personnage.
7. **Combat** : attaque de base et compétences visent la cible choisie (inchangé) ; le ciblage reste ; l'esquive part dans la direction de course.

## Comportement choisi (clic droit, strafe, orientation en combat)

- **Avant** = la direction dans laquelle regarde la caméra, à plat. **A** et **D** : strafe à gauche et à droite de la vue. **S** : le personnage **recule en regardant devant lui**, il ne fait pas demi-tour.
- Le personnage **regarde dans la direction de la vue** tant que vous orientez la caméra (clic droit maintenu) **ou que vous vous déplacez**. À l'arrêt, sans clic droit, il garde son orientation. Il tourne **progressivement** (pas de retournement instantané).
- **Sans clic droit, la caméra ne tourne jamais** : on peut utiliser le curseur librement (ciblage au clic) sans faire pivoter la vue.
- **Attaque ciblée** (touche 1, compétences 2 et 4) : le personnage se tourne vers sa cible, même si la caméra tourne en même temps ; il se remet à regarder la vue ensuite.
- **Esquive** : dans la direction des touches, relative à la caméra (sinon dans la direction du regard).
- Un **clic gauche pendant l'orbite** ne choisit pas de cible (le curseur est verrouillé).

## Valeurs initiales (à régler après votre retour)

| Réglage | Valeur | Où |
|---|---|---|
| Distance de départ / minimale / maximale (caméra libre) | 9 m / 3 m / 18 m | `FreeCameraRig` |
| Distance de départ / minimale / maximale (caméra isométrique, **nouveau**) | 22 m (14 m avant) / 12 m / 40 m, 2 m par cran, angle et champ de vision inchangés | `IsometricCameraRig` (valeurs posées par la scène) |
| Seuil clic / glissement | 8 pixels | `MouseCameraIntentSource` |
| Zoom par cran / rattrapage | 1,2 m / 0,12 s | `FreeCameraRig` |
| Inclinaison de départ / minimale / maximale | 22° / 4° / 70° | `FreeCameraRig` |
| Champ de vision | 55° | `FreeCameraRig` |
| Sensibilité souris (lacet / tangage) | 0,15 / 0,12 degré par pixel, inversion de l'axe vertical disponible | `MouseCameraIntentSource` |
| Collision | sphère de 0,3 m ; approche 0,05 s, retour 0,3 s ; distance minimale 0,6 m | `FreeCameraRig` |
| Lacet de départ | 45° (même sens de marche qu'avant M7) | `FreeCameraRig` |

Le panneau du banc d'essai (bas à droite) affiche la caméra courante, sa distance (demandée et réelle), le lacet et le tangage.

## Recette courte (dans le Sandbox)

| # | À faire | À juger |
|---|---|---|
| 1 | Lancer le jeu : la vue est derrière le nain | Lisible, personnage bien visible |
| 2 | **Clic droit maintenu** + souris | La caméra tourne autour du personnage, le corps la suit en douceur ; le curseur revient au relâchement ; pas de menu contextuel du navigateur |
| 2 bis | **Maintenez W**, puis **clic gauche maintenu et glissé** de gauche à droite (180°) | Le personnage **continue de courir tout droit** pendant que la caméra regarde derrière lui ; relâchez le clic gauche : **aucun retournement, aucun saut** ; lâchez W puis reprenez W : il court vers ce que montre la caméra |
| 2 ter | **Clic gauche bref** sur un mannequin, puis **clic gauche glissé** au-dessus d'un autre | Le premier clic choisit la cible ; le glissement tourne la caméra **sans changer de cible** |
| 3 | **Molette** | Zoom progressif entre 3 et 18 m ; la distance s'affiche dans le panneau ; elle ne bouge pas pendant les déplacements |
| 4 | **W A S D** autour du mannequin, en tournant la vue | Avancer, strafe et recul suivent la caméra, sans demi-tour en reculant, diagonales à la même vitesse |
| 5 | Se coller à un **mur** ou un **pilier** (près du départ) avec la caméra derrière soi, puis s'éloigner | La caméra se rapproche sans traverser, puis retrouve sa distance doucement, sans à-coups |
| 6 | **Clic gauche** sur un mannequin, puis **1** en tournant la caméra | 20 dégâts à chaque coup ; le personnage reste tourné vers sa cible pendant le coup |
| 7 | Combattre le **Maraudeur** et le **Briseur** (zone sud, S+D depuis le départ en caméra isométrique) | Combat, télégraphes, esquive (Espace) comme avant ; les télégraphes restent lisibles depuis la vue basse |
| 8 | La **meute de cinq gobelins** (ouest, zone verte) : approchez par plusieurs côtés (est, nord, sud-ouest) | **Les cinq** se mettent en route quel que soit le côté ; trois au contact, **deux marqués « Attente »** derrière (ce ne sont pas des passifs) ; un gobelin tombé est remplacé par un de ceux qui attendent ; les gobelins **4** (au nord de la meute) et **5** (à l'ouest) occupent des places comme les autres |
| 8b | **Poison sur la meute** : placez-vous à **9 à 13 m** d'un gobelin (hors des 6 m de détection : aucun ne bouge), cliquez-le, appuyez sur **Y** | Environ 1 s plus tard (premier tick) le gobelin empoisonné **vient vers vous** ; **les autres aussi**, même ceux à 14 à 20 m de vous (sous chacun, une courte note : « poison » ou « alerte de meute (converge) ») ; trois au contact, deux « Attente ». **À plus de 14 m** : rien ne bouge, la note dit « poison sans effet : joueur à X m (> 14 m) » et la ligne « Cible du banc » donne l'état et la distance. Un gobelin à plus de 20 m reste au repos et rejoint quand vous vous approchez à moins de 14 m de lui |
| 9 | **V** en plein combat, puis molette dans chaque mode | La caméra change ; personnage, PV, effets et ennemis ne bougent pas ; chaque mode retrouve **son** zoom ; l'isométrique montre bien plus de terrain qu'avant |
| 10 | Les ennemis sont-ils **repérables avant de vous engager** ? | Oui en général : la vue est large ; ils restent dangereux de près (détection inchangée : 6, 8, 7 m) |

## Limites connues

- L'orbite se fait à la souris (clic droit ou clic gauche glissé) ; pas de rotation au clavier ; tactile et manette sont préparés (interface d'intentions) mais non réalisés. Pas de course automatique avec les deux boutons (R48).
- Dans le navigateur, le verrouillage du curseur dépend du navigateur ; touche **Échap** : il le rend (R47).
- Sans carte graphique, le jeu tourne lentement avec la vue large : à mesurer sur une vraie machine (R47).
- Aucune visée ni tir à distance : seule la direction de visée au centre de l'écran est prête (`PlayerAim.CameraForward`).
- Les distances de détection ne sont pas modifiées (D247) ; une éventuelle modification devra être configurable et re-validée.
