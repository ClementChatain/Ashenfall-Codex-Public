# Tester M3 (esquive, endurance, statistiques)

## Dans Unity

1. Éditeur 6000.6.6f1 sur `C:\DEV\ASHENFALL\Unity` (voir `TESTER_M1.md`). Ferme les autres éditeurs Unity.
2. Ouvre `Assets > _Ashenfall > Scenes > Sandbox`, puis **Play**. Clique dans la fenêtre **Game**.
3. En bas à gauche : la barre rouge (PV) et la barre verte (endurance).
4. **Esquive** : **Espace**.
   - En courant (ZQSD/WASD) : l'esquive part dans la direction des touches, glisse environ 4 m en 0,30 s puis tu continues à courir sans à-coup.
   - À l'arrêt : l'esquive part dans la direction où tu regardes (le curseur).
   - Pendant l'esquive, le personnage s'incline et se compresse légèrement, et il est **bleu clair** pendant les 0,20 s d'invulnérabilité aux dégâts.
5. **Endurance** : chaque esquive coûte 35 (deux esquives d'affilée, la troisième est refusée : la barre verte clignote en rouge). La réserve se remplit ensuite (15/s après 0,9 s sans esquive).
6. **Murs** : esquive contre un mur, un pilier, la rampe, la marche : tu ne traverses rien.
7. **Esquive et attaque** : frappe puis esquive en plein coup (le coup est annulé). Clique pendant l'esquive : seul un clic fait dans les derniers 0,15 s avant la fin de l'esquive part juste après ; un clic plus tôt est ignoré.
8. **Invulnérabilité** : testée depuis M4.2 avec de vraies attaques ennemies (la touche de debug T et le diagnostic d'esquive ont été retirés après validation de M4.2, voir Docs/TESTER_M4_2.md). À 0 PV, le joueur revient à la vie après 3 s.

## Régler les valeurs

- Sélectionne **Player** dans la fenêtre **Hierarchy** :
  - `Player Dodge` : distance, durée, cooldown, coût, invulnérabilité (début et durée), mémorisation de l'appui, vitesse de sortie.
  - `Stamina` : maximum, régénération, délai.
  - `Character Stats` : PV max, Force, Agilité, Défense de base. Clic droit sur le titre du composant : **Test : ajouter +5 Force** pour essayer un bonus (un clic fait alors plus de 20 dégâts), puis **Test : retirer les bonus de test**.
  - `Health` : PV max (écrasé par les statistiques), réapparition.
- **Attention** : une valeur changée pendant Play revient à l'ancienne à l'arrêt. Valeurs actuelles : distance 4, durée 0,30, cooldown 0,60, invulnérabilité 0,20 s dès le début (validées) ; endurance 100, coût 35, régénération 15/s après 0,9 s, mémorisation de l'appui 0,35 s (ajustées après le test manuel de M3).

## Vérifier que l'esquive ne rate plus d'appuis (correctif après le test manuel de M3)

Le défaut venait de l'attaque : le joueur se blessait avec ses propres coups, tombait à 0 PV (« KO » sur la barre rouge), et l'esquive est impossible tant que le joueur est KO (jusqu'à sa réapparition 3 s plus tard). C'est corrigé : le joueur ne se frappe plus.

1. Lance **Play**, regarde la barre rouge de PV en bas à gauche et frappe plusieurs fois avec le clic gauche, près des mannequins ou dans le vide : les PV du joueur doivent **rester à 100**. Esquive entre deux coups.
2. Il y a maintenant une **fine barre sous les PV** : elle se remplit pendant le cooldown de l'esquive (0,60 s) et devient bleu clair quand l'esquive est prête. Elle clignote en orange quand un appui est perdu à cause du cooldown. L'endurance clignote en rouge quand l'appui est refusé faute d'endurance, et les PV clignotent en blanc si le joueur est KO.
3. **Diagnostic temporaire** (éditeur et build de développement seulement), en haut à droite de l'écran de jeu :
   - « Espace vu par Unity » : combien de fois Unity a vu la touche Espace enfoncée.
   - « reçus par l'action » : combien de ces appuis l'esquive a reçus.
   - « Exécutés », « refus cooldown », « refus endurance », « refus KO », « autre », « fusionnés » : l'issue de chaque appui, avec le dernier expliqué en clair.
   - Chaque appui est aussi écrit dans la **Console** Unity (`[Esquive] …`).
4. Méthode : fais 20 esquives en courant dans toutes les directions, en appuyant naturellement sur Espace. À la fin, **« Espace vu par Unity » doit être égal à « reçus par l'action »**, et « reçus » égal à la somme des issues. Un appui qui n'a pas donné d'esquive doit avoir une raison écrite (cooldown, endurance, KO).
   - Si « Espace vu par Unity » est **inférieur** au nombre de fois où tu as appuyé : l'appui n'arrive pas jusqu'à Unity (limite du clavier, par exemple plusieurs touches maintenues en même temps, ou focus de la fenêtre) : ce n'est pas le jeu.
   - Si « vu par Unity » est supérieur à « reçus » : dis-le-moi, ce serait un problème d'entrée dans le jeu.
5. **Règle de mémorisation** : un appui fait pendant les premiers ~0,25 s d'une esquive (avant la mémorisation de 0,35 s) est perdu par conception, et affiché comme « refus cooldown ». Un appui fait ensuite est mémorisé et l'esquive part dès la fin du cooldown de 0,60 s.

## Dans le navigateur

Depuis `C:\DEV\ASHENFALL` : `node Tools\serve-web.js`, puis `http://127.0.0.1:8080`. Clique sur la page, puis joue (Espace pour esquiver). La touche de debug T n'existe plus (retirée en M4.2).

Pour tester aussi la touche de debug dans le navigateur : construis le build de développement (éditeur fermé) :
`Unity.exe -batchmode -nographics -projectPath C:\DEV\ASHENFALL\Unity -executeMethod Ashenfall.EditorTools.ProjectBootstrap.BuildWebDevelopment -logFile build.log`
puis `node Tools\serve-web.js Unity\Builds\WebDev 8081` et `http://127.0.0.1:8081`.

## Tests automatiques (52, dont 19 de M1 et M2)

Éditeur fermé :
`Unity.exe -batchmode -nographics -projectPath C:\DEV\ASHENFALL\Unity -runTests -testPlatform PlayMode -testResults results.xml -logFile tests.log`
Ou dans l'éditeur : **Window > General > Test Runner > PlayMode > Run All**.
