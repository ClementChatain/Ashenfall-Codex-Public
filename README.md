# Codex Ashenfall

Interface publique du Codex. Seuls les contenus explicitement approuvés sont exportés ici.

Publication depuis main via GitHub Pages. Aucune source privée ni brouillon de lore.

## Présentation des six peuples et des 24 classes

La présentation illustrée couvre désormais Nains, Elfes, Humains, Kharûn, Vaelith et Orynth, avec quatre classes par peuple. La page `#/peuples` donne accès aux six fiches illustrées ; chaque classe conserve ses compétences, ses textes de référence, ses archives et ses portraits d’origine. Deux galeries séparent progression de base et six skins alternatifs, avec vues de détail et visionneuse au clavier. Le Rempart conserve sa présentation et ses variantes de couleur existantes. Les autres tenues restent des concepts artistiques, sans nouvelle statistique, niveau requis ou validation canonique.

Le dossier `site/assets/classes/peoples-v1/` contient la présentation commune (`codex-peoples.js`, `codex-peoples.css`), sa configuration (`visual-data.js`) et 442 nouveaux WebP issus de 23 planches de classes et cinq panoramas. Les PNG sources et descriptions de génération sont archivés séparément dans Knowledge. Le script optionnel `scripts/prepare_all_peoples_artwork.py` prépare les dérivés avec Pillow ; son mode strict exige toutes les sources avant publication. Aucun build ni framework ajouté au site. Les ressources restent couvertes par les empreintes V2 et par le packaging `assets/classes` du workflow Pages.

Les textes des 278 fiches et leurs métadonnées restent identiques. La couche de présentation lit les données publiques déjà présentes ; les mécaniques et fiches d’origine sont conservées. Les liens `simulateur/classes/?classe=<identifiant>` sélectionnent la bonne classe dans le simulateur existant, sans changer ses règles ou sauvegardes. Les URL des scripts et styles portent une version pour éviter de réutiliser la présentation précédente après déploiement.

Vérifications de navigation (Playwright et Chromium requis uniquement pour la validation) :

```sh
PYTHONDONTWRITEBYTECODE=1 python3 scripts/smoke_all_peoples.py
PYTHONDONTWRITEBYTECODE=1 python3 scripts/smoke_codex_ui.py
```

Le premier contrôle parcourt les six peuples et les 23 classes nouvellement traitées aux formats ordinateur, tablette et mobile, compare le texte de leurs archives aux fiches en mémoire, vérifie les images, les deux galeries, la recherche, le clavier et les liens vers les 24 classes du simulateur. Le second conserve les contrôles du Rempart. Les captures chargent les portraits hors écran avant la prise de vue. Aperçus : [peuples](docs/previews/all-peoples-v1/desktop-peuples.webp), [Gardien des Racines](docs/previews/all-peoples-v1/desktop-gardien-des-racines.webp), [Brise-Courant](docs/previews/all-peoples-v1/desktop-brise-courant.webp), [Elfes sur mobile](docs/previews/all-peoples-v1/mobile-elfes.webp).

Les notes datées ci-dessous décrivent les étapes précédentes de la reprise ; les derniers runs GitHub Pages et les contrôles du domaine font foi pour le commit actuellement publié.

## Refonte illustrée en préparation

### Rempart : progression de base et skins de maître V2

Aperçus : [skins sur ordinateur](docs/previews/rempart-equipment-v2/desktop-skins.webp), [équipement de base](docs/previews/rempart-equipment-v2/desktop-base.webp), [skins sur mobile](docs/previews/rempart-equipment-v2/mobile-skins.webp), [base sur mobile](docs/previews/rempart-equipment-v2/mobile-base.webp).

Les deux références visuelles du créateur sont désormais distinguées : le sélecteur de galerie ouvre soit les six étapes de l’équipement de base, soit six exemples alternatifs de skins de maître (Ancestral, Garde d’honneur, Seigneur des montagnes, Forteresse d’acier, Sanctifié, Forgebrûlé). La galerie des skins est sélectionnée par défaut. La base comprend également six détails de pièces et quatre variantes de couleur. Les visionneuses possèdent des cycles distincts (six skins, six étapes, six détails, quatre couleurs), navigation au clavier et retour du focus. L’atelier existant utilise les véritables visuels des skins pour ses exemples ; son mélange de pièces reste schématique.

