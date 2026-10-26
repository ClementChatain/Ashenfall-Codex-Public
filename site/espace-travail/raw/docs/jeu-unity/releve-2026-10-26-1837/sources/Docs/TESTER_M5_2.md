# Tester M5.2 : la Sentinelle de Fer (premier ennemi d'élite)

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT (2026-10-23)** (frappe frontale, balayage, charge, combat global). 335 tests PlayMode réussis (318 + 17 nouveaux de `M52SentinelTests`), build WebDev réussi et vérifié dans le navigateur (cône de la frappe frontale, cercle du balayage, déplacement de l'élite). M5.3 (deux armes) : non commencé. La mobilité du joueur (distance d'esquive, vitesse) **n'est pas modifiée** (R37, passe de réglage après M5.3) ; la Sentinelle est conçue en tenant compte de sa générosité actuelle.

## Principe

Une élite de mêlée, **grande et gris-bleu** (échelle 1,6), de **140 PV** (7 coups : une élite plus résistante, mais pas un sac à PV). Sa difficulté vient de ses **trois attaques complémentaires** et du choix qu'elle fait entre elles ; chacune est annoncée par un télégraphe de **forme et de couleur distinctes**, et laisse **plus d'une seconde** pour contre-attaquer. Elle n'est **jamais immunisée** au Stagger (protection de 1,2 s au lieu de 0,8 s contre les enchaînements ; une attaque interrompue arme sa riposte protégée R25 comme les autres).

| Attaque | Quand | Télégraphe | Anticipation | Dégâts | Récupération | Comment l'éviter |
|---|---|---|---|---|---|---|
| **A Frappe frontale** | joueur à moins de 3,4 m, devant elle | **cône étroit rouge** (3,4 m, 50°) | 0,85 s (visée figée à 0,55 s) | 16 | **0,9 s** | **pas de côté** après la visée figée, ou esquive |
| **B Balayage circulaire** | joueur à moins de 3,2 m, n'importe où autour d'elle | **cercle orange complet** (3,2 m) | 1,10 s | 12 | **1,0 s** | **sortir du cercle** (au-delà de 3,6 m) ou esquive au bon moment |
| **C Engagement** | joueur resté **à plus de 5 m depuis 1 s**, devant elle, entre 5 et 9 m ; au plus toutes les 5 s | **bande jaune** (1,2 m x 7 m) | 0,9 s (visée figée à 0,6 s) | 12 | **1,1 s** | **pas de côté** : elle charge à 14 m/s pendant 0,5 s (7 m au plus, s'arrête au contact ou au premier mur) |

- **Choix de l'attaque** : selon la distance et l'angle ; au contact, entre A et B avec un peu de hasard, **jamais plus de deux fois la même d'affilée** ; la charge n'est jamais choisie au contact ni sans ligne de vue.
- **Un seul coup par attaque** ; la zone de dégâts est exactement celle du télégraphe. L'esquive par invulnérabilité bloque le coup (retour « bloqué »).
- Intervalle entre deux débuts d'attaque : 2,6 s après A, 3,0 s après B, 3,2 s après C. Débit moyen ~5 dégâts par seconde (comparable aux ordinaires).
- Réapparition individuelle à **10 s** (pas 4 s). Retour protégé, ligne de vue, mort : comme les autres ennemis.

## Où la combattre (Sandbox)

**Au nord du départ**, dalle bleu nuit de 26 x 22 m (entrée marquée par une piste dorée), à environ 40 m :

1. Tenir **A** environ 1 s (le personnage monte en diagonale vers le haut-gauche, entre le pilier et la petite marche).
2. Puis **W+A** environ 6 s, tout droit vers le nord le long de la piste dorée. La brute de référence n'est pas réveillée sur ce chemin.
3. La Sentinelle attend au fond de l'arène, face au sud ; elle détecte à 10 m.

Les autres rencontres (M4.4 est/ouest, M5.1 sud) sont conservées.

## Recette courte

| # | À faire | À juger |
|---|---|---|
| 1 | Entrer dans l'arène et la laisser venir | Elle avance lentement (3 m/s) ; son premier coup est annoncé **0,85 s ou plus** à l'avance : le télégraphe est-il lisible ? |
| 2 | **Frappe frontale** : te placer devant elle à 2 à 3 m, puis faire un **pas de côté** (S, D, Q/A) après que le cône rouge s'est figé | Pas de dégâts ; après l'impact, elle reste immobile ~1 s : **frappe-la** (contre-attaque). |
| 3 | **Balayage** : rester collé à elle ou sur son flanc | Un **cercle orange** apparaît : **sors du cercle** (3,6 m) ou **esquive (Espace)** au moment du coup (1,1 s après le début). Différent de la frappe ? |
| 4 | **Engagement** : reste à 6 à 8 m devant elle, en reculant, pendant 1 à 2 s | Une **bande jaune** apparaît : elle **charge en ligne droite sur 7 m** (jamais plus loin, jamais en téléportation) ; **pas de côté** pour l'éviter. Après la charge, elle est exposée ~1,1 s. |
| 5 | Combattre pour de bon (tu peux viser avec clic/Tab, esquiver, interrompre) | Frapper pendant l'anticipation (avant la visée figée) **interrompt** l'attaque (Stagger) ; l'attaque suivante est alors **protégée** (contour bleu acier). 7 coups pour la tuer. |
| 6 | Mourir ou fuir à plus de 16 m / la tuer | Retour protégé individuel ; elle réapparaît après 10 s. |
| 7 | Plaisir de jeu | L'élite teste-t-elle la lecture des télégraphes, le placement, le timing des esquives, les fenêtres de contre-attaque, le ciblage ? Trop facile à cause de la mobilité du joueur (R37) ? |

## Limites connues

- **Visuel provisoire** (même modèle et même animation d'attaque, plus grand et teinté) ; le balayage et la charge réutilisent l'animation de frappe.
- **Valeurs de départ**, non équilibrées : à ajuster après essai, dans `EnemyBuilder.BuildSentinel` (qui réécrit les valeurs à chaque reconstruction). Sa difficulté dépend de la mobilité actuelle du joueur (R37) : la charge et le balayage sont faciles à éviter à 6 m/s.
- Une élite entourée d'autres ennemis n'est pas prévue dans le Sandbox (arène isolée).
- Pas de phases de combat, de rage ni de mécanique de boss (hors périmètre).
