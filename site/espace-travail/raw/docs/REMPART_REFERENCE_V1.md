# Rempart — référence d’équilibrage V1

**Statut : EN_ETUDE.** Clément a demandé dans la session du 25 octobre 2026 : « Mets en place toutes les stats pour le tank rempart ! ce sera notre base pour équilibrer tout le reste des classes ! ». Cette instruction autorise l’installation de cette base de conception et son affichage dans le Codex ; elle ne prouve pas l’équilibre en combat ni une implémentation Unity. Les paramètres manquants sont définis explicitement dans cette V1 ajustable.

## Périmètre et sources

- `balance/rempart-reference-v1.json` : profil normalisé, 24 talents, 48 choix, six synergies, 25 actions et correspondances historiques. Le snapshot exécutable `balance/rempart-v1/` conserve les mêmes données et le validateur public des builds, avec empreintes dans `source.json`.
- 25 actions = 10 compétences publiques de référence + 14 actions de talents débloquées au rang 1 + attaque de base. Les passifs ne sont pas de nouveaux boutons de combat.
- Les nombres historiquement publics sont conservés : Garde 50 %, Défi PvE 3 s / PvP 15 % sur 4 s, Coup de Heurt interruption 1 s, Interposition 12 m sans immunité, Mur d’Écho 25 % / 5 s, Ancrage 70 % / 6 s, riposte après blocage dans les 3 s, Heurt du Bastion 8 m monocible, Souffle +35 Endurance sur 4 s, Rempart Absolu 45 % / 4 s sans cumul fort.
- Les coûts, recharges, coefficients de dégâts et paramètres du personnage absents des sources sont des réglages V1 choisis pour amorcer la calibration. Ils ne sont pas présentés comme des mesures antérieures. La proposition initiale est conservée dans `balance/proposals/rempart-v1.md`.

## Personnage normalisé

10 000 PV ; puissance 1 000 ; armure 3 000 et constante 7 000, soit 30 % physique ; résistance magique 2 500 et constante 10 000, soit 20 % magique. Endurance : 100, régénération 8/s. Stabilité : 100 maximum, départ 0, décroissance 2/s après 5 s sans gain. Pas de consommation implicite ; Élan de Granit utilise le seuil de 20.

Blocage : 20 %, réduit le coup de 30 %, coûte 8 Endurance avant talents. Parade : 5 %. Critique : 5 %, multiplicateur 1,5. Déplacement : 5 m/s. GCD : 1,5 s. Mêlée : 3 m. Menace : ×3, conservée comme paramètre ; le moteur actuel ne calcule pas un classement de menace multi-PNJ. Aucun niveau final ni équipement réel n’est inventé : il s’agit d’un étalon de comparaison à équipement normalisé.

Toutes les valeurs de coûts, recharges, durées, rayons, coefficients et effets de rangs/choix sont dans le JSON. Le module public `reference.mjs` calcule les PV, coûts de blocage, durées et recharges à partir des mêmes coefficients. Les tests privés et publics vérifient leur cohérence.

## Correspondances et calculs

Défi Renforcé améliore Défi du Rempart ; Contre-Frappe améliore Contre-Heurt et utilise sa fenêtre de blocage ; Ancrage améliore Ancrage Profond. Ils ne créent pas une seconde capacité cumulable. Onde de Rupture reste une action de talent distincte du Heurt du Bastion monocible ; aucune fusion ne change son effet public. Posture défensive et Esquive restent des rappels historiques du planificateur ; aucun bonus caché ou iframe n’est ajouté à partir d’un simple nom.

Les rangs sont des totaux. Les choix sont additionnels dans leur catégorie. Exemples : Pieds de Pierre 2/A = 30 % de distance de repoussement en moins ; Balayage 2/A = 25 % de dégâts supplémentaires en PvE. Le premier n’est pas 30 % de réduction générale des dégâts.

