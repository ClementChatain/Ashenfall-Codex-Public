# Pipeline Blender -> Unity (M3b.1, étapes A et B)

État : **prototype validé techniquement (étape A) ; silhouette en attente de validation visuelle (étape B)**.

## Conventions

| Sujet | Règle |
|---|---|
| Unité | 1 unité Blender = 1 m ; échelle d'import Unity 1 (vérifié : un cube de 2 m mesure 2,000 m en Unity) |
| Axes Blender | Z vers le haut ; le personnage regarde vers **-Y** ; son côté droit est **-X**, son côté gauche **+X** |
| Axes Unity | Y vers le haut ; le personnage regarde vers **+Z** (vérifié : une flèche vers l'avant en Blender part vers +Z en Unity) |
| Format | **FBX** exporté par Blender 5.2.2, committé dans `Unity/Assets/_Ashenfall/Art/Characters/` (Git LFS) ; sources `.blend` dans `Blender/` (Git LFS) |
| Squelette | 21 os Humanoid : Hips, Spine, Chest, Neck, Head, Shoulder/UpperArm/LowerArm/Hand (_L/_R), UpperLeg/LowerLeg/Foot/Toes (_L/_R) ; pose de repos en T ; sans doigts ; aucune translation sur l'os racine (pas de root motion) |
| Poids | rigides par pièce (poids 1 sur un os) à ce stade ; 4 influences maximum par sommet |
| Matériaux | non importés du FBX (`materialImportMode = None`) : les matériaux sont ceux du projet (URP) |

## Réglages d'export FBX (`ashenfall_common.export_fbx`)

`axis_forward = -Z`, `axis_up = Y`, `global_scale = 1`, `apply_unit_scale`, `apply_scale_options = FBX_SCALE_ALL`, `bake_space_transform = True`, `add_leaf_bones = False`, `use_armature_deform_only = False`, `armature_nodetype = NULL`, `primary_bone_axis = Y`, `secondary_bone_axis = X`, `mesh_smooth_type = FACE`, `path_mode = STRIP`.

Effet constaté à l'import : racine du modèle sans rotation ni échelle, maillages sans rotation ; le nœud d'armature porte la rotation de 270° habituelle d'un export Blender, compensée par ses os (orientation nette des os : identité).

## Réglages d'import Unity (`Editor/CharacterModelPostprocessor.cs`)

Pour tout modèle du dossier `Art/Characters/` : caméras, lumières, blend shapes et visibilité non importés ; matériaux non importés. Pour les personnages : rig **Humanoid**, avatar créé depuis le modèle, `optimizeGameObjects = false` (tous les os restent accessibles pour les points d'attache), animation non importée dans le modèle de base, skin weights standard (4).

## Résultat de l'étape A (prototype de rig Humanoid)

- L'avatar est **valide et humanoïde** avec l'association automatique des noms d'os : 21 os associés (tous les os requis + épaules + orteils). Non associés (facultatifs) : yeux, mâchoire, doigts, UpperChest.
- Tests automatiques : `Tests/PlayMode/ArtPipelineTests.cs` (8 tests : échelle, orientation +Z, racine sans rotation ni échelle, réglages d'import, avatar valide et os requis, hauteur, le maillage suit les os, 4 influences maximum).
- Modèles de test : `Art/Characters/_Prototype/ScaleReference.fbx` et `RigPrototype.fbx`, produits par `Blender/Scripts/build_export_test.py`.

## Étape B (silhouette du nain)

- Script : `Blender/Scripts/build_dwarf_silhouette.py` (modèle en formes simples, 43 pièces, 8 matériaux d'affichage, 2 704 triangles, pose de combat pour les rendus, hache dans la main droite).
- Dimensions mesurées en pose de combat : hauteur 1,51 m (hache non comprise), largeur 0,78 m, profondeur 0,61 m.
- Rendus : `Blender/Scripts/render_previews.py` (Workbench, sans fenêtre) -> `Docs/Art/M3b1/` : `01_vues.png` (face, trois quarts, profil, dos avec la capsule de jeu en fil vert), `02_silhouettes.png`, `03_iso_8_directions.png` (caméra de jeu, 8 orientations, gros plan), `04_iso_taille_ecran.png` (taille réelle dans une fenêtre de jeu de 800 x 600).

## Silhouette, itération 2 (V2) : en attente de validation visuelle

Retours du porteur du projet sur la V1 : proportions conservées (1,51 m, épaules larges, jambes courtes, grosses bottes) ; volumes à retravailler. Changements de la V2 (`build_dwarf_silhouette_v2.py`, formes dans `ashenfall_shapes.py`) :
- plastron facetté à 8 pans (au lieu de la sphère), crête centrale, lames de ceinturon, collerette d'épaules ;
- épaulières à trois plaques superposées de fer noirci, liseré de bronze et pointe, moins rondes ;
- barbe en éventail qui déborde sur les côtés de la tête, joues et favoris, deux tresses à anneaux de fer, moustache ;
- casque facetté à cimier forgé en arc qui épouse le contour, visière, protège-joues et protège-nuque ;
- gantelets effilés (manchette, paume, jointures) et bottes forgées (tige, pied effilé, talon, bout de fer) ;
- palette plus sombre : fer noirci en masse, acier usé pour les arêtes, bronze terni, cuir sombre, tissu lie-de-vin.

Mesures V2 (pose de combat) : hauteur 1,53 m hache non comprise (casque 1,46 m, cimier compris 1,53 m), largeur 0,94 m, profondeur 0,67 m, 3 808 triangles, 61 pièces, 21 os, 8 matériaux d'affichage. V1 : 1,51 m, 0,78 m, 0,61 m, 2 704 triangles, 43 pièces.

Rendus V2 : `Docs/Art/M3b1/v2/` (01 à 04 comme la V1) et planches de comparaison V1 en haut / V2 en bas : `05_comparaison_vues_V1_V2.png`, `06_comparaison_silhouettes_V1_V2.png`, `07_comparaison_iso_taille_ecran_V1_V2.png` (script `render_comparison.py`).

## Export du nain vers Unity et scène DwarfPreview (fin de M3b.1)

Statut : **personnage technique provisoire, non représentatif de la direction artistique finale** (le jeu vise une dark fantasy 3D haut de gamme, détaillée et immersive). Son rôle est de valider le pipeline technique avant de produire des personnages beaucoup plus détaillés.

- `Blender/Scripts/export_dwarf.py` : exporte la silhouette V2 en **pose de repos en T** (pas la pose de combat des rendus) vers `Unity/Assets/_Ashenfall/Art/Characters/Dwarf/Dwarf.fbx` et produit `Textures/Dwarf_Palette.png` (256 x 128 px, 4 x 2 cases) et `Blender/dwarf_base.blend`.
- **Un seul matériau** : chaque face est UV-mappée au centre de la case de sa couleur (fer noirci, acier usé, bronze terni, cuir, tissu, peau, barbe, bois). Les matériaux ne sont pas importés du FBX.
- **Trois maillages skinnés** : `Dwarf_Body` (tout sauf barbe et hache), `Dwarf_Beard`, `Dwarf_Axe` (rigide sur la main droite). Total 3 832 triangles, 21 os, 1 influence par sommet (poids rigides).
- **Supports de clavicule** : deux petites pièces cachées pondérées sur `Shoulder_L/R`, nécessaires pour que les épaules soient utilisables dans l'avatar.
- `Editor/DwarfPreviewBuilder.cs` : crée le matériau `Materials/Dwarf_Palette.mat` (URP Lit, texture de palette), le prefab `DwarfVisual.prefab` (matériau de palette, Animator avec avatar Humanoid, `applyRootMotion = false`) et la scène `Assets/_Ashenfall/Scenes/DwarfPreview.unity`.
- Scène DwarfPreview : caméra de jeu (inclinaison 50, orientation 45, champ 30), sol sombre (celui du jeu) à gauche et sol clair à droite, un nain sur chaque sol en pose de combat statique (`DwarfCombatPose`, uniquement pour l'aperçu), capsule de jeu (2 m, rayon 0,4) en vert transparent. **Hors du build Web** (seule la Sandbox y est).
- `Editor/DwarfPreviewCapture.cs` : captures de la scène avec la caméra de jeu (`Docs/Art/M3b1/unity/`) ; nécessite un périphérique graphique (sans `-nographics`).

### Leçons techniques
- **Avatar Humanoid en cache** : Unity garde dans le `.meta` l'association des os calculée au premier import. Après un nouvel export qui change les poids ou le squelette, il faut la recalculer (menu `Ashenfall > Régénérer l'avatar du nain`), sinon des os (ici les épaules) restent non associés.
- **Shaders asynchrones** : les premières images rendues en ligne de commande utilisent un shader de secours gris ; les captures désactivent la compilation asynchrone et font des images d'échauffement.
- **Maillages lisibles** (`isReadable = true`) pour les personnages : quelques milliers de triangles, utile aux tests de poids/UV et à `BakeMesh` ; à réévaluer pour la mémoire.

### Mesures dans Unity (modèle en T, sommets exacts)
Hauteur 1,53 m casque et cimier compris (hache exclue), pieds au sol, avant du personnage vers +Z, côté gauche du personnage en -X, envergure en T supérieure à 1,6 m, 19 à 21 os Humanoid associés (voir tests).

## Animations du nain (M3b.2)

Statut : **animations provisoires**, destinées à valider le pipeline (squelette Humanoid commun, retargeting, Animator, masques) ; pas les animations artistiques finales.

- `Blender/Scripts/export_dwarf_anims.py` : crée sept actions sur le squelette du nain et exporte `Animations/Dwarf_Anims.fbx` (squelette seul, 60 images/s). Poses définies par des directions d'os (`aim_bone`) et de petites rotations du torse ; bassin posé pour que le pied le plus bas touche le sol (oscillation verticale naturelle).
- Clips : `Idle` (2 s, boucle), `Run_F`, `Run_B`, `Run_L`, `Run_R` (0,533 s, boucle ; directions relatives au regard), `Attack_Axe` (0,45 s = cooldown ; élévation 0,10 s, frappe 0,10 s, retour 0,25 s), `Dodge` (0,30 s = durée de l'esquive).
- `Editor/DwarfAnimationBuilder.cs` : déclare les clips (boucle, racine intégrée à la pose), construit `DwarfPlayer.controller`, le masque `UpperBody.mask` et le prefab `DwarfPlayerVisual.prefab`. Rapport : menu `Ashenfall > Rapport des animations du nain`.
- Animator Controller : calque 0 = mélange 2D `Locomotion` (VelX, VelZ) + état `Dodge` ; calque 1 `UpperBody` (masque, mode Override, poids 0 par défaut) = états `Empty` et `Attack`. Aucune transition.
- `Scripts/Player/PlayerAnimationDriver.cs` : voir `Docs/DECISIONS.md` D61 à D65.
- `Editor/DwarfAnimationCapture.cs` : planches de poses dans `Docs/Art/M3b2/` (vue de jeu, profil, face). Le maillage skinné ne se met à jour qu'à l'image suivante : une image éditeur par pose.

### Limites connues des animations provisoires
- Glissement des pieds en course : les jambes courtes du nain ne couvrent pas 6 m/s avec un cycle de 0,533 s ; mélange de l'Idle quand la vitesse est partielle.
- Pendant l'attaque, le masque « Body » remplace le torse mais la hauteur du bassin vient de la locomotion (calque 0, racine exclue du masque).
- Pas de transition d'entrée/sortie élaborée : fondus courts (0,03 à 0,12 s).

## Armures de torse interchangeables (M3b.3, phase 1 : assets)

Statut : **prototypes techniques, non représentatifs de la direction artistique finale**. Phase 2 (composant d'équipement, touches 1 et 2) non commencée.

| Élément | Contenu |
|---|---|
| `Dwarf.fbx` | pièces communes ; `Dwarf_Body` 2 460 triangles (dont dessous de tenue), `Dwarf_Beard` 608, `Dwarf_Axe` 164 ; 21 os ; avatar Humanoid régénéré et valide |
| `Armors/Armor_Heavy.fbx` | armure lourde (fer noirci), 684 triangles, poids rigides sur Spine, Chest, UpperArm_L/R |
| `Armors/Armor_Light.fbx` | armure légère (cuir et mailles), 1 040 triangles, mêmes os |
| `DwarfVisual.prefab` | communs + lourde (look V2 inchangé) |
| `DwarfVisual_Light.prefab` | communs + légère (aperçu) |
| `Scenes/ArmorPreview.unity` | quatre nains (lourde, légère sur sol sombre ; lourde, légère sur sol clair), hors build Web |

Mesures (prefabs) : 4 `SkinnedMeshRenderer`, 1 matériau, 21 os max par maillage, 4 appels de dessin au minimum (le SRP Batcher ne regroupe pas les maillages skinnés) ; **3 916 triangles visibles avec l'armure lourde, 4 272 avec la légère** (budget 8 000). Les FBX d'armure exportent les 21 os dans leur liste d'os ; seuls 4 portent du poids.

Vérifications automatiques (`ArmorAssetTests`, 15 tests) : mêmes noms, hiérarchie et pose de repos que `Dwarf.fbx` ; bind poses identiques os par os ; un seul squelette, un seul Animator, une seule armure par prefab ; os et os racine appartenant au prefab ; clips inchangés (Humanoid, durées) ; mêmes mouvements de squelette pour les deux armures ; l'armure suit le torse pendant l'esquive.

Captures : `Docs/Art/M3b3/` (vue de jeu 800 x 600 avec et sans capsule, 8 directions à taille réelle et en gros plan, poses de course, attaque et esquive en vue de jeu, de profil et de face). Régénération : `export_dwarf_modular.py`, puis `DwarfPreviewBuilder.RegenerateAvatar`, `DwarfPreviewBuilder.Build`, `DwarfPreviewBuilder.BuildArmorScene`, `DwarfAnimationBuilder.Build` (voir D67 à D71).

## Animations Hit et Death (M4.3, phase 1)

Statut : **animations provisoires** (prototypes techniques, le nain reste provisoire : R19). Aucun gameplay : le contrôleur Animator, les composants de combat et l'ennemi ne sont pas modifiés ; les états Hit et Death du contrôleur viendront avec la phase gameplay.

| Clip | Durée | Contenu |
|---|---|---|
| `Hit` | 0,30 s (18 images à 60 i/s), non bouclé | Flinch modéré (pic à 0,085 s) : le torse recule et se tord, la tête part en arrière (environ 16 cm), les bras sursautent, les genoux cèdent un peu, retour exact à la garde (pose de l'Idle à t = 0). Aucun déplacement : le bassin et les pieds restent en place. |
| `Death` | 1,00 s (60 images), non bouclé | Genoux qui plient et torse qui recule (0 à 0,30 s), chute en arrière autour du bassin (0,28 à 0,78 s) avec un petit rebond, bras qui retombent ; **pose finale stable à partir de 0,9 s** : allongé sur le dos, bassin à 0,28 m, tête derrière et pieds devant, torse horizontal. Aucune translation d'ensemble : le bassin ne descend que de 0,33 m. |

- **Script :** `Blender/Scripts/export_dwarf_anims.py` ajoute les deux actions après les sept existantes (même squelette, même FBX `Dwarf_Anims.fbx`). Les sept clips ne changent pas : leurs poses de référence (13 os à 4 instants chacun) ont été enregistrées **avant** la régénération (`Ashenfall > Écrire la référence des animations`, fichier `Tests/PlayMode/Baselines/AnimationBaseline.json`) et un test les compare après : **écart maximal 0,0000 degré**.
- **Import :** `Ashenfall > Réimporter les clips du nain (sans contrôleur)` (`DwarfAnimationBuilder.ImportClipsOnly`) ne touche ni au contrôleur ni aux prefabs ; les clips sont humanoïdes, sans root motion (racine intégrée à la pose), sans événement.
- **Piège découvert :** dans `torso_local`, un `pitch` **positif** penche le personnage vers l'**arrière** (le commentaire disait l'inverse ; vérifié dans Unity par les positions des os). Les clips existants sont validés tels quels et ne sont pas touchés ; les nouveaux utilisent le bon signe.
- **Captures :** `Docs/Art/M4/phase1_animations/` (vue de jeu, profil, face ; distance réelle de la caméra sur sol sombre et clair ; vue de jeu complète). Outil : `Ashenfall > Capturer les animations Hit et Death`.
- **Lisibilité à 800 x 600 (caméra de jeu) :** debout 60 x 82 px, Hit 78 x 98 px, mort 82 x 83 px.

## Commandes
```
blender.exe -b --factory-startup --python Blender/Scripts/build_export_test.py -- <dossier de sortie>
blender.exe -b --factory-startup --python Blender/Scripts/build_dwarf_silhouette.py -- Blender/dwarf_silhouette.blend
blender.exe -b --factory-startup --python Blender/Scripts/render_previews.py -- Blender/dwarf_silhouette.blend Docs/Art/M3b1
blender.exe -b --factory-startup --python Blender/Scripts/export_dwarf.py -- Blender/dwarf_silhouette_v2.blend Unity/Assets/_Ashenfall/Art/Characters/Dwarf/Dwarf.fbx Unity/Assets/_Ashenfall/Art/Characters/Dwarf/Textures/Dwarf_Palette.png Blender/dwarf_base.blend
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.DwarfPreviewBuilder.RegenerateAvatar
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.DwarfPreviewBuilder.Build
Unity.exe -batchmode -quit -projectPath Unity -executeMethod Ashenfall.EditorTools.DwarfPreviewCapture.Run   (sans -nographics)
Unity.exe -batchmode -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.ArtPipelineReport.Run
```
(Blender : `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe`.)

## Décor de la forteresse (M13.1)

Chaîne indépendante de celle des personnages (aucun squelette) ; direction et règles : `Docs/ART_DIRECTION_M13.md`, droits : `Docs/ASSETS_LICENSES.md`.

```
blender.exe -b --factory-startup --python Blender/Scripts/m13_textures.py -- Unity/Assets/_Ashenfall/Art/Environment/Textures [flagstone|stone|ground|metals|embers|flame]
blender.exe -b --factory-startup --python Blender/Scripts/m13_modules.py  -- Unity/Assets/_Ashenfall/Art/Environment/Models Blender/m13_fortress_modules.blend
blender.exe -b --factory-startup --python Blender/Scripts/m13_preview.py  -- Blender/m13_fortress_modules.blend Unity/Assets/_Ashenfall/Art/Environment/Textures Docs/Art/M13/apercu_modules_blender.png
blender.exe -b --factory-startup --python Blender/Scripts/m13_sheet.py    -- Unity/Assets/_Ashenfall/Art/Environment/Textures Docs/Art/M13/planche_materiaux.png
Unity.exe -batchmode -nographics -quit -projectPath Unity -executeMethod Ashenfall.EditorTools.M1SandboxBuilder.Build     (matériaux, prefabs et habillage inclus)
```

- **Textures** : 1024 px (pierre, dalles, sol) ou 512 px (métal, braises), PNG 8 bits créés par synthèse procédurale (graines fixes, raccords sans couture). Albédo en sRGB ; normales au format Unity ; carte « métal-lisse » (R = métallique, A = lissage). Import : `EnvironmentImportSettings` (normales, sRGB, mipmaps, anisotropie, compression avec Crunch).
- **Modèles** : 1 unité = 1 m, origine au centre de la base, FBX statiques (un indice de matériau par face), matériaux Unity assignés **par indice** (`M13EnvironmentBuilder`). Aucun FBX ne contient de matériau utile.
- **Unity** : `M13EnvironmentBuilder` crée matériaux (URP Lit, particules additives), prefabs (`Art/Environment/Prefabs`) et habille la scène **sans collider** : voir D316. Remplacer un module = réexporter le FBX du même nom ; les prefabs gardent leurs matériaux.
- **Piège** : un maillage dont les faces portent des indices de matériau mais qui n'a **aucun emplacement de matériau** s'exporte avec un seul sous-maillage (les indices par face sont perdus). `m13_modules.py` crée un emplacement par indice utilisé (D321).
- **Lumière** : `ConfigureAmbience` (lune froide, ambiance trilight, brume exponentielle carrée) ; `BrazierFlicker` fait vaciller les quatre lumières des braseros (présentation seule).

## Limites connues

- La silhouette actuelle est un **prototype en formes simples**, pas un modèle final : voir `Docs/DECISIONS.md` (D48 à D51) et `Docs/RISKS.md`.
- Hauteur visuelle (1,51 m) et capsule de jeu (2 m) : écart documenté, `CharacterController` non modifié.
