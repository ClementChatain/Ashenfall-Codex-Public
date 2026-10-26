# ASHENFALL — Compétences des nouveaux peuples

**Proposition V0.1 — 23 octobre 2026 — 12 classes, 120 compétences.**

Statut : PROPOSITION / INTERNE. Les identités de classes sont déjà retenues ; les compétences, chiffres et nouvelles mécaniques de ce dossier sont proposés pour étude. Aucune publication ni modification Unity.

## 1. Objectif d’équilibrage

Donner aux Kharûn, Vaelith et Orynth les mêmes moyens fondamentaux que les Nains, Elfes et Humains : protéger, menacer, soigner, interrompre et répondre à un contrôle. Leur différence vient des conditions d’usage et des arbitrages, plutôt que d’un cumul de bonus. Les rapprochements ci-dessous sont des comparaisons de gameplay ; ils ne figent aucune alliance politique ni vérité cosmologique.

Chaque classe dispose de dix compétences de référence. L’esquive universelle et les attaques ordinaires éventuelles ne sont pas des onzièmes compétences inventées par ce dossier ; aucune attaque automatique supplémentaire n’est supposée pour alimenter les ressources. Seule la posture du Mue-Lame a un bouton de mécanique dédié, à l’image d’un contrôle de classe ; elle consomme un GCD sauf pendant sa fenêtre dédiée. Les quatre premières compétences ne forment pas ici un ordre de déblocage : aucune progression de niveaux n’est décidée.

**Ce qui est effectivement vérifié :** présence de 120 compétences, dix par classe, puissances calculées par impact et au total, coûts et durées renseignés, trois Garde, trois bumps, trois dissipations et trois résurrections. **Ce qui reste à mesurer :** DPS/HPS soutenus, dégâts réellement empêchés, consommation sur 60–180 s, survie, facilité d’exécution et résultats PvP. Les valeurs ne constituent pas une preuve d’équilibre.

## 2. Règles communes proposées

### Référence de calcul

- Niveau 30 et équipement standardisé, comme dans le Codex existant. Puissance offensive PO = 1 000 ; puissance de soin PS = 1 000. P désigne PO pour les dégâts et PS pour soins/absorptions.
- Puissance brute par impact = base + coefficient × P. Total théorique = puissance par impact × nombre d’impacts/ticks. Les tableaux affichent **total PvE / total PvP**, par cible, avant armure, résistances, critique, soins reçus et absorption ; aucune valeur ne représente un DPS. Les colonnes « formule » utilisent la valeur par impact.
- Pour cette proposition, le facteur PvP s’applique à tous les dégâts, soins ou absorptions chiffrés du sort, y compris ses ticks. Il ne multiplie pas les pourcentages de contrôle ou de réduction. Exceptions et bonus sont explicités dans l’effet.
- Une préparation égale ou inférieure au GCD n’autorise pas deux actions : début suivant après max(1,25 s ; durée de préparation). Un sort préparé est interruptible et exige de rester à portée et en ligne de vue au départ et à la résolution. Une fenêtre de préparation n’accorde pas d’immunité.
- Les compétences instantanées offensives utilisent le GCD de 1,25 s. Seules Garde et les défenses explicitement marquées hors GCD en sont exemptées.
- Les projectiles peuvent être évités selon les règles de visée du prototype ; aucune traversée d’obstacle. Sans précision, les soins ciblés sélectionnent un allié, et les offensives une cible ennemie. Une portée 0 signifie personnel ou centré sur le lanceur ; le rayon figure dans le texte.
- Maximum 5 cibles pour les zones sauf plafond plus bas indiqué. Le plafond inclut le lanceur pour les soins de zone. Sélection : cibles légales les plus proches du centre au premier impact ; les impacts suivants ne renouvellent pas ce groupe pour augmenter le nombre de victimes.
- Pour la première implémentation, tous les dégâts chiffrés de ces nouvelles classes sont physiques et utilisent PO ; la résonance est une intention de présentation, pas une pénétration d’armure gratuite. Comparer séparément cibles à armure faible et forte ; la diversité des types de dégâts pourra être étudiée ensuite.
- Une recharge et le coût sont engagés au lancement réussi ; une action bloquée avant le lancement ne paie rien. Une interruption après début paie le coût et garde la recharge ; un soin ou tir raté ne génère rien. Les finisseurs qui perdent le seuil avant résolution échouent sans remboursement : aucune annulation gratuite pour chercher un critique.

### Ressources et bonus

- Toutes les ressources principales sont bornées à 0–100. Coût affiché = unités de la ressource principale de la classe. La génération conditionnelle figure dans la compétence ou la mécanique ; ne rien ajouter implicitement.
- Les tanks commencent à 20. Hors combat, retour progressif vers 20 : +5/s en dessous, −10/s au-dessus après 5 s. Entrer ou sortir du combat ne crée pas un nouveau crédit de 20. Les DPS et soigneurs commencent à 0 et perdent 10/s hors combat après 5 s, sans réserve négative.
- Les gains « sur touche » n’existent qu’à la résolution contre un ennemi légal ; ils ne sont jamais multipliés par nombre de cibles ou nombre de ticks, sauf mention. Le soin utile exclut le sursoin. Un HoT ne donne pas de ressource à chacun de ses ticks.
- Deux applications d’un même DoT/HoT du même lanceur sur la même cible se remplacent : pas de cumul, pas de tick immédiat supplémentaire, pas de prolongation exploitée. Le prochain tick suit le délai normal. Deux lanceurs peuvent chacun avoir leur propre effet.
- Les états personnels Joint, Passage, Repère, Reprise et Relais ne peuvent pas être consommés par un autre joueur. Pas de génération sur mannequins alliés, auto-dégâts ou soins/renvois copiés.
- Les effets périodiques mémorisent les bonus de dégâts du lanceur au moment de l’application ; un changement de posture ne les augmente pas rétroactivement. Les défenses et modificateurs du receveur s’évaluent à chaque tick.
- Sans mention explicite, un bonus ne s’applique pas aux dégâts périodiques, au ricochet, à une exécution ou aux effets copiés. Les bonus au même coup s’additionnent : Joint +15 % et Mesure +10 % = +25 %, jamais ×1,15×1,10. Aucun bonus de dégâts d’équipe nouveau.

### Garde, défense et dette

Garde reprend les règles du Codex : 50 % des dégâts post-mitigation éligibles de l’allié sont transférés tant que les deux sont vivants et à 9 m ; une seule assignation, pas soi-même. Changement instantané sans coût ni recharge, hors GCD. Assignation conservée à la mort et réactivée si les conditions reviennent. Un étourdissement ne coupe pas le transfert, mais empêche le changement de cible et les défenses actives.

Les dégâts transférés n’engendrent pas un nouveau transfert, ne produisent aucune ressource, ne déclenchent aucune contre-attaque et ne sont pas différés par le Porte-Faille. Ils suivent exactement la résolution de transfert du prototype existant ; ce dossier n’ajoute pas une seconde mitigation gratuite. Pour comparer les tanks, utiliser le même ordre de calcul pour les six.

Les protections de même famille ne se cumulent pas : seule la plus forte s’applique. Entre familles éligibles, conserver la règle du Codex : plus forte réduction + 25 % des autres, avec un plafond de réduction active proposé de 60 % avant armure/résistance. Ce plafond est une hypothèse de test pour les deux camps, à faire approuver avant de modifier les anciennes classes. Aucun bouclier semblable ne s’empile ; les soins ne rendent jamais de dette « négative ».

**Dette du Porte-Faille :** elle ne concerne que des dégâts directs reçus normalement après mitigation. La part différée est soustraite au dégât immédiat et ajoutée exactement à la dette. Chaque ajout est remboursé en quatre parts à +1/+2/+3/+4 s, même si de nouveaux ajouts arrivent ; ces échéances ne sont jamais repoussées. Plafond = 10 % des PV max, surplus immédiat. Les ticks ignorent mitigation, absorption et nouveau report, ne déclenchent pas de ressource ou de Reprise, et peuvent tuer. Les soins remontent seulement les PV, pas la dette ; les échéances surviennent pendant les contrôles. À la mort, le combat sur ce personnage se termine ; aucune dette convertie en soin ou bénéfice à la résurrection.

### Contrôles, dissipation et résurrection

- Stuns et immobilisations : rendements séparés 100 % → 50 % → 25 % → immunité 18 s, règle héritée à préciser dans le moteur. Une application immunisée ne prolonge pas le verrou. Ici, aucune compétence n’ajoute un stun.
- Une interruption bloque seulement la famille de l’action réellement interrompue pendant 1 s. Pas de silence général ; sans action interrompue, dégâts seuls. La table d’équilibrage doit ultérieurement préciser les familles communes aux 24 classes.
- Ralentissements ordinaires ≤40 % ; seul le plus fort s’applique, jamais la somme. Ils expirent à leur durée ou à la sortie de la zone indiquée.
- Bumps : après réussite, immunité commune 10 s aux projections ; les tentatives bloquées ne prolongent rien. Blocage frontal réussi annule le déplacement. Ancrage : distance −70 %. Préparation télégraphiée, esquivable, pas de stun d’arrivée. Arrêt sur obstacle sans dégât de collision ; chute seulement là où la carte l’autorise. Boss immunisés : dégâts seuls, sans interruption automatique.
- Les trois dissipations nouvelles ont la même liste d’éligibilité : un DoT ordinaire, ralentissement, marque ou affaiblissement explicitement dissipable. Retirer l’effet éligible le plus ancien pour éviter un choix invisible. Pas de suppression de Garde, dette, stun, immunité, verrou de résurrection ou posture. Ces catégories sont proposées pour les deux camps ; le moteur existant reste à confronter.
- Résurrection en combat : 3 s immobile, coût 50, CD personnel 180 s, portée 5 m, retour à 25 % PV. Proposition pour combler la limite de groupe encore inconnue dans le Codex : un succès par groupe de 5 toutes les 180 s, verrou partagé entre tous les soigneurs, anciens et nouveaux. Échecs sans activation du verrou collectif, mais coût/CD personnel si incantation commencée. À zéro Flux, Cohésion ou Éveil : pas de résurrection gratuite.
- Les tanks de ce dossier conservent tous Garde, provocation et bump. Les soigneurs conservent soin fondamental sans coût, dissipation et résurrection. Les DPS ont chacun une mobilité, une défense et une réponse de contrôle, avec une portée et des fenêtres réellement différentes.

## 3. Identités et comparaison de rôle

