# Maîtrises natives des classes

Le simulateur est intégré dans l’onglet **Maîtrises** des 24 fiches : `/#/rempart/maitrises`, par exemple. Les anciennes adresses `/simulateur/classes/?classe=…` et `/simulateur/rempart/` redirigent vers cet onglet ; leurs sauvegardes sur le même domaine restent accessibles.

## Sources et architecture

- `data/masteries-source-v1.json` conserve les définitions des anciens prototypes publics, relevées au commit indiqué dans ce fichier. Aucun contenu du dépôt privé n’est exporté.
- `node scripts/build_mastery_definitions.mjs` produit `site/assets/classes/masteries-v1/definitions.mjs` : 24 modèles par rôle et le modèle historique Rempart Bastion / Fracture / Vigie. Les deux modèles Rempart restent distincts et sélectionnables ; le second est celui ouvert par défaut sur sa fiche.
- `engine.mjs` centralise validation, dépenses, prérequis, commandes atomiques, import et migrations. `storage.mjs` protège la persistance. `component.mjs` fournit le composant et `integration.mjs` le relie aux onglets existants. `route.js` fournit le parseur commun aux trois moteurs de présentation du Codex. Aucun framework, paquet npm ou build de production nécessaire.
- URL partageable : `#/identifiant/maitrises?mode=v8|generic&build=…`. Le fragment contient le build ; aucun serveur de sauvegarde n’est ajouté. Les définitions sont chargées lorsque l’onglet est ouvert.

## Règles préservées et limites

20 points communs, trois voies de huit talents, deux rangs maximum, paliers 0/5/10. Les prérequis comptent les **autres points de toute la voie**, y compris les talents supérieurs, comme dans le prototype précédent. Les synergies coûtent deux points et exigent cinq points dans chacune des deux voies concernées. Un remboursement qui invaliderait un prérequis est refusé avec une explication.

Les choix manquants au rang 2 restent un brouillon signalé. La barre propose 10, 20 ou 30 emplacements ; réduire sa taille conserve les emplacements masqués et ramène la sélection dans la partie visible. Rembourser un élément enlève ses affectations devenues indisponibles. L’arme est indicative. Les talents dont la nature active/passive n’est pas définie sont identifiés comme tels. Aucun calcul de dégâts, soins, statistiques ou combat n’est implémenté. Les définitions demeurent des éléments de conception EN_ETUDE, pas du lore nouvellement validé.

## Sauvegardes

Format 2, identifiants stables et empreinte de définition ; clé `ashenfall-build-v2:<classe>:<modèle>`. Les clés historiques `ashenfall-all-masteries-v1-<classe>` et `ashenfall-rempart-v8` sont lues et conservées sans modification. Une sauvegarde mal formée n’est jamais chargée partiellement. Un original incompatible au nouveau format est sauvegardé sous une clé `:backup:<horodatage>` avant remplacement ; si cette copie échoue, l’original n’est pas écrasé. Export de l’original proposé lors du diagnostic. En cas de stockage bloqué ou saturé, le build reste utilisable en mémoire avec un avertissement et un export JSON.

Imports JSON et liens partagés passent par la même validation : rangs entiers, budget, paliers, synergies uniques, choix, version/classe, emplacements et raccourcis. Les champs ne sont jamais interprétés comme HTML. Annuler/rétablir conserve 40 opérations de la session ; le chargement d’un lien partagé est annulable.

## Vérification et publication

```sh
node --test tests/masteries_engine.test.mjs
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -q
python3 scripts/verify_public_v2.py --for-deployment
# Avec le serveur public local décrit dans le README et Playwright installé :
python3 scripts/smoke_native_masteries.py --base-url http://127.0.0.1:8030/
python3 scripts/smoke_all_peoples.py --base-url http://127.0.0.1:8030/
python3 scripts/smoke_codex_ui.py --base-url http://127.0.0.1:8030/
```

Les ressources natives restent dans `assets/classes/`, déjà copié par Pages et couvert par les empreintes de `publication/v2-release.json`. Les tests Node sont exécutés par les workflows de validation et de déploiement. Développer sur une branche issue de `main`, fusionner puis déclencher `pages.yml` sur `main` avec le SHA complet. Contrôler ensuite les fichiers et la navigation sur le domaine actuel avant d’annoncer la mise en production.

Travail futur : valider les coefficients et la classification active/passive avant tout calcul de combat ou restriction d’équipement ; prévoir une migration explicite si les définitions changent. Les illustrations et les 278 fiches publiques ne sont pas modifiées par cette intégration.

## Templates proposés du Rempart

