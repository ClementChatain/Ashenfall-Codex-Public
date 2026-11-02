# Atelier privé du lore — Ashenfall

Application séparée du site public, conçue pour Clément et son frère. Le code est public ; les comptes, brouillons, commentaires, validations, pièces jointes et sauvegardes restent exclusivement dans une base SQLite privée, **hors du dépôt**. Aucune donnée n’est envoyée au Codex ni à un service tiers.

## Présentation visuelle V2

Direction artistique rapprochée de la maquette : parchemins texturés aux bords irréguliers, épingles dorées, cadres fins, emblème et ruines stylisées. Les ornements SVG sont créés pour l’interface et servis localement ; aucune police, image ou bibliothèque distante n’est chargée. `web/style.css` porte la structure et `web/theme.css` son habillage.

Une fiche s’ouvre en lecture : texte, commentaires et actions de relecture. « Modifier et organiser l’idée » déplie les champs et les sous-idées ; « Images, fichiers et relations » déplie les ressources. Une nouvelle idée ouvre directement son éditeur. Les aperçus illustratifs utilisent uniquement des exemples temporaires non canoniques, jamais injectés dans un vrai atelier.

Pour mettre à jour une installation V1 : sauvegarder la base, remplacer le code serveur et le dossier `web/` complet, puis redémarrer `ashenfall-atelier`. Le serveur doit aussi être actualisé pour servir les nouveaux ornements et le thème. Aucune migration des données requise.

## Fonctionnement

- Tableau avec étapes, déplacement de cartes, recherche, filtres « vrac », « à relire », « validées ».
- Idées imbriquées via le choix du parent ; arborescence sans boucles. Une suppression remonte les enfants d’un niveau après confirmation.
- Toile libre : cartes déplaçables, liens nommés, dessin à main levée, effacement d’un trait, déplacement et zoom. Les trois vues utilisent les mêmes idées.
- Texte simple, étiquettes, couleurs, commentaires attribués au compte connecté. Images affichées ; autres pièces jointes téléchargées avec authentification (20 Mo/fichier). Les SVG/HTML ne sont pas exécutés dans l’application.
- Comptes contributeur et relecteur. Seul le relecteur valide une version exacte (empreinte et copie conservées). Modifier texte, étape, parent ou fichiers invalide le badge courant ; déplacer une carte sur la toile ne l’invalide pas. Les sous-idées ne sont pas validées automatiquement. Les validations anciennes restent dans l’historique.
- Enregistrement automatique avec révision optimiste : une modification concurrente est refusée avec choix d’exporter le travail de l’onglet avant de charger la version partagée. Aucun écrasement silencieux. Actualisation des autres changements toutes les sept secondes ; **ce n’est pas un éditeur simultané caractère par caractère**.
- Export/import JSON privé pour le texte et les positions. Les fichiers binaires et l’historique complet exigent une sauvegarde SQLite. Un import ne fabrique jamais une validation.

Aucun exemple de lore n’est injecté à la création. La validation dans l’atelier est une décision de travail, **pas une validation canonique V2 ni une autorisation de publication**. La passerelle Archiviste reste une prochaine étape : elle devra vérifier la version, la visibilité PUBLIC et une approbation de publication explicite avant toute projection dans le Codex.

## Essai local (Python 3.11 ou supérieur, sans dépendance)

Depuis la racine du dépôt :

```sh
python3 atelier/server.py --data /tmp/ashenfall-atelier/workshop.sqlite user Clement --role reviewer
python3 atelier/server.py --data /tmp/ashenfall-atelier/workshop.sqlite user Frere --role author
python3 atelier/server.py --data /tmp/ashenfall-atelier/workshop.sqlite serve
```

Les mots de passe (12 caractères minimum) sont saisis de façon masquée. Ouvrir **http://127.0.0.1:8050/**. Pas d’inscription publique, pas de mot de passe par défaut. Le répertoire `/tmp` convient uniquement aux essais ; utiliser un chemin persistant pour un vrai atelier.

## VPS Debian 12 : installation indépendante du serveur de jeu

Installation prévue pour un VPS Debian 12 accessible par clé SSH depuis le PC du propriétaire. Remplacer `VPS_IP` par son adresse ; aucune adresse d’infrastructure privée n’est enregistrée dans ce dépôt. **Aucune connexion au VPS n’a été réalisée et aucun pare-feu, DNS, secret ou service existant n’a été modifié.** L’atelier ne touche pas au service `ashenfall` ni au port UDP 27777.

Sur le PC, copier uniquement le dossier applicatif (pas les données d’essai ni le dépôt du jeu). Les commandes suivantes supposent la clé et l’accès déjà disponibles sur le PC ; remplacer l’utilisateur SSH si nécessaire :

```sh
scp -r atelier root@VPS_IP:/tmp/ashenfall-atelier-code
ssh root@VPS_IP
```

Sur le VPS, vérifier d’abord Python (`python3 --version`) et que le port local 8050 est libre (`ss -ltn`). Puis, pour une **première installation** :

