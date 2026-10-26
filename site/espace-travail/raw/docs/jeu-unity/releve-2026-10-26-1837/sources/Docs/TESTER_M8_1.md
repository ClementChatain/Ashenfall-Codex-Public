# Tester M8.1 : objets, sac, équipement et butin

**Statut : VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-25).** Validé : sac (B), ajout F3, lisibilité et clavier après un clic dans le panneau, équipement du plastron et valeurs attendues, remplacement et retrait sans cumul ni perte d'objet, refus d'équiper en combat puis équipement autorisé hors combat, clics dans le panneau sans action derrière, changement d'arme par R, butin, ramassage et Sentinelle de Fer. **Non testé manuellement (tests seulement)** : sac plein (ramassage et retrait refusés). Texte historique de la vérification automatique : Suite PlayMode complète : **531 tests réussis sur 531** (dont 14 `M8ItemsTests`) ; build WebDev réussi. Premier jalon de M8 (« Loot, inventaire, équipement » : 10 à 12 objets définis à la main, les stats changent à l'équipement). Reste pour la suite de M8 : effets d'objets (comportements, pas seulement des statistiques), raretés plus riches, tri du sac, objets jetés ; la sauvegarde est M9.

**Observé dans le navigateur (build WebDev, vrais clics et touches)** : sac « [B] Sac (n/24) » affiché ; F3 (« Debug : 10 objet(s) ajouté(s) au sac ») ; B ouvre le panneau (équipement, statistiques, sac coloré par rareté) ; clic sur un objet puis « Équiper » : Plastron du seigneur de guerre équipé, Force 15, Agilité 8, Défense 12, dégâts x1,15 et reçus x0,89 (sac 10/24), avec l'effet existant « régén. d'endurance -8 % » dû à l'Agilité ; clic sur l'emplacement Torse : « Retiré : Plastron du seigneur de guerre », statistiques de base retrouvées (sac 11/24) ; combat contre la meute de gobelins : un gobelin tué a lâché des « Bottes lestées », ramassées en passant (« Ramassé : Bottes lestées », sac 12/24). Correctifs d'affichage faits pendant cette vérification (panneau réduit à la hauteur de la fenêtre, bouton « Équiper » sous le détail, fond opaque).
**Couvert par les tests seulement (non observé dans le navigateur)** : refus d'équiper en combat, sac plein (ramassage refusé, retrait refusé), table élite (deux objets), plafond de butin au sol, hache runique et touche R, clic sur le panneau qui ne choisit pas de cible.
Note de vérification : après un clic dans le panneau, le navigateur automatisé a perdu le focus clavier (les touches n'agissaient plus) jusqu'à un clic dans le jeu ; à surveiller avec un vrai clavier.

Adresse du build : **http://127.0.0.1:8081** (serveur local : `node Tools/serve-web.js Unity/Builds/WebDev 8081` depuis `C:\DEV\ASHENFALL`).

## Ce qui est nouveau

| Élément | Règle |
|---|---|
| **12 objets définis à la main** | 3 armes, 2 casques, 3 torses, 2 paires de bottes, 2 talismans ; 4 raretés (commun gris, peu commun vert, rare bleu, épique violet) ; chacun apporte des bonus ou des malus de PV max, Force, Agilité, Défense |
| **Sac** | 24 places. Au départ : la lance (déjà accessible par R). La hache de guerre naine est équipée |
| **Équipement** | 5 emplacements : arme, tête, torse, bottes, talisman. Équiper applique les bonus aux statistiques ; retirer ou remplacer les enlève exactement (jamais cumulés). **Impossible en combat**, pendant une attaque ou une esquive, ou KO (même règle que le changement d'arme) : un refus ne change rien et le dit |
| **Butin** | À la mort d'un ennemi, un petit cube lumineux tombe au sol, de la couleur de la rareté, avec son nom. On le ramasse en passant dessus (1,6 m). Sac plein : il reste au sol. Gobelins et ennemis ordinaires : 35 % ; Maraudeur, Briseur, Traqueur : 60 % ; Sentinelle de Fer : toujours deux objets |
| **Panneau du sac** | Touche **B** (bouton Select de la manette) : équipement, statistiques, sac. Clic sur un objet du sac pour le choisir, bouton « Équiper » ; clic sur un emplacement pour retirer son objet. Un clic sur le panneau ne choisit pas d'ennemi et ne fait pas tourner la caméra |
| **Touche R** | Inchangée : elle passe à l'arme suivante, et le sac suit (l'arme rangée retourne dans le sac) |
| **F3** (test) | Ajoute au sac tous les objets que vous n'avez pas (éditeur et build de développement seulement) |

Les 12 objets : Hache de guerre naine (commun, départ), Lance de garde (commun), Hache runique (rare, +3 Force), Capuchon de cuir (+2 Défense), Casque de fer noirci (peu commun, +5 Défense, -1 Agilité), Gilet de recrue (+3 Défense), Cotte de mailles (peu commun, +7 Défense, +10 PV), Plastron du seigneur de guerre (épique, +12 Défense, +5 Force, -2 Agilité), Bottes de marche (+2 Agilité), Bottes lestées (peu commun, +4 Défense, -1 Agilité), Amulette de vigueur (rare, +25 PV), Anneau du berserker (rare, +4 Force, -10 PV). Les valeurs sont des points de départ, pas un équilibrage.

## Recette courte

| # | Action | Résultat attendu |
|---|---|---|
| 1 | Lancer le jeu, appuyer sur **B** | Le panneau s'ouvre : « Hache de guerre naine » à l'emplacement Arme, les autres vides, statistiques de base (PV max 100, Force 10, Agilité 10, Défense 0, dégâts x1,00 / x1,00), sac : « Lance de garde ». **B** le referme |
| 2 | Appuyer sur **F3**, puis **B** | Message « Debug : 10 objet(s) ajouté(s) au sac » ; le sac contient 11 objets de couleurs différentes |
| 3 | Dans le sac, cliquer « Plastron du seigneur de guerre », puis **Équiper** | Message « Équipé : ... » ; l'emplacement Torse se remplit ; Défense 12, Force 15, Agilité 8, « Dégâts infligés x1,15 », « Dégâts reçus x0,89 » ; le panneau ne change aucune cible |
| 4 | Cliquer « Cotte de mailles », puis **Équiper** | Le plastron retourne dans le sac ; les bonus du plastron disparaissent (Défense 7, PV max 110, Force 10) : rien ne s'accumule |
| 5 | Cliquer sur l'emplacement **Torse** | La cotte retourne dans le sac, statistiques de base retrouvées |
| 6 | Équiper « Anneau du berserker » | Force 14, PV max 90 ; les dégâts infligés passent à x1,12 |
| 7 | Choisir « Hache runique », **Équiper** ; fermer ; frapper un mannequin (touche 1) | Force +3 ; la hache runique est utilisée (même forme que la hache) ; appuyer sur **R** : on passe à l'arme suivante et la hache runique retourne dans le sac |
| 8 | Se faire engager par les gobelins (zone verte à l'ouest), ouvrir le sac, tenter d'équiper | Message rouge « Impossible en combat : ... » ; rien ne change |
| 9 | Tuer un ennemi (gobelin, ennemi ordinaire à l'est) | Parfois (35 %) un cube lumineux avec un nom tombe à côté du corps ; passer dessus : « Ramassé : ... » et l'objet est dans le sac |
| 10 | Remplir le sac (F3, puis ramasser) et passer sur un butin | Message « Sac plein : ... reste au sol » ; le cube reste |
| 11 | Tuer la **Sentinelle de Fer** (arène au nord) | Deux objets tombent toujours |
| 12 | Cliquer dans le panneau, sur un objet, avec un mannequin derrière | Aucune cible choisie derrière le panneau ; la caméra ne tourne pas |

## Limites connues (réserves)

- Présentation provisoire : cubes colorés au sol, panneau IMGUI sobre, aucun modèle ni icône d'objet ; les objets n'ont **pas d'apparence** (l'apparence est indépendante : M12).
- Les objets n'ont que des statistiques : les effets (poison au coup, etc.) viennent après.
- Pas de sauvegarde : le sac et l'équipement repartent de zéro au rechargement (M9). Pas de suppression ni de vente d'objets : un sac plein se libère en équipant (le plus ancien objet reste en place).
- Un butin au sol n'expire pas, mais le sol est plafonné à 40 objets (le plus ancien disparaît).
- Les tirages de butin sont aléatoires : sur quelques ennemis, aucun objet ne tombe, c'est normal (35 % pour les gobelins).
- Un malus peut ramener une statistique à son plancher (0) : aucun objet actuel ne le provoque seul.
