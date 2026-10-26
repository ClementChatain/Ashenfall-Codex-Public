# Index des références (faisant autorité ou non)

Chemins relatifs à `C:\DEV\ASHENFALL`. Copies : `Docs/PORTAIL_RELAIS/sources/…` (voir `MANIFESTE_COPIES.md`, qui donne aussi l'état Git de chaque original). Date de relevé : 2026-10-26.

Règle d'autorité observée dans le dépôt : **le code et les logs de test priment sur les documents** ; entre documents, la décision la plus récente (numéro `D` le plus haut) prime ; `COMMANDES.md` prime sur les `TESTER_*` pour les touches.

## A. Cadrage et règles (stables)

| Chemin | Fonction | Actualité | Remarque |
|---|---|---|---|
| `CLAUDE.md` | Instructions permanentes de l'IA développeuse (rôle, règles de collaboration, direction artistique) | Commité, stable | Dit « solo, pas de réseau/MMO/PvP dans le MVP » ; voir contradiction n°1 |
| `PROJECT_BRIEF.md` | Brief produit v0.1 (promesse, piliers, hors périmètre) | Commité, v0.1 | Liste « MMO » en hors périmètre **initial** |
| `FIRST_PROMPT.md` | Premier prompt du projet | Historique | Contexte seulement |

## B. État, feuille de route, décisions, risques

| Chemin | Fonction | Actualité | Remarque |
|---|---|---|---|
| `Docs/ROADMAP.md` | Table des jalons M0 → M13 avec statut | Modifié non commité (ligne M13). **Pas de ligne M14.** Lignes M3, M4, M6, M8 : texte ancien (« Implémenté », « En cours ») alors que les commits les montrent clos et validés | **Source principale des statuts**, à lire avec `git log` |
| `Docs/DECISIONS.md` | Journal des décisions D1 → **D324** + « Décisions ouvertes » | Modifié non commité (D318–D324 = M13.1). **Aucune décision M14** | Source de vérité des choix de conception |
| `Docs/RISKS.md` | Registre des risques R1 → **R57** | Modifié non commité. En-tête « Dernière mise à jour : 2026-10-22 » **périmé** (contient R57) | Aucun risque M14 |
| `Docs/M13_CADRAGE.md` | Proposition du lot M13.1 | Texte d'origine conservé ; **D314–D317 font foi** en cas de différence | Remplacé en partie par DECISIONS |

## C. Commandes, tests, builds, performances

| Chemin | Fonction | Actualité | Remarque |
|---|---|---|---|
| `Docs/COMMANDES.md` | Touches du jeu (PC) **actuelles** : C esquive, Espace saut, 2 boutons | Non suivi, créé 2026-10-26 (M14). **Fait foi sur les touches** | Seul document qui décrit M14 |
| `Unity/Assets/_Ashenfall/Data/Input/AshenfallControls.inputactions` (copie `sources/Unity/`) | Définition réelle des touches | Modifié non commité | Plus fiable que tout document |
| `Docs/TESTER_M1.md` … `TESTER_M13_1.md` (≈ 40 fichiers) | Recettes de test manuel par jalon | M1 → M12.1 : commités, historiques. `TESTER_M13_1.md` : non suivi, en attente de validation | **Avant M14, citent Espace pour l'esquive : périmé** (c'est C) |
| `Docs/TESTER_M14.md` | **N'EXISTE PAS** | — | Cité par un commentaire de `M1SandboxBuilder.cs` l. 41 |
| `Docs/PERF_M11.md` | Mesures de performances/poids de M11.1 | Commité, référence « avant M13 » | |
| `Docs/PERF_M13.md` | Mesures avant/après de M13.1 (poids, chargement, mémoire, images/s) | Non suivi, 2026-10-26 08:11 | Antérieur à M14 |
| `Docs/NAVIGATION_M4.md` | Preuve de navigation NavMesh (éditeur et WebGL) | Commité | |
| `Docs/AUDIT_M4_4.md`, `Docs/CDC_M4_4.md` | Audit technique et cahier des charges du combat multi-ennemis (M4.4) | Commités, 2026-10-22, historiques | |
| `Unity/Logs/*.xml`, `*.log` (non copiés) | Résultats bruts de tests et de builds | Ignorés par Git (`Unity/[Ll]ogs/`), contiennent le nom d'utilisateur Windows | Cités dans `ETAT_ACTUEL.md` ; à ne pas publier tels quels |

## D. Art et licences

| Chemin | Fonction | Actualité | Remarque |
|---|---|---|---|
| `Docs/ART_PIPELINE.md` | Pipeline Blender → Unity (échelle, rig, matériaux, pièges) | Modifié non commité (+18 lignes M13.1) | |
| `Docs/ART_DIRECTION_M13.md` | Planche de direction M13.1 (matériaux, ambiance) | Non suivi | Direction **provisoire**, pas finale (R57) |
| `Docs/ASSETS_LICENSES.md` | Registre d'origine et de licence des assets | Non suivi | Règle 15 de CLAUDE.md ; M13.1 : aucune ressource externe |
| `Docs/Art/…` (images, non copiées) | Captures (M3b, M4, M13 avant/après, M13b) | `M13`, `M13b` non suivis | PNG : à transmettre séparément si utile |
| `Blender/m13_fortress_modules.blend`, `Blender/Scripts/m13_*.py` (non copiés) | Sources Blender de M13.1 | Non suivies | **Sources uniques, non commitées, sans sauvegarde distante** |

## E. Obsolescence connue (résumé)

Périmés : touche d'esquive dans `TESTER_M1…M13_1`, ROADMAP M3 (touche Espace), en-tête de `RISKS.md`. Absents : tout document d'état/décision/risque/recette pour M14.
