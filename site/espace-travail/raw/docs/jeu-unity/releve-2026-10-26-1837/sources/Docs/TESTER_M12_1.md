# Tester M12.1 : apparence du torse et transmogrification

**Statut : VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-26) sur le build de développement.** Validé : le plastron donne la silhouette lourde et le gilet la silhouette légère en mode « Suivre l'équipement » ; le choix « Armure légère » avec le plastron équipé change l'apparence sans changer les statistiques ni l'équipement ; après rechargement, le choix d'apparence et l'équipement sont conservés ; « Suivre l'équipement » restaure la silhouette du plastron. **Limites conservées** : deux silhouettes de torse seulement ; migration v2 et déblocage par le butin couverts par les tests, sans observation navigateur ; sur le build de diffusion, seuls le chargement et la section du sac ont été observés (parcours complet testé sur le développement). Texte historique de la vérification : Premier jalon de M12 (« 2 à 3 silhouettes distinctes ; apparence indépendante des stats ») : le **torse** du nain a désormais une **apparence** séparée de l'**équipement**. Deux silhouettes (légère, lourde) ; une troisième demande un modèle Blender fait main et n'est pas faite.

**Vérification automatique** : suite PlayMode complète **603 tests réussis sur 603** (dont 10 `M12AppearanceTests`) ; build de développement réussi (86 Mo). Build de diffusion réussi (`Builds/Web`, 560 s) : **10,32 Mo à télécharger (Brotli), 45,35 Mo décompressés**, dans le budget de D296 ; servi sur 8082 avec `Content-Encoding: br` ; **observé dans le navigateur** : il se charge, le sac (B) affiche la section « Apparence du torse » (« Armure légère (suit l'équipement) », « Armure lourde (verrouillée) »). Le parcours complet (équipement, transmogrification, rechargement) n'a été observé que sur le build de développement.

Deux adresses (serveurs locaux, depuis `C:\DEV\ASHENFALL`) :

| Build | Adresse | Serveur |
|---|---|---|
| **Développement** (outils de test F3, F8 à F11) | **http://127.0.0.1:8081** | `node Tools/serve-web.js Unity/Builds/WebDev 8081` |
| **Diffusion** (Brotli, sans outils de test) | **http://127.0.0.1:8082** | `node Tools/serve-web.js Unity/Builds/Web 8082` |

Chaque adresse a sa propre sauvegarde (le navigateur range les données par adresse).

## Règles

1. Le torse affiché est : l'**apparence choisie** (si débloquée), sinon celle de l'**objet de torse équipé**, sinon la **tenue de départ** (légère).
2. Une apparence **se débloque** en obtenant un objet de torse qui la porte (dans le sac ou équipé) et le reste pour toujours.
3. Choisir une apparence **ne change aucune statistique** et n'enlève ni n'ajoute aucun objet.
4. L'apparence choisie est **sauvegardée** (version 3 de la sauvegarde ; les sauvegardes version 2 se chargent encore).

| Objet de torse | Apparence | Effet sur les statistiques |
|---|---|---|
| Gilet de recrue | légère | inchangé (indépendant de l'apparence) |
| Cotte de mailles | légère | idem |
| Plastron du seigneur de guerre | lourde | idem |

## Vérifié dans le navigateur (build de développement, vraies touches, rechargement réel)

Le navigateur de vérification tournait avec une vraie carte graphique. Sauvegarde vierge au départ.

1. **Départ** : panneau du sac (B) : section « Apparence du torse », « Affichée : Armure légère (suit l'équipement) » ; « Armure lourde (verrouillée) » grisée.
2. **F3** (tous les objets dans le sac) : « Armure lourde » devient cliquable (débloquée par la possession du plastron), l'affichage reste « Armure légère ».
3. **Équiper le plastron** : torse « Plastron du seigneur de guerre », « Affichée : Armure lourde (suit l'équipement) » ; statistiques Force 15, Défense 12, Agilité 8, dégâts x1,15, dégâts reçus x0,89 ; la **silhouette en jeu devient massive** (épaulières, torse large).
4. **Transmogrification** : plastron toujours équipé, clic sur « Armure légère » : « Affichée : Armure légère (choisie par vous) », message « Apparence : Armure légère », **statistiques inchangées** (Force 15, Défense 12, effet « régén. d'endurance -6 % » toujours actif), silhouette plus fine.
5. **Sauvegarde** (attendre 1 à 2 s après le clic) : le navigateur contient `version 3`, `appearance.unlocked = ["heavy","light"]`, `torsoOverride = "light"`, plastron équipé.
6. **Rechargement de la page** : le nain réapparaît avec l'apparence légère, plastron équipé, mêmes statistiques ; le panneau affiche « Armure légère (choisie par vous) ».
7. **« Suivre l'équipement »** : retour à « Armure lourde (suit l'équipement) ».

**Non observé** dans le navigateur (couvert par les tests seulement) : migration d'une sauvegarde version 2 réelle, identifiants inconnus dans la sauvegarde, gilet de recrue équipé puis transmogrifié, le build de diffusion si non indiqué ci-dessous.

## Recette courte

| # | Action | Résultat attendu |
|---|---|---|
| 1 | Ouvrir **http://127.0.0.1:8081**, console du navigateur : `localStorage.clear()` puis recharger | Nain en tenue légère ; **B** : « Affichée : Armure légère (suit l'équipement) », « Armure lourde (verrouillée) » |
| 2 | **F3** (outil de test), **B** | Le sac contient les objets ; « Armure lourde » n'est plus verrouillée mais n'est pas affichée |
| 3 | Choisir « Plastron du seigneur de guerre » dans le sac, **Équiper**, fermer avec **B** | Silhouette lourde et massive ; statistiques en hausse (Force 15, Défense 12) |
| 4 | **B**, bouton « Armure légère » | Silhouette légère ; **mêmes statistiques** ; texte « (choisie par vous) » |
| 5 | Attendre 2 s, **recharger la page** (F5), **B** | Même état : apparence légère choisie, plastron équipé |
| 6 | **Équiper** un « Gilet de recrue » à la place du plastron | Les statistiques changent, **le visuel reste « choisi par vous »** |
| 7 | Bouton « Suivre l'équipement » | Le torse suit de nouveau l'objet équipé |
| 8 | (Facultatif, long) Sans F3, sauvegarde vierge : vaincre des ennemis d'élite jusqu'à obtenir le plastron (table de butin `Loot_Elite`, plastron en tête à 30 % de poids) | « Armure lourde » se débloque à la première obtention ; non observé dans le navigateur |

## Limites connues (réserves)

- **Règle cible des apparences (D309)** : une apparence ne devrait rester utilisable que tant que la pièce qui la porte est possédée (équipée, ou dans le sac comme source visuelle). M12.1 applique encore le **déblocage permanent** : limite temporaire acceptée, évolution réservée par Clément (R56). Le test « objet retiré, apparence encore disponible » décrit donc le comportement **actuel**, pas la cible.
- Deux silhouettes seulement, torse seulement (R55) ; le gilet et la cotte ont la même apparence.
- La tenue de départ est maintenant légère (changement voulu, D302).
- Interface provisoire (IMGUI) : pas d'aperçu du personnage dans le panneau, pas de renommée ni de coût pour débloquer.
- F1/F2 (développement) changent le visuel sans passer par ce système.