| Classe | Repère de comparaison | Différence centrale | Prix payé / réponse adverse |
|---|---|---|---|
| Porte-Faille | Rempart | Étaler une partie de ses dégâts personnels | Dette non effaçable, pression prolongée dangereuse |
| Enlaceur | Gardien des Racines | Contrôler une enceinte locale | Zones fixes, portée de protection courte |
| Brise-Courant | Sentinelle | Interception et protection dans son sillage | Orientation et regroupement nécessaires |
| Fendeur | Brise-Fer | Préparer un Joint personnel | Perte de préparation au changement de cible |
| Mue-Lame | Danse-lame | Choisir attaque ou repli par posture | GCD de transition, dégâts perdus en repli |
| Sillonneur | Duelliste | Traverser pour ouvrir sa frappe | Terrain et disponibilité de la traversée |
| Éclateur | Artilleur runique | Tir préparé, budget de ricochet partagé | Balise visible, tirs immobiles, pas de tourelle |
| Aiguilleur | Traqueur sylvestre | Déplacer son angle avant de percer | Cible avertie, ligne de vue et arrêt pour tirer |
| Lance-Rive | Arcaniste / Traqueur | Continuer à tirer avec le groupe | Portée 22–24 m, aucun gros bonus de dégâts |
| Lieur | Accordeur | Relier deux alliés pour un secours limité | Distance de lien, copie plafonnée, pas de chaîne |
| Éveilleur | Thaumaturge / Tisseur | Relancer après une vraie poussée hostile | Condition de Reprise, pas de bonus permanent |
| Passeur | Thaumaturge | Continuité de soin en déplacement | Portée 22 m, rassemblement pour soigner le groupe |

Ces correspondances servent à comparer des fonctions, pas à imposer des clones ni un duel gagnant prédéterminé. Les quatre rôles existent chez chaque peuple ; aucun peuple ne doit être indispensable pour former un groupe.

## 4. Les douze arsenaux

Puissance affichée = **total brut PvE / total brut PvP par cible**, sans bonus conditionnel sauf mention. « — » = utilitaire sans valeur de dégâts/soins. Une compétence à plusieurs impacts indique sa formule par impact et son nombre d’impacts. Les coûts sont dans la ressource de la classe ; CD 0 reste soumis au GCD.

### 1. Porte-Faille — Kharûn — Tank

**Ressource.** Tension 0–100 ; départ 20. Frappe de Jointure : +10 si elle touche. Absorption structurée : +5 au maximum toutes les 2 s, uniquement sur un coup ennemi direct reçu pendant Armature Ouverte ; aucun gain via Garde, auto-dégâts ou dégâts différés. Hors combat : −10/s après 5 s. Hors combat, retour progressif vers 20 : +5/s si inférieur, −10/s si supérieur après 5 s. Pas de gain instantané en quittant puis reprenant le combat.

**Mécanique propre.** Deux protections structurées peuvent différer une part des dégâts. Plafond de dette commun : 10 % des PV max. À saturation, le surplus est immédiat ; jamais annulé. Le tank choisit quand encaisser, sans transformer la dette en ressource gratuite.

**Boucle.** Frappe de Jointure → Armature Ouverte au bon moment → dépenser en répartition ou en contrôle → laisser la dette se résorber.

**Comment le contrer.** Maintenir une pression après la fenêtre défensive ; écarter le gardé au-delà de 9 m ; interrompre le placement. Les ticks de dette continuent pendant les contrôles et le KO.

**Repères existants.** Rempart : protection personnelle −45 % pendant 4 s, recharge 90 s ; Heurt du Bastion 8 m / 25 s.

**1. Garde — Protection**

Coût **0** · Recharge **0 s** · Portée **9 m** · Lancement : **Instantané**.

Une cible alliée, jamais soi-même : 50 % des dégâts éligibles transférés au tank. Changement instantané hors GCD ; applique intégralement les règles communes.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**2. Défi de la Faille — Provocation**

Coût **0** · Recharge **12 s** · Portée **15 m** · Lancement : **Instantané**.

PvE : provocation 3 s. PvP : dégâts de la cible réduits de 15 % contre les autres pendant 4 s. Ni silence ni obligation de ciblage en PvP. Non cumulable avec un autre défi.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**3. Frappe de Jointure — Dégâts directs**

Coût **0** · Recharge **0 s** · Portée **3 m** · Lancement : **Instantané**.

Frappe fondamentale ; +10 Tension si elle touche.

Formule par impact : 140 + 0,36 × P. Puissance de référence totale : **500 / 500** (PvE / PvP). Facteur PvP : 1.

**4. Armature Ouverte — Protection**

Coût **15** · Recharge **18 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

Pendant 4 s : −20 % de dégâts directs entrants. Puis 20 % du montant restant est différé sur 4 ticks à +1/+2/+3/+4 s, avec le plafond de dette commun. Les ticks de dette ne sont ni réduits ni différés de nouveau.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**5. Pas de Soutènement — Mobilité**

Coût **0** · Recharge **18 s** · Portée **12 m** · Lancement : **Instantané**.

Rejoint un allié sur 10 m maximum ; obstacles bloquants, ni immunité ni purge de contrôle. Aucun déplacement si immobilisé.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**6. Ouverture du Front — Contrôle — bump**

Coût **20** · Recharge **26 s** · Portée **3 m** · Lancement : **0,40 s, télégraphié**.

Une cible repoussée de 7 m à l’opposé du tank. Règles communes des projections ; ni stun final ni dégâts de collision.

Formule par impact : 100 + 0,2 × P. Puissance de référence totale : **300 / 300** (PvE / PvP). Facteur PvP : 1.

**7. Coin de Rupture — Dégâts directs / interruption**

Coût **10** · Recharge **18 s** · Portée **3 m** · Lancement : **Instantané**.

Interrompt une action interruptible et verrouille 1 s la famille interrompue. Sans incantation ennemie : dégâts seuls.

Formule par impact : 100 + 0,3 × P. Puissance de référence totale : **400 / 400** (PvE / PvP). Facteur PvP : 1.

**8. Répartition des Charges — Protection**

Coût **35** · Recharge **26 s** · Portée **8 m** · Lancement : **Instantané**.

Cône frontal 90°, 5 alliés au plus : −15 % de dégâts directs pendant 4 s. N’absorbe pas la dette du Porte-Faille et ne crée aucune nouvelle dette.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**9. Scellement des Appuis — Ancrage**

Coût **20** · Recharge **30 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

Pendant 5 s : distance des projections subies réduite de 70 %. Ne purge aucun contrôle, ne donne aucune immunité.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**10. Tenir les Fragments — Défense majeure**

Coût **60** · Recharge **90 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−40 % de dégâts directs pendant 4 s ; 20 % du montant restant peut être différé selon la même dette. Remplace Armature Ouverte au lieu de s’y ajouter. Aucune remise à zéro de dette.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

### 2. Enlaceur — Vaelith — Tank

**Ressource.** Étreinte 0–100 ; départ 20. Arc d’Enceinte : +10 sur touche. Une attaque ennemie directe parée dans Garde Entrelacée : +10, une fois par utilisation. Aucun gain automatique sur chaque cible immobilisée. Hors combat, retour progressif vers 20 : +5/s si inférieur, −10/s si supérieur après 5 s. Pas de gain instantané en quittant puis reprenant le combat.

**Mécanique propre.** Une enceinte locale et des contrôles courts gênent les passages. L’Enlaceur doit maintenir sa position ; il ne déplace jamais un joueur contre un obstacle invisible et ne bloque pas physiquement les alliés.

**Boucle.** Se placer → tracer une enceinte → forcer un choix de passage → garder sa ressource pour protéger ou repousser.

**Comment le contrer.** Sortir du rayon, combattre à distance et profiter de ses protections personnelles plus courtes ; ses zones ne suivent pas les ennemis.

**Repères existants.** Gardien des Racines : immobilisation 1,5 s / 20 s ; réduction alliée −18 % / 5 s / 28 s ; bump 6 m / 24 s.

**1. Garde — Protection**

Coût **0** · Recharge **0 s** · Portée **9 m** · Lancement : **Instantané**.

Une cible alliée, jamais soi-même : 50 % des dégâts éligibles transférés au tank. Changement instantané hors GCD ; applique intégralement les règles communes.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**2. Défi de l’Enceinte — Provocation**

Coût **0** · Recharge **12 s** · Portée **15 m** · Lancement : **Instantané**.

PvE : provocation 3 s. PvP : dégâts de la cible réduits de 15 % contre les autres pendant 4 s. Ni silence ni obligation de ciblage en PvP. Non cumulable avec un autre défi.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**3. Arc d’Enceinte — Dégâts directs**

Coût **0** · Recharge **0 s** · Portée **3 m** · Lancement : **Instantané**.

Une cible ; +10 Étreinte sur touche.

Formule par impact : 130 + 0,37 × P. Puissance de référence totale : **500 / 500** (PvE / PvP). Facteur PvP : 1.

**4. Garde Entrelacée — Protection**

Coût **15** · Recharge **18 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−25 % de dégâts directs pendant 4 s. Pendant les premières 0,5 s, une attaque frontale éligible peut être parée : mitigation normale du tank, sans bonus automatique de dégâts.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**5. Pas d’Enroulement — Mobilité**

Coût **0** · Recharge **16 s** · Portée **8 m** · Lancement : **Instantané**.

Déplacement dirigé de 6 m ; s’arrête aux obstacles, sans invulnérabilité. Impossible sous immobilisation.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**6. Revers de Liane — Contrôle — bump**

Coût **20** · Recharge **28 s** · Portée **4 m** · Lancement : **0,45 s, télégraphié**.

Une cible repoussée de 6 m à l’opposé du tank. Aucune attraction préparatoire. Règles communes des bumps.

Formule par impact : 100 + 0,2 × P. Puissance de référence totale : **300 / 300** (PvE / PvP). Facteur PvP : 1.

**7. Nœud de Passage — Immobilisation**

Coût **20** · Recharge **22 s** · Portée **10 m** · Lancement : **0,40 s**.

Une cible immobilisée 1,5 s en PvP, 2 s sur ennemis ordinaires PvE. Catégorie de rendements décroissants Immobilisation ; boss : dégâts seuls.

Formule par impact : 80 + 0,22 × P. Puissance de référence totale : **300 / 300** (PvE / PvP). Facteur PvP : 1.

**8. Enceinte Vivante — Zone / protection**

Coût **35** · Recharge **28 s** · Portée **0 m** · Lancement : **Instantané**.

