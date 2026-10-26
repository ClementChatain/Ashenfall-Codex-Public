# Tester M4.3 : coups reçus, mort et réapparition de l'ennemi

**Statut : terminé et validé manuellement (2026-10-21).** Les clips Hit (0,30 s) et Death (1,0 s) sont ceux de la phase 1 (inchangés). Rien ne change pour le joueur (M1 à M3) ni pour les valeurs d'attaque de l'ennemi (M4.2).

## Ce qui est nouveau

| Situation | Comportement |
|---|---|
| Tu frappes l'ennemi en **Idle** | Flash blanc + réaction Hit (**Stagger 0,30 s**, recul jusqu'à 0,35 m en 0,15 s), puis il te poursuit (alerte). |
| Tu le frappes en **poursuite** | Stagger, puis la poursuite reprend. |
| Tu le frappes **pendant l'anticipation de son attaque, avant 0,45 s** (secteur rouge qui se remplit) | L'attaque est **annulée** : le secteur disparaît tout de suite, aucun dégât, Stagger. Son intervalle de 1,80 s reste compté depuis le début de l'attaque annulée. |
| Tu le frappes **après 0,45 s**, pendant la frappe ou la récupération | L'attaque continue (comme en M4.2) ; les dégâts s'appliquent quand même. |
| **Riposte protégée (R25)** : l'attaque qui suit une vraie interruption | **Contour bleu acier** sur l'indicateur et bref éclat clair sur l'ennemi au lancement. Tes coups lui font des dégâts mais ne l'interrompent ni ne le font reculer ; l'esquive, le mur et la sortie de zone marchent comme d'habitude. Une seule attaque est protégée : la suivante est de nouveau interruptible (contour rouge). |
| Tu le frappes **pendant Stagger ou dans les 0,50 s qui suivent** (protection totale 0,80 s) | Les dégâts s'appliquent, le flash aussi, mais **ni nouveau Stagger, ni nouveau Hit, ni nouveau recul**. |
| Il **rentre au départ** (Return) | Dégâts oui, Stagger et recul non (décision de M4.1). |
| Il **meurt** | Annulation immédiate de l'attaque, colliders coupés (tu peux le traverser, il ne bloque ni tes coups ni la vue), animation Death. Le corps reste visible. |
| Chronologie du cadavre | 0 à 1,0 s chute ; 1,0 à 3,0 s immobile ; 3,0 à 3,6 s s'enfonce dans le sol ; 3,6 s invisible. |
| **Réapparition** | À 4,0 s, au point de départ, orientation initiale, PV pleins, Idle. **Reportée** tant que **toi (vivant)** es à moins de 2 m du point de départ ; elle a lieu dans les 0,25 s qui suivent ton éloignement. Si tu es mort, rien ne la retient. |

## Lancer

- **Unity :** `Assets/_Ashenfall/Scenes/Sandbox`, Play, clic dans la vue Game.
- **Navigateur :** `node Tools\serve-web.js Unity\Builds\WebDev 8081` puis `http://127.0.0.1:8081/` (Ctrl+F5). L'ennemi est en (6, 0, 11), derrière le mur ; contourne-le par l'est.
- Le jeu écrit dans la console chaque état (`Chase -> Stagger`, `Stagger -> Chase`, `Attack -> Stagger`, `Dead`, `Dead -> Idle`) et chaque phase d'attaque.

## Les vérifications

