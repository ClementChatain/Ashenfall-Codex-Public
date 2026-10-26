# État de référence du projet

Relevé actualisé le 26 octobre 2026. Les vérifications de fichiers portent sur une archive prise à 18:37 ; ce n'est pas une inspection du poste actuel ni un essai du jeu.

## Direction validée

L'objectif final est un MMORPG persistant. Le prototype reste solo, avec séparation données/règles/présentation et sans infrastructure réseau prématurée. Clément confirme que Claude a inscrit cette direction dans D325 et actualisé CLAUDE.md, PROJECT_BRIEF.md et ROADMAP après la sauvegarde. Ces nouvelles versions ne sont pas encore reçues ; D325 est absente de l'archive. Les formulations historiques « pas de MMO » dans les copies ne remplacent pas cette décision.

## Vérifié directement dans l'archive

- Archive reçue : ASHENFALL_20261026_183738_etat-M13-M14-non-commite.zip ; 146 550 442 octets, 3 085 entrées, contrôle ZIP sans erreur.
- SHA-256 : 37f08fd4e65e28048ecf6bc8574bc06a949d6e7057f2f0b8e2bbfbc6016206ff.
- Unity : 6000.6.6f1, révision d20c9ac777da dans ProjectVersion.txt.
- Git local : main, HEAD 3f1f0ae25fedaca7a14855f494e541962750a188 ; aucune section remote dans la configuration archivée. Ce commit n'inclut pas tout le travail non commité.
- Input System : Dodge = clavier C ; Jump = Espace ; manette : esquive bouton Est, saut bouton Sud.
- Sources M14 présentes : PlayerJump.cs, PointerMovement.cs et M14ControlsTests.cs.
- Les 46 entrées du manifeste des copies correspondent à leurs empreintes SHA-256 tronquées déclarées. Les 47 documents Markdown du relais sont conservés dans docs/jeu-unity/releve-2026-10-26-1837/.

## Rapporté par Claude et transmis par Clément

- Projet sur le poste : C:\DEV\ASHENFALL\Unity ; rendu URP et builds WebGL.
- M0 à M12.1 validés selon le relevé ; M13.1 livré sans validation visuelle retrouvée ; M14 implémenté sans validation manuelle retrouvée.
- Dernière suite complète rapportée : 612/612 avant M14. Tests M14 réussis séparément après correction d'un test ; aucun résultat complet après M14 fourni.
- Dernier état rapporté de l'essai complet : encore en cours le 26 octobre à 18:38:32. Ceci décrit cette observation historique, pas une exécution actuellement vérifiée.
- Build développement M14 rapporté à 18:13 ; diffusion M13.1 à 07:57. Les builds et journaux ne sont pas inclus : résultats non reproduits ici.
- Sauvegarde locale à C:\Sauvegardes_ASHENFALL, sur le même disque. Une copie de cette archive a également été reçue dans cette conversation ; aucun dépôt distant du jeu ni mécanisme de sauvegarde récurrent n'est établi.

## Actualisation attendue

1. Recevoir le ZIP documentaire PORTAIL_RELAIS régénéré après D325 et les corrections, sans renvoyer toute la sauvegarde du jeu.
2. Recevoir le résultat complet M14 une fois disponible et son lien avec la version testée.
3. Faire valider le jeu manuellement par Clément avant toute clôture ou commit de clôture.
4. Mettre en place une sauvegarde distante du projet dans une opération distincte. L'intégration des documents au portail ne sauvegarde pas le code Unity ni les fichiers Blender.
5. Raccorder le portail à un hébergement accessible. Aucun accès commun effectif de toutes les IA n'est encore attesté.

Le dépôt du portail reste privé. Le Codex existant provient d'un dépôt public distinct dont la visibilité n'a pas changé. Les archives historiques sont des sources datées, pas des instructions qui annulent les décisions actuelles.
