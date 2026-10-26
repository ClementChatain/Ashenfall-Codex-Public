# Tester M1 (déplacement, caméra isométrique)

## Dans Unity

1. Ferme les autres éditeurs Unity (mémoire).
2. Ouvre **Unity Hub**, bouton **Add > Add project from disk**, choisis `C:\DEV\ASHENFALL\Unity` (la première fois seulement), puis ouvre-le avec l'éditeur **6000.6.6f1**. Le premier chargement peut prendre quelques minutes.
3. Dans la fenêtre **Project**, ouvre `Assets > _Ashenfall > Scenes > Sandbox` (double-clic).
4. Clique sur le bouton **Play** (triangle, en haut au centre). Clique dans la fenêtre **Game** pour lui donner le focus clavier.
5. Déplace-toi : **ZQSD** sur AZERTY (les touches aux emplacements WASD du clavier QWERTY), **WASD** sur QWERTY, ou les flèches, ou le stick d'une manette.
6. Essaie : les 8 directions, les murs, les piliers, la rampe (à gauche), la marche basse (devant), le sol en pente douce. Le texte en haut à gauche montre la vitesse, les images par seconde et les touches détectées.

## Régler les valeurs en direct

- Sélectionne **Player** dans la fenêtre **Hierarchy** : tu vois `Player Motor` (vitesse, accélération, décélération, vitesse de rotation, gravité).
- Sélectionne **Main Camera** : tu vois `Isometric Camera Rig` (inclinaison, orientation, distance, champ de vision, lissage, décalage).
- Pendant Play, change une valeur : elle s'applique tout de suite. **Elle revient à l'ancienne valeur quand tu arrêtes Play.** Note celles que tu préfères et donne-les moi.
- Hors Play, la caméra se replace d'elle-même quand tu modifies ses paramètres.

## Dans le navigateur

1. Dans un terminal, depuis `C:\DEV\ASHENFALL` :
   `node Tools\serve-web.js`
   (dossier par défaut : `Unity\Builds\Web`, port 8080 ; `Ctrl+C` pour arrêter.)
2. Ouvre `http://127.0.0.1:8080` dans Chrome, clique sur la page, puis joue avec les mêmes touches.

## Reconstruire

- Scène Sandbox : menu **Ashenfall > Reconstruire Sandbox** (écrase la scène ; depuis M2 elle inclut aussi la hache et les mannequins).
- Build Web : `Unity.exe -batchmode -nographics -projectPath C:\DEV\ASHENFALL\Unity -executeMethod Ashenfall.EditorTools.ProjectBootstrap.BuildWeb -logFile build.log` (éditeur fermé).

## Tests automatiques

Éditeur fermé :
`Unity.exe -batchmode -nographics -projectPath C:\DEV\ASHENFALL\Unity -runTests -testPlatform PlayMode -testResults results.xml -logFile tests.log`
Ou dans l'éditeur : **Window > General > Test Runner > PlayMode > Run All**.
