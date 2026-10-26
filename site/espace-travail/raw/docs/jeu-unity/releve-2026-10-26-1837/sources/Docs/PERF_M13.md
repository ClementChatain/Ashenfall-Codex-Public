# Mesures M13.1 : poids, chargement, mémoire et images par seconde

Relevé du **2026-10-26** sur **le même poste** que `PERF_M11.md` (navigateur intégré à l'application de bureau, GPU NVIDIA GeForce RTX 3050 Ti Laptop via ANGLE, affichage limité à **144 images/s**). Règle (D317) : on ne compare que des conditions identiques ; **les seuils de M11.1 (15 Mo / 60 Mo, +2 / +6 Mo) ne sont plus bloquants**, ils servent de repères.

## Ce qui est comparé

- **« Avant »** : le build d'avant M13 (état du commit `c865548`/M12.1), conservé en copie (`Unity/Builds/_before_M13/`, ignoré par Git) et servi sur d'autres ports : développement `:8083`, diffusion `:8084`.
- **« Après »** : le build M13.1 : développement `:8085` (et `:8081`), diffusion `:8086` (et `:8082`).
- Mêmes machine, navigateur, taille du canvas (**960 x 600**, rendu à 80 % en Moyenne), même scène (Sandbox), même caméra (3e personne par défaut), mêmes touches, même chronologie.

## Poids (`node Tools/measure-web-build.js <dossier>`)

| Build | Avant | Après | Écart |
|---|---|---|---|
| **Diffusion, à télécharger (Brotli)** | 10,32 Mo (stocké 10,35) | **13,45 Mo** (stocké 13,47) | **+3,13 Mo (+30 %)** |
| Diffusion, décompressé | 45,35 Mo | **50,31 Mo** | +4,96 Mo (+11 %) |
| dont `Web.data.br` (scène, textures, modèles) | 3,39 Mo | 6,34 Mo | **+2,95 Mo** |
| dont `Web.wasm.br` (code) | 6,85 Mo | 7,02 Mo | +0,17 Mo |
| Développement, brut | 86,51 Mo | 91,86 Mo | +5,35 Mo |
| Développement, Brotli / gzip | 15,15 / 21,92 Mo | 18,36 / 25,49 Mo | +3,21 / +3,57 Mo |

Poids **ajouté par le lot** : environ **+3,1 Mo à télécharger** et **+5 Mo décompressés** en diffusion, presque tout dans les données (textures compressées avec Crunch, maillages). Par rapport aux anciens repères : 13,45 Mo contre 15 Mo et 50,31 Mo contre 60 Mo : **encore en dessous**, sans que ce soit une condition. Sources non livrées : 16 Mo de PNG de textures dans le dépôt (le build en contient la version compressée).

## Temps de chargement (affichage F6, « Chargement : x s depuis l'ouverture de la page »)

| Cas | Avant | Après |
|---|---|---|
| Diffusion, première visite de l'adresse | 3,3 s | 3,0 s |
| Diffusion, deuxième visite | 2,9 s | 2,7 s |
| Développement, première visite de l'adresse | 3,3 s | 3,2 s |

**Lecture honnête :** le serveur est **local** (aucun réseau) et il n'envoie **pas d'en-têtes de cache** : le navigateur recharge donc tout le contenu à chaque visite (les tailles transférées relevées sont les tailles complètes, 6,34 Mo pour `Web.data.br`). La distinction **cache froid / cache chaud n'est donc pas mesurable ici** ; les ≈ 3 s mesurent surtout le décodage et l'initialisation, **pas** un téléchargement réel. Sur Internet, le poids ajouté (+3,1 Mo) comptera plus que ces temps. Les chiffres de M11 (40,8 s au premier chargement de développement) venaient d'un premier accès disque non reproduit ici.

## Mémoire (affichage F6 « Mémoire »)

**Ce que mesure l'indicateur :** `Profiler.GetTotalAllocatedMemoryLong` = mémoire allouée par Unity (natif et géré), **pas** la mémoire graphique de la carte ni la mémoire totale du processus du navigateur. Relevé au départ, profil Moyenne, sans combat.

| Build | Avant | Après |
|---|---|---|
| Développement | 51 Mo | 62 Mo (+11 Mo) |
| Diffusion | 60 Mo | 70 Mo (+10 Mo) |

Le tas géré reste à 3 à 4 Mo. Les textures du décor (1024 px, 6 jeux) expliquent l'essentiel.

## Images par seconde (F4, 10 s, build de développement, 960 x 600)

Scénario **calme** : F11 (devant l'étendard de l'arène), 2,5 s d'attente, F4. Scénario **combat** : même départ, E (lancement de la mission), 3,3 s plus tard (fin du compte à rebours) F4 : les 10 s couvrent la première vague (quatre gobelins) jusqu'à la défaite du joueur immobile (≈ 14 s). Chaque profil est mesuré après un rechargement de la page.

| Profil | Scénario | Avant : moyenne / 1 % bas / pire image | Après : moyenne / 1 % bas / pire image |
|---|---|---|---|
| Basse | calme | 143,9 / 119,0 / 14 ms | 144,0 / 123,0 / 9 ms |
| Basse | combat | 143,9 / 93,8 / 13 ms | 143,7 / 101,4 / 17 ms |
| Moyenne | calme | 144,0 / 125,0 / 8 ms | 143,9 / 118,1 / 14 ms |
| Moyenne | combat | 144,0 / 125,0 / 8 ms | 144,0 / 125,0 / 8 ms |
| Haute | calme | 144,0 / 124,0 / 9 ms | 144,0 / 123,0 / 9 ms |
| Haute | combat | 144,0 / 109,5 / 13 ms | 143,7 / 100,0 / 18 ms |

**Lecture honnête :**
- Sur ce poste, **tous les cas restent à la limite d'affichage** (143,7 à 144,0 images/s) : le lot n'a pas fait baisser la moyenne.
- Le « 1 % bas » et la pire image varient de quelques images/s et de quelques ms dans les deux sens ; **le combat n'est pas déterministe** (trajets des ennemis, instant de la défaite), donc ces écarts sont du même ordre que la variation d'une mesure à l'autre. Le plus net est **Haute en combat** (1 % bas 109,5 puis 100,0 ; pire image 13 puis 18 ms) : à surveiller, sans pouvoir l'attribuer précisément aux quatre lumières ponctuelles ou aux ombres des piliers.
- **Ce poste ne peut pas révéler un surcoût** : la limite de 144 images/s masque le coût réel. Les quatre lumières ponctuelles par pixel, les particules et les textures supplémentaires peuvent peser sur un processeur graphique intégré, un portable modeste ou un mobile : **non mesuré** (R57).
- La première image après le chargement (pire image 1000 ms dans la fenêtre de 5 s) est la même avant et après : c'est le démarrage.

## Comment refaire ces mesures

1. Servir les deux builds : `node Tools/serve-web.js <dossier> <port>` (avant : copie `Unity/Builds/_before_M13/WebDev`, après : `Unity/Builds/WebDev`).
2. Mêmes réglages : profil mis par `localStorage.setItem('ashenfall.settings.main','{"version":1,"quality":"Medium"}')` (ou `Low`, `High`) puis rechargement ; canvas non agrandi.
3. Calme : **F11**, 2,5 s, **F4**. Combat : **F11**, **E**, 3,3 s, **F4** ; résultat dans la console (« [Ashenfall] Mesure 10 s ... ») et dans le cadre **F6**.
4. Captures du canvas : `node Tools/capture-server.js` puis `canvas.toDataURL` envoyé en POST (voir `Docs/Art/M13/`).

## Limites

- Un seul poste, très rapide ; aucune mesure sur carte intégrée, portable modeste ou mobile ; aucune mesure en plein écran.
- Une seule mesure par cas (pas de répétition statistique) ; le combat varie.
- Pas de réseau réel ; pas de cache navigateur mesurable.
- Le build de diffusion n'a pas été mesuré en images/s dans les deux scénarios (pas de touches de test) ; seul l'état initial (144 images/s, 1 % bas 113 à 119) a été relevé.
