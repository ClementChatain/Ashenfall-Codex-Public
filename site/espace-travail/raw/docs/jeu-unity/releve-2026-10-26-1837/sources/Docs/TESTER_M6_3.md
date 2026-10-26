# Tester M6.3 : système d'effets temporaires

**Statut : TERMINÉ / VALIDÉ MANUELLEMENT (2026-10-23)** (mécaniques et corrections de lisibilité ; réserve cosmétique acceptée : certains textes légèrement coupés). Suite complète : 426 tests PlayMode réussis (dont 28 `M63EffectsTests`, avec la mesure réelle de la régénération d'endurance sous Fatigue et les tests de lisibilité du poison et de la Fatigue) ; build WebDev réussi et vérifié dans le navigateur (les quatre effets, le poison sur la cible courante, les colonnes d'effets et leur expiration). Fondation générique pour les futures classes (dégâts et soins sur la durée, bonus, malus) : **aucune compétence canonique n'est ajoutée**. Les compétences 2, 3 et 4, leurs valeurs, la mobilité, les armes, l'équipement hors combat, le ciblage, les protections anti-enchaînement, les archétypes et la Sentinelle sont **inchangés**. Aucun changement d'équilibrage.

## Le système en bref

- **Une définition par effet** (asset dans `Data/Effects/`) : identifiant stable, catégorie (bénéfique ou nuisible), mécanique, durée, intervalle, puissance, règle de cumul, portée du cumul, conditions de fin.
- **Un seul gestionnaire** (`EffectSystem`) tient toutes les instances actives et tous les minuteurs ; une instance garde sa **source** (qui l'a posée) et sa cible.
- **Ticks déterministes** : à intervalle, 2 x intervalle, ... durée comprise (6 s / 1 s : exactement 6 ticks ; 6 s / 2 s : 3), jamais après l'expiration, même rythme quel que soit le nombre d'images.

### Règles de cumul

| Règle | Une nouvelle application... | Exemple d'essai |
|---|---|---|
| **Non cumulable** | est ignorée tant que l'effet est actif | Fatigue (O) |
| **Rafraîchissement** | remet la durée à zéro, une seule instance ; le rythme des ticks continue (aucun tick en plus) | Régénération (U) |
| **Cumul partagé** (maximum) | ajoute un cumul (puissance x cumuls) et remet la durée à zéro ; au maximum, rafraîchit seulement ; tous les cumuls expirent ensemble | Vigueur (I) : 3 cumuls au plus |
| **Instances indépendantes** (maximum) | crée une instance avec sa durée et son rythme propres ; au maximum, rafraîchit la plus ancienne ; chaque instance expire seule | Poison (Y) : 3 instances au plus |

Deux effets de définitions différentes ne s'écrasent **jamais**, même de même catégorie. La **portée** décide qui partage : « par source » (deux lanceurs ont chacun leur instance) ou « par cible » (les lanceurs partagent l'instance, la source d'origine est conservée).

### Politique avec les règles existantes

| Situation | Règle |
|---|---|
| **Invulnérabilité** (esquive) | un tick de dégâts est **bloqué** (aucun dégât, événement « bloqué ») et n'est **pas rattrapé** ; un tick de soin n'est pas bloqué |
| **Garde de fer / Défense** | s'appliquent aux ticks de dégâts comme à tout dégât |
| **Un tick n'est pas un coup** | pas de Stagger, pas de recul, pas d'alerte, pas de flash de coup, pas de vignettage rouge sur vous |
| **Soins** | jamais au-delà des PV maximum ; jamais sur un être KO ; ne ressuscitent pas |
| **Mort de la cible** | tous ses effets s'arrêtent immédiatement (un seul tick mortel, aucun après) ; bonus et malus sont retirés ; la réapparition repart sans aucun effet |
| **Mort de la source** | n'arrête l'effet que si sa définition le demande, et seulement celui de cette source |
| **Bonus et malus** | additifs sur `CharacterStats` (le résultat ne dépend pas de l'ordre d'application), retirés à la fin ; la valeur de base n'est jamais modifiée ; une cible sans statistiques (les ennemis, pour l'instant) refuse un effet de statistique |

## Le banc d'essai expérimental

Texte discret en bas à droite : « BANC D'ESSAI (expérimental) ». Il n'existe que dans l'éditeur et les builds de développement (donc dans votre build Web actuel).

