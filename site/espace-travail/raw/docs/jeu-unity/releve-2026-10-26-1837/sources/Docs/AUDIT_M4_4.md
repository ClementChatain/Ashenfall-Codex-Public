# Audit technique M4.4 (2026-10-22)

Audit en lecture seule du code M4.3 par rapport au cahier des charges M4.4 (`Docs/CDC_M4_4.md`). Aucun fichier de code touché. Les tests n'ont pas été relancés pour cet audit (la référence de 243 tests vient de `TESTER_M4_3.md`).

## Verdict

Réalisable sans refonte. Le résolveur de coups accepte déjà un filtre de cible, chaque ennemi est autonome (états, PV, stagger, protection, riposte R25, point de départ, laisse) et le retour protégé existe (état `Return`).

## Déjà prêt

| Besoin M4.4 | Existant |
|---|---|
| Attaque monocible | `MeleeHitResolver.Resolve(..., accept, ...)` : un filtre « cette cible seulement » suffit, le résolveur n'est pas modifié. |
| Ennemis indépendants | Un `EnemyBrain` par ennemi, tous les minuteurs sont des champs d'instance (B04, B05). |
| Retour protégé | En `Return`, `OnDamaged` ne change aucun état : pas de réengagement (A07). |
| Mort sans impact | `OnDied` annule l'attaque ; `HitFeedback` coupe les colliders (B06). |
| Évitement | Agents en `LowQualityObstacleAvoidance`, priorité 50. |

## Points à traiter (constatés dans le code)

| # | Constat | Fichiers | Traitement prévu |
|---|---|---|---|
| A1 | L'attaque lit `IsPressed()` à chaque image et la liaison est `<Mouse>/leftButton` : répétition au maintien. | `MeleeAttack.cs`, `AshenfallControls.inputactions` | Détection de nouvelle pression seulement ; liaison sur la touche 1 (M4.4.1). |
| A2 | Tampon d'entrée de 0,15 s : une pression pendant le cooldown est mémorisée et lancée seule (contraire à CDC 5.4 / C10). | `MeleeAttack.cs` (`inputBuffer`, `bufferedUntil`) | Suppression du tampon pour l'attaque. Le tampon de l'esquive est un autre mécanisme, hors périmètre. |
| A3 | Touches `1` et `2` (et pavé numérique) déjà liées à `Debug/EquipHeavy` et `EquipLight`. | `ArmorDebugKeys.cs`, `AshenfallControls.inputactions`, tests M3b.3 | Déplacer vers F1/F2 (D125). Aucune liaison F1/F2 existante dans le code. |
| A4 | `PlayerAim` réimpose le regard vers le curseur à chaque image : l'orientation vers une cible ≠ curseur serait annulée aussitôt. | `PlayerAim.cs`, `PlayerMotor.cs` (`SetFacingOverride`, `SnapFacing`) | Priorité d'orientation vers la cible pendant l'attaque, restituée ensuite (D119, D123). |
| A5 | Aucun registre d'ennemis (seul le joueur est cherché, par tag). | `EnemyBrain.cs` | Registre statique (ajout/retrait `OnEnable`/`OnDisable`), sans recherche par image (WebGL, R23). |
| A6 | Sélection souris : collider 1,9 m pour un visuel de 1,53 m (R20). | `EnemyBuilder.cs`, `PlayerAim.cs` | Raycast avec tolérance limitée, sans grande zone invisible (D127). |
| A7 | Réapparition : `CanRespawn` ne regarde que le joueur à moins de 2 m. | `EnemyBrain.cs`, `Health.cs` (`ReviveGate`, retest 0,25 s) | Ajouter état de meute, point libre, délai conservé (R27, M4.4.3). |
| A8 | Pas d'alerte collective. | — | Composant de groupe appelant une méthode d'alerte des membres ; ignore `Return` et `Dead` (M4.4.2). |
| A9 | Ennemi de référence à 100 PV (`EnemyBuilder`). | `EnemyBuilder.cs`, `EnemyBrute.asset` | Nouveau prefab dérivé et définition séparée à 60-80 PV ; le monstre de référence M4.3 reste intact. |
| A10 | Sandbox : un seul ennemi, derrière le mur. | `M1SandboxBuilder.cs` | Zone de test séparée pour les deux rencontres (M4.4.2). |
| A11 | Tests dépendant du clic gauche : environ 24 usages de `leftButton` (M2 : 8, M3 : 8, M3b.2 : 4, M3b.3 : 4). | `Tests/PlayMode` | Migration vers la touche 1 ; les autres garanties ne sont pas supprimées. |
| A12 | Indicateurs et vignettage en `OnGUI`/maillages par ennemi. | `EnemyAttackIndicator.cs`, `PlayerDamageFeedback.cs` | Mesure à 3 ennemis sur WebGL (R23). |

## Échap et F1/F2

Aucun usage d'Échap dans le code du jeu (seule une entrée héritée du gestionnaire d'entrées par défaut d'Unity). Échap peut donc désélectionner la cible manuelle. Dans un navigateur, Échap quitte le plein écran et peut libérer le pointeur : à vérifier en WebGL (R29). F1 ouvre l'aide dans certains navigateurs : à vérifier également (R29).

## Arbitrages du 2026-10-22

Quatre points ouverts tranchés par le porteur du projet (D129 à D132) : attaque maintenue de M3b.2 officiellement remplacée ; priorité d'orientation du déclenchement à la fin de la récupération ; Échap, F1/F2 et Tab conservés sous réserve de vérification en build WebGL (aucun changement de commande sans signalement) ; ennemi entrant en `Return` non sélectionnable et libéré s'il était la cible manuelle.

## Compatibilité du découpage

M4.4.1 (commandes, ciblage) ne dépend d'aucune nouvelle IA. M4.4.2 (rencontres, alerte, évitement) dépend du registre d'ennemis de M4.4.1. M4.4.3 (combat collectif, réapparition, équilibrage, WebGL) dépend des deux. Le découpage tient, avec deux précisions consignées dans le CDC : le prefab à 60-80 PV est créé en M4.4.2 (premier besoin) ; la porte de réapparition de meute est en M4.4.3.