Zone fixe de 5 m de rayon pendant 5 s. 5 alliés à l’intérieur : −15 % de dégâts directs. Ennemis à l’intérieur : ralentissement 20 %, disparu à la sortie. Une zone par lanceur, les zones identiques ne se cumulent pas.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**9. Prise Profonde — Ancrage**

Coût **20** · Recharge **32 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

Distance des projections réduite de 70 % pendant 5 s. Aucun enracinement de soi, aucune purge.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**10. Dernier Enlacement — Défense majeure**

Coût **60** · Recharge **90 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−40 % de dégâts directs pendant 4 s. L’Enlaceur inflige 20 % de dégâts en moins pendant cet effet. Ne renforce pas ses contrôles.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

### 3. Brise-Courant — Orynth — Tank

**Ressource.** Impulsion 0–100 ; départ 20. Taille de Proue : +10 sur touche. Déviation : +10 une fois si une attaque ennemie est reçue pendant ses 0,5 premières secondes. Marcher ou tourner en boucle ne génère rien. Hors combat, retour progressif vers 20 : +5/s si inférieur, −10/s si supérieur après 5 s. Pas de gain instantané en quittant puis reprenant le combat.

**Mécanique propre.** Le tank protège en changeant de position et en interceptant les trajectoires. Ses déplacements ne déplacent jamais l’allié gardé. Les effets directionnels exigent une orientation réellement contrôlée.

**Boucle.** Se placer entre allié et menace → dévier → rejoindre le bon allié → réorienter le front.

**Comment le contrer.** Attaquer par plusieurs directions, l’immobiliser avant l’interception ou se décaler hors du cône ; sa défense ne couvre pas toute l’équipe à distance.

**Repères existants.** Sentinelle : bond 12 m / 18 s ; protection alliée −18 % / 5 s / 28 s ; bump de cône 5 m / 30 s.

**1. Garde — Protection**

Coût **0** · Recharge **0 s** · Portée **9 m** · Lancement : **Instantané**.

Une cible alliée, jamais soi-même : 50 % des dégâts éligibles transférés au tank. Changement instantané hors GCD ; applique intégralement les règles communes.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**2. Défi de la Proue — Provocation**

Coût **0** · Recharge **12 s** · Portée **15 m** · Lancement : **Instantané**.

PvE : provocation 3 s. PvP : dégâts de la cible réduits de 15 % contre les autres pendant 4 s. Ni silence ni obligation de ciblage en PvP. Non cumulable avec un autre défi.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**3. Taille de Proue — Dégâts directs**

Coût **0** · Recharge **0 s** · Portée **3 m** · Lancement : **Instantané**.

Une cible ; +10 Impulsion sur touche.

Formule par impact : 150 + 0,35 × P. Puissance de référence totale : **500 / 500** (PvE / PvP). Facteur PvP : 1.

**4. Déviation — Protection**

Coût **15** · Recharge **18 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−25 % de dégâts directs pendant 4 s. Aucun renvoi de projectile ni annulation d’attaque à distance.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**5. Couper la Trajectoire — Mobilité**

Coût **0** · Recharge **18 s** · Portée **12 m** · Lancement : **Instantané**.

Rejoint un allié sur 12 m maximum ; arrêt aux obstacles. Ni immunité, ni purge ; impossible si immobilisé.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**6. Ressac de Proue — Contrôle — bump**

Coût **25** · Recharge **30 s** · Portée **3 m** · Lancement : **0,50 s, télégraphié**.

Cône frontal 90°, 3 ennemis les plus proches repoussés de 5 m. Les immunités ne reportent pas la projection sur une autre cible. Règles communes.

Formule par impact : 100 + 0,2 × P. Puissance de référence totale : **300 / 300** (PvE / PvP). Facteur PvP : 1.

**7. Brisure d’Élan — Dégâts directs / interruption**

Coût **10** · Recharge **18 s** · Portée **3 m** · Lancement : **Instantané**.

Interruption d’une action interruptible, verrou de famille 1 s. N’interdit pas les déplacements ou attaques ordinaires.

Formule par impact : 110 + 0,29 × P. Puissance de référence totale : **400 / 400** (PvE / PvP). Facteur PvP : 1.

**8. Sillage Abrité — Protection**

Coût **35** · Recharge **28 s** · Portée **0 m** · Lancement : **Instantané**.

Pendant 4 s : jusqu’à 5 alliés dans un cône arrière de 90°, rayon 6 m, reçoivent −18 % de dégâts directs. Effet uniquement tant qu’ils restent dans le cône, contrôle de position continu.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**9. Contrepoids — Ancrage**

Coût **20** · Recharge **30 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

Réduit la distance des projections de 70 % pendant 5 s. Ni vitesse supplémentaire ni immunité aux immobilisations.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**10. Proue Inflexible — Défense majeure**

Coût **60** · Recharge **90 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−40 % de dégâts directs pendant 4 s. Aucun effet de groupe supplémentaire ; Garde continue selon ses conditions ordinaires.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

### 4. Fendeur — Kharûn — DPS corps à corps

**Ressource.** Pression 0–100 ; départ 0. Frappe de Taille : +10 ; Repérage du Joint : +15 s’il touche. Les charges de Joint sont distinctes et non échangeables contre de la Pression.

**Mécanique propre.** Joint : marque personnelle sur une seule cible, 0–3 charges, durée rafraîchie à 8 s par Frappe de Taille et Repérage du Joint. Changer de cible efface l’ancien Joint. Chaque charge ajoute 5 % aux seuls Effondrement et Ultime Fissure, puis ces coups consomment les charges. Aucun affaiblissement d’armure partagé.

**Boucle.** Construire le Joint → préparer son placement → engager un coup lourd → reconstruire ; réserve défensive ou offensive à arbitrer.

**Comment le contrer.** Changer d’angle, interrompre le coup lourd et sortir de portée ; les changements de cible lui coûtent sa préparation.

**Repères existants.** Brise-Fer : fondamentale 840 ; Coup de Rupture jusqu’à 2 480 avec 5 Fracture ; gros coup préparé 1 790.

**1. Frappe de Taille — Dégâts directs**

Coût **0** · Recharge **0 s** · Portée **3 m** · Lancement : **Instantané**.

+10 Pression et +1 Joint si touche. Une seule cible.

Formule par impact : 180 + 0,64 × P. Puissance de référence totale : **820 / 820** (PvE / PvP). Facteur PvP : 1.

**2. Repérage du Joint — Dégâts directs / préparation**

Coût **0** · Recharge **12 s** · Portée **3 m** · Lancement : **Instantané**.

+15 Pression ; +1 Joint sur touche. Aucun malus d’armure global.

Formule par impact : 130 + 0,4 × P. Puissance de référence totale : **530 / 530** (PvE / PvP). Facteur PvP : 1.

**3. Effondrement — Dégâts directs**

Coût **30** · Recharge **12 s** · Portée **3 m** · Lancement : **0,90 s, immobile**.

Consomme 0–3 Joint pour +0/5/10/15 % dégâts personnels sur ce coup. Fenêtre interruptible. Sur esquive/parade : coût dépensé, Joint conservé.

Formule par impact : 300 + 1,15 × P. Puissance de référence totale : **1 450 / 1 160** (PvE / PvP). Facteur PvP : 0,8.

**4. Pas de Coin — Mobilité**

Coût **15** · Recharge **18 s** · Portée **8 m** · Lancement : **Instantané**.

Approche rectiligne de 8 m vers une cible visible ; aucun dégât, stun ou invulnérabilité. Obstacles bloquants.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**5. Entrave de Taille — Dégâts directs / ralentissement**

Coût **15** · Recharge **20 s** · Portée **3 m** · Lancement : **Instantané**.

Ralentit de 35 % pendant 3 s ; ni étourdissement ni immobilisation.

Formule par impact : 100 + 0,3 × P. Puissance de référence totale : **400 / 400** (PvE / PvP). Facteur PvP : 1.

**6. Fissure Persistante — Dégâts sur la durée**

Coût **15** · Recharge **12 s** · Portée **3 m** · Lancement : **Instantané**.

3 ticks à +2/+4/+6 s ; effet physique dissipable selon catégorie, pas de cumul par lanceur. Rafraîchir remplace les ticks restants.

Formule par impact : 80 + 0,24 × P ; 3 impacts/ticks. Puissance de référence totale : **960 / 864** (PvE / PvP). Facteur PvP : 0,9.

**7. Fermer les Appuis — Protection personnelle**

Coût **20** · Recharge **30 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−20 % de dégâts directs pendant 4 s ; propres dégâts réduits de 15 % pendant cet effet.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**8. Taille d’Éboulis — Dégâts de zone**

Coût **25** · Recharge **20 s** · Portée **4 m** · Lancement : **0,65 s**.

Cône 90°, 5 cibles au plus. Ne crée pas de Joint et ne consomme pas les charges.

Formule par impact : 140 + 0,46 × P. Puissance de référence totale : **600 / 480** (PvE / PvP). Facteur PvP : 0,8.

**9. Mesure de Rupture — Amélioration personnelle**

Coût **20** · Recharge **45 s** · Portée **0 m** · Lancement : **Instantané**.

Le prochain Effondrement sous 6 s gagne +10 % de dégâts ; aucun effet sur l’exécution ni sur les ticks. Remplacé s’il est relancé, non cumulable.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**10. Ultime Fissure — Exécution**

Coût **35** · Recharge **25 s** · Portée **3 m** · Lancement : **0,70 s**.

Utilisable uniquement sur cible à moins de 30 % PV au départ et à la résolution. Consomme Joint pour +5 % par charge, maximum +15 % ; aucune remise à zéro au kill.

Formule par impact : 320 + 1,1 × P. Puissance de référence totale : **1 420 / 1 136** (PvE / PvP). Facteur PvP : 0,8.

### 5. Mue-Lame — Vaelith — DPS corps à corps

**Ressource.** Souplesse 0–100 ; départ 0. Taille Souple : +10 sur touche ; Revers d’Appui : +15 sur touche. Pas de ressource obtenue par changement de posture.

**Mécanique propre.** Deux postures : Ouverte (aucun bonus, permet le finisseur offensif) et Repliée (−10 % dégâts directs reçus, −10 % dégâts infligés). Un bouton dédié de mécanique de classe, séparé des dix compétences, change la posture : GCD normal, verrou 4 s, sans gain de ressource. État affiché ; un seul effet actif. Commence en Ouverte.

**Boucle.** Construire en posture choisie → passer en Ouverte pour engager → revenir en Repliée lorsque la pression monte.

**Comment le contrer.** Forcer la défensive avant son finisseur ; ses changements consomment un GCD et il ne dispose pas d’une invulnérabilité de mobilité.

