# Tester M3b.3 : armures de torse interchangeables (prototype)

Le nain peut passer entre deux armures de torse **provisoires** (prototypes techniques, non représentatifs de la direction artistique finale) : **lourde** en fer noirci (apparence d'avant) et **légère** en cuir et mailles. Un seul personnage, un seul squelette, un seul Animator : on n'active que l'un des deux torses. **Le gameplay M1 à M3 est strictement inchangé** et l'armure n'a aucune statistique.

## Touches de test (éditeur et build de développement seulement)

| Touche | Effet |
|---|---|
| **1** (ou **1 du pavé numérique**) | armure lourde |
| **2** (ou **2 du pavé numérique**) | armure légère |

Clavier AZERTY : les touches sont définies par leur **position physique**. Appuie sur la touche en haut à gauche de ton clavier, celle de « & » pour 1 et de « é » pour 2, **sans Maj**, ou utilise le pavé numérique.
Dans le build Web **normal** (`Builds/Web`), ces touches n'existent pas. Le build **de développement** (`Builds/WebDev`, port 8081 si tu lances `node Tools/serve-web.js Unity\Builds\WebDev 8081`) les a.

## Dans Unity

1. Ouvrir `Assets/_Ashenfall/Scenes/Sandbox`, **Play**, cliquer une fois dans la vue Game.
2. Appuyer sur **2** : le torse devient plus clair et plus étroit aux épaules (cuir, mailles). **1** : retour au fer noirci.

## Dans le navigateur

Recharger `http://127.0.0.1:8081/` avec **Ctrl+F5** (build de développement), puis mêmes touches.

## Ce qu'il faut vérifier

| # | Test | Résultat attendu |
|---|---|---|
| 1 | Au démarrage | Armure lourde (identique à M3b.2). |
| 2 | Touches 1 et 2, plusieurs fois, vite | Le torse change à chaque appui ; **un seul torse visible**, jamais deux superposés ni aucun. |
| 3 | Changer d'armure en courant (avant, arrière, de côté) | La course ne saute pas, ne se relance pas, ne se fige pas. |
| 4 | Changer d'armure au milieu d'une attaque (clic, puis 1 ou 2) | Le coup continue jusqu'au bout et touche comme avant (20 PV d'un mannequin). |
| 5 | Changer d'armure pendant une esquive | L'esquive va jusqu'au bout (même distance, même durée). |
| 6 | Maintenir le clic gauche pendant que tu alternes 1 et 2 | Les coups s'enchaînent normalement. |
| 7 | Voir les deux armures en attaque et en esquive | Pas de trou entre les pièces, pas de partie d'armure qui traverse un bras ou la tête de façon gênante (points à noter : cela reste un prototype). |
| 8 | HUD (PV, endurance), vitesse, portée | Aucun changement selon l'armure. |
| 9 | Console Unity | Aucune erreur rouge. |

## Mesures (prefab joueur)

5 `SkinnedMeshRenderer` dans le prefab, dont **4 visibles** (corps commun, barbe, hache, un torse), 1 matériau, 4 appels de dessin au minimum, 21 os max par maillage ; **3 916 triangles visibles avec l'armure lourde, 4 272 avec la légère** (budget 8 000).

## Tests automatiques

Menu **Window > General > Test Runner**, onglet **PlayMode**, **Run All**. Tests M3b.3 : définitions d'armure, un seul squelette et un seul Animator, os reliés, touches, un seul torse visible, 100 changements sans toucher à la hiérarchie, animation de course non réinitialisée, attaque et esquive non interrompues, changements à chaque image pendant course, attaque et esquive, valeurs de gameplay inchangées, Sandbox.

## Reconstruire (si on change les modèles)

```
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.DwarfPreviewBuilder.Build
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.DwarfAnimationBuilder.Build
```

(Unity.exe : `C:\Program Files\Unity\Hub\Editor\6000.6.6f1\Editor\Unity.exe`, éditeur fermé sur ce projet.) Le deuxième construit le prefab joueur `DwarfPlayerVisual` avec les deux torses reliés au même squelette et le composant `VisualEquipment`.
