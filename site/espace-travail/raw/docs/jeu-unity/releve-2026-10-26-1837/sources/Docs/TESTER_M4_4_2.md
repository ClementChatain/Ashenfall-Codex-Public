# Tester M4.4.2 : combats multi-ennemis

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-22)** : rencontre A (ennemis indépendants), rencontre B (aggro collective), déplacements et collisions, ciblage et attaques, difficulté et plaisir de jeu. Bilan automatique : 281 tests PlayMode réussis (269 de M4.4.1 + 12 nouveaux), build WebDev réussi. Rien ne change pour les commandes de M4.4.1 (clic, Tab, Échap, touche 1, F1/F2), le joueur, l'esquive, les dégâts ni les mécaniques M4.3 (Stagger, recul, riposte R25, mort, retour protégé). Hors périmètre, prévu en M4.4.3 : règles de réapparition de meute, équilibrage définitif, finition des télégraphes simultanés.

## Ce qui est nouveau

- **Variantes d'ennemis** (la brute de référence à 100 PV n'est pas modifiée) : *ennemi ordinaire* (70 PV, ocre) et *gobelin* (60 PV, vert, visuel plus petit). Mêmes timings et mêmes dégâts que M4.3 (10 dégâts, anticipation 0,60 s, intervalle 1,80 s).
- **Rencontre A (est)** : trois ennemis ordinaires **indépendants**, espacés de 14 m (rayon de détection : 9 m). Dalle brune au sol.
- **Rencontre B (ouest)** : une **meute** de trois gobelins, serrés, reliés par une **alerte collective** (composant `EnemyGroup`). Dalle verte au sol.
- **Évitement souple** : chaque ennemi reçoit une priorité d'évitement différente (40 à 60) : ils se contournent au lieu de se superposer ou de trembler.
- Le sol du Sandbox passe à 100 x 100 m. Le départ du joueur reste au centre, à plus de 20 m des deux zones : aucune détection au lancement.

## Règles de la meute

| Situation | Comportement |
|---|---|
| Un gobelin **détecte** le joueur, ou **subit un coup** alors qu'il est inactif | Les autres gobelins **disponibles** passent aussitôt en poursuite (une seule propagation, aucune boucle). |
| Gobelin mort, en retour au départ, déjà au combat, ou à plus de 14 m du joueur | **Jamais réactivé** par le groupe. |
| Ensuite | PV, Stagger, protection, riposte, attaque, laisse et retour sont **individuels**. Un gobelin peut abandonner pendant que les autres se battent. |

La rencontre A n'a aucun lien de groupe : frapper un ennemi n'alerte pas les deux autres.

## Lancer

- **Unity :** `Assets/_Ashenfall/Scenes/Sandbox`, Play, clic dans la vue Game.
- **Navigateur :** `node Tools\serve-web.js Unity\Builds\WebDev 8081` puis `http://127.0.0.1:8081/` (Ctrl+F5). Le chargement prend une vingtaine de secondes.
- Le joueur démarre en (0, 0, 0). La caméra regarde en diagonale : **la zone A (dalle brune) est en haut à droite du départ, la zone B (dalle verte) en bas à gauche** ; marcher avec D+W (ou W seul puis D) vers A, avec S+A vers B, en suivant les dalles colorées (environ 4 s de course à 6 m/s). Coordonnées : zone A autour de (24, 0, 0) (ennemis en z = -14, 0, 14), zone B autour de (-28, 0, 0).
- Au-dessus de chaque ennemi s'affiche son état (Idle, Chase, Attack, Stagger, Return).

## Recette : rencontre A (trois ennemis indépendants)

| # | Test | Résultat attendu |
|---|---|---|
| A1 | Aller vers la dalle brune, s'approcher d'un seul ennemi (un des deux ennemis du bout, par exemple celui du nord) à moins de 9 m, sans s'approcher des autres | Seul cet ennemi passe en Chase ; les deux autres restent Idle. |
| A2 | Le frapper (touche 1) | Il réagit (Stagger puis poursuite). Les deux autres restent Idle (ils ne sont pas alertés). |
| A3 | Le combattre : 70 PV, 4 coups environ (20 dégâts, parfois 3 + 1) | Il meurt (animation de mort), il réapparaît à son point de départ après 4 s si le joueur n'est pas à moins de 2 m. |
| A4 | S'approcher d'un deuxième ennemi pendant le combat (à moins de 9 m) | Il se réveille tout seul à son tour : deux ennemis te poursuivent, avec leurs propres cycles d'attaque. |
| A5 | Réveiller les trois (se placer au centre, entre eux, ou les attirer) | Les trois te rejoignent, **se contournent**, sans se superposer longtemps ni trembler ; leurs attaques ne sont pas synchronisées. |
| A6 | S'enfuir loin (plus de 14 m) d'un seul ennemi | Il passe en Return et rentre ; ceux qui sont encore près te suivent. |
| A7 | Sélection (clic gauche, Tab, Échap) | Fonctionne sur les trois ennemis comme en M4.4.1 ; un seul ennemi est touché par coup. |

## Recette : rencontre B (meute de gobelins)

| # | Test | Résultat attendu |
|---|---|---|
| B1 | Aller vers la dalle verte et s'approcher à moins de 9 m **du premier gobelin** | Les trois gobelins passent en Chase **en même temps** (alerte collective). |
| B2 | Recommencer (recharger) en frappant un gobelin de loin | Même alerte : les trois attaquent. |
| B3 | Combattre : chaque gobelin a **60 PV** (3 coups), sa propre barre d'état | Un gobelin qui reçoit un coup subit son propre Stagger ; les deux autres continuent sans être interrompus. |
| B4 | Tuer un gobelin pendant le combat, puis alerter ou frapper un autre | Le mort ne revient pas (il suit ses propres règles de réapparition de M4.3, 4 s, hors règles de meute prévues en M4.4.3). |
| B5 | S'enfuir à plus de 14 m d'un gobelin seulement | Celui-ci rentre (Return) seul ; les autres continuent si tu es à moins de 14 m d'eux. |
| B6 | Frapper un gobelin qui rentre (Return) | Il prend les dégâts mais ne repart pas à l'attaque et le groupe n'est pas réalerté. |
| B7 | Esquive (Espace) entre plusieurs attaques | Les règles M4.3 restent : invulnérabilité de l'esquive, indicateurs rouges ; riposte R25 (contour bleu acier) par gobelin. |

## Limites connues

- Pas de règle de réapparition de meute (un gobelin mort revient après 4 s comme un ennemi seul) : prévu en M4.4.3.
- Les ennemis conservent la ligne de vue M4.3 : un coéquipier placé entre un ennemi et le joueur peut retarder son attaque ; la règle d'évitement les fait se contourner.
- Équilibrage non définitif (60 à 70 PV, dégâts de M4.3). Télégraphes simultanés : pas de finition (M4.4.3).
- **Létalité (R32)** : trois ennemis qui attaquent ensemble peuvent te tuer en environ 6 s sans esquive ; l'équilibrage est prévu en M4.4.3. Esquive (Espace) et sortie de portée sont les réponses attendues.
- **Répétitivité des attaques (R34, limite de conception assumée)** : tous les ennemis ordinaires utilisent la même attaque (mêmes dégâts, mêmes timings, même portée) : les combats sont plutôt faciles, mais obligent à rester mobile. Ce n'est pas compensé par un réglage artificiel ; la diversification des archétypes est une évolution ultérieure.
- Les états au-dessus des ennemis sont un affichage de débogage (`OnGUI`), conservé pour les tests.