**Repères existants.** Danse-lame : fondamentale 770 ; finition 1 490 (+15 % conditionnel) ; Pas de Feuille 12 s.

**1. Taille Souple — Dégâts directs**

Coût **0** · Recharge **0 s** · Portée **3 m** · Lancement : **Instantané**.

Une cible : +10 Souplesse sur touche. La posture se règle via son bouton de mécanique de classe, jamais en frappant une cible vide.

Formule par impact : 170 + 0,63 × P. Puissance de référence totale : **800 / 800** (PvE / PvP). Facteur PvP : 1.

**2. Revers d’Appui — Dégâts directs**

Coût **0** · Recharge **10 s** · Portée **3 m** · Lancement : **Instantané**.

+15 Souplesse sur touche. Pas de bonus de dégâts caché selon la posture.

Formule par impact : 160 + 0,54 × P. Puissance de référence totale : **700 / 700** (PvE / PvP). Facteur PvP : 1.

**3. Lame Déployée — Dégâts directs**

Coût **30** · Recharge **14 s** · Portée **3 m** · Lancement : **0,50 s**.

Uniquement en posture Ouverte. Aucun bonus d’ouverture supplémentaire.

Formule par impact : 290 + 1,2 × P. Puissance de référence totale : **1 490 / 1 192** (PvE / PvP). Facteur PvP : 0,8.

**4. Pas de Mue — Mobilité**

Coût **15** · Recharge **14 s** · Portée **0 m** · Lancement : **Instantané**.

Déplacement dirigé de 5 m ; sans invulnérabilité ni purge. Interdit sous immobilisation.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**5. Crochet de Garde — Dégâts directs / ralentissement**

Coût **15** · Recharge **20 s** · Portée **3 m** · Lancement : **Instantané**.

Ralentissement 30 % pendant 3 s. Aucun désarmement ou réduction de parade supplémentaire.

Formule par impact : 100 + 0,3 × P. Puissance de référence totale : **400 / 400** (PvE / PvP). Facteur PvP : 1.

**6. Suture Tranchante — Dégâts sur la durée**

Coût **15** · Recharge **12 s** · Portée **3 m** · Lancement : **Instantané**.

3 ticks à +2/+4/+6 s ; pas de cumul par lanceur. Coefficient figé à l’application, aucun recalcul avantageux via posture.

Formule par impact : 80 + 0,23 × P ; 3 impacts/ticks. Puissance de référence totale : **930 / 837** (PvE / PvP). Facteur PvP : 0,9.

**7. Repli Mesuré — Protection personnelle**

Coût **20** · Recharge **30 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

Pendant 3 s : −20 % de dégâts directs. Remplace le −10 % de la posture Repliée ; ne s’y ajoute pas. Ne change pas la posture.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**8. Croissant Changeant — Dégâts de zone**

Coût **25** · Recharge **20 s** · Portée **4 m** · Lancement : **1 s, deux impacts**.

2 impacts espacés de 0,5 s, cône 90°, maximum 5 cibles. Une esquive évite les impacts encore non résolus.

Formule par impact : 120 + 0,38 × P ; 2 impacts/ticks. Puissance de référence totale : **1 000 / 800** (PvE / PvP). Facteur PvP : 0,8.

**9. Lecture du Mouvement — Amélioration personnelle**

Coût **20** · Recharge **45 s** · Portée **0 m** · Lancement : **Instantané**.

Pendant 6 s : un seul changement de posture ne consomme pas de GCD, mais garde le verrou de 4 s. Aucun bonus de dégâts ou esquive passive.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**10. Dernière Mue — Exécution**

Coût **35** · Recharge **25 s** · Portée **3 m** · Lancement : **0,60 s**.

Posture Ouverte ; cible à moins de 30 % PV au départ et à la résolution. Aucun reset au kill.

Formule par impact : 310 + 1,25 × P. Puissance de référence totale : **1 560 / 1 248** (PvE / PvP). Facteur PvP : 0,8.

### 6. Sillonneur — Orynth — DPS corps à corps

**Ressource.** Élan 0–100 ; départ 0. Taille de Sillage : +10 sur touche ; Traversée Offensive : +10 au total si au moins une cible touchée. Aucun gain par distance parcourue seule.

**Mécanique propre.** Passage : après une Traversée Offensive ayant touché, une fenêtre de 4 s donne +10 % à la seule prochaine Coupe de Rive. Un seul Passage, consommé à la résolution ; ni cumul par ennemi ni bonus d’équipe.

**Boucle.** Construire → traverser une ligne → choisir où s’arrêter → placer Coupe de Rive → préparer sa prochaine entrée.

**Comment le contrer.** Le contraindre dans les espaces étroits ; couper sa trajectoire et exploiter l’absence de mobilité pendant sa recharge.

**Repères existants.** Duelliste : fondamentale 830 ; Riposte Magistrale 1 620 ; approche 8 m / 14 s.

**1. Taille de Sillage — Dégâts directs**

Coût **0** · Recharge **0 s** · Portée **3 m** · Lancement : **Instantané**.

Une cible ; +10 Élan sur touche.

Formule par impact : 180 + 0,63 × P. Puissance de référence totale : **810 / 810** (PvE / PvP). Facteur PvP : 1.

**2. Traversée Offensive — Dégâts / mobilité**

Coût **10** · Recharge **16 s** · Portée **8 m** · Lancement : **0,35 s, télégraphié**.

Déplacement de 8 m maximum sur ligne ; 3 ennemis au plus, un impact par ennemi. +10 Élan total et Passage si touche. Obstacles bloquants ; pas d’invulnérabilité.

Formule par impact : 140 + 0,36 × P. Puissance de référence totale : **500 / 400** (PvE / PvP). Facteur PvP : 0,8.

**3. Coupe de Rive — Dégâts directs**

Coût **30** · Recharge **14 s** · Portée **3 m** · Lancement : **0,60 s**.

+10 % si Passage disponible, consommé après résolution, même sur attaque évitée. Sans Passage, dégâts de base.

Formule par impact : 290 + 1,15 × P. Puissance de référence totale : **1 440 / 1 152** (PvE / PvP). Facteur PvP : 0,8.

**4. Pas Latéral — Mobilité**

Coût **15** · Recharge **20 s** · Portée **0 m** · Lancement : **Instantané**.

Déplacement dirigé de 4 m ; aucune invulnérabilité ni purge ; immobilisation bloque le déplacement.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**5. Accroche du Sillage — Dégâts directs / ralentissement**

Coût **15** · Recharge **20 s** · Portée **3 m** · Lancement : **Instantané**.

Ralentit de 30 % pendant 3 s, sans immobiliser.

Formule par impact : 110 + 0,29 × P. Puissance de référence totale : **400 / 400** (PvE / PvP). Facteur PvP : 1.

**6. Entaille Continue — Dégâts sur la durée**

Coût **15** · Recharge **12 s** · Portée **3 m** · Lancement : **Instantané**.

3 ticks à +2/+4/+6 s ; pas de cumul par lanceur ; dissipation physique si disponible.

Formule par impact : 80 + 0,25 × P ; 3 impacts/ticks. Puissance de référence totale : **990 / 891** (PvE / PvP). Facteur PvP : 0,9.

**7. Profil Bas — Protection personnelle**

Coût **20** · Recharge **30 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−20 % de dégâts directs pendant 4 s. N’offre pas de vitesse ou d’esquive supplémentaire.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**8. Large Sillon — Dégâts de zone**

Coût **25** · Recharge **20 s** · Portée **4 m** · Lancement : **0,70 s**.

Cône 120°, maximum 5 cibles. Aucun déplacement et aucun gain de Passage.

Formule par impact : 140 + 0,46 × P. Puissance de référence totale : **600 / 480** (PvE / PvP). Facteur PvP : 0,8.

**9. Tenir la Ligne — Amélioration personnelle**

Coût **20** · Recharge **45 s** · Portée **0 m** · Lancement : **Instantané**.

Pendant 6 s : le prochain Passage dure 6 s au lieu de 4 s et donne +15 % au lieu de +10 %. Une seule Coupe de Rive ; aucun cumul avec Passage ordinaire.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**10. Dernier Passage — Exécution**

Coût **35** · Recharge **25 s** · Portée **3 m** · Lancement : **0,60 s**.

Cible à moins de 30 % PV au départ et à la résolution. Ne bénéficie pas de Passage ; aucune charge offerte au kill.

Formule par impact : 320 + 1,23 × P. Puissance de référence totale : **1 550 / 1 240** (PvE / PvP). Facteur PvP : 0,8.

### 7. Éclateur — Kharûn — DPS distance

**Ressource.** Tension de Tir 0–100 ; départ 0. Éclat Lancé : +10 sur touche. Mise sous Tension : +15, uniquement en combat ; recharge 14 s. Pas de gain par cible de zone.

**Mécanique propre.** Une Balise de Faille personnelle dure 6 s. Elle ne révèle pas les ennemis : le prochain Trait de Fracture peut ricocher depuis sa cible sur un second ennemi proche, à 40 % des dégâts. Le ricochet partage le budget total du tir ; la cible principale ne reçoit que 80 % dans ce cas.

**Boucle.** Tirer pour charger → placer une balise visible → anticiper les regroupements → choisir tir principal plein ou ricochet partagé.

**Comment le contrer.** Disperser les cibles, sortir de ligne de vue, interrompre les tirs préparés et engager au corps à corps ; une balise ne frappe jamais seule.

**Repères existants.** Artilleur runique : tir fondamental 810 ; Trait Perforant 1 360 ; Décharge Runique 1 730, recharge 24 s.

**1. Éclat Lancé — Dégâts directs**

Coût **0** · Recharge **0 s** · Portée **26 m** · Lancement : **0,80 s**.

Projectile visible ; +10 Tension de Tir sur touche. Déplacement réduit à 50 % pendant la préparation ; interruptible.

Formule par impact : 160 + 0,65 × P. Puissance de référence totale : **810 / 810** (PvE / PvP). Facteur PvP : 1.

**2. Mise sous Tension — Préparation**

Coût **0** · Recharge **14 s** · Portée **0 m** · Lancement : **Instantané**.

+15 Tension de Tir uniquement en combat. N’améliore aucun dégât directement et ne réinitialise aucune recharge.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**3. Trait de Fracture — Dégâts directs**

Coût **30** · Recharge **16 s** · Portée **28 m** · Lancement : **1 s, immobile**.

