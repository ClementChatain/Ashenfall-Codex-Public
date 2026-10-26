# Tester M5.4 : game feel du personnage (mobilité et esquive)

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT (2026-10-23)** (six points validés ; « pas mal pour une première version »). Première base jouable, **pas un équilibrage définitif** : les valeurs restent ajustables dans `PlayerMobility.asset`. 367 tests PlayMode réussis (dont 10 nouveaux de `M54MobilityTests`), build WebDev réussi et vérifié dans le navigateur (course à 5,00 m/s affichés, esquive exécutée, ennemi en poursuite et HUD « En combat »). Hache, lance, équipement hors combat, ciblage monocible, trois archétypes et Sentinelle de Fer : **non modifiés**. Les ennemis ne sont **pas** ralentis pour compenser.

## Ce qui a changé

Toutes les valeurs de mobilité sont maintenant dans **un seul asset** : `Unity/Assets/_Ashenfall/Data/Player/PlayerMobility.asset` (menu Create > Ashenfall > Player Mobility Profile). `PlayerMotor` et `PlayerDodge` s'appliquent ses valeurs au démarrage. Pour essayer d'autres valeurs : modifier cet asset dans l'Inspecteur ; reconstruire le Sandbox ne l'écrase pas. Sans asset, les composants gardent les valeurs d'origine de M1 et M3.

| Paramètre | Avant (M1/M3) | Après (M5.4) | Effet recherché |
|---|---|---|---|
| Vitesse de course | 6 m/s | **5 m/s** | Moins de couverture de terrain ; ne dépasse plus le Maraudeur (5 m/s), reste bien au-dessus des autres (2,4 à 3,5 m/s) |
| Accélération | 45 m/s² (0,13 s pour atteindre la vitesse) | **28 m/s²** (0,18 s) | Un peu de poids au démarrage, sans latence |
| Freinage | 60 m/s² (0,10 s pour s'arrêter) | **40 m/s²** (0,125 s) | Arrêt net, sans glisse |
| Rotation du corps | 720 °/s | **600 °/s** | Virages un peu moins instantanés |
| **Distance de l'esquive** | **4 m** | **2,8 m** | Esquive engageante : on choisit sa direction, on ne traverse plus l'arène |
| Durée de l'esquive | 0,30 s | 0,30 s (inchangé) | |
| Vitesse moyenne de l'esquive | 13,3 m/s | 9,3 m/s | Conséquence de la distance |
| Cooldown de l'esquive | 0,60 s | 0,60 s (inchangé) | |
| Mémorisation d'un appui | 0,35 s | 0,35 s (inchangé) | |
| Coût en endurance | 35 | 35 (inchangé) | |
| Invulnérabilité | 0,20 s dès le début | 0,20 s dès le début (inchangé) | |
| Vitesse de sortie de l'esquive | 100 % de la course | 100 % de la course (inchangé) | |
| Endurance max / régénération | 100 / 15 par s après 0,9 s | inchangé | |
| Gravité | -25 | -25 (inchangé) | |

Non modifié volontairement : le déplacement reste possible pendant une attaque, à pleine vitesse (règle validée en M4.4.1) ; je ne l'ai pas ralenti pour créer du « poids ».

## Vérifié automatiquement

- La course atteint 95 % de sa vitesse en moins de 0,25 s, s'arrête en moins de 0,2 s sans glisser plus de 0,5 m.
- L'esquive parcourt 2,8 m en 0,30 s.
- **Esquive contre la Sentinelle, sans l'aide de l'invulnérabilité** (on la coupe dans le test : seul le placement protège), avec un témoin sans esquive qui, lui, est touché : frappe frontale (pas de côté après la visée figée), balayage (sortie du cercle), charge (pas de côté).

## Recette courte (comparer avec ce que vous aviez avant)

Au départ du Sandbox, aucune comparaison directe « avant/après » n'est possible dans le même build : jouez, puis dites-moi si les sensations vous conviennent. Pour revenir aux anciennes valeurs, remettez-les dans l'asset `PlayerMobility.asset` (voir le tableau).

| # | À faire | À juger |
|---|---|---|
| 1 | **Déplacement normal** : courir en rond, s'arrêter, repartir, changer de direction | Réactif (aucun retard à l'appui), précis (on s'arrête où l'on veut, pas de glisse), un peu de poids ? Pas trop lent ? |
| 2 | **Déplacement en combat** : affronter l'ennemi ordinaire ou le Maraudeur et reculer / contourner | Peut-on encore se placer et se repositionner à temps ? Le Maraudeur (5 m/s) rattrape-t-il désormais ? Fuir en ligne droite devant lui est-il devenu impossible, sans être injuste ? |
| 3 | **Distance et réactivité de l'esquive** : Espace, dans toutes les directions, à l'arrêt et en courant | 2,8 m : assez pour se sortir d'un mauvais pas, sans traverser l'arène ? Départ immédiat ? |
| 4 | **Esquive contre la frappe frontale** (Sentinelle, arène au nord) : attendre que le cône rouge se fige, puis Espace sur le côté | Possible à temps ? Trop facile / trop difficile ? |
| 5 | **Esquive contre le balayage** : rester au contact, puis Espace pour reculer pendant le cercle orange | Le cercle de 3,2 m se quitte-t-il bien en une esquive ? |
| 6 | **Esquive contre la charge** : rester à 6 à 8 m devant l'élite, puis Espace sur le côté dès que la bande jaune se fige | Possible à temps ? |
| 7 | **Ressenti global** | L'élite est-elle plus exigeante qu'avant ? Le personnage reste-t-il agréable (ni lourd ni frustrant) ? |

À me dire après l'essai : vitesse (5 est-il bien ?), distance d'esquive (2,8 est-elle bien ?), poids au démarrage (accélération), arrêt (freinage).

## Limites et réserves

- **Valeurs de départ, non définitives** : elles sont à ajuster après votre essai (R37 reste ouvert jusqu'à votre validation de M5.4).
- Les animations de course et d'esquive sont celles de M3b.2 : leur vitesse suit la vitesse de course, mais elles n'ont pas été retravaillées.
- La caméra n'a pas été modifiée.
- Pas de ralentissement pendant l'attaque (voir ci-dessus) : option possible plus tard si vous voulez plus d'engagement dans les coups.
