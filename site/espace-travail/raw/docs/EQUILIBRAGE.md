# Cadre de calcul et de simulation d’Ashenfall — V1

**Méthode de travail interne. Paramètres de protocole et règles de calcul ci-dessous : PROPOSITION, pas mécaniques de jeu validées.** Ce document constitue la référence à réutiliser lors des futures demandes d’équilibrage ; `AGENTS.md` les y dirige.

Objectif : des classes avec une utilité et des compromis, plusieurs builds viables, aucun cumul incontrôlé. Un calcul reproductible ne démontre pas à lui seul l’équilibre d’un MMORPG.

## 1. État initial et provenance

`balance/catalog-v1.json` inventorie les 24 classes, leurs rôles, les 240 compétences de référence et les identifiants des 25 modèles d’arbres du Codex. Le commit public exact, le chemin et l’empreinte du fichier source sont enregistrés. Ce relevé de conception publique n’est pas une preuve de validation des mécaniques. Il n’exporte rien depuis Knowledge.

Le catalogue conserve les textes chiffrés connus sans en déduire automatiquement une formule. Un « −25 % pendant 5 s » ne donne ni recharge, ni coût, ni interaction avec les autres protections. Au relevé initial, les profils d’acteur, rotations, coefficients de rangs/choix/synergies et modèles d’effets étaient `null` : 24 classes bloquées. La référence Rempart V1 décrite ci-dessous fournit désormais un premier périmètre expérimental ; les 23 autres classes restent incomplètes. Ne pas remplir ces champs avec des valeurs implicites. Un profil rempli reste à vérifier et à adapter au moteur, jamais automatiquement déclaré valide.

La proposition Rempart chiffrée préparée dans la session précédente est conservée dans `balance/proposals/rempart-v1.md` et reste une proposition séparée. La création de ce cadre ne l’approuve pas.

## 2. Unités et ordre des opérations proposés

Temps en millisecondes, dégâts/soins/PV dans la même unité, chances sous forme de fractions (0,20 = 20 %), distances en mètres, coûts dans une ressource explicitement nommée. Distinguer +10 % relatif et +10 points de pourcentage. Le rang 2 représente le total au rang 2, pas l’ajout implicite du rang 1. Le choix A/B est séparé du rang.

Pour une attaque prise en charge par le banc V1 :

```
base = valeur_fixe + bonus_fixe + puissance × coefficient
bonus = 1 + somme(des bonus de la même catégorie explicitement retenus)
critique_moyen = 1 + chance_critique × (multiplicateur_critique − 1)
dégâts_attendus = base × bonus × critique_moyen × (1 − mitigation_cible)
```

Ce sont des dégâts moyens attendus, pas un tirage aléatoire ni une mesure de variance. Les bonus de catégories indépendantes, l’armure, la pénétration et les défenses élémentaires devront être modélisés explicitement avant utilisation ; ne pas les fusionner arbitrairement dans un pourcentage.

Réductions défensives distinctes : `réduction_totale = 1 − produit(1 − réduction_i)`. Deux réductions de 50 % donnent 75 %, pas 100 %. Le helper `reduction()` sert à ce calcul ; le profil de simulation reçoit ensuite la réduction agrégée, qui doit être justifiée. Aucun plafond de mitigation ou d’armure n’est inventé. Une éventuelle limite de jeu doit être validée puis versionnée.

Une recharge réduite de 10 % devient `recharge_base × 0,90`. Ne jamais supposer que recharge, GCD, durée d’incantation et durée d’effet sont la même chose. Pas de recharge négative, ressource négative, chance supérieure à 100 %, NaN ou infini.

## 3. Mesures à conserver séparément

- **DPS** : dommages / durée du scénario. Séparer monocible, zone, burst et durée. Le burst ne doit pas devenir un indicateur de DPS soutenu.
- **Soin effectif** : minimum du soin et des PV manquants ; rapporter le sursoin séparément. Pas de crédit pour un soin sur une cible déjà pleine.
- **Boucliers** : compter l’absorption réellement consommée ; isoler la part expirée/remplacée. Un bouclier lancé n’est pas automatiquement de la survie utile.
- **Survie** : dégâts bruts, empêchés par mitigation, absorbés, subis, excédent létal, temps avant mort et survie à chaque burst. Toujours garder les mêmes attaques ennemies.
- **Ressources** : dépenses, régénération, temps d’attente faute de ressources et réserve finale. Les dégâts soutenus ne peuvent pas ignorer les périodes à vide.
- **Utilité** : interruptions réussies, contrôles utiles après immunités/dégressivité, dégâts évités à l’allié, disponibilité de protection et temps de déplacement. Aucun score arbitraire ne convertit automatiquement ces effets en DPS.