Sans balise : plein dégât sur une cible. Avec balise disponible et second ennemi à 4 m : 80 % principal + 40 % second, consommation de la balise ; sinon plein dégât et balise consommée.

Formule par impact : 300 + 1,15 × P. Puissance de référence totale : **1 450 / 1 160** (PvE / PvP). Facteur PvP : 0,8.

**4. Recul de Carrière — Mobilité**

Coût **15** · Recharge **18 s** · Portée **0 m** · Lancement : **Instantané**.

Recul dirigé de 5 m sans dégâts ; obstacles bloquent. Ni invulnérabilité ni projection ennemie.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**5. Balise de Faille — Préparation de zone**

Coût **10** · Recharge **18 s** · Portée **24 m** · Lancement : **0,40 s**.

Place un repère visible au sol, rayon 4 m, durée 6 s. Pour le ricochet, la cible principale doit être dans le repère. Un repère actif ; aucun contrôle.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**6. Poussière Incisive — Dégâts sur la durée**

Coût **15** · Recharge **14 s** · Portée **25 m** · Lancement : **0,50 s**.

Une cible, 3 ticks à +2/+4/+6 s ; effet dissipable, pas de cumul par lanceur.

Formule par impact : 80 + 0,24 × P ; 3 impacts/ticks. Puissance de référence totale : **960 / 864** (PvE / PvP). Facteur PvP : 0,9.

**7. Pare-Éclats — Protection personnelle**

Coût **20** · Recharge **30 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−20 % de dégâts directs pendant 4 s ; n’absorbe pas les contrôles et ne réfléchit pas les tirs.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**8. Éboulis Projeté — Dégâts de zone**

Coût **30** · Recharge **22 s** · Portée **25 m** · Lancement : **1,20 s, immobile**.

Zone fixe annoncée, rayon 4 m ; 2 impacts espacés de 0,6 s, 5 cibles au plus. Aucun ralentissement.

Formule par impact : 140 + 0,43 × P ; 2 impacts/ticks. Puissance de référence totale : **1 140 / 912** (PvE / PvP). Facteur PvP : 0,8.

**9. Éclat d’Arrêt — Dégâts directs / interruption**

Coût **20** · Recharge **22 s** · Portée **20 m** · Lancement : **0,35 s**.

Interrompt une action interruptible et verrouille sa famille 1 s. Projectile visible et ligne de vue requise.

Formule par impact : 90 + 0,26 × P. Puissance de référence totale : **350 / 350** (PvE / PvP). Facteur PvP : 1.

**10. Noyau Brisé — Exécution**

Coût **35** · Recharge **26 s** · Portée **26 m** · Lancement : **1 s, immobile**.

Cible à moins de 30 % PV au départ et à la résolution ; aucun ricochet, aucun bonus de balise.

Formule par impact : 320 + 1,25 × P. Puissance de référence totale : **1 570 / 1 256** (PvE / PvP). Facteur PvP : 0,8.

### 8. Aiguilleur — Vaelith — DPS distance

**Ressource.** Précision 0–100 ; départ 0. Aiguille Droite : +10 sur touche. Repère d’Angle : +10 sur touche.

**Mécanique propre.** Un Repère d’Angle marque personnellement une cible pendant 6 s. Si le tireur se déplace ensuite de 3 m depuis sa position d’application, Perce-Intervalle gagne +10 %, une fois. Le test porte sur le déplacement net, pas sur des tours sur place ; la cible et le tireur voient le repère. Aucun bonus de dos imposé.

**Boucle.** Marquer → changer réellement d’angle → exposer sa fenêtre de tir → exploiter → se replacer.

**Comment le contrer.** Le forcer à quitter son angle, casser la ligne de vue ou avancer pour supprimer sa fenêtre de tir préparé ; pas de tir à travers les obstacles.

**Repères existants.** Traqueur sylvestre : fondamentale 810 ; Flèche de Percée 1 570 et +10 % sur marque ; exécution 1 630.

**1. Aiguille Droite — Dégâts directs**

Coût **0** · Recharge **0 s** · Portée **28 m** · Lancement : **0,65 s**.

Projectile visible, préparation mobile à 70 % de vitesse ; +10 Précision sur touche. Interruptible.

Formule par impact : 160 + 0,64 × P. Puissance de référence totale : **800 / 800** (PvE / PvP). Facteur PvP : 1.

**2. Repère d’Angle — Dégâts directs / préparation**

Coût **0** · Recharge **14 s** · Portée **28 m** · Lancement : **Instantané**.

+10 Précision sur touche ; pose le repère personnel 6 s. Une seule cible marquée ; changer remplace le précédent.

Formule par impact : 100 + 0,25 × P. Puissance de référence totale : **350 / 350** (PvE / PvP). Facteur PvP : 1.

**3. Perce-Intervalle — Dégâts directs**

Coût **30** · Recharge **16 s** · Portée **30 m** · Lancement : **0,90 s, immobile**.

+10 % après déplacement net de 3 m depuis Repère d’Angle ; consomme le repère à la résolution, même sur esquive.

Formule par impact : 290 + 1,15 × P. Puissance de référence totale : **1 440 / 1 152** (PvE / PvP). Facteur PvP : 0,8.

**4. Décalage — Mobilité**

Coût **15** · Recharge **16 s** · Portée **0 m** · Lancement : **Instantané**.

Déplacement latéral dirigé de 5 m. Pas de purge ni d’invulnérabilité ; peut remplir le déplacement du repère.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**5. Aiguille d’Entrave — Dégâts directs / ralentissement**

Coût **15** · Recharge **20 s** · Portée **24 m** · Lancement : **Instantané**.

Ralentit de 35 % pendant 3 s ; pas d’immobilisation.

Formule par impact : 100 + 0,3 × P. Puissance de référence totale : **400 / 400** (PvE / PvP). Facteur PvP : 1.

**6. Fil Incisif — Dégâts sur la durée**

Coût **15** · Recharge **14 s** · Portée **26 m** · Lancement : **0,40 s**.

3 ticks à +2/+4/+6 s ; une cible ; pas de cumul par lanceur, dissipation possible.

Formule par impact : 80 + 0,23 × P ; 3 impacts/ticks. Puissance de référence totale : **930 / 837** (PvE / PvP). Facteur PvP : 0,9.

**7. Garde de Profil — Protection personnelle**

Coût **20** · Recharge **30 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−20 % de dégâts directs pendant 4 s ; ne supprime pas les marques ou dégâts périodiques.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**8. Éventail d’Aiguilles — Dégâts de zone**

Coût **25** · Recharge **22 s** · Portée **18 m** · Lancement : **0,90 s**.

Cône 45°, maximum 5 cibles ; 2 salves à 0 et 0,45 s après la préparation ; sans repère ou bonus d’angle.

Formule par impact : 120 + 0,4 × P ; 2 impacts/ticks. Puissance de référence totale : **1 040 / 832** (PvE / PvP). Facteur PvP : 0,8.

**9. Aiguille de Silence — Dégâts directs / interruption**

Coût **20** · Recharge **22 s** · Portée **22 m** · Lancement : **0,30 s**.

Interrompt une action interruptible et verrouille sa famille 1 s. Ce nom ne désigne pas un silence général.

Formule par impact : 80 + 0,27 × P. Puissance de référence totale : **350 / 350** (PvE / PvP). Facteur PvP : 1.

**10. Point Final — Exécution**

Coût **35** · Recharge **26 s** · Portée **28 m** · Lancement : **0,90 s, immobile**.

Cible à moins de 30 % PV au départ et à la résolution ; aucun bonus de repère.

Formule par impact : 320 + 1,25 × P. Puissance de référence totale : **1 570 / 1 256** (PvE / PvP). Facteur PvP : 0,8.

### 9. Lance-Rive — Orynth — DPS distance

**Ressource.** Rythme 0–100 ; départ 0. Jet de Rive : +10 sur touche ; Javelot de Cadence : +15 sur touche. Le rappel de javelot n’accorde aucune ressource supplémentaire.

**Mécanique propre.** Cadence : Javelot de Cadence prépare 4 s le prochain Jet Appuyé, qui peut être préparé en marchant à 70 % de vitesse. Aucun bonus de dégâts ; le confort mobile est payé par une portée plus courte que les autres tireurs.

**Boucle.** Construire → préparer Cadence → accompagner le groupe → engager à moyenne portée → réserver son recul.

**Comment le contrer.** Profiter de sa portée de 22–24 m, le ralentir puis l’engager ; ses javelots restent évitables et sa préparation reste interruptible.

**Repères existants.** Traqueur sylvestre et Arcaniste : fondamentales 810–820 à 26–28 m ; gros tirs 1 570–1 740.

**1. Jet de Rive — Dégâts directs**

Coût **0** · Recharge **0 s** · Portée **22 m** · Lancement : **0,65 s**.

Préparation en mouvement à 70 % de vitesse ; projectile visible. +10 Rythme sur touche, interruptible.

Formule par impact : 170 + 0,64 × P. Puissance de référence totale : **810 / 810** (PvE / PvP). Facteur PvP : 1.

**2. Javelot de Cadence — Dégâts directs / préparation**

Coût **0** · Recharge **12 s** · Portée **22 m** · Lancement : **Instantané**.

+15 Rythme sur touche ; prépare le prochain Jet Appuyé en mouvement pendant 4 s. Un seul effet, consommé au début de la préparation.

Formule par impact : 140 + 0,36 × P. Puissance de référence totale : **500 / 500** (PvE / PvP). Facteur PvP : 1.

**3. Jet Appuyé — Dégâts directs**

Coût **30** · Recharge **16 s** · Portée **24 m** · Lancement : **0,90 s**.

Immobile par défaut ; mobile à 70 % avec Cadence. Dégâts identiques dans les deux cas. Aucun bonus de portée.

Formule par impact : 290 + 1,2 × P. Puissance de référence totale : **1 490 / 1 192** (PvE / PvP). Facteur PvP : 0,8.

**4. Retrait de Rive — Mobilité**

Coût **15** · Recharge **16 s** · Portée **0 m** · Lancement : **Instantané**.

Recul dirigé de 5 m, sans dégâts ni projection ; obstacles bloquants. Immobilisation bloque l’action.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**5. Javelot d’Amarre — Dégâts directs / ralentissement**

Coût **15** · Recharge **20 s** · Portée **22 m** · Lancement : **0,35 s**.

Ralentissement 35 % pendant 3 s ; ni attraction ni immobilisation.

Formule par impact : 100 + 0,3 × P. Puissance de référence totale : **400 / 400** (PvE / PvP). Facteur PvP : 1.

**6. Pointe Persistante — Dégâts sur la durée**

