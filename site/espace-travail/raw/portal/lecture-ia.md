# Contrat de lecture commun aux IA

Version 1 — 26 octobre 2026. Destination : ChatGPT 01, 02 et 03, Claude Code et toute autre IA intervenant sur Ashenfall.

## Au début d'une mission

1. Ouvrir le point d'entrée `ai/index.html` du portail déployé et son `manifest.json`. Relever la révision source et la date de construction.
2. Lire l'état du projet et le journal des évolutions, puis les documents du périmètre. Le paquet d'une rubrique dans `ai/` facilite la lecture sans charger tout le projet.
3. Distinguer décision validée, proposition, archive et implémentation. La publication d'un document de travail n'en change pas le statut. Comparer les dates, versions et preuves de décision, sans choisir arbitrairement le texte le plus récent.
4. Si la mission concerne le jeu local, comparer sa révision, son état de travail et sa version Unity avec le relevé du portail. Une divergence se signale ; le site ne prouve pas l'état du disque.
5. En cas d'accès impossible ou de contradiction bloquante, annoncer précisément ce qui manque. Utiliser l'export texte ou le dépôt authentifié si disponible ; ne pas prétendre avoir lu le site.

## Après une évolution

- Le responsable du travail actualise les sources, l'état courant et le journal ; il prépare les éléments de relais sans les faire retranscrire par Clément.
- Chaque entrée indique date, changement, source/version, statut, impacts et éventuelle validation.
- La publication met à disposition les mêmes sources et la même révision pour toutes les IA. Aucun agent n'est autorisé à prétendre avoir rafraîchi les autres sessions.
- Les tests pertinents et validations utilisateur existantes restent applicables. Pas de commit de clôture Unity sans validation de Clément.

## Responsabilités

| Espace | Travail | Référence attendue |
|---|---|---|
| 01 | Cadrage et suivi du jeu | État technique, missions, tests et builds identifiés |
| Claude Code | Implémentation et comptes rendus | Code et documents du projet Unity réel |
| 02 | Conception et propositions | Décisions validées par Clément, sources et versions |
| 03 / Archiviste | Conservation et portail | Fiches, statuts, liens et version réellement publiée |
| IA créatives | Livrables selon brief | Référence retenue, version et destination |

Le MMORPG persistant reste l'objectif ; séparer données, règles et présentation sans introduire de réseau prématurément. Une contrainte technique ne justifie pas une nouvelle règle de lore.
