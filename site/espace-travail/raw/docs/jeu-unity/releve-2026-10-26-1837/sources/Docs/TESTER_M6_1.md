# Tester M6.1 : premières compétences actives

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT (2026-10-23)** (frappe, onde, garde, lisibilité du HUD, fluidité du combat, intérêt des compétences ; sans remarque). 386 tests PlayMode réussis (dont 19 nouveaux de `M61SkillsTests`), build WebDev réussi et vérifié dans le navigateur (barre de compétences, Garde de fer et son anneau, Onde de choc 14 dégâts sur un mannequin, Frappe brise-garde 36 dégâts). Trois compétences **provisoires**, banc d'essai du nain actuel : ce n'est pas le kit définitif d'une classe. Pas de système de classes, de talents, d'inventaire ni de variantes par arme. Hache, lance, équipement hors combat, ciblage, esquive et mobilité : **non modifiés**.

## Les trois compétences (touches 2, 3, 4 ; la touche 1 reste l'attaque de base)

| # | Compétence | Rôle | Touche (manette) | Effet | Portée | Préparation / récupération | Cooldown | Coût (endurance) |
|---|---|---|---|---|---|---|---|---|
| 1 | **Frappe brise-garde** | Burst, interruption | **2** (bouton Ouest) | **36 dégâts** (hache : 20) sur **une cible**, la cible choisie ou à défaut la plus proche ; **interrompt son attaque en préparation, même après le verrouillage de sa visée** (ce que le coup de base ne peut plus faire) | **2,8 m** (bord de la cible, décor bloquant) | 0,35 s / 0,25 s | **8 s** | **25** |
| 2 | **Onde de choc** | Zone, contrôle léger | **3** (épaule droite) | **14 dégâts** à **tous les ennemis et mannequins dans un rayon de 3,5 m**, une seule fois chacun, décor bloquant ; les ennemis réagissent comme à un coup normal (recul et bref Stagger s'ils ne sont pas protégés) | **zone de 3,5 m** autour de vous | 0,30 s / 0,30 s | **10 s** | **30** |
| 3 | **Garde de fer** | Mitigation, survie | **4** (épaule gauche) | **-50 % de dégâts reçus pendant 4 s** | vous-même | instantané / 0,20 s | **14 s** | **15** |

Endurance maximale : 100 (esquive : 35). Un refus (cooldown, endurance, cible, portée, occupé) **ne dépense rien et ne lance aucun cooldown**.

## Les règles

- **Compatibles avec les deux armes** : la portée et les dégâts d'une compétence ne dépendent pas de l'arme équipée. Hache et lance restent équipables **uniquement hors combat** (R).
- **Une seule action à la fois** : pendant une compétence, l'attaque de base est ignorée et les autres compétences sont refusées (« action en cours »). Pendant l'attaque de base, les compétences offensives attendent la fin du coup ; la **Garde de fer** peut partir (elle n'annule rien).
- **L'esquive annule la préparation** d'une compétence : l'effet est perdu, l'endurance et le cooldown restent dépensés (rien n'est gratuit).
- **Mort** : tout est annulé, la garde s'efface ; à la réapparition les cooldowns repartent à zéro.
- **Anti-enchaînement conservé** : aucune compétence ne contourne les protections des ennemis. Un ennemi qui vient d'être étourdi est protégé (0,8 s, 1,2 s pour l'élite) : pas de nouveau Stagger, les dégâts passent quand même. Une attaque interrompue arme la riposte protégée de l'ennemi (R25). Un ennemi dont l'attaque est déjà dans sa phase active ne peut pas être interrompu.
- La Frappe brise-garde **ne verrouille pas** : 8 s de cooldown, Stagger bref, protection ensuite.
- Pas d'auto-attaque : rien ne part sans appui.

## La barre de compétences (bas de l'écran, au centre)

Pour chaque compétence : touche, nom, résumé (cible ou zone, valeur), état.

| Aspect | Signification |
|---|---|
| Bordure **dorée** | Prête |
| Bordure **grise**, voile qui se vide et **secondes restantes** | En recharge |
| Bordure **rouge** | Impossible maintenant et vous pouvez y remédier : endurance insuffisante, aucune cible, cible hors de portée ou masquée |
| Bordure grise sans chiffre | Occupé (autre action, esquive, KO) |
| Bordure **blanche** (et fond chaud) | En préparation (avant l'effet) |
| **Éclat blanc** de la bordure | Le lancement a réussi |
| **Éclat rouge** de la bordure + message au-dessus | Refusé, avec la raison |
| **Barre bleue** sous Garde de fer | Durée restante de la garde |

À l'écran : l'**anneau orange** sur la cible pendant la préparation de la Frappe brise-garde ; l'**anneau bleu** du rayon exact (3,5 m) autour de vous pendant la préparation de l'Onde de choc, puis une onde blanche qui s'étend ; un **anneau acier** autour de vous tant que la garde dure, qui clignote à la fin.

## Recette courte

Le Sandbox est inchangé : tous les ennemis, mannequins et rencontres sont là.

| # | À faire | À juger |
|---|---|---|
| 1 | **Frappe brise-garde sur mannequin** : mannequin A (devant le départ), le sélectionner (clic ou Tab), s'approcher à moins de 2,8 m, touche **2** | L'anneau orange annonce la cible ; après 0,35 s : 36 dégâts d'un coup ; le créneau 2 se vide (8 s). Plus gros que le coup de base ? Lisible ? |
| 2 | Refus : touche 2 **sans cible**, puis à **4 m**, puis derrière le **mur** (mannequin C) | Bordure rouge + message (« aucune cible », « hors de portée ou masquée ») ; **aucun cooldown, aucune endurance dépensée** |
| 3 | **Cible choisie derrière une autre** (mannequins D et E, alignés) : sélectionner E, touche 2 | Seule E est touchée |
| 4 | **Onde de choc sur un groupe** : rencontre est (3 ennemis) ou meute de gobelins à l'ouest, au milieu d'eux, touche **3** | L'anneau bleu annonce la zone ; tous ceux dans les 3,5 m prennent 14 une seule fois et reculent ; le message dit combien sont touchés |
| 5 | **Garde de fer** (touche **4**) avant de vous faire frapper par un ennemi ordinaire | Moitié de dégâts pendant 4 s, anneau acier qui clignote à la fin, barre bleue ; ne vous rend pas invincible |
| 6 | **Contre la Sentinelle de Fer** (arène au nord) : attendre que le **balayage** (cercle orange) ait commencé depuis un moment, sélectionner l'élite, touche **2** | L'attaque est **interrompue** même si sa visée est figée ; l'élite recule brièvement puis repart ; sa prochaine attaque est protégée (contour bleu acier) |
| 7 | **Jouer avec les deux armes** : essayer les trois compétences avec la hache puis (hors combat) avec la lance | Même portée et mêmes dégâts de compétence, quelle que soit l'arme ; l'attaque de base (1) marche toujours |
| 8 | **Esquiver pendant la préparation** d'une compétence (Espace) | La compétence est annulée, le cooldown et l'endurance sont perdus |
| 9 | **Ressenti** | Les trois compétences ont-elles un rôle différent et un vrai choix de moment ? L'élite et les groupes restent-ils exigeants (aucune compétence ne règle un combat à elle seule) ? |

## Limites connues

- **Valeurs, durées et coûts provisoires**, non équilibrés (R41) ; le Stagger et le recul de l'Onde de choc sont ceux des coups normaux, pas un effet de contrôle dédié.
- **Visuels provisoires** : mêmes animations d'attaque que la hache, anneaux au sol procéduraux, aucun son.
- Tester les compétences sur l'Onde de choc **sans ennemi à proximité** est autorisé (elle part, 0 touché) : à vous de choisir le moment.
- Les compétences ne tiennent pas encore compte d'une classe, d'un arbre de talents ni de l'inventaire (M6.2, M7).