Coût **15** · Recharge **14 s** · Portée **22 m** · Lancement : **Instantané**.

3 ticks à +2/+4/+6 s ; pas de cumul par lanceur, dissipable.

Formule par impact : 80 + 0,24 × P ; 3 impacts/ticks. Puissance de référence totale : **960 / 864** (PvE / PvP). Facteur PvP : 0,9.

**7. Abri de Voyage — Protection personnelle**

Coût **20** · Recharge **30 s** · Portée **0 m** · Lancement : **Instantané, hors GCD**.

−20 % de dégâts directs pendant 4 s ; aucune protection passive permanente du groupe.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**8. Gerbe de Rive — Dégâts de zone**

Coût **25** · Recharge **22 s** · Portée **18 m** · Lancement : **1 s**.

Cône 60°, 5 cibles maximum ; 2 impacts espacés de 0,5 s. Se tourner entre les impacts ne permet pas de dépasser le plafond.

Formule par impact : 130 + 0,45 × P ; 2 impacts/ticks. Puissance de référence totale : **1 160 / 928** (PvE / PvP). Facteur PvP : 0,8.

**9. Trait de Coupure — Dégâts directs / interruption**

Coût **20** · Recharge **22 s** · Portée **20 m** · Lancement : **0,35 s**.

Interruption d’une action interruptible, verrou de famille 1 s. Ligne de vue et projectile.

Formule par impact : 90 + 0,26 × P. Puissance de référence totale : **350 / 350** (PvE / PvP). Facteur PvP : 1.

**10. Dernier Javelot — Exécution**

Coût **35** · Recharge **26 s** · Portée **24 m** · Lancement : **0,90 s, immobile**.

Cible à moins de 30 % PV au départ et à la résolution. Ne bénéficie pas de Cadence ; aucun reset sur kill.

Formule par impact : 320 + 1,25 × P. Puissance de référence totale : **1 570 / 1 256** (PvE / PvP). Facteur PvP : 0,8.

### 10. Lieur — Kharûn — Soigneur

**Ressource.** Cohésion 0–100 ; départ 0. Point de Suture : +8 sur soin utile ; Fil Continu : +6 une seule fois à l’application si la cible a un déficit de PV ; Éclat de Maintien : +5 sur touche. Pas de gain sur bouclier posé ou sur sursoin.

**Mécanique propre.** Deux alliés peuvent être reliés par Attaches de Secours, une paire par Lieur. Le prochain Point de Suture sur l’un copie vers l’autre 25 % du soin effectif initial, plafonné à 250 en PvE ou 225 en PvP avant les modificateurs propres au second receveur. Le facteur PvP du soin initial n’est pas appliqué une seconde fois. Une charge seulement, sans rebond secondaire ni ressource. Aucun transfert de dégâts.

**Boucle.** Créer de la Cohésion par soins utiles → relier les alliés réellement menacés → stabiliser → conserver un budget pour dissiper ou sauver.

**Comment le contrer.** Séparer les alliés reliés au-delà de 10 m, forcer des changements de cible et interrompre ses soins préparés. Aucun lien ne partage Garde, contrôle ou résurrection.

**Repères existants.** Accordeur : soin fondamental 1 090 ; bouclier 870 ; soin de groupe 710 par cible ; grande intervention 1 750 / 75 s.

**1. Point de Suture — Soin direct**

Coût **0** · Recharge **0 s** · Portée **25 m** · Lancement : **1,25 s, immobile**.

+8 Cohésion si soin utile. Peut consommer une Attache de Secours. Aucun déclenchement par les soins copiés.

Formule par impact : 230 + 0,82 × P. Puissance de référence totale : **1 050 / 945** (PvE / PvP). Facteur PvP : 0,9.

**2. Fil Continu — Soin sur la durée**

Coût **0** · Recharge **8 s** · Portée **25 m** · Lancement : **Instantané**.

3 ticks à +2/+4/+6 s ; +6 Cohésion à l’application si cible blessée. Aucun gain par tick ; pas de cumul par lanceur.

Formule par impact : 100 + 0,28 × P ; 3 impacts/ticks. Puissance de référence totale : **1 140 / 1 026** (PvE / PvP). Facteur PvP : 0,9.

**3. Serrage Protecteur — Absorption**

Coût **20** · Recharge **16 s** · Portée **25 m** · Lancement : **Instantané**.

Bouclier 6 s ; non cumulable avec autre bouclier de même famille, seul le plus élevé reste. Aucun gain de ressource à l’absorption.

Formule par impact : 200 + 0,6 × P. Puissance de référence totale : **800 / 720** (PvE / PvP). Facteur PvP : 0,9.

**4. Trame de Maintien — Soin de zone**

Coût **30** · Recharge **18 s** · Portée **15 m** · Lancement : **1 s, immobile**.

Soigne jusqu’à 5 alliés dans un rayon de 6 m autour de la cible choisie ; aucun transfert supplémentaire via Attaches.

Formule par impact : 160 + 0,53 × P. Puissance de référence totale : **690 / 621** (PvE / PvP). Facteur PvP : 0,9.

**5. Reprise du Joint — Soin direct d’urgence**

Coût **45** · Recharge **35 s** · Portée **25 m** · Lancement : **Instantané**.

Une cible ; ne déclenche pas Attaches de Secours. Fenêtre d’urgence, sans recharge réinitialisée sous un seuil de vie.

Formule par impact : 420 + 1,15 × P. Puissance de référence totale : **1 570 / 1 413** (PvE / PvP). Facteur PvP : 0,9.

**6. Délier l’Altération — Dissipation**

Coût **15** · Recharge **18 s** · Portée **25 m** · Lancement : **Instantané**.

Retire un effet négatif dissipable selon les règles communes ; aucune immunité offerte et aucun dégât propre effacé artificiellement.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**7. Attaches de Secours — Lien / soin conditionnel**

Coût **20** · Recharge **20 s** · Portée **25 m** · Lancement : **0,50 s**.

Choisir deux alliés visibles, chacun à portée ; validité 6 s tant qu’ils restent à 10 m l’un de l’autre et à 25 m du Lieur, en ligne de vue. Une seule copie de Point de Suture : min(25 % du soin initial effectif, 250 en PvE ou 225 en PvP), puis modificateurs du second receveur. Le facteur PvP n’est pas réappliqué. Aucun rebond ni gain de ressource.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**8. Éclat de Maintien — Dégâts directs**

Coût **0** · Recharge **9 s** · Portée **22 m** · Lancement : **0,80 s**.

+5 Cohésion sur touche ; aucun soin automatique de groupe.

Formule par impact : 140 + 0,51 × P. Puissance de référence totale : **650 / 650** (PvE / PvP). Facteur PvP : 1.

**9. Tenir Ensemble — Soin de groupe majeur**

Coût **65** · Recharge **75 s** · Portée **15 m** · Lancement : **1,50 s, immobile**.

Jusqu’à 5 alliés dans un rayon de 6 m. Ne déclenche pas les Attaches et n’accorde aucune réduction de dégâts additionnelle.

Formule par impact : 430 + 1,2 × P. Puissance de référence totale : **1 630 / 1 467** (PvE / PvP). Facteur PvP : 0,9.

**10. Rappel des Liens — Résurrection**

Coût **50** · Recharge **180 s** · Portée **5 m** · Lancement : **3 s, immobile**.

Réanime un allié à 25 % de PV ; ligne de vue. Interruption possible. Verrou de résurrection en combat partagé par groupe : 180 s à compter du succès, toutes classes confondues. Aucune immunité offerte.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

### 11. Éveilleur — Vaelith — Soigneur

**Ressource.** Éveil 0–100 ; départ 0. Impulsion Vitale : +8 si soin utile ; Bourgeon Attentif : +6 une seule fois à l’application si cible blessée ; Épine Claire : +5 sur touche. Pas de gain par dégâts auto-infligés.

**Mécanique propre.** Reprise : quand un allié visible à 25 m subit dans une fenêtre glissante de 2 s des dégâts hostiles réels atteignant 10 % de ses PV max, il devient éligible 4 s à Seconde Pousse. Par allié, un tel déclenchement au maximum toutes les 12 s. Sont exclus dette, Garde et auto-dégâts. Une seule charge, aucune augmentation automatique de tous les soins.

**Boucle.** Soigner normalement → repérer un pic hostile → décider d’utiliser la relance conditionnelle ou garder sa ressource pour le prochain danger.

**Comment le contrer.** Changer de cible après avoir forcé sa relance, interrompre les gros soins et dissiper ses préparations. Les bonus de relance sont personnels au lanceur.

**Repères existants.** Thaumaturge : urgence instantanée 1 830 / 35 s ; Tisseur : urgence 1 610 / 35 s ; grande intervention de groupe Accordeur 1 750 / 75 s.

**1. Impulsion Vitale — Soin direct**

Coût **0** · Recharge **0 s** · Portée **25 m** · Lancement : **1,25 s, immobile**.

+8 Éveil uniquement si soin utile ; ne consomme aucune Reprise.

Formule par impact : 230 + 0,82 × P. Puissance de référence totale : **1 050 / 945** (PvE / PvP). Facteur PvP : 0,9.

**2. Bourgeon Attentif — Soin déclenché**

Coût **0** · Recharge **8 s** · Portée **25 m** · Lancement : **Instantané**.

Prépare un soin pendant 6 s, déclenché uniquement par le prochain dégât hostile réel. +6 Éveil à l’application sur cible blessée ; expiration sans soin. Un bourgeon par lanceur et par cible ; réapplication remplace sans déclencher.

Formule par impact : 200 + 0,52 × P. Puissance de référence totale : **720 / 648** (PvE / PvP). Facteur PvP : 0,9.

**3. Poussée Nouvelle — Soin direct**

Coût **25** · Recharge **12 s** · Portée **25 m** · Lancement : **1,50 s, immobile**.

Soin ciblé sans condition de Reprise ; interruptible.

Formule par impact : 350 + 1,05 × P. Puissance de référence totale : **1 400 / 1 260** (PvE / PvP). Facteur PvP : 0,9.

**4. Élan Commun — Soin de zone**

Coût **30** · Recharge **18 s** · Portée **15 m** · Lancement : **1 s, immobile**.

Jusqu’à 5 alliés dans un rayon de 6 m autour de la cible ; ne déclenche aucun Bourgeon.

Formule par impact : 150 + 0,53 × P. Puissance de référence totale : **680 / 612** (PvE / PvP). Facteur PvP : 0,9.

**5. Seconde Pousse — Soin direct d’urgence**