Les trois planches ont été régénérées à la demande explicite du créateur. PNG sources archivés séparément dans Knowledge ; WebP et manifeste sous `site/assets/classes/rempart-equipment-v2/`. `scripts/prepare_rempart_artwork.py --base BASE.png --skins SKINS.png --colors COLORS.png` prépare 31 dérivés (Pillow requis uniquement pour cette préparation). Les nouveaux visuels restent des concepts, sans nouvelle statistique ou validation canonique. Les anciennes illustrations et les 278 fiches sont conservées. Préparation pour revue, sans publication automatique.

Aperçus de la fiche Rempart : [ordinateur](docs/previews/illustrated-codex-v1/desktop.webp) · [mobile](docs/previews/illustrated-codex-v1/mobile.webp).

La nouvelle présentation reprend la maquette du créateur : navigation horizontale, panneau des six peuples, sélection des classes naines, panorama, onglets et galerie d'équipements. Le cas Rempart possède un panorama et six illustrations avec angles et détails ; les autres classes naines réutilisent leurs planches existantes. Le reste du Codex conserve ses routes et ses contenus sous la nouvelle navigation. Les 278 fiches, leurs métadonnées et leurs valeurs ne changent pas.

Le code de présentation est isolé dans `site/assets/classes/redesign-v1/codex-ui.css` et `codex-ui.js`, chargés depuis `site/index.html`. Les ressources de ce dossier sont incluses par le packaging `assets/classes` existant, sans modifier le workflow Pages. `artwork-manifest.json` consigne les empreintes et le statut conceptuel des nouveaux WebP. Les originaux existants restent consultables dans l'onglet Illustrations et via la planche d'origine ; l'atelier de composition est conservé dans un volet dépliable. Les passifs ne sont pas inventés : l'onglet reste désactivé faute de données distinctes.

Pour le serveur et les contrôles Python, suivre les commandes ci-dessous. Pour les contrôles de navigation, de visionneuses, de recherche et de mise en page aux trois formats (ordinateur, tablette, mobile), si Playwright et Chromium sont disponibles :

```sh
PYTHONDONTWRITEBYTECODE=1 python3 scripts/smoke_codex_ui.py
```

Le script accepte `--base-url`, `--chromium` et `--output`. Les captures et résultats vont par défaut dans `/tmp/ashenfall-redesign`. Playwright est une dépendance de validation facultative, pas une dépendance du site servi. Les modifications de présentation et les nouveaux assets restent soumis aux empreintes de `publication/v2-release.json` ; aucune désactivation du vérificateur. La refonte est préparée pour revue visuelle avant publication, distincte de la version déjà en ligne.

## Reprise du développement — 25 octobre 2026

- Site existant : `site/index.html`, application statique HTML/CSS/JavaScript native, routage par fragments `#/…`, données intégrées dans `const records`. Chroniques dans `site/chroniques/`, illustrations WebP et manifestes dans `site/assets/` (abilities, classes, emblems). Simulateurs autonomes dans `simulateur/rempart/` et `simulateur/classes/`, avec sauvegarde locale pour le Rempart.
- Aucun gestionnaire de paquets ni build requis. Python 3.12 et sa bibliothèque standard suffisent aux contrôles et au serveur local. Les polices Google constituent une ressource externe du rendu.
- Branche distante par défaut : `main`, observée à `a869ab198b16fb00c30ffb9f41f9e86d0a3250ee`. `launch/codex-v1` existe encore mais n'est pas la cible du workflow actuel. Le checkout cloud utilise la branche locale `work` au même commit ; ne pas l'écraser ni recréer le site.

Depuis la racine de ce dépôt :

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
python3 scripts/verify_public_v2.py
python3 scripts/verify_public_v2.py --for-deployment
mkdir -p /tmp/ashenfall-public-dev
cp -R site/. /tmp/ashenfall-public-dev/
cp -R simulateur /tmp/ashenfall-public-dev/
python3 -m http.server 8000 --bind 127.0.0.1 --directory /tmp/ashenfall-public-dev
```

Contrôler localement `/`, `/#/rempart`, `/chroniques/`, les deux routes `/simulateur/` et leurs ressources. Recopier les fichiers publics après modification ; retirer uniquement les sorties obsolètes générées par la session. Ne jamais servir la racine du dépôt privé ni les métadonnées Git. Les processus doivent être redémarrés après restauration de l'environnement.

## Publication constatée et limites

