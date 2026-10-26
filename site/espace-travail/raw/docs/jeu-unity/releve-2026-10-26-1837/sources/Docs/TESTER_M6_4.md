# Tester M6.4 : interactions avancées des effets de combat

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT (2026-10-25) par le porteur du projet : visibilité avant détection, ouverture au poison, réaction de groupe, ralentissement, dissipation et Poison fragilise sont tous positifs. Limitation acceptée pour le prototype : ennemis parfois non visibles en bas-gauche et bas-droite de la caméra isométrique (R45).** Suite complète : **456 tests PlayMode réussis sur 456** (dont 18 `M64InteractionTests`, 6 `M64DetectionTests` et 6 `M64PoisonWeaknessTests` ; plusieurs tests anciens ont été recalés sur les nouvelles portées de détection, voir D223 ; un test M6.3 a été ajusté parce que l'alerte par poison est désormais voulue) ; build WebDev réussi et vérifié dans le navigateur (aggro par poison, ralentissement x2, dissipation réussie et « rien à dissiper »). Les compétences 2, 3 et 4 (valeurs, coûts, cooldowns), les règles de ciblage monocible, la mobilité M5.4, les armes, l'équipement hors combat, les immunités anti-stunlock, les comportements fondamentaux des ennemis et les durées, puissances et règles de cumul de M6.3 sont **inchangés**. Pas de multijoueur, de classes ni de talents.

## Ajustement de la détection (M6.4, ajouté après le retour manuel)

Les ennemis vous détectaient depuis **hors de l'écran** (9 m, 11 m, 10 m) alors que la caméra isométrique ne montre qu'environ 6 m de chaque côté et 7,7 m vers le haut de l'écran. Seules les **portées de détection** ont été réduites (données des définitions d'ennemis, reconfigurables) :

| Ennemi | Avant | Après |
|---|---|---|
| Brute, Ordinaire, Gobelin, Maraudeur, Briseur | 9 m | **6 m** |
| Traqueur (tireur) | 11 m | **8 m** |
| Sentinelle de Fer (élite) | 10 m | **7 m** |

Inchangés : perte de cible (14 m, 16 m pour l'élite), laisse, vitesses, attaques, agro par coup ou par poison, réactions de meute. Aucune logique liée à l'écran : la caméra est provisoire (D224), la perception sera réévaluée avec la future caméra libre.

## Ce que M6.4 ajoute

### 1. Aggro déclenchée par les dégâts sur la durée

Un tick de dégâts périodiques **qui retire réellement des PV** peut alerter un ennemi **au repos** (Idle), par le même chemin qu'un coup ou une détection (état « poursuite », le groupe est alerté comme d'habitude).

| Règle | Détail |
|---|---|
| Source | chaque tick porte la **source** de l'effet (qui l'a posé) ; l'ennemi ne réagit que si c'est **sa cible** (le joueur) ; une autre source ou une source environnementale n'alerte personne |
| Distance | la source doit être à **moins de la distance de perte de cible** de l'ennemi (14 m, 16 m pour l'élite) : sinon il abandonnerait aussitôt |
| Une seule alerte | seul un ennemi **inactif** est alerté ; engagé, en retour ou mort, les ticks suivants ne font plus rien (une nouvelle alerte n'est possible qu'après un retour au repos) |
| Pas un coup | **aucun Stagger, aucun recul, aucune interruption, aucun flash de coup** ; l'ennemi poursuit, c'est tout |
| Tick sans dégât | un tick **absorbé par l'invulnérabilité** ou nul ne génère ni dégâts, ni alerte |
| Groupe | un membre alerté alerte la meute par le mécanisme existant (`EnemyGroup`), dans la limite de sa distance de perte |

### 2. Ralentissement d'un ennemi

| Aspect | Comportement |
|---|---|
| Effet d'essai | **Ralentissement** : vitesse **-30 %** par cumul, **5 s**, cumul partagé jusqu'à **2** cumuls (-30 % puis -60 %), dissipable |
| Ce qu'il ralentit | la poursuite, le retour au point de départ et le recul du Traqueur (corps à corps, distance, élite) ; **pas** la charge de la Sentinelle (sa longueur reste exactement celle de son télégraphe) |
| Calcul | additif (le résultat ne dépend pas de l'ordre d'application), plancher à **-80 %** (20 % de la vitesse de base) |
| Assets | la vitesse de la définition n'est **jamais** modifiée ; le multiplicateur vit dans l'ennemi |
| Fin | à l'expiration, à la dissipation, à la mort : retour **exact** à la vitesse de base (par exemple 3,5 m/s pour un ennemi ordinaire) |
| Joueur | non ralentissable (un effet de vitesse exige un ennemi) |

