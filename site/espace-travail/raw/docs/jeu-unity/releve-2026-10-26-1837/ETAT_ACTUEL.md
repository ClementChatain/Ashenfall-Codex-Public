# ASHENFALL — État actuel (relevé documentaire)

Relevé du **2026-10-26, ~18h35** (heure locale, UTC+1), fait par Claude Code (Sonnet 5.5) à la demande de Clément. **Lecture seule** : aucun code, scène, paramètre, test, build ni commit n'a été produit pour ce relevé. Chaque affirmation cite sa source ; ce qui n'a pas de preuve est marqué **INCONNU**.

Légende : **IMPLÉMENTÉ** (code présent) · **TESTÉ AUTO** (test automatisé enregistré) · **VALIDÉ MANUELLEMENT** (preuve d'un test de Clément) · **EN COURS** · **PRÉVU** · **INCONNU**.

## 1. Environnement vérifié

| Élément | Valeur | Source |
|---|---|---|
| Dossier du dépôt | `C:\DEV\ASHENFALL` (racine Git) | `git rev-parse` |
| Projet Unity | `C:\DEV\ASHENFALL\Unity` | ligne de commande de `Unity/Logs/m14_full.log` |
| Version Unity | **6000.6.6f1** (révision `d20c9ac777da`) | `Unity/ProjectSettings/ProjectVersion.txt` |
| Rendu | URP (gabarit `com.unity.template.urp-blank-17.2.6`) | `Docs/ROADMAP.md` (étape 2) |
| Plateforme de build configurée | **WebGL** (seul cas attesté : scène unique `Sandbox.unity` dans `EditorBuildSettings`). Android/iOS : **INCONNU**, aucune configuration vérifiée | `Unity/ProjectSettings/EditorBuildSettings.asset`, `ProjectSettings.asset` |
| Méthode de build habituelle | Scripts d'éditeur lancés en ligne de commande Unity (`-batchmode`) : `Assets/_Ashenfall/Editor/ProjectBootstrap.cs` (`Setup`, `BuildWeb`), `M1SandboxBuilder.cs` (reconstruit la scène Sandbox). Deux sorties : `Unity/Builds/WebDev` (développement, non compressé) et `Unity/Builds/Web` (diffusion, Brotli). Serveur local : `Tools/serve-web.js` ; poids : `Tools/measure-web-build.js` | `Docs/ROADMAP.md`, `Docs/TESTER_M11_1.md`, `Docs/PERF_M11.md`, logs `Unity/Logs/*build*.log` |
| Tests | PlayMode (NUnit) via `Unity.exe -batchmode -runTests -testPlatform PlayMode`, dossier `Unity/Assets/_Ashenfall/Tests/PlayMode` | `Unity/Logs/m14_full.log` (ligne de commande) |
| Dépôt Git | Oui, branche **`main`**, **59 commits**, Git LFS configuré (`.gitattributes`, 10 fichiers LFS) | `git log`, `git lfs ls-files` |
| Commit courant | **`3f1f0ae25fedaca7a14855f494e541962750a188`** (2026-10-26 07:01 +0100) « Docs : règle cible des apparences, backlog M12, cadrage M13 et décisions de lancement de M13.1 (D309 à D317, R56) » | `git log -1` |
| Dernier commit de code/jalon | `c865548` — M12.1 (2026-10-26), clos, validé manuellement | `git log` |
| Modifications non enregistrées | **59 entrées** `git status` avant la création de ce dossier : 23 fichiers suivis modifiés (dont `Sandbox.unity`, `PlayerMotor.cs`, `PlayerDodge.cs`, `AshenfallControls.inputactions`, 4 docs) et le reste non suivi (tout M13.1 : `Art/Environment/`, `Resources/`, `Presentation/`, scripts Blender `m13_*`, `m13_fortress_modules.blend`, docs M13 ; tout M14 : `PlayerJump.cs`, `PointerMovement.cs`, `MouseChordSource.cs`, `M14ControlsTests.cs`, `M13VisualTests.cs`) | `git status` |
| Dépôt distant | **AUCUN** : `git remote -v` vide, aucune section `remote` dans la config. Aucune branche de suivi. | `git remote -v`, `git config` |
| Sauvegarde distante | **NON VÉRIFIABLE / NON ACQUISE.** Rien ne prouve une copie hors de ce poste (ni GitHub, ni autre). Tout l'historique et tout le travail non commité de M13.1/M14 n'existent que sur ce disque. | idem |
| Une session Unity est ouverte | Oui : `Unity.exe` tourne et un essai complet (`Unity/Logs/m14_full.log`) était en cours à 18:33, sans `m14_full.xml` produit. Lancé par quelqu'un d'autre que ce relevé. | `tasklist`, mtime du log |

Aucun jeton ni identifiant n'apparaît dans les URL (il n'y a pas d'URL distante).

## 2. État fonctionnel

### 2.1 Jalons (source : `Docs/ROADMAP.md`, `git log`, `Docs/DECISIONS.md`)

| Jalon | Contenu | État | Preuve |
|---|---|---|---|
| M0 | Dépôt, projet URP, build Web vide | Fait 2026-10-20 | ROADMAP ; `739c862`, `f140554` |
| M1 | Personnage provisoire, caméra isométrique, déplacement | **VALIDÉ MANUELLEMENT** 2026-10-20 | ROADMAP, `0ff0190` |
| M2 | Visée souris, attaque de base | **VALIDÉ MANUELLEMENT** 2026-10-21 | `e18db8b` |
| M3 | Esquive, endurance, statistiques | **VALIDÉ MANUELLEMENT** 2026-10-21 (« Docs : M3 validé », `c7028b2`). Ligne ROADMAP encore rédigée « Implémenté » : texte ancien | `c7028b2` |
| M3b | Nain Blender → Unity, animations, armures interchangeables (torse) | **VALIDÉ MANUELLEMENT** 2026-10-21 | `08a5c24` |
| M4 (4.1 à 4.4.3) | Ennemi, navigation, attaques ennemies, mort/réapparition, ciblage, rencontres, combat collectif | Clos, **VALIDÉ MANUELLEMENT** (commits « clos, validé manuellement ») | `565c847`, `a9052f5`, `598b98a` |
| M5 (5.1 à 5.4) | 3 archétypes + élite (Sentinelle de Fer), 2 armes (hache, lance), mobilité | **VALIDÉ MANUELLEMENT** 2026-10-23 | `b41433b`, `5afa0d1` |
| M6 (6.1 à 6.5) | 3 compétences, retours visuels, effets temporaires, aggro, tactique des ennemis | **VALIDÉ MANUELLEMENT** 2026-10-23/25 | `22b957c` … `cec6afe` |
| M7 | Caméra libre 3e personne + bascule isométrique | **VALIDÉ MANUELLEMENT** 2026-10-25 | `26c35c1` |
| M8.1 | Objets (10 à 12), sac, équipement, butin | **VALIDÉ MANUELLEMENT** 2026-10-25 | `0949a42` |
| M9.1 | XP, 10 niveaux, sauvegarde JSON versionnée | **VALIDÉ MANUELLEMENT** 2026-10-25 | `075bd7c` |
| M10.1 | Mission « Défense de la forteresse » (6 vagues, récompenses, records) | **VALIDÉ MANUELLEMENT** 2026-10-25 ; réserve d'équilibrage R53 (3 min 02 mesurées pour une cible de 5 à 10 min) | `1ec77ef` |
| M11.1 | 3 profils graphiques, mesures perfs, builds Web dev/diffusion | **VALIDÉ MANUELLEMENT** 2026-10-25 (144 images/s, 1 % bas 117,2, RTX 3050 Ti Laptop, un seul poste) | `282484b`, `Docs/PERF_M11.md` |
| M12.1 | Apparence du torse, transmogrification, sauvegarde v3 | **VALIDÉ MANUELLEMENT** 2026-10-26 (D307) ; M12 **partiel** : tête/bottes/arme, règle de possession (D309), 3e silhouette → backlog (D313) | `c865548` |
| **M13.1** | Preuve visuelle d'une portion de la forteresse (6 modules Blender procéduraux, 6 matériaux, lumière) | **IMPLÉMENTÉ + TESTÉ AUTO (612/612 au moment du livrable) ; EN ATTENTE de la validation visuelle de Clément ; NON COMMITÉ** ; qualité procédurale, pas la direction finale (R57, D324) | ROADMAP ligne M13, D318–D324, `Docs/PERF_M13.md`, `Unity/Logs/m13_full.xml` |
| **M14** (contrôles : esquive C, saut Espace, avancer 2 boutons, pieds au sol) | voir 2.3 | **IMPLÉMENTÉ + TESTÉ AUTO partiel ; NON COMMITÉ ; NON DOCUMENTÉ dans ROADMAP/DECISIONS/RISKS ; aucune validation manuelle retrouvée** | voir 2.3 |

**Jalon actif** : M13 (M13.1 livré en attente de validation) et le travail M14 non commité qui s'y est superposé. Aucun document ne définit M14 comme jalon ; seul `Docs/COMMANDES.md` et des commentaires `// M14` dans le code l'attestent.

### 2.2 Systèmes présents dans le code (`Unity/Assets/_Ashenfall/Scripts/…`)

IMPLÉMENTÉS (dossiers) : Player (mouvement, esquive, saut, endurance, animation, HUD), Cameras (isométrique, libre, souris), Combat (santé, résolveur de coups partagé), Targeting, Enemies (4 archétypes dont l'élite, IA, groupes), Navigation (NavMesh à l'exécution), Skills/Effects, Items (sac, équipement, butin, panneau), Save (XP, niveaux, JSON versionné), Missions, Performance (F6/F7/F4), Presentation (`BrazierFlicker`, M13.1). Données d'objets/profils en ScriptableObjects (`Data/…`, ex. `PlayerMobility.asset`).
Hors périmètre actuel (CLAUDE.md, PROJECT_BRIEF.md, ROADMAP) : réseau, MMO, PvP, monde ouvert, crafting, économie en ligne. Voir contradiction n°1 dans `NOTE_RELAIS_IA.md`.

### 2.3 Les quatre demandes vérifiées

| Demande | Code | Test automatisé | Validation manuelle |
|---|---|---|---|
| **Esquive sur C** | **IMPLÉMENTÉ** : action `Dodge` liée à `<Keyboard>/c` (manette : bouton Est), `AshenfallControls.inputactions` l. 345–382 (**modifié, non commité**) | **TESTÉ AUTO** : `M14ControlsTests` — `C_Triggers_The_Dodge_And_Space_No_Longer_Does`, `The_Input_Asset_Binds_Dodge_To_C_…`, `The_Validated_Dodge_Parameters_Are_Unchanged` : réussis (`Unity/Logs/m14_tests.xml`, 18:04). Les tests M3/M4/M53/M61… ont été adaptés (Espace→C) | **INCONNU** : aucune preuve |
| **Saut sur Espace** | **IMPLÉMENTÉ** : `PlayerJump.cs` (nouveau, non suivi) → `PlayerMotor.RequestJump()` ; 0,9 m, pas de double saut, pas d'esquive aérienne, **aucune animation de saut** (`Docs/COMMANDES.md`) | **TESTÉ AUTO** : 7 tests (un saut, pas de chaîne, pas de double saut, KO/esquive, plafond/mur, pas de bonus de vitesse) réussis (`m14_tests.xml`) | **INCONNU** |
| **Avancer vers le point visé, deux boutons maintenus** | **IMPLÉMENTÉ** : `MouseChordSource.cs` + `PointerMovement.cs` (nouveaux, non suivis) + `PlayerMotor.SetPointerMove` ; avance vers le **point du sol sous le curseur** (≠ simple « direction ») ; clavier prioritaire ; caméra figée pendant la combinaison | **TESTÉ AUTO** : 9 tests (vitesse, suivi du curseur, arrêt sans tremblement, relâchement, priorité clavier, sac/UI, perte de focus, pas de sol visé, 2 vues caméra) : 8 réussis dans `m14_tests.xml` ; le 9e (`A_Press_Over_The_Bag…`) a **échoué à 18:04** (`m14_tests.xml`), a été **réécrit/renommé** puis **réussi seul à 18:05** (`m14_tests3.xml`) | **INCONNU** |
| **Décalage visuel personnage / sol** | **IMPLÉMENTÉ** : `VisualGroundOffset = -0.104` dans `M1SandboxBuilder.cs` l. 40–42 et l. 186, présent dans `Sandbox.unity` l. 3611 (le collider et les règles de déplacement ne changent pas). Mesures de sonde : pieds à **0,104–0,106 m** au-dessus du sol en course avant (`Logs/foot.log`, 17:48) → **0,0015–0,0029 m** après (`Logs/foot2.log`, 17:55) ; pendant l'esquive −0,032 à +0,008 m (léger enfoncement possible) | **TESTÉ AUTO** : `The_Feet_Touch_The_Ground_At_Rest_While_Running_And_After_A_Dodge` réussi (`m14_tests.xml`). La sonde `FootProbeTests` n'existe plus dans le dépôt (résultats seulement dans les logs) | **INCONNU**. Le commentaire de code renvoie à `Docs/TESTER_M14.md`, **qui n'existe pas** |

Un ancien résultat de test ne certifie pas le code actuel : le dernier essai de la **suite complète** est antérieur à M14 (voir 2.5).

### 2.4 Builds

| Build | Date des fichiers | Contenu | Source |
|---|---|---|---|
| `Unity/Builds/WebDev/Build/WebDev.*` | **2026-10-26 18:12–18:13** | Développement, « Build Finished, Result: Success » ; construit pendant M14 | `Unity/Logs/m14_dev_build1.log` |
| `Unity/Builds/Web/Build/Web.*.br` | 2026-10-26 07:53–07:57 | **Diffusion M13.1**, antérieur à M14 : **13,45 Mo** à télécharger, 50,31 Mo décompressés (+3,13 / +4,96 Mo vs M12.1) | `Docs/PERF_M13.md`, `Logs/m13_release_build.log` |
| `Unity/Builds/_before_M13/`, `NavProof/` | 2026-10-26 07:05 / 2026-10-21 | Copies de comparaison (ignorées par Git) | D323 |

Aucun build de diffusion ne contient M14. Aucun build n'a été lancé pour ce relevé. Dossier `Unity/Builds/` ignoré par Git (`.gitignore`).

### 2.5 Résultats de tests enregistrés (`Unity/Logs/*.xml`, ignorés par Git)

| Essai | Date (locale) | Résultat |
|---|---|---|
| Suite complète `m13_full.xml` | 2026-10-26 07:47 | **612/612 réussis** (état M13.1, avant M14) |
| M14 `m14_tests.xml` | 18:04–18:05 | 22 tests M14 : **21 réussis, 1 échec** (`A_Press_Over_The_Bag_Or_Over_Any_Interface…`) ; 634 tests découverts au total |
| M14 `m14_tests3.xml` | 18:05 | test remplaçant (`…And_Entering_The_Bag_Stops_It`) : **réussi** |
| Suite complète `m14_full.log` | démarrée vers 18:19 | **EN COURS** à 18:33, aucun `m14_full.xml` : résultat **INCONNU** |

Donc : après M14, **aucune suite complète réussie n'est enregistrée**. Les 22 tests M14 n'ont pas réussi dans un même essai.

### 2.6 Validations manuelles de Clément retrouvées

Preuves : lignes « VALIDÉ MANUELLEMENT » de `Docs/ROADMAP.md`, messages de commit « clos, validé manuellement », D307 (M12.1). Dernière : **M12.1, 2026-10-26** (`c865548`). **Aucune** pour M13.1 ni M14.

### 2.7 Problèmes connus, travaux en cours, prochaines actions décidées

- **Risques ouverts** (`Docs/RISKS.md`, R1 … R57) ; les plus récents : R53 (mission trop courte), R54 (mesures sur un seul poste), R55 (2 silhouettes seulement), R56 (règle de possession des apparences non implémentée), R57 (preuve visuelle procédurale ≠ direction finale ; reste du monde « décalé »).
- **En cours** : validation visuelle de M13.1 par Clément ; essai complet M14 ; consignation de M14 (ROADMAP/DECISIONS/RISKS/TESTER) **non faite**.
- **Décidé** (D313–D317) : backlog M12 (tête, bottes, arme, règle de possession D309, 3e silhouette optionnelle) ; M13.1 limité à une portion de forteresse ; direction « réaliste et épique » ; aucun achat ni prestataire ; seuils de poids non bloquants (repères 15 Mo / 60 Mo).
- **Décisions ouvertes** (`DECISIONS.md`, fin) : cibles perfs par poste, méthode de modélisation des personnages (R19), sauvegarde multiple/nuagique, style de combat détaillé, MCP Unity/Blender (reporté, D13).
- **Prochaines actions déjà décidées** : aucune feuille de route au-delà de M13 n'est écrite (ROADMAP : « reste de la forteresse, personnages et ennemis : à planifier »). Rien n'est reconstitué ici.

Le prototype actuel (primitifs, modèle nain provisoire, décor procédural) **n'est pas la direction artistique finale** (D314, R57).