`.github/workflows/pages.yml` ne s'exécute que manuellement sur `main` : `approved_commit` doit être égal au SHA exécuté. Il teste et vérifie la release, assemble `site/index.html`, chroniques, ressources autorisées et simulateurs dans `pages-output/`, puis utilise les actions officielles GitHub Pages. Une fusion seule ne publie pas. `publication/v2-release.json` contient les empreintes des fichiers et les justificatifs ; après toute modification de `site/`, préparer leur mise à jour par le circuit approuvé, sans neutraliser le contrôle d'intégrité.

Le précontrôle actuel accepte les fiches historiques inchangées ; toute fiche nouvelle ou modifiée exige un justificatif V2. Le paramètre `--for-deployment` ne renforce actuellement pas cette règle. Les simulateurs sont copiés par le workflow mais ne sont pas couverts par les empreintes de `site/` : examiner leurs diffs séparément.

Le domaine attendu est `https://codex.ashenfall.linkin-tools.fr/`. Le pipeline cible GitHub Pages ; le rattachement effectif du domaine et le commit actuellement servi restent à confirmer : le proxy réseau de l'environnement a refusé le tunnel HTTPS vers ce domaine et vers `api.github.com` (403). Aucun fournisseur DNS n'est déduit. Aucun déploiement n'a été déclenché pendant cette prise en main.

Vérifications locales : 27 tests réussis entre les deux dépôts, export V2 réussi, contrôles public et déploiement réussis ; navigation de la page d'accueil, fiche Rempart et deux simulateurs sous Chromium en 1440 × 1000 et 390 × 844, sans erreur JavaScript ni débordement horizontal sur ces écrans. Le contrôle visuel de la fiche Rempart révèle toutefois des libellés `undefined` dans la navigation entre classes : défaut applicatif existant, non corrigé par cette prise en main. Les contrôles V2 ne garantissent pas l'absence de défaut visuel.

Prochaine étape : permettre les lectures HTTPS de ces deux destinations dans les paramètres réseau, vérifier le dernier run Pages réussi et comparer les fichiers servis au commit associé. Première correction locale proposée : supprimer les libellés `undefined` de la navigation entre classes en réutilisant les métadonnées existantes, puis présenter son aperçu avant publication. Aucun changement de DNS, permissions ou secrets n'est nécessaire à cette étape de diagnostic.

### Vérification du domaine après activation réseau — 25 octobre 2026

Le blocage réseau décrit ci-dessus est levé. Le domaine et l’API GitHub répondent HTTP 200. L’API Pages confirme `cname=codex.ashenfall.linkin-tools.fr`, `build_type=workflow`, source `main` et HTTPS imposé. Le dernier run Pages réussi est [40210208724](https://github.com/ClementChatain/Ashenfall-Codex-Public/actions/runs/40210208724), commit `20e407fa8aa3ed19ba56ca21fd6dc116a7231b56`, terminé le 25 octobre 2026 à 16:08:12 UTC. Le HTML servi, les deux simulateurs, le portrait Rempart et la chronique Rupture des Eaux ont été comparés octet par octet aux fichiers de ce commit : identiques.

Le checkout `a869ab1` diffère du site publié : ne pas le présenter comme la production ni publier tous ses changements implicitement. Le commit déployé a été récupéré en lecture, sans changement de branche ou écrasement des modifications locales. Les droits d’écriture et de déclenchement Actions ne sont pas établis par ces lectures réussies. Aucun déploiement effectué par cette session.

### Alignement local / production publié — 25 octobre 2026

À la demande explicite de Clément, le commit public `a869ab198b16fb00c30ffb9f41f9e86d0a3250ee` a été déployé depuis `main` par [le run Pages 40216421048](https://github.com/ClementChatain/Ashenfall-Codex-Public/actions/runs/40216421048), terminé avec succès. Le précédent échec utilisait un SHA court dans `approved_commit` ; le nouveau lancement utilise le SHA complet sans modification du workflow. Les 186 fichiers publics (site et deux simulateurs) ont ensuite été téléchargés depuis le domaine avec un paramètre de vérification et comparés octet par octet au checkout : tous identiques. Les 278 fiches et leurs métadonnées sont identiques à la production précédente. Les libellés `undefined` repérés dans l’aperçu restent à corriger ; aucun correctif supplémentaire n’a été inclus implicitement. Les modifications documentaires locales ne font pas partie du site servi.
