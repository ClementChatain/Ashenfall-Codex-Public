# Instructions de travail — Ashenfall Knowledge

Respecter `governance/ARCHIVISTE_V2.md` et les instructions utilisateur. Les mécaniques et valeurs proposées ne deviennent pas validées par une simulation ou une génération de document. Préserver les modifications en cours et les frontières privé/public.

## Demandes d’équilibrage des classes

Lorsque Clément demande d’équilibrer une classe, plusieurs classes, un arbre, un template ou une synergie :

1. Lire `docs/EQUILIBRAGE.md` puis `balance/scenario-contracts-v1.json`. Utiliser cette méthode plutôt que réinventer les formules et les objectifs à chaque session.
2. Lancer `python3 scripts/balance.py readiness`. Vérifier la source et l’actualité du catalogue pour **toutes les 24 classes** lorsqu’une comparaison globale est demandée. Aucun coefficient manquant ne vaut zéro.
3. Distinguer données de référence, hypothèses explicites et décisions validées. Les valeurs proposées dans une conversation ou un fichier restent PROPOSITION jusqu’à validation de leur version par Clément.
4. Comparer des builds légaux à budget, niveau, équipement et contexte identiques, au sein d’un même rôle puis par composition de groupe. Ne jamais classer Tank, Heal, DPS mêlée et DPS distance sur le seul DPS.
5. Exécuter uniquement les scénarios et effets réellement pris en charge. Le banc Python V1 n’est pas un moteur de combat MMORPG complet et ne résout pas automatiquement Garde, les zones, la mobilité, les contrôles, le PvP ou les arbres. Ne pas appeler « classe équilibrée » un profil de test synthétique.
6. Toute proposition doit inclure avant/après, sources et versions, formules de cumul, scénarios, compromis de rôle, sensibilité, limites et changements exacts. Conserver les entrées/rapports permettant de reproduire les résultats.
7. Exécuter `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -q` après modification du moteur. Conserver la vérification d’export existante. Les fixtures `test_only` ne sont jamais des données de production.
8. Ne pas appliquer automatiquement des coefficients à Unity ou au site. Une demande de calcul autorise le travail et les propositions internes ; une modification des valeurs de jeu ou leur publication suit l’autorisation correspondante de Clément et la gouvernance existante.

Point d’entrée : `docs/EQUILIBRAGE.md`. Catalogue initial : `balance/catalog-v1.json`. Exécution : bibliothèque standard Python, aucune dépendance supplémentaire.

## Référence Rempart V1

Pour le Rempart Bastion/Fracture/Vigie, lire `docs/REMPART_REFERENCE_V1.md`. Les données sont dans `balance/rempart-reference-v1.json` ; le moteur spécialisé est `scripts/simulate_rempart.mjs`. Exécuter ses tests Node et les tests Python. Réutiliser les données du profil avant de proposer des chiffres concurrents. Préserver les valeurs publiques historiques et les correspondances explicites entre noms. Les 23 autres classes restent à compléter ; le moteur Python général et le moteur Rempart ont des périmètres distincts, documentés.

## Portail de travail et lecture commune des IA

Décision de Clément du 26 octobre 2026 : conserver le dépôt privé et centraliser le contenu du projet dans un portail web lisible par les IA. Lire `portal/decision-portail-2026-10-26.md`, `portal/lecture-ia.md`, `portal/etat-projet.md` et `portal/evolutions.md` avant une mission transversale. Conserver les statuts : une proposition consultable ne devient pas canonique. Cette exception de consultation documentaire ne modifie pas les contrôles de publication officielle V2.

Le portail est en préparation tant qu'aucune URL et preuve de déploiement ne sont consignées. Ne jamais prétendre l'avoir consulté ou avoir synchronisé d'autres IA sans lecture effective. Utiliser le dépôt authentifié si le portail est indisponible. Après une évolution significative, actualiser les sources et le relais ; le site change seulement après reconstruction et publication de la révision concernée. Ne pas exporter la racine du dépôt ou des conversations brutes.