### 3. Dissipation et nettoyage (deux opérations distinctes)

| | **Dissipation** (action de gameplay) | **Nettoyage** (technique) |
|---|---|---|
| Quand | une action ciblée du joueur (banc d'essai : L, K) | mort, réapparition, destruction de la cible, test |
| Porte sur | une instance précise, toutes celles d'une définition, ou les effets d'une catégorie (bénéfiques ou nuisibles), au plus N, les plus anciens d'abord | tous les effets de la cible |
| Non dissipable | un effet marqué non dissipable **reste** et est compté « protégé » | **toujours retiré** |
| Événements | `Dispelled` par effet retiré + un compte rendu de tentative (retirés, protégés) émis **même sans résultat** | `Removed`, `TargetDied`, `SourceDied` |
| Après | modificateurs retirés, **aucun tick ni expiration fantôme** | idem |

Dans l'essai : la **Fatigue** est l'unique effet **non dissipable** ; le poison et le ralentissement sont dissipables.

### 4. Interaction expérimentale « Poison fragilise »

Une **frappe de base** (touche 1) sur une cible **empoisonnée** inflige **+50 %** de dégâts (20 devient 30), **une seule fois par frappe**. Pilotée par un asset de données (`RulePoisonFragilise`), **coupée par défaut**, activée par la touche **N** du banc d'essai. Elle ne concerne **jamais** les compétences 2, 3 et 4 (la Frappe brise-garde reste à 36).

## Banc d'essai (éditeur et builds de développement seulement)

Touches du M6.3 conservées. Nouvelles touches, sans conflit : **P** ralentir la cible, **L** dissiper les malus de la cible, **K** dissiper vos malus, **N** activer ou couper l'interaction. Le libellé « BANC D'ESSAI (expérimental) » en bas à droite les affiche, avec l'état de l'interaction.

| Touche | Effet |
|---|---|
| Y, U, I, O | poison sur **la cible de votre attaque de base** (voir ci-dessous), régénération, vigueur, fatigue |
| **P** | **Ralentissement** de la cible courante (-30 %, cumulable une fois : -60 %) |
| **L** | **Dissipation** des malus de la cible courante |
| **K** | **Dissipation** de vos propres malus |
| **N** | **Interaction** « Poison fragilise » : bascule ; l'état est écrit en gras dans le panneau (**ACTIVÉ** en vert, **DÉSACTIVÉ** en rouge) et rappelé par un message bref |

**Cible du banc (correctif de la dernière vérification).** Y, P, L visent ce que votre **attaque de base (touche 1) va toucher** : la cible que vous avez choisie (clic ou Tab), sinon l'ennemi ou le mannequin **le plus proche à portée de frappe**, à défaut la cible automatique de l'anneau. Avant ce correctif, sans cible choisie, Y empoisonnait l'anneau automatique (gardé jusqu'à 14 m) alors que la frappe touchait un autre mannequin : aucun bonus. Le panneau affiche la ligne « Cible du banc : <nom> · poison 4,2 s » (ou « sans poison ») : c'est exactement la cible que Y et la touche 1 viseront.

## Retours

| Ce que vous voyez | Signification |
|---|---|
| « Ralentissement : Vitesse -30 % » au-dessus de l'ennemi, puis « x2 » | Application, cumul |
| Ligne « ▼ Ralentissement  Vitesse -30 %  4,2 s » dans la colonne « Cible » ; petit carré bleu près de l'étiquette de PV | Ennemi ralenti (un carré par malus : vert poison, bleu ralentissement) |
| « Ralentissement : fin » | Fin du ralentissement |
| « Dissipé : Poison » au-dessus de la cible | Dissipation réussie |
| « Rien à dissiper » / « Non dissipable » (gris) | Dissipation sans effet / impossible |
| « Poison fragilise +10 » (or) | Interaction déclenchée (une frappe de base sur une cible empoisonnée) |
| Texte légèrement coupé (cosmétique) | Les lignes de la colonne d'effets sont élargies (270 px) ; les autres textes coupés restent en réserve (R43) |