Ne pas additionner « dégâts empêchés à l’allié » et les mêmes dégâts absorbés par le tank comme deux gains indépendants. Pour Garde, définir d’abord la séparation des dégâts originaux, la part transférée et l’ordre des mitigations. Le banc V1 ne modélise pas cette interaction.

## 4. Comparaison et objectifs par rôle

Comparer d’abord les six classes d’un même rôle, puis leur contribution dans des groupes comparables. Même niveau, équipement, qualité d’exécution, buffs externes, cible, distance et durée. Garder les variantes PvE et PvP séparées. Un personnage de test égalisé aide à isoler un mécanisme, mais ne représente pas automatiquement l’équipement réel des classes.

| Rôle | Mesures principales | Compromis à surveiller |
|---|---|---|
| Tank | survie, pression sur le soigneur, protection des alliés, contrôle des ennemis | dégâts, mobilité, coût en ressources |
| Heal | soin effectif, gestion des bursts, ressources, protection, couverture de groupe | dégâts, contraintes de placement et d’incantation |
| DPS mêlée | dommages utiles soutenus/burst, temps au contact, interruptions | exposition au danger, accès à la cible |
| DPS distance | dommages utiles soutenus/burst, temps de lancement, accès aux cibles | interruptions, déplacements et fragilité |

Ne pas viser le même chiffre dans tous les scénarios. Un spécialiste peut dominer son contexte prévu tout en cédant ailleurs. Une classe qui surpasse ses pairs sur toutes les dimensions exige une revue de conception, pas seulement une correction de 2 %.

**Seuils d’alerte initiaux proposés**, pas critères de validation automatique : ±5 % sur la mesure principale d’un test soutenu à contexte égal, ±10 % sur une fenêtre courte ; revue obligatoire d’une synergie dont le gain marginal dépasse de 50 % celui d’une alternative de même coût et de même objectif. Un écart supérieur peut être justifié par une faiblesse mesurée ailleurs. Pourcentage avec référence nulle : indéfini, rapporter l’écart absolu. Les alertes ne prouvent ni abus ni équilibre.

Ne calculer une médiane de rôle qu’avec une couverture suffisante et explicitement annoncée ; avec des profils manquants, signaler que la comparaison globale est bloquée. Popularité d’un build ≠ puissance démontrée.

## 5. Arbres, templates et synergies

Pour le système actuel : 20 points, rangs entiers 0–2, trois voies, paliers et coûts exacts du modèle choisi. Rempart V8 et modèle générique restent séparés. Réutiliser le validateur public `engine.mjs` et ses définitions au commit relevé ; ne pas recopier une approximation des prérequis. La règle actuelle compte les autres points de toute la voie, y compris les paliers supérieurs : c’est un fait du prototype, pas une nouvelle validation de sa pertinence.

Une synergie doit être comparée à une répartition légale avec le même budget total, pas à un build qui laisse gratuitement deux points inutilisés. Examiner également les coûts d’accès aux deux voies. Un talent au rang 2 se compare au rang 1 et aux allocations alternatives avec redistribution du point. Vérifier les effets redondants et les doubles déclenchements.

Point de départ : builds spécialisés, hybrides par paire et templates connus. Une recherche exhaustive ou optimisée n’est autorisée que si tous les effets concernés sont modélisés et les builds filtrés par le validateur. Ne jamais présenter trois templates choisis à la main comme un optimum global.

## 6. Scénarios et sensibilité

Les six contrats sont dans `balance/scenario-contracts-v1.json` : soutenu monocible, burst, zones 3/5/8 cibles, protection d’allié, mobilité/contrôle et PvP de groupe. Les durées sont des propositions de protocole ; les PV, équipements, pressions et compositions restent à calibrer. L’absence de calibration interdit de prétendre que ces scénarios représentent la production.

Pour chaque candidat : référence puis variante, mêmes entrées sauf la modification étudiée. Varier les coefficients proposés de ±10 %, la durée, le nombre de cibles et la disponibilité des ressources. Rapporter les cas où le classement s’inverse. Tester les limites de cumul, coûts nuls, boucles de récupération et empilements de contrôles.

Quand une simulation aléatoire sera ajoutée : graines archivées et appariées entre variantes, réplications, dispersion et intervalle de confiance ; annoncer le nombre d’essais et utiliser un critère d’arrêt défini. Le banc V1 est déterministe en espérance et ne produit **aucun intervalle de confiance statistique**.

## 7. Banc exécutable V1 : périmètre exact

