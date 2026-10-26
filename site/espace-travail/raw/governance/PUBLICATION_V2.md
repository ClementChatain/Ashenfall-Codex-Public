# Publication V2 — procédure d'installation et limites

Cette réparation est préparée en PR ; elle ne fusionne ni ne déploie rien. La PR Knowledge consolide le contrat de la PR #5, les preuves de la PR #6 et les corrections. Les rapports de validation antérieurs restent historiques.

## Autorité et données

- `canon/lore/*.json` : fiches internes. Seule une fiche VALIDE/PUBLIC, sans contradiction bloquante ni marqueur de test, peut être sélectionnée.
- `decisions/*.json` : décision du créateur liée à l'identifiant, la version, la date et l'empreinte du contenu validé. Les références aux preuves doivent exister dans `sources/decisions/`.
- `publication/v2-approved.json` : approbation de publication distincte, liée aux empreintes exactes de la fiche et de sa projection publique. Ce fichier est initialement vide ; aucun export n'est autorisé.
- `public_projection` est une liste blanche de cinq champs : id, category, title, summary, body. Aucune copie implicite du corps privé, des notes, des sources ou des assets. L'approbation de cette projection requiert une revue sémantique par le créateur : aucun programme ne sait reconnaître tous les spoilers.
- Les empreintes garantissent l'intégrité après décision ; elles ne sont pas une signature cryptographique du créateur. La provenance et l'authenticité sont contrôlées lors de la revue des PR par Clément. Les administrateurs capables de changer code et approbations conservent leur autorité GitHub.

## Synchronisation

1. Fusionner les correctifs uniquement après approbation. Installer la PR publique et la PR Knowledge. Rien n'est activé sur main par la préparation seule.
2. Pour une version publique validée, créer une projection explicitement revue et son approbation exacte. Ne pas réutiliser `provisional_entries` de l'ancien exporteur.
3. Le workflow Knowledge `sync-v2.yml` est uniquement manuel et uniquement sur main. L'entrée approved_commit doit correspondre exactement au commit exécuté. Il réutilise l'environnement codex-publication et le secret CODEX_PUBLIC_REPO_TOKEN déjà prévu par le précédent pipeline. Leur présence/permissions n'ont pas été consultées ou modifiées.
4. Le workflow produit le bundle, contrôle la version publique existante, applique uniquement les fiches sélectionnées, préserve les artworks et usageGuide historiques non modifiés, puis ouvre une PR publique en brouillon. Il ne fusionne et ne déploie rien. Il requiert un jeton autorisé à pousser une branche et créer une PR dans le dépôt public ; un jeton absent ou insuffisant bloque la synchronisation.
5. Le workflow public de déploiement perd son déclenchement automatique sur push. Il exige un déclenchement manuel et l'identifiant exact du commit public approuvé. Le contrôle couvre les octets HTML et tous les fichiers/assets de site/ via leurs empreintes Git, les fiches et leurs justificatifs V2. Le packaging existant reste inchangé.
6. Une PR de préparation accepte la base historique inchangée, sans la déclarer canonique. Le contrôle de déploiement strict `--for-deployment` exige en revanche un justificatif VALIDE/PUBLIC pour TOUTE fiche servie. La base historique ne donne donc jamais une nouvelle autorisation de publier des brouillons. Tant que les 142 fiches historiques n'ont pas fait l'objet d'une migration explicitement approuvée (validation ou retrait décidé), un nouveau déploiement V2 sera bloqué. Rien n'est retiré du site déjà en ligne par ces PR.
7. Après déploiement autorisé, vérifier le run, l'URL et la version effectivement publique avant de consigner PUBLIE. Les scripts ne changent jamais automatiquement le statut canonique.

## Fondation I

ASH-LORE-0001 est enregistrée en VALIDE/INTERNE. Une recherche élargie a retrouvé le message d'accord du 23 octobre 2026 à 06:43:17Z et trois phrases de la consignation du 06:43:31Z. Les limites de récupération sont explicites dans la source : il s'agit d'un extrait attesté, pas d'une prétendue transcription intégrale. Aucun identifiant durable de conversation n'a été inventé. La version 1.0 désigne cet archivage, pas une version historique supposée.

La fiche production ASH-UNITY-0001 est une proposition de contraintes et non une implémentation. Aucune cause, aucun mécanisme, PNJ, lieu, quête ou nouvelle vérité d'auteur n'est inventé. Les textes narratifs historiques ne sont pas modifiés.

## Contrôles

Knowledge : `python3 -m unittest discover -s tests -v` puis `python3 scripts/export_v2.py --output /tmp/codex-v2.json`.
Public : `python3 -m unittest discover -s tests -v` puis `python3 scripts/verify_public_v2.py` pour une PR et `python3 scripts/verify_public_v2.py --for-deployment` pour le déploiement strict.

Les tests locaux vérifient export, refus, versionnage, projection, application, restauration en cas d'échec, préservation des champs historiques, échappement et contrôles de déploiement. Les workflows ne sont pas déclenchés à la place de Clément. Leur intégration réelle et les accès croisés ne sont pas présentés comme testés en production.
