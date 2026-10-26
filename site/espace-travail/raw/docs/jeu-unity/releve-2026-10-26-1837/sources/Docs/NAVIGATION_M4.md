# Navigation (M4) : preuve technique et limites

Statut : **preuve réussie (2026-10-21)** dans l'éditeur ET dans un vrai build WebGL. Option B retenue : NavMesh généré à l'exécution avec les API intégrées à Unity, **sans paquet** (le module `com.unity.modules.ai` est déjà dans le projet).

## Ce qui a été prouvé

Scène de preuve : sol 40 x 40 m, mur de 1 x 3 x 10 m au centre, pilier de 1,5 x 1,5 m près de l'extrémité du mur. Un agent part de (-8, 0, 0) vers (8, 0, 0), de l'autre côté du mur. Code : `Scripts/Navigation/RuntimeNavMesh.cs` (génération) et `NavigationProofRunner.cs` (mesures). Scène : `Assets/_Ashenfall/Scenes/NavProof.unity` (hors build du jeu). Build dédié : `Ashenfall > Construire le build WebGL de la preuve de navigation` (dossier `Unity/Builds/NavProof`, build de développement).

| Mesure | Éditeur (Windows) | **WebGL réel** (navigateur) |
|---|---|---|
| API `NavMesh.GetSettingsByID`, `NavMeshBuilder.CollectSources`, `BuildNavMeshData` + `AddNavMeshData` | OK | **OK** |
| Génération du NavMesh (3 sources, bornes 50 x 20 x 50 m) | 7,3 ms | **46,0 ms** (environ 6 fois plus lent : un seul fil d'exécution) |
| Ligne droite | 16,00 m | 16,00 m |
| Chemin calculé | 19,63 m en 4 coins | 19,63 m en 4 coins |
| Distance parcourue | 19,55 m | 19,57 m |
| Temps d'arrivée à 3,5 m/s | 6,84 s | 6,80 s |
| Dégagement minimal par rapport aux obstacles (rayon d'agent 0,4 m) | 0,47 m | 0,47 m |

Résultats identiques dans l'éditeur et sur le Web : le contournement du mur et du pilier fonctionne, sans traverser ni effleurer d'obstacle. Le coût de génération est faible (46 ms sur le Web pour ce petit monde) ; il sera remesuré avec le Sandbox complet.

Tests automatiques : `NavigationProofTests` (3 tests : génération et temps mesuré, chemin autour du mur et du pilier sans le traverser, exécution complète du runner). Dans le build WebGL, l'écran de la preuve affiche le résultat ; le texte `NAVPROOF RESULT ...` est aussi écrit dans la console du navigateur.

## Vérification dans le Sandbox, en vrai WebGL (build de développement, M4.1)

Même navigateur, vrai build `Builds/WebDev` ; l'ennemi est piloté par des événements clavier envoyés à la page (le joueur contourne le mur jusqu'à voir l'ennemi).

| Mesure | Valeur (WebGL) |
|---|---|
| Génération du NavMesh du Sandbox (10 sources : sol, mur, piliers, bloc, marche, rampe, 3 mannequins) | **55,9 ms** (plateforme `WebGLPlayer`) |
| Images par seconde affichées avec l'ennemi | 72 |
| Détection | `Idle -> Chase` à 8,7 m (vue dégagée après contournement du mur) |
| Poursuite | l'ennemi vient se placer près du joueur, s'arrête, se tourne vers lui (état `Chase` affiché) |
| Perte de cible | `Chase -> Return` (laisse dépassée), puis `Return -> Idle` à l'arrivée |
| Dégâts reçus par le joueur | aucun (barre de vie inchangée) |

Dans l'éditeur, la génération prend 0,7 à 36 ms selon la charge ; sur le Web, environ 6 fois plus.

Deux pièges rencontrés pendant l'implémentation, notés pour la suite :
- `NavMeshBuilder.CollectSources` **vide la liste qu'on lui donne** : pour plusieurs racines de géométrie, une liste temporaire par racine, puis on ajoute.
- `GetComponentInParent<NavMeshAgent>()` **ne trouve pas un agent désactivé** (l'agent est désactivé jusqu'à `EnemyBrain.Start`) : utiliser `GetComponentInParent<T>(true)`.

## Limites et règles découvertes

- **Îlots inatteignables dans les obstacles larges.** Un obstacle en maillage fermé de plus de 0,9 m de large (pilier de 1,5 m) laisse, à l'intérieur, un îlot navigable isolé (`SamplePosition` y trouve un point). Aucun chemin n'y mène depuis le sol, donc c'est inoffensif pour les agents, mais **on ne choisit jamais une destination par `SamplePosition` sans vérifier `PathComplete`**. Si cela gênait un jour : marquer les obstacles « non navigables » avec un `NavMeshBuildMarkup`, ou passer au paquet officiel AI Navigation.
- **Géométrie de navigation = racines indiquées** (sol, murs, piliers, mannequins), jamais le joueur ni les ennemis (leurs colliders creuseraient des trous).
- **Les agents doivent être activés après la génération** du NavMesh : `RuntimeNavMesh` s'exécute en premier (ordre -1000) ; les ennemis activent leur agent dans `Start`.
- **Pas de reconstruction dynamique** : si le décor bouge, il faut reconstruire (`Build()`) ; pas besoin avant les missions (M9).
- **Écran magenta de la scène de preuve** : les primitives n'ont pas de matériau URP, sans importance (la preuve ne rend que du texte et des primitives).
- **Cible Android** : mêmes API (module Unity standard) ; non mesurée (aucun appareil à ce stade).

## Solution de repli (non nécessaire à ce stade)

Si une génération ou une navigation WebGL avait échoué : NavMesh précalculé dans l'éditeur (stocké comme asset de scène) avec le paquet officiel AI Navigation (`NavMeshSurface`), après validation du porteur du projet. Les résultats ci-dessus montrent que ce n'est pas nécessaire pour M4.
