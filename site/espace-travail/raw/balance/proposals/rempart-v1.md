> Document initial conservé pour traçabilité. La demande suivante de Clément a autorisé l’installation de la référence de travail V1 ; voir `docs/REMPART_REFERENCE_V1.md` et `balance/rempart-reference-v1.json`. Le texte ci-dessous décrit la proposition avant cette installation et ne constitue pas une preuve d’équilibre ni une modification Unity.

# Rempart — proposition d’équilibrage V1

**PROPOSITION À VALIDER — aucune de ces nouvelles valeurs n’est appliquée au site.**

Périmètre : modèle Bastion / Fracture / Vigie, 24 talents et 6 synergies. Les 20 points, les paliers et les templates restent inchangés. Les nombres ci-dessous sont des valeurs de départ proposées pour des essais, pas des résultats de simulation ni des statistiques déjà approuvées.

## Lecture et calcul

- Le rang 2 remplace le rang 1 : « 10 % / 20 % » signifie 20 % au total au rang 2.
- Un seul choix de maîtrise A ou B est ajouté au rang 2.
- Les bonus de dégâts sont des variations du dommage de référence de la compétence, pas des points de dégâts fixes. Sans dommage de référence ni recharge, aucun DPS ne peut être annoncé.
- « pp » signifie points de pourcentage : 20 % + 10 pp = 30 %. Les autres pourcentages modifient la valeur de référence concernée.
- Une réduction de recharge de 10 % donnerait 18 s pour une recharge de référence de 20 s ; cet exemple ne fixe pas la recharge d’une compétence existante.
- Les montants de Stabilité, les déclenchements et leurs limitations sont eux aussi proposés ; ils nécessitent de définir la ressource avant implémentation.

## Bastion

| Talent | Rang 1 | Rang 2 total | Choix A au rang 2 | Choix B au rang 2 |
|---|---|---|---|---|
| Pieds de Pierre | Distance subie des repoussements −10 % | −20 % | Résistance accrue : −10 pp supplémentaires sur cette distance, soit −30 % au total | Stabilité après une repousse : +5 Stabilité après un repoussement subi, au plus une fois toutes les 3 s |
| Tenir la Ligne | Dégâts reçus pendant son effet −3 % supplémentaires | −6 % supplémentaires | Durée prolongée : +2 s à la durée de référence | Stabilité en défense : +2 Stabilité par seconde pendant l’effet |
| Blocage Obstiné | Coût d’endurance du blocage −5 % | −10 % | Coût d’endurance réduit : −5 pp supplémentaires, soit −15 % au total | Riposte après blocage : prochaine Contre-Frappe dans les 3 s, dégâts +10 % |
| Cœur de Fer | PV maximum +3 % | +6 % | Plus de points de vie : +4 pp, soit +10 % au total | Résistance en danger : dégâts reçus −5 % sous 35 % des PV maximum |
| Mur de Boucliers | Dégâts reçus pendant son effet −3 % supplémentaires | −6 % supplémentaires | Protection prolongée : +2 s à la durée de référence | Réduction des dégâts de zone : dégâts de zone reçus −8 % supplémentaires pendant l’effet |
| Assise de Granit | +2 Stabilité par résistance à un contrôle ou déplacement forcé | +4 Stabilité par déclenchement | Génération accrue : +2 Stabilité par déclenchement, soit +6 au total | Résistance aux contrôles : durée des contrôles subis −10 %, hors immunités et règles de boss |
| Dernier Bastion | Durée de son effet +1 s | +2 s | Durée prolongée : encore +1 s, soit +3 s au total | Protection partagée : allié gardé, dégâts reçus −10 % pendant l’effet |
| Forteresse Vivante | Dégâts reçus −3 % | −6 % | Meilleure résistance : −3 pp supplémentaires, soit −9 % au total | Réduction des dégâts transférés : dégâts subis provenant de Garde −15 % |

Pieds de Pierre : « résistance » concerne ici les **repoussements**, pas une résistance globale à tous les dégâts. Cette portée doit être affichée explicitement si la proposition est retenue.

## Fracture

| Talent | Rang 1 | Rang 2 total | Choix A au rang 2 | Choix B au rang 2 |
|---|---|---|---|---|
| Balayage de Fer | Dégâts du Balayage +5 % | +10 % | Dégâts PvE augmentés : +15 % sur le dommage de référence contre les ennemis PvE ; avec le rang 2, +25 % au total | Stabilité par cible touchée : +2 par cible, au maximum 5 cibles par utilisation |
| Contre-Frappe | Dégâts de la riposte +5 % | +10 % | Riposte renforcée : +10 pp, soit +20 % au total | Riposte de zone : jusqu’à 2 cibles secondaires, chacune à 50 % du dommage de la cible principale |
| Coup de Fracture | Dégâts +5 % | +10 % | Dégâts augmentés : +10 pp, soit +20 % au total | Ralentissement bref : vitesse de déplacement de la cible −20 % pendant 2 s |
| Marteau Implacable | Dégâts du Marteau contre une cible ralentie +8 % | +16 % | Bonus de dégâts : +8 pp contre une cible ralentie, soit +24 % au total | Effet de ralentissement : vitesse de déplacement −15 % pendant 2 s |
| Brise-Garde | Durée de l’affaiblissement +0,5 s | +1 s | Affaiblissement prolongé : encore +1 s, soit +2 s au total | Réduit aussi l’offensive : dégâts infligés par la cible −5 % pendant l’affaiblissement |
| Onde de Choc | Dégâts +5 % | +10 % | Zone élargie : rayon +20 % ; ne pas présenter ce nombre comme un bonus de surface | Génère de la Stabilité : +5 par utilisation ayant touché au moins une cible |
| Fureur Inébranlable | Dégâts des attaques de zone pendant la posture +4 % | +8 % | Dégâts de zone renforcés : +4 pp, soit +12 % au total | Parade renforcée : chance de parade +5 pp pendant la posture, sous réserve de définir cette statistique |
| Briseur de Ligne | Dégâts +8 % | +16 % | Dégâts renforcés : +8 pp, soit +24 % au total | Effet de contrôle bref : interruption de 0,5 s sur une cible interruptible, sans contourner d’immunité |