`scripts/balance.py` utilise seulement la bibliothèque standard Python. Il simule un acteur stationnaire contre une cible à PV infinis, une ressource, une rotation prioritaire, un GCD, coûts, recharges, incantations, dégâts directs moyens, soin sur soi, boucliers sur soi, pression entrante continue et bursts configurés.

Les tableaux d’aptitudes ordonnent la priorité. Le banc ne choisit pas une rotation optimale et peut lancer un soin inutile : cet effet apparaît comme sursoin. Aucun effet implicite sur une autre cible, pas de DOT/HOT, armure détaillée, génération de menace, blocage/parade, mobilité, zone, Garde, contrôles ou PvP. Les types d’effets et champs non pris en charge sont refusés, pas ignorés. Pour les étendre, écrire d’abord la spécification et des tests de référence.

À chaque pas : expiration des boucliers → résolution de l’incantation terminée → lancement éventuel d’une capacité → dégâts entrants → mort éventuelle → régénération. La recharge et le coût commencent au lancement. Un sort en cours peut se terminer après un GCD mais jamais après la mort. Une résolution exactement à la fin de scénario n’est pas comptée. Les événements sont arrondis au premier pas disponible ; vérifier la convergence avec un pas divisé par deux. Le temps de mort a la précision du pas, pas une précision continue.

Les boucliers de sources différentes s’empilent dans ce banc et sont consommés dans l’ordre d’application ; relancer la même source remplace son reste sans l’additionner. Ce sont des conventions explicites de test, non des règles de jeu approuvées. La mitigation s’applique avant l’absorption. Le soin ne critique pas dans V1. Le DPS/HPS est normalisé sur la durée entière du scénario, temps après mort inclus, pour ne pas avantager une rotation qui tue rapidement son utilisateur.

Chaque rapport reste **EXPERIMENTAL**, identifie la version, les empreintes SHA-256 du moteur et des entrées, la résolution temporelle et le marquage `test_only`. La présence d’un chiffre dans un rapport ne valide pas son origine.

## 8. Commandes et reprise

Depuis la racine Knowledge :

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -q
python3 scripts/balance.py --output /tmp/balance-readiness.json readiness
python3 scripts/balance.py --output /tmp/balance-synthetic.json simulate \
  --profile balance/fixtures/actor-test.json \
  --scenario balance/fixtures/scenario-test.json
python3 scripts/export_v2.py --output /tmp/codex-v2.json
```

Les fixtures sont purement synthétiques, marquées `test_only` et ne correspondent à aucune classe. Elles démontrent le fonctionnement des calculs, pas l’équilibre du Rempart ou d’une autre classe. Les tests couvrent notamment dégâts analytiques, critiques moyens, ressources, sursoin, absorption utile, expiration, conservation des dégâts, mort, incantation et convergence temporelle.

Pour ajouter des données réelles : conserver une source et une version par valeur, préciser les correspondances entre noms historiques et compétences actuelles, remplir un profil expérimental complet, vérifier ses effets pris en charge, puis comparer une référence et un candidat. Actualiser le catalogue par une revue du diff ; aucun accès réseau automatique ni modification du site n’est nécessaire au calcul.

## 9. Rapport obligatoire d’une demande d’équilibrage

1. Classes et rôles couverts, versions et données absentes.
2. But de chaque spécialisation, budget exact et scénarios réellement exécutés.
3. Table avant/après par métrique avec unités et limites ; pas de score universel inventé.
4. Changements de coefficients proposés, taille de l’effet, contreparties et sensibilité.
5. Risques de cumul, interactions non modélisées et essais de joueurs encore nécessaires.
6. Entrées, rapports, empreintes et commandes de reproduction.
7. Statut : comparaison bloquée, résultat expérimental ou proposition à valider. Aucun coefficient de gameplay n’est appliqué automatiquement à Unity ou au Codex.

Prochaine étape : compléter et valider les données du Rempart, mettre en correspondance ses noms historiques, implémenter Garde et les effets réellement nécessaires à ses trois templates, puis étendre les scénarios aux classes de même rôle. La couverture multi-classe vient de la même méthode, pas de la réutilisation aveugle de coefficients entre classes.

## 10. Référence Rempart installée

[docs/REMPART_REFERENCE_V1.md](REMPART_REFERENCE_V1.md) décrit le profil complet, les correspondances, les règles de Garde et de cumul, le moteur spécialisé et les limites. Utiliser `node scripts/simulate_rempart.mjs --output /tmp/rempart.json` et `node --test tests/*.test.mjs` en plus du banc Python pour toute demande concernant ce modèle. Le diagnostic le signale REVIEW_REQUIRED, pas équilibré ou validé pour tout le MMO.
