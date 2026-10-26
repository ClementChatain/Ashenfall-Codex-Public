# Tester M4.1 : ennemi provisoire (détection, poursuite, retour)

Un ennemi de mêlée provisoire (le nain en armure légère, teinté rouge-orangé) garde le coin nord du Sandbox, **derrière le grand mur**. Il détecte, poursuit en contournant les obstacles, s'arrête à distance de mêlée, se tourne vers toi et rentre chez lui si tu t'éloignes. **Il n'inflige aucun dégât** (les attaques ennemies arrivent en M4.2). Les valeurs du joueur (M1 à M3) ne sont pas touchées.

L'état de l'ennemi (**Idle**, **Chase**, **Return**) s'affiche au-dessus de lui. Dans la console du navigateur ou de Unity, chaque changement d'état est écrit : `[Ashenfall] Enemy Brute (provisoire) : Idle -> Chase (distance au joueur 8,7 m)`.

## Où est-il ?

Position de départ : (6, 0, 11), derrière le mur de 10 m (le mur est entre ton point de départ et lui). Le joueur démarre à l'origine.

## Ouvrir et lancer

- **Dans Unity :** ouvrir `Assets/_Ashenfall/Scenes/Sandbox`, **Play**, cliquer une fois dans la vue Game.
- **Dans le navigateur :** build de développement sur `http://127.0.0.1:8081/` (Ctrl+F5), serveur : `node Tools\serve-web.js Unity\Builds\WebDev 8081`.

Commandes inchangées : WASD/ZQSD, souris (visée), clic gauche (attaque), Espace (esquive).

## Les vérifications

| # | Test | Résultat attendu |
|---|---|---|
| 1 | Ne bouge pas, ou reste près de l'origine | L'ennemi reste **Idle**, immobile (à l'origine tu es à 12 m environ, et le mur coupe la vue). |
| 2 | Va près du mur, côté sud (par exemple en (6, 0, 2)) | Toujours **Idle** même à moins de 9 m : **le mur coupe la ligne de vue**, pas de détection à travers. |
| 3 | Contourne le mur par l'est (x > 11) ou par l'ouest (x < 1) jusqu'à voir l'ennemi à moins de 9 m | Dès que la vue est dégagée : **Chase**, il part vers toi. |
| 4 | Laisse-le venir | Il **contourne les obstacles** (mur, piliers, mannequins) sans les traverser, à environ 3,5 m/s (plus lent que toi : tu cours à 6). |
| 5 | Reste immobile quand il arrive | Il s'arrête à **environ 1,5 m**, se **tourne vers toi** et ne bouge plus ; il ne te pousse pas et tu ne peux pas le traverser en marchant dessus. |
| 6 | Tourne autour de lui | Il pivote pour te faire face (rotation fluide, pas instantanée). |
| 7 | Éloigne-toi à plus de 14 m en courant | **Return** : il rentre à 4,5 m/s à son point de départ, redevient **Idle**, se remet face à sa direction d'origine. |
| 8 | Fais-le te suivre à plus de 18 m de son point de départ (en restant à moins de 14 m de lui) | Il rentre aussi (« laisse »). |
| 9 | Frappe-le avec le clic gauche **depuis loin** (derrière le mur, ou à plus de 9 m, à portée d'attaque de 2,2 m, donc en l'approchant) puis fuis | Un coup l'**alerte** même hors du rayon de détection ou derrière un mur ; s'il est blessé puis perd sa cible, il **récupère toutes ses PV** à son retour. |
| 10 | Tue-le (5 coups) | Il disparaît (retour visuel provisoire), reste inerte, puis **réapparaît** inactif à son point de départ après environ 4 s. Aucun comportement de mort élaboré en M4.1. |
| 11 | Laisse-le te rejoindre et reste à côté pendant 10 s | **Tes PV restent à 100** : aucun dégât. |
| 12 | Console | Aucune erreur rouge ; le texte `NavMesh construit à l'exécution : X ms` (quelques ms dans Unity, quelques dizaines dans le navigateur). |

## Remarques

- **L'ennemi n'a pas d'attaque** : si tu le colles, il te regarde seulement. C'est voulu.
- **Rendu provisoire** : même modèle que le joueur, teinté, armure légère ; mêmes animations (repos, course, plus lente que celle du joueur) ; pas d'animation de coup reçu ni de mort (M4.3).
- **Ligne de vue** : tout collider du décor (mur, pilier, mannequin) coupe la vue ; le sol ne la coupe pas.
- **Tests automatiques** : Test Runner, PlayMode, Run All. Nouveaux : `M4EnemyDetectionTests` (17 tests : détection, mur, rayon, poursuite autour du mur, arrêt, orientation, retours, coup reçu, absence de dégâts, collisions, animation, Sandbox) et `NavigationProofTests` (3 tests).

## Reconstruire (si besoin)

```
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.EnemyBuilder.Build
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.M1SandboxBuilder.Build
```

(Unity.exe : `C:\Program Files\Unity\Hub\Editor\6000.6.6f1\Editor\Unity.exe`, éditeur fermé sur ce projet.)
