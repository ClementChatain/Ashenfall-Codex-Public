# Tester M3b.2 : le nain animé dans le Sandbox

Le nain (personnage technique provisoire, non représentatif de la direction artistique finale) remplace la capsule du joueur et s'anime : repos, course dans quatre directions, attaque à la hache, esquive. **Le gameplay est strictement celui de M1 à M3** : l'animation suit le gameplay, jamais l'inverse.

## Ouvrir et lancer

1. Unity Hub, ouvrir le projet `C:\DEV\ASHENFALL\Unity` (6000.6.6f1).
2. Dans la fenêtre **Project**, ouvrir `Assets/_Ashenfall/Scenes/Sandbox`.
3. Cliquer sur **Play** (en haut, au centre). Cliquer une fois dans la vue **Game** pour lui donner le focus.

Commandes (inchangées) : **WASD / ZQSD** déplacement, **souris** visée et regard, **clic gauche** attaque, **Espace** esquive.

## Ce qu'il faut vérifier

| # | Test | Résultat attendu |
|---|---|---|
| 1 | Ne rien toucher | Le nain respire doucement (torse qui monte et descend), il ne bouge pas de place. |
| 2 | Courir vers le curseur (le nain regarde la souris et avance vers elle) | Cycle de course avant. |
| 3 | Reculer (touche opposée) en gardant la souris devant | Le nain regarde toujours la souris et recule avec un cycle de course **arrière** (pas de moonwalk figé ni de demi-tour). |
| 4 | Se déplacer de côté (touches perpendiculaires à la visée), puis dans l'autre sens | Pas chassés **à gauche** et **à droite**, le regard reste sur la souris. |
| 5 | Diagonales (par exemple avant + côté) | Transition fluide entre deux cycles, sans saut. |
| 6 | Clic gauche à l'arrêt | Le nain lève la hache puis frappe de droite à gauche, **bras et torse**. Le coup touche un mannequin comme avant (20 PV). |
| 7 | Clic gauche en courant en avant, en reculant, en se déplaçant de côté | L'attaque est lisible dans les quatre cas ; **les jambes continuent de courir** pendant que le haut du corps frappe. |
| 8 | Maintenir le clic gauche | Les coups s'enchaînent au rythme habituel (0,45 s), une animation complète à chaque coup, sans coup « avalé ». |
| 9 | Cliquer très vite, plusieurs fois | Chaque attaque acceptée rejoue l'animation depuis le début (jamais bloquée). |
| 10 | Esquive (Espace), à l'arrêt puis en courant | Plongeon/roulade avec le corps incliné et les jambes repliées ; distance, durée et reprise de la course comme en M3 ; légère teinte bleue pendant l'invulnérabilité. |
| 11 | Clic puis Espace tout de suite | L'esquive annule l'attaque : l'animation du coup disparaît aussitôt. |
| 12 | Courir contre le mur | Le nain ne traverse rien ; le collider (capsule de 2 m) est inchangé. |
| 13 | Lire le HUD (PV, endurance) et la console | Même comportement qu'en M3 ; aucune erreur rouge en Console. |

## Points à juger (animations provisoires)

- **Glissement des pieds** en course : attendu, les jambes courtes du nain ne couvrent pas 6 m/s avec un cycle simple. À juger : gênant ou acceptable pour un prototype ?
- **Écart visuel / collider** : le nain mesure 1,53 m, la capsule de jeu 2 m (risque R20). Les coups touchent à portée de la capsule, pas du modèle.
- **Lisibilité** de la hache et du nain sur le sol sombre (risque R21).

## Voir les animations une par une (facultatif)

1. Ouvrir `Assets/_Ashenfall/Art/Characters/Dwarf/Animations/Dwarf_Anims`, déplier le fichier dans la fenêtre Project : les clips `Idle`, `Run_F`, `Run_B`, `Run_L`, `Run_R`, `Attack_Axe`, `Dodge` apparaissent. Sélectionner un clip : l'aperçu en bas de l'Inspector le joue.
2. Planches de poses prêtes à regarder : dossier `Docs/Art/M3b2/` (vue de jeu, profil, face).
3. Voir l'Animator Controller : double-clic sur `DwarfPlayer.controller` (fenêtre Animator) ; en Play, sélectionner `Player > DwarfPlayerVisual` pour voir l'état courant et les paramètres `VelX`/`VelZ`.

## Tests automatiques

Menu **Window > General > Test Runner**, onglet **PlayMode**, **Run All**. Attendu : tous les tests au vert (les 71 précédents plus les tests M3b.2 : import, durées, contrôleur, locomotion directionnelle, attaque et esquive, non-régression). En ligne de commande :

```
"C:\Program Files\Unity\Hub\Editor\6000.6.6f1\Editor\Unity.exe" -batchmode -projectPath C:\DEV\ASHENFALL\Unity -runTests -testPlatform PlayMode -testResults C:\DEV\ASHENFALL\Unity\Logs\results.xml -logFile C:\DEV\ASHENFALL\Unity\Logs\tests.log
```

## Régénérer les animations (si on change le modèle ou les poses)

```
"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b --factory-startup --python Blender/Scripts/export_dwarf_anims.py -- Blender/dwarf_base.blend Unity/Assets/_Ashenfall/Art/Characters/Dwarf/Animations/Dwarf_Anims.fbx
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.DwarfAnimationBuilder.Build
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.M1SandboxBuilder.Build
```

(Unity.exe : `C:\Program Files\Unity\Hub\Editor\6000.6.6f1\Editor\Unity.exe`, à lancer éditeur fermé sur ce projet.)

## Build Web

Le build Web inclut la scène Sandbox avec le nain animé (voir `Docs/TESTER_M1.md` pour lancer le serveur local et ouvrir le navigateur). Vérifier la fluidité et l'absence d'erreur dans la console du navigateur.