Sur le modèle Bastion / Fracture / Vigie, trois cartes proposent les répartitions approuvées dans la conversation : **La Citadelle** (12/0/6 + Rempart Vivant), **Le Broyeur** (6/12/0 + Riposte de Fer) et **Le Garde du corps** (0/6/12 + Défi Fracassant). Chaque build dépense 20 points et renseigne les choix de rang 2. Leur détail est consultable avant chargement ; aucun template n’est appliqué automatiquement à l’ouverture.

`presets.mjs` construit chaque configuration par les commandes du moteur et valide les prérequis à chaque étape. Le chargement est une opération annulable et sauvegardée ; il conserve l’équipement indicatif, les emplacements et les raccourcis, en libérant uniquement les affectations devenues indisponibles. Les exemples restent modifiables, exportables et partageables comme les autres builds. Ils ne changent ni les talents ni les coefficients. Le Garde du corps conserve le choix PvE du Balayage présenté dans la proposition initiale.

## Lecture des talents et chiffres disponibles

Les cartes distinguent **Acquis** (au moins un point investi), **Disponible** et **Verrouillé** avec un libellé, une pastille et un traitement de bordure. « Acquis » décrit l’investissement, pas la classification actif/passif d’une capacité. Les choix sélectionnés sont surlignés ; les boutons radio gardent une largeur fixe.

Les sources du prototype ne définissent aucun coefficient de gain par rang ni par choix. L’interface affiche donc « valeur à définir » et ne transforme pas une absence de donnée en zéro. Sur les modèles génériques, les effets de référence disponibles sont identifiés séparément ; ils ne représentent pas le bonus obtenu en investissant un point. Toute proposition d’équilibrage doit être approuvée avant l’ajout de coefficients publics.

## Référence chiffrée Rempart V1

À la demande de Clément de mettre en place toutes les statistiques du Rempart comme référence d’équilibrage, `data/rempart-reference-v1.json` définit un profil normalisé : 10 000 PV, 1 000 puissance, 3 000 armure (30 % physique avec constante 7 000), 2 500 résistance magique (20 % avec constante 10 000), 100 Endurance (+8/s), 100 Stabilité, blocage 20 % / réduction 30 % / coût 8, parade 5 %, critique 5 % ×1,5, déplacement 5 m/s, GCD 1,5 s et menace ×3. Ce sont des paramètres de travail V1, pas des statistiques mesurées dans Unity ni des valeurs universelles imposées aux autres classes.

Le fichier couvre les 24 talents, leurs 48 choix, les six synergies et 25 actions : dix compétences de référence, quatorze actions débloquées par les talents, l’attaque de base. Les modificateurs Défi Renforcé, Contre-Frappe et Ancrage améliorent leurs compétences de base via des correspondances explicites, sans créer de doublons. Les noms publics sont préservés. Posture défensive et Esquive restent des rappels historiques du planificateur ; ils ne créent aucun bonus ou iframe implicite.

`node scripts/build_rempart_reference.mjs` génère `reference-data.mjs` depuis le fichier public autorisé. `reference.mjs` compile les chiffres avec un build validé, sans changer sa définition ni invalider ses sauvegardes : PV, coûts de blocage, durées et recharges ; gains par rang et choix ; total sélectionné avec contexte PvE. Exemples : Pieds de Pierre rang 2 + A = −30 % de distance de repoussement, pas −30 % de dégâts ; Balayage rang 2 + A = +25 % de dégâts sur la référence en PvE.

Le panneau de statistiques affiche les caractéristiques et les actions disponibles avec leurs coûts, recharges, durées, portées et effets. Les rangs remplacent le rang précédent ; les choix se rajoutent dans leur catégorie ; sources défensives distinctes multiplicatives, protections fortes au maximum. Garde partage les dégâts bruts avant la mitigation propre à chaque destinataire ; les réductions des dégâts transférés s’appliquent ensuite à la part du Rempart. Les effets de zone et de contrôle ne deviennent pas des résistances globales.

La source privée Knowledge conserve une copie identique, un moteur de benchmark spécialisé et les résultats sur les trois templates. Les essais sont des scénarios PvE de référence à deux acteurs, pas une simulation complète du MMO ou du PvP. Les coefficients sont EN_ETUDE et ajustables. Les autres modèles, notamment Rempart générique, gardent leurs chiffres inconnus explicitement signalés ; cette intégration ne prétend pas équilibrer les 23 autres classes.

Tests : `node --test tests/*.test.mjs`, contrôles Python et V2 habituels, puis `scripts/smoke_native_masteries.py` avec le serveur local. Le test de projection compare les données générées au JSON ; les tests des maîtrises continuent de vérifier les migrations et les templates historiques.