```sh
adduser --system --group --home /var/lib/ashenfall-atelier atelier
install -d -m 0755 /opt/ashenfall-atelier
install -m 0644 /tmp/ashenfall-atelier-code/server.py /opt/ashenfall-atelier/server.py
cp -r /tmp/ashenfall-atelier-code/web /opt/ashenfall-atelier/
install -d -o atelier -g atelier -m 0700 /var/lib/ashenfall-atelier
runuser -u atelier -- python3 /opt/ashenfall-atelier/server.py --data /var/lib/ashenfall-atelier/workshop.sqlite user Clement --role reviewer
runuser -u atelier -- python3 /opt/ashenfall-atelier/server.py --data /var/lib/ashenfall-atelier/workshop.sqlite user Frere --role author
install -m 0644 /tmp/ashenfall-atelier-code/ashenfall-atelier.service /etc/systemd/system/ashenfall-atelier.service
systemctl daemon-reload
systemctl enable --now ashenfall-atelier
systemctl status ashenfall-atelier
```

Ne jamais ajouter de base ou de sauvegarde dans Git. Les commandes créent un utilisateur/service dédiés et ne doivent être lancées qu’après revue sur le VPS. Aucun achat ni installation Docker requis.

### Premier accès sans ouvrir de port web

Depuis le PC déjà autorisé en SSH, garder ce terminal ouvert :

```sh
ssh -N -L 8050:127.0.0.1:8050 root@VPS_IP
```

Ouvrir http://127.0.0.1:8050/. Le trafic passe dans le tunnel chiffré ; le serveur reste lié à l’interface locale du VPS. Pour le frère, un accès SSH propre, autorisé par le propriétaire du VPS, ou un accès HTTPS devra être mis en place : **ne pas partager la clé root**. Deux sessions SSH peuvent utiliser le même port local sur deux ordinateurs distincts.

### Accès permanent partagé en HTTPS

Choisir un sous-domaine contrôlé, idéalement distinct du Codex (par exemple `atelier.ashenfall.linkin-tools.fr` si vous le souhaitez). Configurer un reverse proxy HTTPS vers `127.0.0.1:8050`, avec corps autorisé jusqu’à 21 Mo. `Caddyfile.example` est un exemple, pas un fichier installé. N’écraser aucun proxy existant.

Dans l’unité systemd, ajouter à la commande serveur `--secure --origin https://ADRESSE-EXACTE` : cookie Secure, origine unique. L’ouverture des ports 80/443, le DNS et le certificat sont à effectuer par le propriétaire, après choix de l’adresse. Ne pas exposer directement Python sur Internet. L’atelier peut vivre sur le VPS existant sans achat, mais surveiller son disque de 20 Go (fichiers + historique).

Ce n’est qu’après vérification de la connexion des deux comptes et des fichiers protégés que l’on ajoutera le lien vers cette adresse depuis le Codex. **GitHub Pages n’héberge pas l’atelier.**

## Sauvegarde, mise à jour, récupération

```sh
# Sur le VPS, choisir un emplacement privé existant, hors Git.
runuser -u atelier -- python3 /opt/ashenfall-atelier/server.py --data /var/lib/ashenfall-atelier/workshop.sqlite backup /var/lib/ashenfall-atelier/sauvegarde-PRIVEE.sqlite
```

Cette commande copie la base de manière cohérente, y compris images, fichiers, versions, comptes et sessions. Chiffrer les copies hors serveur et conserver plusieurs dates ; ne jamais les publier. Surveiller l’espace disque. Pour restaurer, arrêter le service, conserver une copie de l’état existant, remplacer la base par la sauvegarde et écarter ses fichiers `-wal`/`-shm` seulement après arrêt de toutes les connexions ; remettre propriétaire `atelier:atelier`, mode 0600, redémarrer. Révoquer les sessions après restauration en supprimant les lignes de `sessions` si nécessaire.

Avant mise à jour : sauvegarde, copie du dossier `/opt/ashenfall-atelier` pour retour arrière, remplacement du seul code et redémarrage du seul service `ashenfall-atelier`. Les données restent dans `/var/lib/ashenfall-atelier`.

## Limites V1 et vérifications

Toile SVG native (pas de bibliothèque externe ni CDN), texte simple, pièces jointes sans antivirus intégré, limite de document 4 Mo / 1 500 idées / 2 000 traits. L’historique et les fichiers détachés sont conservés pour éviter une suppression destructive ; prévoir une politique d’archivage et surveiller le stockage. Pas de notifications par e-mail, pas de synchronisation hors ligne, pas d’annulation graphique ; les versions complètes restent dans la base et les exports permettent la récupération. Le compte du contributeur peut éditer les propositions ; une édition rend une ancienne validation obsolète.

Les sessions durent huit heures ; après expiration, conserver/exporter le travail de l’onglet avant de se reconnecter. Le code ne présente pas une session expirée comme un enregistrement réussi.

```sh
python3 -m unittest discover -s tests -p 'test_atelier.py' -v
node --check atelier/web/app.mjs
# Test navigateur facultatif, Playwright et Chromium requis pour le développement :
python3 scripts/smoke_atelier.py
```