Coût **45** · Recharge **35 s** · Portée **25 m** · Lancement : **Instantané**.

Utilisable uniquement sur cible ayant Reprise pour cet Éveilleur ; consomme Reprise. Aucun surplus au-delà de la puissance annoncée et aucun reset.

Formule par impact : 420 + 1,15 × P. Puissance de référence totale : **1 570 / 1 413** (PvE / PvP). Facteur PvP : 0,9.

**6. Écarter le Mal — Dissipation**

Coût **15** · Recharge **18 s** · Portée **25 m** · Lancement : **Instantané**.

Retire un effet négatif dissipable ; ne réinitialise pas Reprise et ne déclenche pas Bourgeon.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**7. Écorce de Relance — Protection**

Coût **25** · Recharge **25 s** · Portée **25 m** · Lancement : **Instantané**.

−15 % de dégâts directs pendant 4 s sur un allié. Cette prévention peut empêcher le seuil de Reprise : choix assumé entre prévenir et relancer.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**8. Épine Claire — Dégâts directs**

Coût **0** · Recharge **9 s** · Portée **22 m** · Lancement : **0,80 s**.

+5 Éveil sur touche ; aucun Bourgeon allié déclenché artificiellement.

Formule par impact : 140 + 0,51 × P. Puissance de référence totale : **650 / 650** (PvE / PvP). Facteur PvP : 1.

**9. Réveil Collectif — Soin de groupe majeur**

Coût **65** · Recharge **75 s** · Portée **15 m** · Lancement : **1,50 s, immobile**.

Jusqu’à 5 alliés dans un rayon de 6 m. Ne nécessite pas Reprise et ne renforce pas les autres soins après son effet.

Formule par impact : 430 + 1,2 × P. Puissance de référence totale : **1 630 / 1 467** (PvE / PvP). Facteur PvP : 0,9.

**10. Retour du Souffle Neuf — Résurrection**

Coût **50** · Recharge **180 s** · Portée **5 m** · Lancement : **3 s, immobile**.

Réanime un allié à 25 % de PV ; ligne de vue. Interruption possible. Verrou de résurrection en combat partagé par groupe : 180 s à compter du succès, toutes classes confondues. Aucune immunité offerte.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

### 12. Passeur — Orynth — Soigneur

**Ressource.** Flux 0–100 ; départ 0. Soin de Passage : +8 sur soin utile ; Souffle de Rive : +6 à l’application sur cible blessée ; Pierre Lancée : +5 sur touche. Aucun gain simplement en courant.

**Mécanique propre.** Relais : Traversée Partagée donne pendant 4 s une charge permettant de préparer un Soin de Passage en marchant à 70 % de vitesse. Dégâts/soins inchangés, charge consommée au début de la préparation. Le Passeur gagne en continuité mobile avec une portée plus courte de 22 m.

**Boucle.** Suivre les alliés → créer du Flux par soins utiles → préparer un Relais → soigner en déplacement → se regrouper pour les soins de proximité.

**Comment le contrer.** Disperser le groupe, ralentir le soigneur et jouer hors de ses 22 m. Aucun bonus automatique de déplacement ou de soin parce que plusieurs Passeurs sont présents.

**Repères existants.** Thaumaturge : fondamentale 1 100 à 25 m ; soin de groupe 720 / 18 s ; bouclier 810 / 16 s.

**1. Soin de Passage — Soin direct**

Coût **0** · Recharge **0 s** · Portée **22 m** · Lancement : **1,25 s**.

Immobile par défaut ; mobile à 70 % sous Relais. +8 Flux si soin utile ; aucun soin additionnel au déplacement.

Formule par impact : 230 + 0,82 × P. Puissance de référence totale : **1 050 / 945** (PvE / PvP). Facteur PvP : 0,9.

**2. Souffle de Rive — Soin sur la durée**

Coût **0** · Recharge **8 s** · Portée **22 m** · Lancement : **Instantané**.

3 ticks à +2/+4/+6 s ; +6 Flux à l’application si cible blessée, jamais par tick. Pas de cumul par lanceur.

Formule par impact : 100 + 0,28 × P ; 3 impacts/ticks. Puissance de référence totale : **1 140 / 1 026** (PvE / PvP). Facteur PvP : 0,9.

**3. Traversée Partagée — Préparation / soin direct**

Coût **20** · Recharge **16 s** · Portée **22 m** · Lancement : **Instantané**.

Soigne une cible ; prépare Relais pour le lanceur pendant 4 s. Aucun déplacement de l’allié, aucun bonus de vitesse.

Formule par impact : 180 + 0,52 × P. Puissance de référence totale : **700 / 630** (PvE / PvP). Facteur PvP : 0,9.

**4. Halte Commune — Soin de zone**

Coût **30** · Recharge **18 s** · Portée **0 m** · Lancement : **1 s, immobile**.

Jusqu’à 5 alliés dans un rayon de 8 m autour du Passeur ; rester proche est nécessaire. Le lanceur est éligible au plafond de 5.

Formule par impact : 160 + 0,53 × P. Puissance de référence totale : **690 / 621** (PvE / PvP). Facteur PvP : 0,9.

**5. Main Tendue — Soin direct d’urgence**

Coût **45** · Recharge **35 s** · Portée **22 m** · Lancement : **Instantané**.

Une cible ; aucun déplacement, invulnérabilité ou réduction de recharge.

Formule par impact : 420 + 1,15 × P. Puissance de référence totale : **1 570 / 1 413** (PvE / PvP). Facteur PvP : 0,9.

**6. Laver l’Entrave — Dissipation**

Coût **15** · Recharge **18 s** · Portée **22 m** · Lancement : **Instantané**.

Retire un effet négatif dissipable ; peut retirer un ralentissement éligible, sans purge générale des contrôles.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

**7. Abri de Rive — Absorption**

Coût **20** · Recharge **16 s** · Portée **22 m** · Lancement : **Instantané**.

Bouclier 6 s ; règles communes de non-cumul par famille. Aucun gain de Flux par absorption.

Formule par impact : 200 + 0,6 × P. Puissance de référence totale : **800 / 720** (PvE / PvP). Facteur PvP : 0,9.

**8. Pierre Lancée — Dégâts directs**

Coût **0** · Recharge **9 s** · Portée **20 m** · Lancement : **0,80 s**.

+5 Flux sur touche ; la préparation peut être faite en marchant à 70 %. Interruptible.

Formule par impact : 140 + 0,51 × P. Puissance de référence totale : **650 / 650** (PvE / PvP). Facteur PvP : 1.

**9. Franchir Ensemble — Soin de groupe majeur**

Coût **65** · Recharge **75 s** · Portée **0 m** · Lancement : **1,50 s, immobile**.

Jusqu’à 5 alliés dans un rayon de 8 m autour du Passeur. Aucun bonus de vitesse, soin copié ou deuxième impulsion.

Formule par impact : 430 + 1,2 × P. Puissance de référence totale : **1 630 / 1 467** (PvE / PvP). Facteur PvP : 0,9.

**10. Retour à la Rive — Résurrection**

Coût **50** · Recharge **180 s** · Portée **5 m** · Lancement : **3 s, immobile**.

Réanime un allié à 25 % de PV ; ligne de vue. Interruption possible. Verrou de résurrection en combat partagé par groupe : 180 s à compter du succès, toutes classes confondues. Aucune immunité offerte.

Puissance : effet utilitaire, non convertible directement en dégâts ou soins.

## 5. Comparaisons chiffrées et points d’écart

### Fondamentales et soins

Les six nouvelles fondamentales DPS vont de 800 à 820 bruts par action, contre 770 à 840 dans les classes existantes. Sans préparation supérieure au GCD, cela représente 640–656 bruts/s sur cible immobile sans mitigation : c’est un plancher de comparaison, pas une rotation complète. Les trois tanks ont une fondamentale à 500 bruts, soit 61–63 % des nouvelles fondamentales DPS ; cette valeur isolée ne prouve pas qu’un tank atteindra cette proportion sur une rotation. L’objectif soutenu du Codex reste 40–55 % du DPS complet et doit être testé.

Les nouvelles fondamentales de soin donnent 1 050 bruts, soit 945 après facteur PvP, avec une préparation de 1,25 s. L’Accordeur affiche 1 090 et le Thaumaturge 1 100, sans durée d’incantation formalisée dans les données récupérées : l’écart par action est −3,7 à −4,5 %, mais la comparaison de HPS exige de fixer leurs préparations aussi. La base HoT nouvelle totalise 1 140 bruts en 6 s ; il faut comparer durée et sursoin, pas sa somme à un soin instantané.

Les urgences nouvelles donnent 1 570 / 1 413, recharge 35 s. Elles sont plus faibles que Conversion d’Urgence du Thaumaturge (1 830 / 1 647) : c’est un choix prudent, à tester, pas un écart déclaré résolu. Leur grande intervention donne 1 630 / 1 467 par cible à 75 s, contre 1 750 / 1 575 chez l’Accordeur. Les mécaniques mobiles ou de copie pourraient compenser, mais aucune équivalence chiffrée n’est prouvée. Si l’écart persiste en HPS utile, ajuster la base ou le coût sans ajouter un multiplicateur passif de faction.

### Pics de dégâts : ne pas masquer les anomalies historiques

Le Coup de Rupture du Brise-Fer monte à 2 480 bruts avec cinq charges, et son facteur PvP historique est 1,0. Le Fendeur ne reproduit pas ce pic à l’identique : Effondrement avec trois Joint atteint 1 667,5, ou 1 812,5 avec Mesure de Rupture (bonus additionnés +25 %), puis facteur PvP 0,8. Son maximum réel à P=1 000 est donc **1 812,5 / 1 450**, avant défenses. L’écart à 2 480 est conséquent : aucun verdict « factions équilibrées » ne peut être donné tant que la cadence d’obtention et l’efficacité des fenêtres ne sont pas mesurées.

Lame Croisée du Danse-lame est spécifiée par impact : 1 030 × 2 = 2 060 bruts sur 8 s de recharge ; son facteur PvP est 1,0. La nouvelle Mue-Lame a un finisseur à 1 490 / 1 192 sur 14 s, plus une posture défensive avec malus de dégâts. La paire doit être une priorité de test. Ne pas comparer seulement les deux grosses attaques et en conclure un taux de victoire.

**Décision proposée pour la revue :** conserver les nouveaux budgets prudents, puis tester les arsenaux anciens avec les mêmes conventions. Si les anciens pics sont réellement excessifs, proposer leur correction séparément et la faire valider ; ne rien diminuer silencieusement sur le Codex. Si leur coût de préparation les justifie, rehausser les nouveaux coups seulement après observation du rendement complet.