## Vigie

| Talent | Rang 1 | Rang 2 total | Choix A au rang 2 | Choix B au rang 2 |
|---|---|---|---|---|
| Défi Renforcé | Durée de l’effet de Défi +0,5 s | +1 s | Recharge réduite : −10 % sur la recharge de référence | Interruption renforcée sous condition : interruption de 0,5 s si la cible lance une action interruptible ; aucune immunité contournée |
| Gardien Fidèle | Dégâts transférés par Garde et subis par le Rempart −5 % | −10 % | Réduit les dégâts transférés subis : −5 pp supplémentaires, soit −15 % au total | Mobilité du protecteur : vitesse de déplacement +10 % à moins de 12 m de l’allié gardé |
| Onde de Rupture | Dégâts +5 % | +10 % | Zone augmentée : rayon +20 % | Protection après repoussement : dégâts reçus par le Rempart −8 % pendant 3 s après une repousse réussie |
| Charge Inébranlable | Recharge −5 % | −10 % | Recharge réduite : −5 pp supplémentaires, soit −15 % au total | Résistance après charge : dégâts reçus −8 % pendant 3 s après une charge réussie |
| Ancrage | Durée +1 s | +2 s | Durée prolongée : encore +1 s, soit +3 s au total | Protection du gardé : distance subie des repoussements de l’allié gardé −20 % pendant Ancrage |
| Veille Partagée | Dégâts reçus par l’allié gardé −2 % si proche du Rempart | −4 % | Portée accrue : +4 m à la portée de référence de Veille | Résistance partagée : le Rempart reçoit aussi la réduction de 4 % tant que la proximité est respectée |
| Serment du Rempart | Durée +1 s | +2 s | Durée prolongée : encore +1 s, soit +3 s au total | Protection d’urgence : dégâts reçus par l’allié gardé −10 % pendant Serment s’il est sous 35 % de ses PV maximum |
| Sentinelle Éternelle | Durée +1 s | +2 s | Réduction des dégâts : alliés concernés, dégâts reçus −5 % supplémentaires pendant l’effet | Soutien aux alliés proches : ils récupèrent 2 % de leurs PV maximum sur 4 s, une fois par activation |

La réduction des dégâts transférés ne change pas la part de dégâts redirigée par Garde. Elle s’applique au montant transféré subi par le Rempart, pour éviter de confondre les deux statistiques.

## Synergies — toujours 2 points chacune

| Synergie | Proposition d’effet chiffré |
|---|---|
| Riposte de Fer | Après un blocage, Contre-Frappe touche jusqu’à 2 cibles secondaires à 50 % du dommage principal. Avec le choix « Riposte de zone », plafond inchangé : pas de doublement caché du nombre de cibles. |
| Rempart Vivant | Pendant Tenir la Ligne, dégâts reçus par l’allié gardé −8 %. |
| Percée Protectrice | Onde de Rupture donne à l’allié gardé une réduction de dégâts de 8 % pendant 3 s si au moins un ennemi est repoussé. |
| Élan de Granit | À partir de 20 Stabilité, Balayage inflige +10 % de dégâts sur son dommage de référence. Aucun coût de Stabilité ajouté à ce stade. |
| Défi Fracassant | Après une interruption réussie, prochaine attaque dommageable dans les 4 s : +15 % sur son dommage de référence ; bonus consommé une seule fois. |
| Garde Inébranlable | Pendant Ancrage, l’allié gardé reçoit −20 % de distance de repoussement. Avec le choix « Protection du gardé », l’effet reste à −20 % : pas de cumul implicite. |

## Décisions nécessaires avant implémentation

1. Confirmer ces nombres et la portée de « Résistance accrue ».
2. Rapprocher les noms du prototype V8 et les compétences publiques de référence avant d’affirmer qu’ils partagent les mêmes recharges ou durées. Notamment Défi / Défi du Rempart, Contre-Frappe / Contre-Heurt et Ancrage / Ancrage Profond ne sont pas encore des équivalences établies.
3. Fixer les valeurs de référence absentes (dégâts, durées, recharges, coûts), puis la réserve et les dépenses de Stabilité. Les variations proposées ne suffisent pas à définir ces bases.
4. Régler les cumuls : proposition de départ, réductions défensives de sources distinctes multiplicatives ; bonus de dégâts d’une même catégorie additifs ; effets identiques non cumulables, renouvellement de durée uniquement. Respecter la mention existante « non cumul fort » de Rempart Absolu, dont le périmètre reste à préciser.
5. Pour Assise, proposition de limite à un déclenchement par seconde. Définir les cas de résistance admissibles pour exclure les gains infinis ou les événements sans danger.
6. Tester les trois templates dans des scénarios comparables : dégâts subis, dégâts infligés, endurance restante et utilité pour l’allié. Aucune supériorité chiffrée d’un template n’est démontrée à ce stade.

Après validation : intégrer une couche de coefficients versionnée, afficher les gains du rang et du choix séparément, puis produire un récapitulatif du build. Cette proposition ne doit pas être injectée comme contenu validé par simple modification de présentation.