| # | Test | Résultat attendu |
|---|---|---|
| 1 | Frappe l'ennemi inactif ou en poursuite | Flash blanc, il se cambre (Hit), recule d'un pas, se redresse ; console : `Stagger` puis `Chase` (0,30 s). Aucun gonflement ni inclinaison parasite. |
| 2 | Frappe-le tout de suite après le début de son attaque (secteur rouge qui commence à se remplir) | Attaque annulée, secteur rouge disparu, **aucun** `Joueur : -10 PV`. |
| 3 | Frappe-le quand le secteur est presque plein, ou pendant la frappe | L'attaque va à son terme (−10 PV si tu restes dans la zone). |
| 4 | Frappe-le deux fois de suite à moins de 0,8 s d'intervalle | Une seule réaction Hit ; la 2e frappe retire des PV sans nouveau Stagger. |
| 5 | Pousse-le contre le grand mur (place-toi pour qu'il soit entre toi et le mur) puis frappe | Il recule moins ou pas du tout, jamais dans le mur. |
| 6 | Tue-le (5 coups) | Il tombe en arrière (1 s), reste au sol, s'enfonce, disparaît à 3,6 s. Pas de disparition immédiate. |
| 7 | Traverse l'endroit où gît le cadavre | Aucun obstacle ; frappe un mannequin derrière le cadavre : le coup passe. |
| 8 | Tue-le en restant à moins de 2 m de son point de départ (6, 0, 11) | Il ne revient pas tant que tu restes là ; il réapparaît juste après que tu t'éloignes. |
| 9 | Tue-le puis éloigne-toi | Réapparition à 4,0 s au point de départ, debout, sans pose résiduelle de chute, PV pleins, il te détecte de nouveau. |
| 10 | Répète 3 fois mort / réapparition | Même comportement chaque fois. |
| 11 | Console | Aucune erreur rouge. |

## Test ciblé R25 : la riposte protégée

À faire en dernier. Reste en face de l'ennemi et **maintiens le clic gauche** (une frappe toutes les 0,45 s) pendant 30 s, en bougeant un peu pour rester à portée.

| # | Ce que tu observes | Attendu |
|---|---|---|
| R1 | Tu interromps une attaque (secteur rouge, tu le frappes tôt) | Il tressaille ; 1 à 2 s plus tard son attaque suivante part avec un **contour bleu acier** et un éclat clair sur son corps. |
| R2 | Tu le frappes pendant cette attaque bleue | Il perd des PV, flash blanc, mais **ne bouge pas et ne s'arrête pas** : l'attaque va à son terme. |
| R3 | Tu restes dans la zone | Tu perds 10 PV. Si tu esquives (Espace), ou sors de la zone, ou te mets derrière le mur : aucun dégât, et « ESQUIVÉ ! » comme avant. |
| R4 | L'attaque suivante | Contour rouge normal : tu peux de nouveau l'interrompre. |
| R5 | Sur 30 s en frappant sans arrêt | Il lance environ 15 attaques, tu en interromps environ la moitié, l'autre moitié va à son terme (le bleu). Tu ne dois plus le voir interrompu 100 % du temps. |
| R6 | Tu le tues pendant une attaque bleue | Mort immédiate, plus de bleu ; à la réapparition, aucune trace de bleu ni d'éclat, et sa première attaque est rouge. |

## Tests automatiques

Test Runner, PlayMode, Run All : 243 tests (41 nouveaux dans `M43GameplayTests` ; 3 anciens tests M4.1/M4.2 mis à jour : un coup en Idle provoque d'abord un Stagger de 0,30 s ; un coup avant le verrouillage interrompt l'attaque).

Ligne de commande :
`Unity.exe -batchmode -projectPath C:\DEV\ASHENFALL\Unity -runTests -testPlatform PlayMode -testResults C:\DEV\ASHENFALL\Unity\Logs\results.xml -logFile C:\DEV\ASHENFALL\Unity\Logs\tests.log`

## Reconstruire (si besoin)

```
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.DwarfAnimationBuilder.AddHitDeathStatesToController
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.EnemyBuilder.Build
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.M1SandboxBuilder.Build
Unity.exe -batchmode -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.ProjectBootstrap.BuildWebDevelopment
```

## Bilan de M4.3

**Périmètre livré :** Hit et réaction aux dégâts ; Stagger 0,30 s ; protection temporelle 0,80 s ; interruption avant le verrouillage à 0,45 s ; riposte protégée (signal bleu acier : contour de l'indicateur et éclat de 0,18 s) ; recul de 0,35 m au plus limité par le NavMesh ; animation Death et état Dead ; cadavre visible, enfoncé de 3,0 à 3,6 s puis masqué ; réapparition à 4,0 s au point de départ, différée si le joueur vivant est à moins de 2 m ; colliders des cadavres désactivés (D84). Aucun changement des valeurs M1 à M4.2.

**Valeurs gameplay validées :** Stagger 0,30 s ; protection supplémentaire 0,50 s (0,80 s au total) ; verrouillage de la direction 0,45 s ; recul 0,35 m sur 0,15 s ; réapparition 4,0 s, zone libre 2 m ; riposte protégée : une seule attaque ; attaque ennemie inchangée (10 dégâts, portée 1,6 m, arc 100°, anticipation 0,60 s, phase active 0,15 s, récupération 0,70 s, intervalle 1,80 s).

**Résultats automatisés :** suite PlayMode complète **243/243**, 0 échec, 0 ignoré (dont 41 tests dans `M43GameplayTests`, 8 dans `HitDeathAnimationTests`). Trois tests M4.1/M4.2 mis à jour car ils encodaient des comportements remplacés (D110).

**Validation manuelle :** phase 1 (animations) approuvée visuellement ; phase 2 : cinq vérifications initiales réussies ; correctif R25 : six vérifications réussies ; feedback d'esquive, mort, cadavre, disparition et réapparition validés.

**Vérifications WebGL (navigateur réel, build de développement) :** interruption à 0,153 s et aucune à 0,500 s ; recul 0,35 m en terrain libre, 0,10 m contre le mur ; cadavre visible jusqu'à 3,5 s, enfoncement 0,56 m à 3,5 s, réapparition à 4,0 s ; réapparition reportée avec le joueur à 1,5 m du départ ; trois cycles de mort ; scénario R25 de 30 s : 15 attaques lancées, 8 interrompues, 7 protégées, 7 terminées, 7 coups reçus ; 143 à 167 images/s ; aucune erreur dans la console. Captures : `Docs/Art/M4/phase1_animations/` et `Docs/Art/M4/phase2_gameplay/`. Le harnais de validation était temporaire et n'a jamais été commité.

**Limitations connues (risques ouverts) :** R26 (recul précis à environ 0,1 m près des obstacles, autres agents non pris en compte) ; R27 (la réapparition ne tient compte que du joueur, pas des autres ennemis) ; R24 (valeurs de combat provisoires) ; R19, R20, R21 (qualité artistique, écart visuel et capsule, lisibilité sur certains matériaux). R25 est clos.

**Références Git :** phase 1 : `8904642` (clips), `845b7bd` (docs), `037e4f4` (captures nommées) ; phase 2 : `791efde` (gameplay), `ece9e81` (tests), `37467e2` (combat prolongé), `7eeba34` (Sandbox), `8a38335` (docs) ; correctif R25 : `796ad5d` (gameplay), `53f8915` (tests), `f7164e7` (docs).
