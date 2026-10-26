# Tester M11.1 : profils graphiques, performances et builds Web

**Statut : VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-25).** Validé : les trois profils graphiques et la lisibilité en Basse ; la mémorisation du profil après rechargement ; le build de diffusion (F6, F7 et F4 fonctionnent ; F3, F10 et F11 sont inactifs dans le jeu). **Mesure de Clément** : 10 secondes en plein écran, profil Moyenne, pendant une vague de la mission : **144,0 images/s en moyenne, 1 % bas 117,2, pire image 12 ms**, GPU NVIDIA GeForce RTX 3050 Ti Laptop, aucune saccade ressentie. **Limites conservées** : un seul poste testé ; résolution exacte du plein écran non relevée ; performances sur mobile et sur carte graphique intégrée non mesurées. Texte historique de la vérification automatique : Suite PlayMode complète : **593 tests réussis sur 593** (dont 18 `M11PerformanceTests`) ; build de développement et build de diffusion réussis. Premier jalon de M11 (« Build Web jouable et profils graphiques : fonctionne dans le navigateur ; images/s et taille mesurées »). Mesures chiffrées : `Docs/PERF_M11.md`.

Deux adresses (deux serveurs locaux, depuis `C:\DEV\ASHENFALL`) :

| Build | Adresse | Serveur |
|---|---|---|
| **Développement** (outils de test F3, F8 à F11) | **http://127.0.0.1:8081** | `node Tools/serve-web.js Unity/Builds/WebDev 8081` |
| **Diffusion** (compressé en Brotli, sans outils de test) | **http://127.0.0.1:8082** | `node Tools/serve-web.js Unity/Builds/Web 8082` |

Chaque adresse a ses propres réglages et sa propre sauvegarde (le navigateur les range par adresse).

## Les trois profils graphiques

| Profil | Rendu | Ombres | Remarque |
|---|---|---|---|
| **Basse** | 65 % de la résolution | aucune ombre, pas de HDR | pour les postes modestes |
| **Moyenne** | 80 % | une cascade, carte de 1024 | **le rendu validé jusqu'ici ; profil par défaut** |
| **Haute** | 100 % | quatre cascades, carte de 2048, ombres douces | consomme plus de mémoire |

**F7** passe au profil suivant (Basse, Moyenne, Haute, puis de nouveau Basse) ; le choix est **mémorisé** entre les sessions. Un message bref confirme (« Qualité : Haute »). Si le jeu reste lent (moins de 25 images/s pendant 10 s), un message propose F7.

**F6** affiche ou masque les performances : images/s (instantané, moyenne sur 5 s, « 1 % bas » = les saccades), durée d'image et pire image, profil et résolution de rendu, mémoire, temps de chargement de la page, carte graphique. **F4** lance une mesure de 10 s dont le résultat reste affiché et s'écrit dans la console du navigateur (F12).

## Vérifié dans le navigateur (build de développement et build de diffusion, vraies touches, rechargement réel)

Le navigateur de vérification tournait ici avec une vraie carte graphique (NVIDIA RTX 3050 Ti Laptop), donc les chiffres sont réels, pour ce poste.

1. **F6** : affichage lisible des performances (144 images/s, 1 % bas 108 à 123, durée d'image 7 ms, mémoire 52 à 95 Mo, chargement, GPU).
2. **F7** : Moyenne, puis Haute (« rendu 100 % »), puis Basse (« rendu 65 % »), message à chaque changement ; sur le build de diffusion aussi.
3. **F4** : mesures de 10 s pour les trois profils (143,9 images/s en moyenne, voir `PERF_M11.md`), écrites dans la console.
4. **Mémorisation** : après le choix de Basse, le navigateur contient `{"version":1,"quality":"Low"}` ; après rechargement de la page : « Qualité : Basse », rendu 65 %.
5. **Chargement** : 40,8 s (développement, premier chargement, 86 Mo), 3,1 s (développement, en cache), 3,4 s (diffusion, 10,3 Mo).
6. **Build de diffusion** : se charge et se joue, sans badge « Development Build » ; **F11 ne fait rien** (les outils de test n'existent pas dans ce build) ; F6, F7 et F4 y fonctionnent.
7. Le changement de profil provoque une image très longue ponctuelle (821 ms en développement, 181 ms en diffusion).

**Non observé** : un profil qui change réellement la fluidité (le poste atteint la limite d'affichage de 144 images/s avec les trois), le conseil automatique de qualité (couvert par les tests), les réglages illisibles et l'échec de stockage (tests), un poste modeste ou un mobile.

## Recette courte

| # | Action | Résultat attendu |
|---|---|---|
| 1 | Ouvrir **http://127.0.0.1:8081** ; **F6** | Un cadre « Performances » en haut à gauche : images/s, 1 % bas, durée d'image, qualité « Moyenne » (rendu 80 %), mémoire, temps de chargement, votre carte graphique |
| 2 | **F7** trois fois, en regardant le cadre et la scène | Haute (rendu 100 %), Basse (rendu 65 %, **plus d'ombres au sol**), Moyenne ; un message « Qualité : ... » à chaque appui ; un à-coup d'une fraction de seconde au changement |
| 3 | Pour **chaque profil** : **F4**, attendre 10 s | « Mesure 10 s : x images/s en moyenne · 1 % bas y · pire image z ms » affiché dans le cadre ; **notez les trois lignes** |
| 4 | Passer en **plein écran** (bouton en bas à droite du jeu) et refaire l'étape 3 | Les profils se distinguent davantage à grande résolution (Basse plus fluide que Haute) si votre carte est modeste |
| 5 | Choisir **Basse**, recharger la page (F5) | Le jeu redémarre en « Qualité : Basse », rendu 65 % |
| 6 | **F11** (devant l'étendard), **E**, puis pendant une vague avec beaucoup d'ennemis : **F4** | La mesure en combat réel (plus basse que au repos) : **notez-la** |
| 7 | Ouvrir **http://127.0.0.1:8082** (build de diffusion) ; **F6**, **F7**, **F4** | Même fonctionnement ; temps de chargement affiché ; **F11, F10, F3 sans effet** (outils de test absents) |
| 8 | (Facultatif) Dans la console du navigateur : `localStorage.setItem('ashenfall.settings.main','abime')` puis recharger | Démarrage en Moyenne avec « Réglages d'affichage illisibles : profil Moyenne » |

## Limites connues (réserves)

- Mesures d'un seul poste puissant (R54) ; les profils n'ont pas été éprouvés sur carte graphique intégrée ou mobile.
- Le changement de profil provoque un à-coup ponctuel.
- Le build de diffusion compressé exige un serveur qui envoie « Content-Encoding: br » (le serveur local du dépôt le fait ; à prévoir pour l'hébergement réel).
- Les réglages (profil) sont par navigateur et par adresse ; pas de réglage de touche ni de menu d'options (provisoire).
- La charge d'un combat de mission n'est pas mesurée (étape 6 de la recette).