### Projections et protections

| Tank | Portée | Projection | Cibles | Coût | CD | Préparation |
|---|---:|---:|---:|---:|---:|---:|
| Rempart, existant | 3 m | 8 m | 1 | 20 Stabilité | 25 s | 0,35 s |
| Gardien, existant | 6 m | 6 m | 1 | 20 | 24 s | 0,40 s |
| Sentinelle, existante | 3 m | 5 m | 3 | 25 Résolution | 30 s | 0,45 s |
| Porte-Faille, proposé | 3 m | 7 m | 1 | 20 Tension | 26 s | 0,40 s |
| Enlaceur, proposé | 4 m | 6 m | 1 | 20 Étreinte | 28 s | 0,45 s |
| Brise-Courant, proposé | 3 m | 5 m | 3 | 25 Impulsion | 30 s | 0,50 s |

Tous infligent 300 bruts par cible à P=1 000 ; les différences portent sur portée, nombre de cibles et fenêtre adverse. La sortie du rayon de Garde de 9 m dépend des positions initiales, pas de la seule distance de bump. Les rebords doivent être testés sur les mêmes cartes et avec les mêmes ancrages.

### Références recopiées du Codex

Ces valeurs sont des entrées historiques, pas des recommandations nouvellement validées. Leur convention « par impact » explique les multiplications indiquées.

| Référence | Puissance brute PvE | Facteur PvP | CD | Coût | Particularité historique |
|---|---:|---:|---:|---|---|
| Rempart · Rempart Absolu | — | 1.0 | 90 s | 70 | -45% dégâts 4s; non cumul fort |
| Gardien · Écorce Vivante | — | 1.0 | 18 s | 25 | -25% dégâts 5s |
| Sentinelle · Balayage | 300 | 1.0 | 30 s | 25 Résolution | Repousse de 5 m à l’opposé du tank ; 3 ennemis maximum dans un cône frontal de 90° |
| Brise-Fer · Frappe Fendante | 840 | 1.0 | 0 s | 0 | +1 Fracture |
| Brise-Fer · Coup de Rupture, 5 charges | 2 480 | 1.0 | 10 s | 5 | Consomme 1-5 Fracture; +12%/charge |
| Danse-lame · Lame Croisée, deux frappes | 2 060 | 1.0 | 8 s | 0 | 2 frappes; +15 Cadence |
| Duelliste · Riposte Magistrale | 1 620 | 0.8 | 14 s | 40 | Consomme Avantage |
| Artilleur · Tir Calibré | 810 | 1.0 | 0 s | 0 | +8 Pression |
| Arcaniste · Décharge Instable | 1 740 | 0.8 | 18 s | 40 | Incant. 1.1s |
| Traqueur · Flèche de Percée, marquée | 1 727 | 0.8 | 16 s | 40 | Incant. 1s; cible marquée +10% |
| Accordeur · Note Réparatrice | 1 090 | 0.9 | 0 s | 0 | +8 Harmonie si soin utile |
| Accordeur · Grande Résonance, par cible | 1 750 | 0.9 | 75 s | 70 | 5 alliés; incant. 1.5s |
| Thaumaturge · Conversion d’Urgence | 1 830 | 0.9 | 35 s | 45 | Instantané; déséquilibre 6s |
| Tisseur · Renouveau Profond | 1 610 | 0.9 | 35 s | 60 | Soin d'urgence |

## 6. Ce qui doit être mesuré avant de parler d’équilibre

### Séquence de tests

1. **Clarifier les anciennes fiches.** Fixer préparation, GCD, gains de ressource et conventions multi-impacts pour les douze classes existantes. Les données anciennes ne contiennent pas toutes les informations nécessaires à une simulation fiable. Conserver les valeurs historiques tant qu’aucune modification n’est validée.
2. **Tests unitaires de mécanique.** Dette conservée au centime/point, pas de chaîne de Garde, pas de génération par sursoin, copie ou auto-dégâts ; barrières et obstacles ; fins de préparation, seuil d’exécution et immunités.
3. **Mannequin pendant 60 puis 180 s.** Même équipement et cibles, ressource initiale identique par rôle, critique et esquive neutralisés d’abord. Mesurer dégâts/soins utiles, nombre d’actions, ressources perdues au plafond, temps à sec, pics sur 3 s et 6 s. Inclure les interruptions de déplacement et pas seulement une rotation parfaite.
4. **Protection et soin sous pression scriptée.** Un tank + un gardé ; un soigneur avec cinq alliés blessés selon un script identique. Pression constante, puis pics, puis dispersion. Mesurer survie, dette restante, sursoin, absorptions consommées et dégâts réellement empêchés. Ne jamais assimiler une dette encore due à des dégâts évités.
5. **Duels et escarmouches 5 contre 5.** Au moins 30 matchs par composition et côté de carte pour une première recherche de défauts ; changer les joueurs de faction. Ce faible volume sert à détecter de gros problèmes, pas à certifier statistiquement un taux de victoire équilibré. Tester aussi 2 tanks, 2 soigneurs et focus coordonné.
6. **Réglage ciblé.** Modifier un axe à la fois : puissance, coût, préparation ou recharge. Ne pas offrir simultanément puissance, portée et mobilité. Rejouer les situations qui ont motivé le réglage.

### Cibles de réglage proposées, non résultats

- DPS soutenu comparable : objectif ±5 % sur mannequin à rôle et difficulté similaires ; séparer monocible, zone, préparation et mobilité.
- Pic sur 3–6 s : une meilleure pointe exige une fenêtre de préparation et un contre-jeu visibles. Pas de mort sous un contrôle unique contre un adversaire équipé pareil sans possibilité de réponse. PV et mitigation manquent encore pour traduire ce souhait en seuil numérique.
- Tanks : cible historique 40–55 % du DPS complet ; comparer surtout survie, protection utile et disponibilité de Garde. L’Enlaceur peut contrôler davantage l’espace, mais pas aussi mieux survivre et mieux tuer.
- Soigneurs : HPS utile proche à ±5–8 % sous scénarios adaptés ; mesurer séparément urgence, continuité mobile, groupe dispersé, absorption et temps d’incantation. Le solo peut rester à 45–60 % d’un DPS sans augmenter le soin offensif de groupe.
- Disponibilité de la ressource : aucune rotation permanente où toutes les grosses compétences sont gratuites en pratique ; pas d’échec de Garde quand la ressource est vide.
- Des avantages de terrain et de composition sont attendus ; aucun groupe ne doit exiger le Lieur ou l’Éveilleur pour passer une mécanique de base.

### Cas limites prioritaires

| Mécanique | Vérification nécessaire |
|---|---|
| Porte-Faille | Une rafale de 20 coups ne repousse pas les échéances ; dette + dégâts immédiats = dégâts restant après mitigation ; saturation exacte ; ticks létaux |
| Enlaceur | Entrées/sorties de zone ; deux Enceintes ne doublent pas protection ou ralentissement ; plafond 5 appliqué |
| Brise-Courant | Rotation du cône, latence, alliés à la frontière ; pas de protection à travers un mur |
| Fendeur | Joint personnel, abandon sur changement de cible, bonus additionnés ; exécution qui perd son seuil |
| Mue-Lame | Pas de double posture, DoT non renforcé rétroactivement, changement gratuit limité à une charge sous Lecture |
| Sillonneur | Aucun gain par course à vide, une seule charge Passage, murs et ennemis traversés une fois |
| Éclateur | Ricochet à 80 % + 40 % uniquement avec deux cibles valides ; aucun saut sur cible cachée ou hors ligne de vue |
| Aiguilleur | Déplacement net de 3 m, pas de cercle sur place ; repère consommé une fois ; lanceur averti de son état |
| Lance-Rive | Cadence change seulement la mobilité de préparation ; pas de bonus caché de dégâts ; impossible de tirer à 30 m |
| Lieur | Copie plafonnée sur soin effectif, puis modificateurs propres au receveur ; aucun rebond en boucle ; paire hors portée |
| Éveilleur | Déclencheur à 10 % PV sur 2 s, temporisation 12 s par allié/lanceur, ni dette ni Garde ni auto-dégâts |
| Passeur | Relais consommé au début même si interrompu ; pas de ressource en courant ; regroupement réellement requis |

## 7. Lecture sur PC et mobile

Dix emplacements de compétences, avec le rôle et le type affichés. Les ressources et états doivent tenir en un indicateur principal et un repère contextuel ; éviter une seconde barre difficile à suivre pour chaque petite condition. Joint peut apparaître sur le portrait de cible ; Repère montre son état prêt ; Passage et Relais sont une charge avec une durée visible. Pour la dette, montrer le montant restant et ses échéances à venir, sans faire croire à un bouclier.

Les zones et cônes doivent être prévisualisés avant engagement. Les préparations de bump partagent un langage visuel reconnaissable. Pour Attaches de Secours, sélectionner deux portraits alliés, confirmer seulement quand les deux sont légaux ; pas de ciblage d’un ennemi converti implicitement en allié. Pour le Mue-Lame, bouton de posture explicite et état affiché ; aucun changement déclenché par une frappe ratée ou une désélection.

## 8. Sources et périmètre

- Identités des douze classes : proposition de la conversation courante, retenue par Clément et publiée au Codex avant cette conception.
- Référence mécanique : [Codex public — site/index.html](https://github.com/ClementChatain/Ashenfall-Codex-Public/blob/4d5cf8d3cdda2ab5eb5b0a83ccfe6b620cffef4a/site/index.html), empreinte Git 41ea542e8b352578ddcbc81128b82b739ac1cc7b.
- Anciennes compétences et règles d’équilibrage : 120 fiches et fiche « Règles d’équilibrage V0.1 », incluant la mise à jour V0.2 des bumps.
- Ce dossier propose également des compléments encore ouverts dans la source : verrou de résurrection de groupe, résolution précise de dette et catégories de dissipation. Ils ne deviennent pas des règles du jeu existant par leur seule présence ici.
- Les nouvelles classes n’acquièrent ni anatomie définitive, ni culture officielle, ni nouvelle cause cosmologique par ces mécaniques. Aucun fichier du Codex en ligne ou du projet Unity n’a été modifié pour cette proposition.

**Prochaine décision utile :** retenir ou corriger les douze boucles de jeu, puis prioriser un groupe de quatre classes pour le prototype. Les 120 techniques constituent un catalogue de conception ; les 24 classes complètes n’ont pas à être implémentées en une étape.
