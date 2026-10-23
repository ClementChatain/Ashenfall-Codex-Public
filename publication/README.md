# Garde de publication V2

- `legacy-baseline.json` fige les 142 fiches au commit public 138017d345dcccfe5b0b5d8765541ca5bd544f9a. Ce gel protège leur contenu existant ; il ne leur attribue aucune validation canonique.
- `v2-release.json` lie les fichiers effectivement déployables aux empreintes Git du checkout et aux justificatifs des projections validées. Il ne contient aucune source privée.
- Les PR peuvent conserver la base historique inchangée. Un nouveau déploiement exige `verify_public_v2.py --for-deployment` : aucune fiche historique non validée n'est dispensée de justificatif V2.
- Le workflow Pages est exclusivement manuel et lié au SHA exact approuvé. Une fusion de cette PR ne déclenche pas de déploiement.
- Les scripts n'attestent pas seuls l'authenticité des validations : Clément doit examiner les preuves privées et approuver les PR. Les administrateurs du dépôt conservent le pouvoir de changer les règles.
- Le premier déploiement V2 reste bloqué tant que la migration explicite des contenus historiques n'est pas approuvée. Aucun contenu actuel n'est retiré par cette préparation.
