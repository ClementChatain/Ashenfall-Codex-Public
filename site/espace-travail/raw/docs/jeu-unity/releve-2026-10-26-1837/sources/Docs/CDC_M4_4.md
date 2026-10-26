# ASHENFALL — Cahier des charges M4.4
## Ciblage hybride, commandes de combat et affrontements multi-ennemis

**Version :** 1.3 — 22 octobre 2026 (v1.1 du 21 octobre 2026 + décisions D119 à D132 de l'audit et des arbitrages, voir `Docs/AUDIT_M4_4.md`, + correctif D141 : mannequins ciblables)
**Statut :** Conception finalisée, audit fait. **M4.4.1 terminé et validé manuellement (2026-10-22)** ; **M4.4.2 terminé et validé manuellement (2026-10-22)** ; **M4.4.3 terminé et validé manuellement (2026-10-23) : M4.4 entièrement terminé**
**Référence stable :** M4.3 validé (243 tests PlayMode)
**Moteur :** Unity 6 / URP — **Plateforme prioritaire :** WebGL

Les passages modifiés par rapport à la v1.1 sont marqués **[v1.2]**.

---

## 1. Vision et objectifs

M4.4 fait évoluer ASHENFALL du duel contre un ennemi unique vers des combats contre plusieurs adversaires, et pose les fondations du combat PC définitif : sélection des cibles et déclenchement volontaire des capacités par raccourcis. Mobilité, placement et esquive d'un action-RPG, confort ciblé d'un MMORPG.

> Un monstre ordinaire est une occasion de combattre. Un groupe est une menace. Un champion est un défi. Un boss est un événement.

La profondeur vient des décisions du joueur, pas de la longueur des combats ni d'une attaque automatique répétée.

Objectifs : (1) ciblage hybride fiable ; (2) le clic gauche cesse d'attaquer, la capacité est sur la touche 1 ; (3) plus d'enchaînement au maintien ; (4) attaque de base monocible, future capacité remplaçable ; (5) trois ennemis simultanés ; (6) aggro individuelle et collective ; (7) mécaniques M4.3 préservées ; (8) deux rencontres validées dans Unity et WebGL.

## 2. Commandes PC

| Commande | Fonction |
|---|---|
| Clic gauche sur un ennemi | Sélection manuelle, sans attaque |
| Clic gauche dans le vide | **[v1.2]** Aucune action (ni attaque ni désélection) |
| Tab | Cible suivante |
| 1 | Capacité de l'emplacement 1 |
| 2 à 5 | Réservés |
| ZQSD / WASD | Déplacement |
| Espace | Esquive |
| Clic droit | Non attribué |
| Échap | **[v1.2]** Désélectionne la cible manuelle (aucune autre fonction d'Échap n'existe dans le jeu ; à vérifier dans un vrai build WebGL, R29) |
| F1 / F2 | **[v1.2]** Debug d'équipement (armure lourde / légère), éditeur et builds de développement seulement ; remplacent 1 / 2 (D125) |
| Échap, F1/F2, Tab | **[v1.2]** Commandes prévues pour le prototype, à vérifier en vrai build WebGL ; en cas de conflit, aucun changement sans signalement au porteur du projet (D131, R29) |

### 2.1 Principes obligatoires : aucune auto-attaque

Sélectionner, rester près d'un ennemi, maintenir la touche 1 : aucune attaque. Une activation exige une nouvelle pression. Aucun déplacement automatique, aucune attaque différée au retour à portée, **aucun tampon d'attaque** (D126). Les capacités de canalisation ou à impacts multiples, si leur définition le prévoit, ne sont pas des auto-attaques.

### 2.2 Compatibilité

À préserver : timings de frappe, dégâts, animations, vérifications spatiales, réactions aux impacts, déplacement, esquive. La suppression de l'attaque maintenue et du tampon d'attaque est une évolution voulue : le comportement de M3b.2 est officiellement remplacé (D129), ses tests sont adaptés en M4.4.1 sans perdre leurs autres garanties. Tout autre changement de comportement est justifié et consigné.

## 3. Fondations des capacités

### 3.1 La touche 1
Coup de hache existant : monocible, 20 dégâts, portée 2,2 m, arc 110°, windup 0,10 s, fenêtre active 0,10 s, cooldown 0,45 s (valeurs du prototype inchangées).

### 3.2 Capacité remplaçable
Séparation raisonnable entre commande, capacité associée à l'emplacement, conditions d'utilisation et exécution. Pas de barre d'action, de builds ni d'apprentissage. Un seul emplacement fonctionnel.

### 3.3 Deux familles
**Ciblée** : exige une cible valide (portée, visibilité, disponibilité). **Libre** : sans cible. M4.4 n'implémente aucune nouvelle capacité.

## 4. Ciblage hybride

### 4.1 Acquisition automatique **[v1.2]**
Sans cible manuelle, acquisition de l'ennemi valide le plus proche dans **12 m**. Une cible **automatique** déjà acquise est conservée jusqu'à **14 m** (anti-oscillation) ; cette marge ne permet **pas** une nouvelle acquisition entre 12 et 14 m (D120). La sélection automatique ne déclenche ni attaque, ni déplacement, ni orientation permanente, et ne remplace jamais une cible manuelle valide. Pas de changement incessant entre deux ennemis à distances presque égales.

### 4.2 Sélection manuelle
Clic gauche : sélection directe. Tab : parcours stable et prévisible des ennemis sélectionnables dans les 12 m. Morts, désactivés et non sélectionnables exclus. **[v1.3]** Les **mannequins d'entraînement sont ciblables** (D141, remplace D124) : sélection au clic, Tab, acquisition automatique et touche 1 comme un ennemi, mais sans IA, sans aggro ni comportement. Distinction : une **entité ciblable** (composant `Targetable`) peut être un ennemi (avec IA) ou un mannequin (sans IA) ; un objet avec `Health` mais sans `Targetable` n'est pas une cible du joueur. **[v1.2]** La sélection au clic utilise un raycast avec une tolérance limitée, sans grande zone invisible (D127).

### 4.3 Persistance
La cible manuelle reste sélectionnée au-delà de 12 m (portée d'acquisition, pas de conservation). Libérée si elle meurt, disparaît, devient non sélectionnable, est remplacée, ou est désélectionnée (Échap). **[v1.2]** Un ennemi qui entre en retour protégé (`Return`) devient non sélectionnable ; s'il était la cible manuelle, elle est libérée immédiatement, puis l'acquisition automatique reprend normalement sans déclencher d'attaque (D132).

### 4.4 Priorité
Une cible manuelle reste prioritaire même si un autre ennemi est plus près : la touche 1 reste dirigée vers elle et échoue si elle est hors de portée.

### 4.5 Attaque sans cible manuelle **[v1.2]**
Sans cible manuelle, la touche 1 choisit l'ennemi valide **le plus proche réellement à portée de la capacité**. Une cible automatique éloignée ne bloque pas la frappe d'un ennemi proche (D121). Sinon l'attaque est refusée. Jamais d'attaque sans pression volontaire.

### 4.6 Affichage
Indicateur discret : lisible en isométrique, distinct des télégraphes ennemis, stable, supprimé dès que la cible devient invalide. Pas d'effet lumineux excessif ni de grande flèche.

## 5. Exécution des attaques

### 5.1 Validation avant lancement
Cible valide, portée, visibilité, disponibilité, ressources. Si une condition échoue : aucune animation, aucun dégât, aucune ressource, **aucun cooldown**, aucun déplacement. Retour bref (« Hors de portée »), messages répétés limités.

### 5.2 Orientation **[v1.2]**
Dès la pression sur 1, le personnage s'oriente vers sa cible, **sans modifier les timings validés** (D123). La priorité commence au déclenchement de l'attaque et se termine à la fin de sa récupération (D130), puis le contrôle revient au système habituel (orientation vers le curseur, D119). Pas de regard permanent, pas d'approche automatique. Dépendance technique : `PlayerAim` réimpose le regard chaque image (A4 de l'audit).

### 5.3 Monocible
Une seule cible subit les dégâts par activation. Arc, portée et obstacles continuent d'être pris en compte ; le ciblage ne garantit pas l'impact.

### 5.4 Aucune répétition, aucun tampon
Une pression = une demande. Le maintien ne répète pas. Une pression pendant le cooldown est perdue (D126). Le tampon de l'esquive est un mécanisme distinct, non modifié.

## 6. Rencontres

**A — Trois ennemis indépendants** : espacés ; détection, poursuite, attaque, abandon et réapparition individuels ; attaquer E1 n'alerte pas E2 ni E3.
**B — Meute de trois gobelins** : alerte collective si un membre détecte le joueur ou subit une agression valide (membres disponibles seulement, jamais un membre en retour protégé ou mort). Ensuite : poursuite, attaque, abandon, PV et états individuels ; retour protégé ; réapparition selon l'engagement de la meute.
Les deux rencontres sont spatialement séparées (zone de test dédiée).

## 7. Difficulté
Ennemis ordinaires fragiles : hypothèse **60 à 80 PV** (3 à 4 coups de 20), point de départ de test. Le monstre de référence M4.3 (100 PV) n'est **pas** modifié : nouveau prefab dérivé et définition séparée.

## 8. Attaques ennemies
Indépendantes, sans réservation de créneaux. Timings M4.3 conservés : 10 dégâts, windup 0,60 s, fenêtre active 0,15 s, récupération 0,70 s, intervalle 1,80 s, verrouillage de direction 0,45 s. Aucune réduction des dégâts cumulés.

## 9. Télégraphes et lisibilité
Lisibles et discrets : préparations identifiables, zones compréhensibles, effets superposés qui ne masquent pas les ennemis, ripostes R25 reconnaissables, retours d'esquive compréhensibles. Pas de grande alerte périphérique.

## 10. Navigation et évitement
Évitement souple : se contourner, éviter les superpositions durables ; ni poussée violente, ni tremblement, ni bouchon, ni blocage injuste du joueur, ni traversée des obstacles. Pas d'encerclement tactique. Esquive inchangée.

## 11. Poursuite individuelle et retour protégé
Par ennemi : point d'origine, laisse, détection, perte de cible, retour. Références M4.3 : détection 9 m, perte 14 m, laisse 18 m, poursuite 3,5 m/s, retour 4,5 m/s. Un ennemi peut abandonner pendant que les autres combattent. Retour protégé : termine son retour, pas de réengagement, pas d'attaque, PV récupérés (M4.3), disponible après réinitialisation. La propagation d'aggro ne l'interrompt pas.

## 12. Réactions aux coups et anti-stunlock
M4.3 conservé : Hit, Stagger 0,30 s, protection 0,50 s après, interruption avant le verrouillage, recul 0,35 m maximum, mort prioritaire, riposte R25. États propres à chaque ennemi. Surveiller recul et navigation multi-agents (R26).

## 13. Mort et réapparition
Séquence M4.3 par ennemi : mort 1 s, cadavre visible jusqu'à 3 s, enfoncement 3 à 3,6 s, réapparition possible dès 4 s ; collisions coupées à la mort. Ennemis indépendants : délai propre. **Meute** : délai propre par membre, mais pas de réapparition tant que la meute est engagée (au moins un membre vivant combat ou termine son retour protégé). Ensuite les réapparitions sont autorisées, **délais écoulés conservés**, conditions de sécurité spatiale applicables : jamais sur le joueur, dans un obstacle ou dans un autre agent (R27). Les 4 s sont une valeur de prototype.

## 14. Découpage (aucune autorisation d'implémentation)

Chaque phase attend la validation de la précédente. Ordre et dépendances vérifiés par l'audit : 4.4.1 → 4.4.2 → 4.4.3.

**M4.4.1 — Commandes PC et ciblage hybride.** Registre d'ennemis ; sélection (clic avec raycast, Tab, Échap) ; acquisition 12 m / conservation automatique 14 m ; liaison de la touche 1 et suppression du clic d'attaque, du maintien et du tampon d'attaque ; déplacement du debug d'équipement sur F1/F2 ; vérification de portée avec refus sans cooldown ; orientation à la pression et priorité pendant l'attaque ; attaque monocible (filtre de cible du résolveur, résolveur inchangé) ; indicateur de cible ; migration des tests utilisant le clic gauche. Validation : un ennemi, puis plusieurs cibles passives (aucune IA nouvelle).
**M4.4.2 — Rencontres et aggro.** Prefab dérivé à 60-80 PV ; zone de test séparée ; trois ennemis indépendants ; meute de trois gobelins et alerte collective ; poursuite et retour individuels ; évitement souple.
**M4.4.3 — Combat collectif et finition.** Attaques simultanées indépendantes ; télégraphes superposés ; réactions et R25 par ennemi ; mort et réapparition différée de meute (porte de réapparition étendue) ; équilibrage initial ; non-régression ; mesures et validation WebGL.

## 15. Plan de tests

**Commandes et ciblage** : C01 clic sur ennemi = sélection sans attaque ; C02 clic dans le vide = rien ; C03 Tab prévisible ; C04 ennemi à 5 m acquis ; C05 ennemi à 13 m sans cible : pas d'acquisition ; C06 cible manuelle à 20 m conservée ; C07 pas de substitution par un ennemi proche ; C08 touche 1 à portée = une attaque ; C09 maintien sans répétition ; C10 pression pendant cooldown sans attaque différée ; C11 hors portée = refus sans cooldown ; C12 sans cible manuelle, ennemi à 2 m = acquisition et frappe ; C13 plusieurs ennemis dans l'arc, un seul touché ; C14 cible morte libérée ; C15 attaque puis déplacement sans verrouillage permanent. **[v1.2] ajouts** : C16 cible automatique conservée à 13 m, mais non acquise à 13 m ; C17 cible automatique éloignée et ennemi proche à portée : la frappe va à l'ennemi proche ; C18 Échap désélectionne la cible manuelle ; C19 **[v1.3]** un mannequin est sélectionnable par clic, Tab et acquisition automatique, subit les coups de la touche 1 (portée, refus hors de portée, un seul touché), ne réagit pas (aucune IA) ; un objet avec Health mais sans Targetable n'est pas une cible ; l'ennemi et les mannequins se parcourent successivement avec Tab ; C20 orientation vers la cible dès la pression, puis retour à l'orientation vers le curseur ; C21 F1/F2 changent l'armure, la touche 1 ne le fait pas ; C22 une cible manuelle qui entre en `Return` est libérée immédiatement et n'est pas sélectionnable, puis l'acquisition automatique reprend sans attaque ; C23 Échap, F1/F2 et Tab vérifiés dans un build WebGL réel.
**Aggro et navigation** : A01 à A07 (v1.1 inchangés : pas d'alerte pour E1 indépendant, E2 s'active à la détection, alerte de meute, pas de superposition durable, esquive entre deux ennemis, retour individuel, pas de réengagement en retour).
**Combat collectif** : B01 à B07 (v1.1 inchangés : cycles indépendants, menaces identifiables, invulnérabilité, stagger et R25 limités à E1, aucun impact après la mort, aucun dégât dupliqué).
**Réapparition** : R01 à R07 (v1.1 inchangés : individuelle, meute différée, retour en cours = engagée, autorisée après retour, joueur proche, point occupé, délai conservé).
**Non-régression M4.3** : déplacement, esquive, timings et dégâts de hache, attaques ennemies, verrouillage, stagger, knockback, R25, mort, retour, réapparition, obstacles. Référence : 243 tests ; les tests utilisant le clic gauche (environ 24 usages) sont migrés vers la touche 1 sans supprimer leurs garanties.

## 16. Risques
Voir `Docs/RISKS.md` : R23 (performances Web), R26 (recul et agents), R27 (réapparition), R28 (migration des tests et de la liaison), R29 (touches Échap, F1 dans le navigateur), R30 (orientation contre la visée), R31 (alerte de meute et réengagement).

## 17. Hors périmètre
Barre d'action, nouvelles compétences, rotations de classe, AoE jouables, cooldowns globaux, Tank/DPS/Healer, champions, boss, patrouilles, encerclement, menace avancée, loot, niveaux, multijoueur, refonte artistique, vraie zone du monde.

## 18. Conditions de clôture
Commandes conformes ; aucune attaque automatique ; touche 1 par pression volontaire ; ciblage automatique et manuel fiable ; conditions des attaques ciblées respectées ; deux rencontres fonctionnelles ; attaques ennemies indépendantes ; télégraphes lisibles ; évitement satisfaisant ; poursuites et retours individuels ; réapparition de meute différée ; M4.3 sans régression ; tests automatiques passés ; build WebGL validé ; **ressenti approuvé par le porteur du projet** (la réussite technique ne suffit pas : le combat doit être amusant).

## 19. Collaboration
Audit fait (`AUDIT_M4_4.md`). Une sous-phase à la fois, tests puis présentation, validation manuelle avant la suite. Aucune fonction hors périmètre, aucune décision de conception modifiée sans signalement. **Ce document n'autorise pas le développement.**
