# Mesures M11.1 : taille, chargement et images par seconde

Relevé du **2026-10-25**, avec les outils de M11.1 (`Tools/measure-web-build.js`, affichage F6, mesure F4). Ce sont des **mesures d'un seul poste** : elles servent de première référence et de méthode, pas de garantie pour d'autres machines.

## Poste de mesure

Navigateur intégré à l'application de bureau (Chromium), carte graphique **NVIDIA GeForce RTX 3050 Ti Laptop GPU** (via ANGLE), canvas de **1200 x 750**, affichage limité à **144 images/s**. Scène : le Sandbox au départ, sans combat ni mission, sauf la ligne marquée « mesure de Clément » (pendant une vague).

## Taille des builds (`node Tools/measure-web-build.js <dossier>`)

| Build | Fichiers principaux | Stocké | Brut (décompressé) | À télécharger (Brotli) |
|---|---|---|---|---|
| **Développement** (`Builds/WebDev`, non compressé, avec outils de test) | `.wasm` 74,9 Mo, `.data` 10,9 Mo, `framework.js` 0,7 Mo | 86,5 Mo | 86,5 Mo | **15,2 Mo** (gzip : 21,9 Mo) |
| **Diffusion** (`Builds/Web`, compressé en Brotli, sans outils de test) | `.wasm.br` 6,8 Mo, `.data.br` 3,4 Mo, `framework.js.br` 0,06 Mo | **10,3 Mo** | 45,3 Mo (`.wasm` 34,3 Mo, `.data` 10,7 Mo) | **10,3 Mo** |

Temps de construction (machine de développement) : développement 156 s ; diffusion 641 s.

**Budget fixé (R3) :** build de diffusion, **au plus 15 Mo à télécharger (Brotli)** et **au plus 60 Mo décompressés**. Mesuré : 10,3 Mo et 45,3 Mo (marge d'environ 45 % et 25 %). Le budget est provisoire : le contenu actuel est du provisoire (formes simples, peu de textures) et il grossira avec les vrais assets (M12, M13).

## Temps de chargement (affichage F6, « Chargement : x s depuis l'ouverture de la page »)

| Cas | Temps |
|---|---|
| Build de développement, premier chargement (86 Mo non compressés) | **40,8 s** |
| Build de développement, rechargement (fichiers en cache du navigateur) | **3,1 s** |
| Build de diffusion (10,3 Mo compressés), première visite de cette adresse | **3,4 s** |

Le premier chargement du build de développement est très supérieur : fichiers non compressés et téléchargés sans cache. Le serveur est local (aucune latence réseau) : sur Internet, le temps dépendra surtout du débit pour les 10,3 Mo.

## Images par seconde (mesure F4 de 10 s, fenêtre 1200 x 750)

| Profil | Build | Images/s (moyenne) | « 1 % bas » | Pire image |
|---|---|---|---|---|
| Moyenne (rendu 80 %, 1 cascade d'ombres) | développement | 143,9 | 116,3 | 12 ms |
| Haute (rendu 100 %, 4 cascades) | développement | 143,9 | 108,7 | 11 ms |
| Basse (rendu 65 %, sans ombres ni HDR) | développement | 143,9 | 120,0 | 12 ms |
| Haute | diffusion | 144,0 | 123,0 | 10 ms |
| **Moyenne, plein écran, pendant une vague de la mission (mesure de Clément)** | diffusion | **144,0** | **117,2** | **12 ms** |

**Mesure en combat réel (Clément, 2026-10-25) :** 10 secondes en plein écran, profil Moyenne, pendant une vague, sur le même poste (RTX 3050 Ti Laptop) : 144,0 images/s en moyenne, 1 % bas 117,2, pire image 12 ms, aucune saccade ressentie. Elle comble le manque « charge d'un combat » pour ce poste ; la **résolution exacte du plein écran n'a pas été relevée** (le cadre F6 l'affiche pourtant : à noter la prochaine fois).

**Lecture :** sur ce poste puissant, les trois profils atteignent la limite d'affichage (144 images/s) : la fluidité ne les distingue pas. Le « 1 % bas » (saccades) est le seul écart, de l'ordre de la mesure. L'intérêt des profils (Basse, Moyenne) ne se verra que sur un poste plus modeste, un processeur graphique intégré ou un mobile : **non mesuré**.

## Mémoire (affichage F6)

Mémoire allouée : environ 52 à 56 Mo (build de développement, Moyenne et Basse), 60 Mo en diffusion (Moyenne), **95 Mo en diffusion (Haute)** ; tas géré : 2 à 3 Mo. La Haute coûte davantage de mémoire (cartes d'ombres plus grandes, quatre cascades).

## Changement de profil

Le premier changement de profil provoque **une image très longue** (reconstruction du pipeline de rendu) : **821 ms** en build de développement, **181 ms** en diffusion lors des changements observés. Ensuite le rythme revient à la normale. C'est ponctuel (action volontaire du joueur) mais visible.

## Comment refaire ces mesures

1. Taille : construire (`Ashenfall > ...` ou `-executeMethod Ashenfall.EditorTools.ProjectBootstrap.BuildWebRelease`) puis `node Tools/measure-web-build.js Unity/Builds/Web`.
2. Serveur : `node Tools/serve-web.js Unity/Builds/Web 8082` (envoie `Content-Encoding: br`).
3. Dans le jeu : **F6** (affichage), **F7** (profil), **F4** (mesure de 10 s, résultat affiché et écrit dans la console du navigateur). Pour une mesure comparable : même taille de fenêtre, rien d'autre d'ouvert, scène identique (idéalement pendant une vague de la mission).

## Limites

- Un seul poste, très rapide ; aucune mesure sur carte graphique intégrée, portable modeste ou mobile.
- Une seule mesure en combat réel (une vague, profil Moyenne, un poste) ; les autres vagues et profils en combat ne sont pas mesurés.
- Les profils changent le pipeline de rendu et l'échelle de rendu ; ils ne changent ni les ennemis, ni la physique, ni le gameplay.
- Le temps de chargement ne tient pas compte d'un réseau réel.
