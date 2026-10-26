# Tester M4.4.1 : commandes PC et ciblage hybride

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-22)** : F1/F2, Tab, attaque sur la touche 1, anneaux de ciblage, ressenti du combat. 269 tests PlayMode réussis (243 de M4.3, adaptés ou conservés, + 26 nouveaux). Build WebDev réussi. **Correctif du 2026-10-22 (D141) : les mannequins sont ciblables.** Rien ne change pour les dégâts, timings, esquive, IA ennemie, Stagger, recul, mort, réapparition et riposte R25.

## Nouvelles commandes

| Commande | Effet |
|---|---|
| **Clic gauche sur un ennemi** | Sélection manuelle (anneau net sous l'ennemi). Aucune attaque, aucun déplacement. |
| Clic gauche dans le vide (sol nu) | Aucune action. |
| **Tab** | Cible suivante parmi les ennemis à moins de 12 m, de la plus proche à la plus éloignée, puis retour à la plus proche. |
| **Échap** | Libère la cible manuelle ; l'acquisition automatique reprend. |
| **1** | Coup de hache sur la cible. **Une pression = un coup** : maintenir ne répète pas, une pression pendant le cooldown (0,45 s) ou l'esquive est perdue. |
| **F1 / F2** | Armure lourde / légère (debug, éditeur et build de développement). Remplacent 1 / 2. |
| ZQSD / WASD, Espace | Inchangés. |

## Ciblage

- **Automatique** : sans cible manuelle, l'ennemi le plus proche à moins de 12 m (anneau discret). Conservé jusqu'à 14 m, jamais ré-acquis entre 12 et 14 m.
- **Manuelle** : prioritaire, conservée à toute distance. Libérée si l'ennemi meurt, est désactivé ou **entre en retour (Return)**.
- **Touche 1** : avec une cible manuelle, elle seule est visée ; hors de portée (2,2 m, arc, murs), message **« Hors de portée »**, aucune animation ni cooldown. Sans cible manuelle, l'ennemi le plus proche réellement à portée est frappé, même si la cible automatique affichée est plus loin. Aucun ennemi sélectionnable : **« Aucune cible »**.
- **Un seul ennemi** reçoit les dégâts par coup (filtre `accept` du résolveur, résolveur inchangé).
- **Orientation** : dès la pression, le nain se tourne vers sa cible et le reste jusqu'à la fin de la récupération (0,45 s), puis revient au curseur.
- **Mannequins (D141)** : ciblables comme l'ennemi (clic, Tab, acquisition automatique, touche 1, mêmes règles de portée et de refus), **sans IA ni aggro** : ils ne bougent et ne réagissent pas, ils encaissent. Détruits, ils sont libérés puis redeviennent ciblables à leur réapparition (2,5 s). Un objet avec `Health` mais sans `Targetable` n'est pas une cible. Les tests historiques de dégâts (frappe libre, sans ciblage) sont conservés.

## Les vérifications manuelles à faire

Sandbox, Play (clic dans la vue Game) ou navigateur : `node Tools\serve-web.js Unity\Builds\WebDev 8081` puis `http://127.0.0.1:8081/` (Ctrl+F5). L'ennemi est en (6, 0, 11) derrière le mur ; le contourner par l'ouest (W+A) le réveille à environ 8 m.

| # | Test | Résultat attendu |
|---|---|---|
| 1 | Au départ, appuyer sur 1 (à 3 à 4 m de deux mannequins, hors de portée) | Anneau discret sous le mannequin le plus proche ; « Hors de portée », aucune attaque, aucun cooldown. |
| 2 | Clic gauche dans le vide, puis sur un mannequin | Vide : aucune action. Mannequin : anneau net, aucune attaque, le mannequin ne réagit pas. |
| 2b | Se placer près d'un mannequin (moins de 2 m), appuyer sur 1 | Un coup : le mannequin affiche 80 / 100 (flash). Maintenir 1 : un seul coup. |
| 2c | Tab plusieurs fois (près de l'ennemi et des mannequins) | La sélection passe successivement par l'ennemi et les mannequins, par distance croissante, puis recommence. |
| 2d | Détruire un mannequin (5 coups) | Sa sélection est libérée ; il réapparaît à 100 / 100 et redevient ciblable. |
| 3 | Approcher l'ennemi, observer le sol sous lui | Anneau discret (cible automatique) à moins de 12 m. |
| 4 | Clic gauche sur l'ennemi | Anneau plus net ; le nain n'attaque pas. |
| 5 | Maintenir 1 près de l'ennemi | **Un seul coup**, pas de répétition. |
| 6 | Marteler 1 | Un coup par pression, pas plus d'un toutes les 0,45 s ; pas de coup « en retard » après le cooldown. |
| 7 | Sélectionner l'ennemi, reculer à plus de 2,2 m, appuyer sur 1 | « Hors de portée », aucune animation, pas de cooldown (une pression à portée frappe tout de suite). |
| 8 | Curseur ailleurs, ennemi à côté, appuyer sur 1 | Le nain se tourne vers l'ennemi, frappe, puis suit de nouveau le curseur. |
| 9 | Échap | L'anneau net disparaît (puis anneau automatique si un ennemi est proche). |
| 10 | Laisser l'ennemi rentrer (s'éloigner de plus de 14 m) avec lui sélectionné | La sélection est perdue dès qu'il rentre. |
| 11 | Tab (1 ennemi dans le Sandbox) | La cible ne change pas ; aucune attaque. |
| 12 | F1 / F2 | L'armure change ; la touche 1 ne la change plus. |
| 13 | Dans le navigateur : Échap, F1, Tab, clic | Pas de plein écran, d'aide ni de perte de focus. **Si un conflit apparaît, me le signaler : je ne change aucune commande sans accord.** |

## Vérifié dans un vrai navigateur (build WebDev, 2026-10-22)

Observé : le jeu charge ; touche 1 sans ennemi affiche « Aucune cible » sans attaque ; le clic gauche dans le vide n'attaque pas ; l'anneau de cible apparaît sous l'ennemi ; la touche 1 près de l'ennemi provoque un Stagger (`Chase -> Stagger` dans la console). **Non confirmé de façon probante** : Échap, F1/F2 (effet visuel trop petit sur la capture), clic gauche sur l'ennemi, Tab seul, comptage des coups. Ces points restent à valider à la main (tests 4, 9, 12, 13).

## Lancer les tests

`Unity.exe -batchmode -projectPath C:\DEV\ASHENFALL\Unity -runTests -testPlatform PlayMode -testResults C:\DEV\ASHENFALL\Unity\Logs\results.xml -logFile C:\DEV\ASHENFALL\Unity\Logs\tests.log` (éditeur fermé). Nouveau fichier : `M441TargetingTests.cs` (21 tests) ; outil `AttackChainPresser.cs` (anciens tests « clic maintenu » : une pression toutes les 0,5 s).
