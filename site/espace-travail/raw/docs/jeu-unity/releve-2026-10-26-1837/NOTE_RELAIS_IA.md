# Note de relais pour les autres IA — ASHENFALL

Relevé du 2026-10-26 (~18h35). À lire avec `ETAT_ACTUEL.md` et `INDEX_REFERENCES.md`. Ne rien déduire au-delà de ce qui est écrit ici.

## 1. À savoir avant de travailler

- Projet Unity **6000.6.6f1**, `C:\DEV\ASHENFALL\Unity`, branche `main`, commit `3f1f0ae`. **Aucun dépôt distant** : rien n'est sauvegardé hors du poste de Clément.
- **Du travail précieux n'est pas commité** : M13.1 (décor, sources Blender) et M14 (saut, esquive sur C, avancer à la souris, pieds au sol). Ne pas lancer `git clean`, `git checkout .`, `git reset --hard`, ni reconstruire la scène sans l'accord de Clément. Ne pas écraser `Docs/` ni `Sandbox.unity`.
- Une session Unity est ouverte avec un essai complet en cours (`Unity/Logs/m14_full.log`). Ne pas lancer une seconde instance sur le même projet.
- Langue du projet : français. Clément débute : expliquer simplement, donner des procédures de vérification concrètes (CLAUDE.md).
- Règles de CLAUDE.md à respecter : petites tâches avec critère d'acceptation, expliquer avant de modifier, ne rien installer/télécharger/remplacer sans accord, ne rien inventer, séparer données / logique / UI / sauvegarde, vérifier licences, documenter dans `Docs/`.

## 2. Outils attestés dans ce projet (preuves)

| Outil | Usage | Preuve |
|---|---|---|
| Unity 6000.6.6f1 (URP) | Moteur, tests PlayMode, builds Web | `ProjectVersion.txt`, `Unity/Logs/*.log` |
| Blender (5.2 mentionné en risque) | Modélisation du nain, armures, modules de décor M13.1 | `Blender/m13_fortress_modules.blend`, `Blender/Scripts/`, `Docs/ART_PIPELINE.md` |
| Claude Code (modèles Claude) | Développeur principal défini par `CLAUDE.md` | `CLAUDE.md` |
| Git + Git LFS | Historique local, 59 commits | `git log`, `.gitattributes` |
| Node.js | Petits outils : `Tools/serve-web.js`, `measure-web-build.js`, `capture-server.js` | dossier `Tools/` |
| Navigateur intégré de l'application de bureau | Test des builds Web, mesures F6 | `Docs/PERF_M11.md`, `PERF_M13.md` |
| **GitHub / Codex / ChatGPT / MCP Unity-Blender** | **Aucune preuve d'usage.** MCP : « reporté », jamais installé (D13, R8). Aucun fichier du dépôt ne mentionne Codex, GitHub ou un portail | recherche textuelle dans le dépôt |

## 3. Boucle de travail réelle

1. **Début de mission** : Claude lit `CLAUDE.md`, `PROJECT_BRIEF.md` (FIRST_PROMPT), puis `Docs/ROADMAP.md`, `DECISIONS.md`, `RISKS.md` et le `TESTER_*` du jalon courant ; `git status`/`git log`.
2. **Pendant** : propose, attend la validation de Clément, modifie code (`Unity/Assets/_Ashenfall/…`) et sources Blender, lance les tests PlayMode et builds en ligne de commande, **enregistre les résultats** dans `Docs/` (ROADMAP, DECISIONS, RISKS, TESTER_*, PERF_*) et dans `Unity/Logs/` (non versionné).
3. **Clôture d'un jalon** : Clément teste à la main (recette `TESTER_*`), puis commit « … clos, validé manuellement ». Les jalons M13.1 et M14 n'ont pas franchi cette étape.
4. **Git** : sauvegarde locale et historique seulement. **GitHub : aucun rôle actuel** (pas de remote).
5. **Échanges avec Codex ou des données de conception** : aucun échange opérationnel n'est attesté dans le dépôt. Tout est **transfert manuel** : ce dossier doit être copié par Clément (ou une IA outillée) vers le portail ; rien n'est synchronisé automatiquement.

## 4. Contradictions et points non fiables à connaître

1. **Direction « MMORPG persistant »** : demandée dans la mission de relais, mais `CLAUDE.md` et `PROJECT_BRIEF.md` disent « solo, pas de réseau, de MMO ou de PvP dans le MVP » et classent le MMO en « hors périmètre initial ». Aucun document du dépôt n'enregistre un changement d'objectif. **À faire décider/consigner par Clément** (nouvelle `D325` probable) ; ne pas considérer l'objectif comme acté dans le dépôt. La séparation données / règles / présentation, elle, est déjà une règle (CLAUDE.md règle 8, ex. ScriptableObjects, `PlayerMobilityProfile`, `Presentation/`) ; aucun réseau n'existe.
2. **M14 non consigné** : absent de ROADMAP, DECISIONS (dernière : D324), RISKS (dernier : R57), et `Docs/TESTER_M14.md` n'existe pas bien que le code le cite.
3. **Touche d'esquive** : tous les `TESTER_*` et la ligne M3 de la ROADMAP disent Espace ; la vérité actuelle est **C** (Espace = saut). Source : `COMMANDES.md` + `.inputactions`.
4. **Statuts anciens** dans ROADMAP (M3, M4, M6, M8) en retard sur `git log` ; `RISKS.md` a un en-tête de date périmé.
5. **« Chaque jalon se termine par un commit »** (ROADMAP) : M13.1 et M14 ne l'ont pas, en attente de validation de Clément.
6. **Tests** : 612/612 est le dernier résultat complet (avant M14). Après M14, 634 tests existent ; leur réussite globale est **INCONNUE** (essai en cours). Les tests ne sont pas synonymes de validation manuelle.
7. **Hors périmètre de la demande M14 mais présent** : correction du butin rose en build Web (cubes de butin sans matériau URP, `LootPickup.cs`, test `Loot_Cubes_Use_The_Project_Urp_Material…`) et Maj+F3 (butin au sol par rareté, `ItemDebugKeys.cs`), non documentés non plus.

## 5. Ce qu'il reste à faire côté humain ou outillé (non fait ici)

- Dire si un dépôt distant privé doit être créé et lequel : **sans cela aucune sauvegarde n'existe**.
- Valider M13.1 visuellement et M14 manuellement (esquive C, saut, 2 boutons, pieds au sol), puis consigner M14 (ROADMAP, DECISIONS, RISKS, `TESTER_M14.md`) et commiter.
- Récupérer le résultat de l'essai complet (`Unity/Logs/m14_full.xml` s'il apparaît).
- Transférer ce dossier au portail ; les PNG de `Docs/Art/` et les `.blend` ne sont pas copiés ici.
