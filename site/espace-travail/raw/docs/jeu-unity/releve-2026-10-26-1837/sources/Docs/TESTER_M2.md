# Tester M2 (visée à la souris, première attaque)

## Dans Unity

1. Éditeur 6000.6.6f1 sur `C:\DEV\ASHENFALL\Unity` (voir `TESTER_M1.md` pour l'ouverture du projet). Ferme les autres éditeurs Unity.
2. Ouvre `Assets > _Ashenfall > Scenes > Sandbox`, puis **Play**. Clique dans la fenêtre **Game**.
3. **Visée** : bouge la souris, le personnage se tourne vers le curseur (le petit repère jaune est son avant, la hache est à son côté).
4. **Courir en visant ailleurs** : ZQSD/WASD avec la souris dans une autre direction. Souris immobile, la visée reste stable pendant la course.
5. **Attaque** : clic gauche. La hache se lève (0,10 s), balaie (0,10 s) et se rabaisse ; le cooldown total est de 0,45 s. Maintiens le clic pour enchaîner.
6. **Mannequins** (3) : approche-toi à moins de 2 m et frappe. Le mannequin clignote, gonfle et penche, ses points de vie (au-dessus de sa tête) baissent de 20. À 0, il disparaît et revient après 2,5 s.
7. À essayer : frapper derrière toi (aucun dégât), trop loin (aucun dégât), sur le côté (touché jusqu'à environ 55° de la visée), **à travers le mur** pour le mannequin C derrière le mur (aucun dégât), attaquer en courant.

## Régler l'arme

- Dans la fenêtre **Project**, sélectionne `Assets > _Ashenfall > Data > Weapons > DwarfAxe` : dégâts, portée, angle, préparation, phase active, cooldown, arrêt par les murs.
- **Attention** : une modification d'un asset (ScriptableObject) faite pendant Play est **conservée** après l'arrêt. Note les valeurs d'origine : dégâts 20, portée 2,2, angle 110, préparation 0,10, phase active 0,10, cooldown 0,45.
- Pour voir la zone de frappe : sélectionne **Player** et regarde la vue **Scene** (arc jaune), ou active les **Gizmos** dans la fenêtre Game.
- Sur **Player** : `Player Aim` (zone morte, case pour garder l'ancien regard « face à la marche ») et `Melee Attack` (mémorisation du clic, hauteur d'origine de la détection).

## Dans le navigateur

Depuis `C:\DEV\ASHENFALL` : `node Tools\serve-web.js`, puis `http://127.0.0.1:8080` dans Chrome. Clique sur la page, bouge la souris, déplace-toi et frappe un mannequin.

## Tests automatiques (19, dont 8 de M1)

Éditeur fermé :
`Unity.exe -batchmode -nographics -projectPath C:\DEV\ASHENFALL\Unity -runTests -testPlatform PlayMode -testResults results.xml -logFile tests.log`
Ou dans l'éditeur : **Window > General > Test Runner > PlayMode > Run All**.