| Touche | Effet d'essai | Cible | Mécanique | Durée | Valeur | Règle de cumul |
|---|---|---|---|---|---|---|
| **Y** | **Poison** (nuisible) | la cible courante (celle de l'anneau : choisie par clic ou Tab, sinon automatique) | dégâts sur la durée | 6 s | 4 par tick, 1 tick par seconde (24 au total par instance) | instances indépendantes, 3 au plus |
| **U** | **Régénération** (bénéfique) | vous | soins sur la durée | 6 s | 5 par tick, 1 par seconde | rafraîchissement |
| **I** | **Vigueur** (bénéfique) | vous | Force +5 par cumul (+15 % de dégâts) | 8 s | +5, +10, +15 | cumul partagé, 3 au plus |
| **O** | **Fatigue** (nuisible) | vous (les ennemis n'ont pas de statistiques) | Agilité -5 (régénération d'endurance -15 %) | 8 s | -5 | non cumulable |

Les touches 1, 2, 3, 4, R, Espace, Tab, Échap et le clic ne sont pas modifiés.

## Retours

| Ce que vous voyez | Signification |
|---|---|
| Nom de l'effet coloré au-dessus de la cible | Application |
| « Poison (renouvelé) » | Rafraîchissement |
| « Poison x2 », « Vigueur x3 » | Cumul |
| **-4** rouge à côté du corps de la cible | Tick de dégâts qui a retiré des PV (trois instances simultanées : un seul texte additionné) ; un tick absorbé par l'invulnérabilité n'affiche rien |
| **+5** vert | Tick de soin (seulement si des points sont rendus) |
| « Poison terminé » gris | Expiration |
| Colonnes en haut à droite (« Vous » et « Cible ») | Effets actifs : nom, cumuls (x n), temps restant, barre fine ; bleu-vert pour un bénéfice, rouge pour un malus |

Aucune particule, aucun effet de lumière : les télégraphes ennemis restent prioritaires.

## Corrections de lisibilité (après la validation manuelle)

| Point | Avant | Maintenant |
|---|---|---|
| Poison sur un mannequin ou un ennemi | « -4 » recouvert par l'étiquette de PV, trois instances superposées | « -4 » rouge, plus gros, **à côté du corps** de la cible ; trois poisons qui tombent ensemble donnent **un seul** « -12 » ; petit carré vert (avec « x3 ») près de l'étiquette de PV tant qu'un poison agit |
| Fatigue à l'application | mot violet recouvert par celui de la Vigueur | « **Fatigue : Agilité -5** », empilé au-dessus des autres textes |
| Fatigue pendant l'effet | ligne « Fatigue » sans explication | ligne avec flèche vers le bas, « Agilité -5 » et temps restant ; repère **« régén. d'endurance -15 % »** à droite de la barre d'endurance |
| Fin de la Fatigue | ligne qui disparaît | « **Fatigue : fin** » discret ; le repère disparaît |

## Recette courte

| # | À faire | À juger |
|---|---|---|
| 1 | Sélectionner un mannequin proche (clic ou Tab), appuyer sur **Y** | « Poison », puis -4 chaque seconde, 6 fois ; colonne « Cible » avec le temps restant ; le mannequin ne réagit pas comme à un coup |
| 2 | Appuyer sur **Y** trois fois de plus en quelques secondes | « Poison x2 », « x3 », puis « renouvelé » (maximum de 3) ; les dégâts par seconde s'additionnent |
| 3 | Vous faire blesser (ennemi, ou laisser un ennemi vous frapper), puis **U** | +5 vert chaque seconde, jamais au-delà de vos PV max |
| 4 | **I** une, deux, trois, quatre fois | « Vigueur x1, x2, x3 », puis rafraîchissement ; attaquer un mannequin (1) : dégâts accrus (20 devient 23, 26, 29) pendant 8 s |
| 5 | **O** | « Fatigue » : l'endurance se régénère plus lentement ; un second appui dit « déjà actif » |
| 6 | Laisser les effets expirer (6 à 8 s) | « terminé » en gris, la ligne disparaît de la colonne, votre Force et votre Agilité reviennent à leur valeur de base (les dégâts de l'attaque de base aussi) |

Les ticks de dégâts bloqués par l'invulnérabilité ou réduits par la Garde de fer sont vérifiés par les tests automatiques : le banc d'essai applique le poison à la cible seulement, donc vous ne pouvez pas vous empoisonner pour les voir en jeu.

## Limites connues

- **Banc d'essai uniquement** : pas de compétence de classe, pas de dissipation, pas de résistance.
- Un malus de statistique ne peut viser que quelqu'un qui a des statistiques (vous) : les ennemis n'en ont pas encore.
- Un poison sur un ennemi **au repos** ne le réveille pas (un tick n'est pas un coup).
- La puissance d'un effet ne dépend pas encore des statistiques de sa source.
- Pas de sauvegarde ni de réseau : les effets ne persistent pas d'une session à l'autre ; l'architecture (identifiant stable, source conservée, échéances explicites, un seul gestionnaire) est prévue pour s'y prêter plus tard.