Les réductions provenant d’une même source se regroupent ; les sources distinctes se multiplient. Les défenses fortes (Tenir la Ligne, Mur de Boucliers, Mur d’Écho, Dernier Bastion et Rempart Absolu) prennent le maximum actif, jamais la somme. Serment et Sentinelle utilisent des effets séparés explicitement définis. Une même synergie ou amélioration de zone n’ajoute pas deux fois les mêmes cibles.

Garde partage le dommage brut en deux parts avant la mitigation de chaque destinataire. La part transférée au Rempart reçoit ensuite les réductions spécialisées des dégâts transférés. Le transfert est une redistribution, pas une deuxième absorption : le moteur vérifie `brut = bloqué + mitigé + reçu tank + reçu allié + excédent létal`.

## Moteur de benchmark et résultats

```sh
node scripts/simulate_rempart.mjs --output /tmp/rempart-v1.json
node --test tests/*.test.mjs
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -q
```

Le moteur compare Citadelle, Broyeur et Garde du corps, tous à 20 points légaux, sur quatre rencontres : boss 180 s, cinq ennemis 60 s, protection d’allié 60 s et mobilité/interruption 60 s. Chaque rencontre fixe pression, soins externes, cast ennemi, repoussements et nombre de cibles. Le témoin sans point mesure l’investissement ; il n’est pas un concurrent à budget égal.

La rotation est une politique commune : interruption si possible, charge pour revenir au contact, récupération d’Endurance si nécessaire, protections d’urgence selon les PV, puis capacités de la spécialisation et attaque de base. Les protections fortes sont espacées pour éviter une dépense inutile. Le bouclier et Garde sont considérés équipés et l’allié choisi au début du test. Le tank et l’allié sont placés sur un axe simple ; l’allié est à 7 m de l’ennemi. La pression sur cet allié est environnementale et ne disparaît pas via une provocation.

Les dégâts critiques utilisent l’espérance ; les blocages/parades utilisent une trace pseudo-aléatoire à graine enregistrée, indépendante des choix offensifs. Les essais sont reproductibles, sans prétendre établir un intervalle de confiance. Le pas par défaut est 50 ms, testé à 25 ms pour la convergence. Les coûts de blocage sont réellement payés ; une Endurance insuffisante empêche le blocage et les compétences payantes. Les morts empêchent les soins de ressusciter et arrêtent la rotation du tank.

Résultats et interprétation : [balance/reports/rempart-v1.md](../balance/reports/rempart-v1.md). Le JSON contient 12 comparaisons de référence et 27 essais de sensibilité (pression ±10 % et trois graines). Les rapports incluent les empreintes du moteur et des données.

## Limites explicites et prochaine calibration

- Un tank et un allié, pas une IA complète de groupe ni un raid. Les cibles sont regroupées : les bonus de rayon ne prouvent pas une couverture spatiale supérieure.
- Les dégâts entrants des rencontres sont physiques. La résistance magique est spécifiée mais attend un scénario magique dédié. Les durées de contrôles hostiles et le contre-jeu PvP attendent un modèle dédié ; une condition non exercée n’est pas une preuve de puissance nulle.
- La mobilité est un axe simple, sans collisions, hauteur, latence ni géométrie de cône. Aucun taux de victoire PvP n’est calculé.
- Les choix et effets ont des coefficients complets, mais les quatre rencontres n’exercent pas toutes les conditions de tous les talents. Étendre les tests de rencontres avant de qualifier une branche entière d’équilibrée.
- Les trois templates ne sont pas un optimum exhaustif. Les résultats actuels montrent des différences de survie/protection/dégâts ; ils restent à confronter à une rotation jouable et à des essais Unity.

Le Rempart V8 devient un point de référence **calculable dans ce périmètre**. Les 23 autres classes et le modèle générique Rempart attendent leurs propres coefficients. Les futures comparaisons entre tanks devront utiliser les mêmes conditions et les effets effectivement modélisés, puis étendre les rencontres aux identités des classes.
