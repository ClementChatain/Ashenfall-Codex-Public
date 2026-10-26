# Tester M4.4.3 : combat collectif et réapparition de meute

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-22/23), correctif monocible compris.** Commandes, zones et ennemis de M4.4.2 inchangés ; dégâts, PV et timings **inchangés** **Bilan automatique : 299 tests PlayMode réussis (281 de M4.4.2 + 10 de M4.4.3 + 8 de régression monocible), build WebDev réussi.** (aucune compensation de la répétitivité des attaques, R34 : diversification prévue en M5).

## Ce qui est nouveau

1. **Réapparition de meute (gobelins)** : chaque gobelin mort garde son délai individuel de **4 s**, mais **ne réapparaît pas tant qu'un autre gobelin vivant combat ou termine son retour au départ**. Dès que la meute est libre (tous les vivants inactifs), les gobelins prêts réapparaissent aussitôt (le délai déjà écoulé n'est pas remis à zéro).
2. **Réapparition sûre pour tous les ennemis** : différée si le joueur vivant est à **moins de 2 m** du point de départ (déjà le cas en M4.3), et maintenant aussi si **un autre être vivant occupe le point de départ** (ennemi, mannequin, joueur). Pour ne jamais bloquer à jamais, l'attente liée à un emplacement occupé est bornée à **10 s**.
3. **Télégraphes superposés lisibles** : toutes les zones rouges sont dessinées sous tous les remplissages, eux-mêmes sous tous les contours. Quand deux attaques se chevauchent, le contour de chacune reste visible au-dessus de la zone de l'autre.
4. Ennemis indépendants et brute de référence : réapparition individuelle inchangée, jamais retardée par un autre ennemi.

Les autres garanties (stagger, recul, riposte R25 bleu acier, esquive, retour protégé, alerte collective, ciblage, touche 1) sont inchangées et testées avec trois ennemis.

## Lancer

Comme en M4.4.2 : Unity (`Sandbox`, Play) ou `node Tools\serve-web.js Unity\Builds\WebDev 8081` puis `http://127.0.0.1:8081/` (Ctrl+F5 ; chargement d'une vingtaine de secondes). Zone A (brune) en haut à droite du départ (D+W environ 3 s), zone B (verte) en bas à gauche (contourner la rampe : W+A puis S+A).

## Recette courte

| # | Test | Résultat attendu |
|---|---|---|
| 1 | Zone B : réveiller la meute et tuer **un** gobelin (3 coups), puis continuer à combattre les deux autres plus de 4 s | Le mort **ne réapparaît pas** pendant le combat, même après 4 s. |
| 2 | Tuer les trois gobelins, puis t'éloigner à plus de 3 m des points de départ | Chacun revient à son point de départ ~4 s après sa mort, **sans attendre les autres** (la meute n'est plus engagée). |
| 3 | Tuer un gobelin, puis fuir à plus de 14 m des autres (ils rentrent) | Pendant leur retour, le mort reste mort ; **dès que tous sont revenus à Idle**, il réapparaît (au plus ~0,25 s après). |
| 4 | Tuer un gobelin puis te tenir à moins de 2 m de son point de départ (là où il était posé) | Il ne réapparaît pas tant que tu y restes ; il revient ~0,25 s après ton éloignement (si la meute est libre). |
| 5 | Zone A : tuer un ennemi ordinaire pendant qu'un autre se bat | Il réapparaît **individuellement à ~4 s** (pas de règle de meute en A). |
| 6 | Même chose avec la brute de référence (6, 0, 11) | Réapparition à ~4 s, comme en M4.3. |
| 7 | Laisser les trois gobelins t'attaquer près de toi (rester dans la zone verte) et regarder le sol | Trois secteurs rouges avec contours distincts ; quand deux se chevauchent, chaque contour reste visible. Les attaques ne sont pas synchronisées. |
| 8 | Frapper un gobelin pendant son anticipation (secteur qui se remplit, avant 0,45 s) | Il est interrompu et recule ; **les deux autres continuent leurs attaques** ; seule sa prochaine attaque a le contour bleu acier (R25). |
| 9 | Sans esquiver, rester immobile au milieu des trois | Tu perds ~17 PV par seconde (lethalité mesurée, R32) ; en courant (6 m/s contre 3,5 m/s) ou en esquivant au bon moment, tu ne perds rien. |
| 10 | Fenêtre de contre-attaque : après qu'un ennemi a frappé (fin de la phase active) | Il ne peut plus attaquer pendant plus d'1 s (récupération 0,70 s + garde 0,35 s) : le contre-coup passe sans l'interrompre. |
| 11 | Deux gobelins alignés vers toi (l'un derrière l'autre) | Celui de derrière **fait un pas de côté** (environ 1 s) puis t'attaque depuis un flanc ; il ne reste plus collé et immobile derrière son allié (R33, D162). |
| 12 | Clic gauche, Tab, Échap, touche 1 | Inchangés ; un seul ennemi est touché par coup. |

## Correctif monocible (2026-10-22) : B derrière A

Cause : un ennemi placé entre le joueur et la cible choisie faisait refuser le coup, car la ligne de vue s'arrêtait au premier collider (D158). Corrigé (D159) : seul le **décor** masque la cible ; l'ennemi de devant ne masque rien et ne reçoit rien.

**Vérification simple (Sandbox, mannequins D et E alignés, à l'est du départ)** : depuis le départ, tenir S+D environ 1,3 s (tu vas vers z = -8), puis D+W jusqu'à être **au contact du mannequin D** (le plus proche) ; **cliquer sur le mannequin E** (derrière D) ; appuyer sur 1. Résultat : **E passe à 80 / 100, D reste à 100 / 100**. Variantes : s'éloigner à plus de 2,2 m de E puis 1 : « Hors de portée », D intact ; sans cliquer (Échap), 1 frappe D (le plus proche).

## Règle des 10 s (point de réapparition occupé)

Un ennemi mort attend, après ses 4 s, que **les autres êtres vivants non joueur** (ennemi, mannequin) libèrent son point de départ. S'il est toujours occupé **10 s après ce constat**, il réapparaît **quand même, sur place, en chevauchant l'occupant** ; rien n'est déplacé de force, l'évitement du NavMesh écarte les agents. La règle du joueur à moins de 2 m n'a pas de limite (voulu).

## Limites connues

- **Répétitivité (R34)** : tous les ennemis ordinaires utilisent la même attaque ; combats plutôt faciles, à traiter par des archétypes en M5. Aucun réglage artificiel.
- **Létalité (R32)** : sans esquive ni déplacement, un groupe de trois te tue en environ 6 s. C'est mesuré et assumé ; l'esquive et le déplacement l'évitent entièrement.
- **Ennemi inactif masqué (R33)** : un ennemi *indépendant* inactif, caché derrière un allié, ne détecte pas le joueur (la détection initiale exige la ligne de vue, M4.1) ; dans une meute, l'alerte collective le réveille quand même.
- Un point de départ occupé par un obstacle fixe n'est pas testé (conception du niveau) ; un point occupé par un être vivant permanent ne bloque pas plus de 10 s.
- Un joueur mort puis revenu, ou un joueur qui reste immobile sur un point de départ, retarde la réapparition tant que la condition dure (voulu).
