# Tester M6.2 : lisibilité des compétences

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT (2026-10-23)** (sans remarque). 12 nouveaux tests `M62FeedbackTests` réussis ; suite complète : 397 sur 398 avant l'ajustement d'une assertion d'un test M6.1, puis 31 sur 31 pour M6.1 et M6.2 (suite complète relancée après le commit de clôture, voir le rapport), build WebDev réussi et vérifié dans le navigateur (anneau et arc de la Garde de fer avec temps restant, éclat orange et « 36 » de la Frappe brise-garde, onde et « 14 » de l'Onde de choc, états du HUD) ; la lisibilité avec plusieurs ennemis simultanés est couverte par un test automatique à trois ennemis, pas par un essai manuel dans le navigateur. **Aucune mécanique modifiée** : dégâts, coûts, cooldowns, portées des trois compétences, mobilité M5.4, ciblage monocible, Stagger et immunités, Sentinelle, archétypes, armes, équipement hors combat et commandes sont inchangés. M6.2 ne change que la présentation, et ajoute les événements de gameplay qui l'alimentent.

## Légende : quel signal pour quoi ?

| Ce que vous voyez | Signification |
|---|---|
| **Flash blanc** de la cible, rien d'autre | Dégât normal (attaque de base) |
| **Éclat coloré** sur le corps de la cible + **sa valeur** en chiffres de la même couleur | Dégât de **compétence** (orange : Frappe brise-garde ; bleu clair : Onde de choc) |
| **Grand éclat doré + anneau doré**, texte « **Interrompu !** » | **Interruption réussie** d'une attaque ennemie |
| **Anneau brisé gris acier** sur la cible, texte « **Protégé** » | La cible est **protégée contre un contrôle** (anti-enchaînement ou riposte protégée) : elle prend les dégâts mais ni interruption ni Stagger. C'est la différence entre une frappe réussie et une frappe bloquée par une protection |
| **Anneau acier** autour de vous qui **se vide** (arc de temps restant), barre bleue et « **x,x s** » dans le créneau | **Garde de fer** active ; le créneau est bleu |
| L'anneau de garde **pulse** (anneau clair qui s'écarte) + liseré gris acier sur les bords de l'écran et mot « **ATTÉNUÉ** » au-dessus de vous | Un coup a été **réduit par la Garde** (distinct du vignettage rouge d'un coup plein et du bleu « ESQUIVÉ ! ») |
| Anneau gris qui s'écarte, message « **Garde de fer terminée** », l'arc a disparu | **Fin de la protection** |
| Bordure rouge du créneau + message (« endurance insuffisante », « aucune cible », « cible hors de portée ou masquée », « en recharge », « action en cours ») | Compétence **refusée** (rien n'est dépensé) |

Effets au sol **sous** les télégraphes ennemis : les zones rouges, orange et jaunes des ennemis restent toujours lisibles, même quand vos propres anneaux sont affichés. Aucun effet de lumière, aucune particule.

## Barre de compétences (conservée, précisée)

| Créneau | Signification |
|---|---|
| Bordure **dorée** | Prête |
| Bordure **rouge**, **raison écrite en bas** (« endurance ! », « aucune cible », « hors de portée ») | Impossible (cible invalide ou endurance insuffisante) |
| Bordure **blanche**, **barre blanche** qui avance sous le créneau | En préparation, jusqu'à l'effet |
| Bordure **bleue**, **temps restant en bleu** (ex. « 3.2 s ») et barre bleue | Effet temporaire actif (Garde de fer) |
| Voile gris qui se vide + **secondes** | En recharge |
| Bordure grise sans chiffre | Occupé (autre action, esquive, KO) |
| **Chiffre en haut à droite** | Coût en endurance : **rouge** quand il manque |

## Recette courte

Le Sandbox est inchangé.

| # | À faire | À juger |
|---|---|---|
| 1 | **Frappe brise-garde** (touche 2) sur un mannequin (sélectionné, à moins de 2,8 m) | Un anneau se resserre sur la cible, puis un **éclat orange** et « 36 » : l'impact est-il puissant et identifiable ? |
| 2 | **Interruption** : contre la Sentinelle (arène au nord), attendre que le balayage ait commencé depuis un moment, la sélectionner, touche 2 | **Grand éclat doré** et « Interrompu ! » : distinct d'un simple coup ? |
| 3 | **Protection** : étourdir un ennemi ordinaire avec l'**Onde de choc** (touche 3) puis le frapper tout de suite avec la **Frappe** (touche 2) | « **Protégé** » et anneau brisé gris : on comprend que le contrôle est refusé alors que les dégâts passent ? |
| 4 | **Onde de choc** au milieu d'un groupe (rencontre est ou meute de gobelins) | L'anneau annonce le rayon exact ; l'onde s'étend **jusqu'à ce même rayon** ; chaque ennemi touché a son éclat et son « 14 » ; un ennemi derrière un mur ou hors du cercle n'en a pas |
| 5 | **Garde de fer** (touche 4), puis se laisser frapper par un ennemi | Anneau qui se vide avec le temps, « ATTÉNUÉ » et pulsation à chaque coup, fin perceptible (anneau gris, « Garde de fer terminée ») |
| 6 | **Plusieurs ennemis qui attaquent en même temps** (rencontre est ou meute de gobelins) avec Garde de fer puis Onde de choc | Vos anneaux ne masquent pas leurs télégraphes ; on distingue coups normaux, coups de compétence, atténuation |
| 7 | **Refus** : touche 2 sans cible, trop loin, ou sans endurance | Raison lisible dans le créneau et le message ; **aucune** dépense ni aucun effet visuel de réussite |
| 8 | **Ressenti** | Les compétences sont-elles plus satisfaisantes et immédiatement compréhensibles ? Rien n'est-il trop chargé ? |

## Limites connues

- Effets **sobres et provisoires** : formes procédurales (anneaux, éclats) sans modèle, particule ni son ; les vraies animations d'impact viendront avec les vrais assets.
- Les valeurs en chiffres ne s'affichent que pour les dégâts de compétence (pas pour l'attaque de base), volontairement.
- La lisibilité à plus de quatre ou cinq ennemis touchés en même temps (chiffres et éclats superposés) n'a été essayée que dans les rencontres du Sandbox.