## Recette courte

| # | À faire | À juger |
|---|---|---|
| 1 | **Aggro par poison** : à environ 10 à 12 m d'un ennemi ordinaire **au repos** (hors de sa détection), le cibler (Tab) et appuyer sur **Y** | Au premier tick (-4) il s'engage et vient à vous ; il n'est **pas** étourdi (pas de recul) ; les ticks suivants ne le « réalertent » pas |
| 2 | Même chose sur un membre de la meute de gobelins | Toute la meute vient |
| 3 | **Ralentissement** : ennemi en poursuite, **P** une fois, deux fois | Il avance nettement plus lentement (-30 %, puis -60 %), colonne « Cible » avec la vitesse et le temps ; au bout de 5 s il repart à sa vitesse normale |
| 4 | Ralentir la **Sentinelle** (arène au nord), le **Traqueur** (tireur) et le **Briseur** | Ils ralentissent aussi ; la charge de la Sentinelle garde sa longueur |
| 5 | **Dissipation** : empoisonner et ralentir un ennemi (Y, P), puis **L** | « Dissipé : Poison », « Dissipé : Ralentissement » ; l'ennemi repart à vitesse normale, plus aucun tick |
| 6 | **L** sans effet sur la cible ; puis **O** (fatigue) et **K** | « Rien à dissiper » ; « Non dissipable » : la fatigue reste |
| 7 | **Poison fragilise** : suivre la recette dédiée juste en dessous | 20 dégâts, puis 30, puis 20 |
| 8 | **Détection** : approcher un ennemi ordinaire sans attaquer | Vous le voyez à l'écran **avant** qu'il ne réagisse ; en continuant il vous engage à environ 6 m ; il reste dangereux |
| 9 | **Poison de loin** : rester à 7 à 10 m d'un ennemi au repos (visible), le cibler, **Y** | Il ne vous a pas détecté ; le premier tick l'engage |

### Recette « Poison fragilise » (moins d'une minute)

Conditions : aucune **Vigueur** active (touche I : elle change les dégâts de base ; si elle est active, attendez sa fin ou comparez avec elle). Le poison dure 6 s : enchaînez **Y** puis **1** sans attendre (rien n'est prolongé pour le test).

1. Placez-vous à côté d'un mannequin (au contact, 2 m). Lisez dans le panneau, en bas à droite : « Poison fragilise : **DÉSACTIVÉ** » et « Cible du banc : Training Dummy … ».
2. Appuyez sur **1** une fois : les PV du mannequin baissent de **20** (par exemple 100 → 80). C'est le point de départ.
3. **Y** puis **1** tout de suite (« Cible du banc : … · poison 5,x s ») : **-20** de plus (plus, éventuellement, un petit tick de poison de 4 à part). Règle désactivée : pas de bonus.
4. Appuyez sur **N** : le panneau affiche « Poison fragilise : **ACTIVÉ** » (vert), avec le message bref.
5. **Y** puis **1** tout de suite : **-30**, et « Poison fragilise +10 » en or au-dessus du mannequin. Refaites **Y** puis **1** : encore **-30** (le bonus ne s'ajoute pas deux fois).
6. Appuyez sur **N** : « Poison fragilise : **DÉSACTIVÉ** » (rouge). **Y** puis **1** : retour à **-20**.
7. Contrôles : sans **Y** (mannequin non empoisonné) : **-20** même règle activée ; la Frappe brise-garde (**2**) reste à **-36** (jamais de bonus).

## Limites connues

- Un effet de vitesse ne vise que les ennemis (le joueur n'a pas besoin de ralentissement pour l'instant).
- **Une seule interaction**, expérimentale : elle ne combine pas les compétences 2, 3 et 4 avec les effets persistants.
- Pas encore de « contrôle sur cible ralentie », de purification canonique ni de compétence de classe.
- Les portées de détection sont **provisoires** : réglées pour la caméra isométrique actuelle, à réévaluer avec la caméra libre (D223, D224).
- Certains textes de l'interface restent légèrement coupés (R43, réserve acceptée).
