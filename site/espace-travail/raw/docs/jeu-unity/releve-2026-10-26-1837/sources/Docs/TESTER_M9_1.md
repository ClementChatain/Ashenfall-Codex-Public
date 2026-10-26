# Tester M9.1 : expérience, niveaux et sauvegarde

**Statut : VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-25).** Validé : niveau, sac, équipement et statistiques restaurés après rechargement ; expérience gagnée sur un gobelin conservée ; retrait d'équipement conservé, objet dans le sac sans doublon. Le retour au point de départ (position, PV courants, ennemis et butin au sol non sauvegardés) est **accepté explicitement** pour cette étape. Texte historique de la vérification automatique : Suite PlayMode complète : **559 tests réussis sur 559** (dont 28 `M9SaveTests`) ; build WebDev réussi. Premier jalon de M9 (« XP, niveaux, sauvegarde : quitter et relancer restaure tout ; version de sauvegarde testée »).

Adresse du build : **http://127.0.0.1:8081** (serveur local : `node Tools/serve-web.js Unity/Builds/WebDev 8081` depuis `C:\DEV\ASHENFALL`). **Utilisez toujours la même adresse** : la sauvegarde appartient à un navigateur ET à une adresse (127.0.0.1 et localhost ont chacun la leur).

## Ce qui est sauvegardé

| Donnée | Sauvegardée ? |
|---|---|
| Expérience totale (le niveau en est déduit) | Oui |
| Sac (objets et ordre) | Oui |
| Équipement (arme, tête, torse, bottes, talisman) | Oui |
| Statistiques | Recalculées au chargement à partir de l'équipement et du niveau (jamais cumulées) |
| PV courants, position, ennemis, butin au sol | Non : on repart à pleine santé au point de départ |
| Compétences, renommée, apparences | Non (ces systèmes n'existent pas encore) |

La sauvegarde est **automatique** : une seconde après un changement du sac, de l'équipement ou de l'expérience. Stockage : le `localStorage` du navigateur (clés `ashenfall.save.main`, `.bak`, `.corrupt`). Rien ne s'écrit tant que rien ne change.

## Niveaux (valeurs provisoires)

Seuils d'expérience totale : niveau 2 à 50, 3 à 120, 4 à 210, 5 à 320, 6 à 450, 7 à 600, 8 à 770, 9 à 960, 10 à 1170. Chaque niveau au-delà du premier : +5 PV max et +1 Force. Expérience à la mort d'un ennemi : 10 (gobelins, ennemis ordinaires), 25 (Maraudeur, Briseur, Traqueur), 100 (Sentinelle de Fer). En haut de l'écran : « Niveau n · XP x / y » ; la fenêtre du sac (B) affiche aussi le niveau et l'expérience totale.

Touches de test (build de développement seulement) : **F3** tous les objets, **F8** +60 expérience, **F9** efface la sauvegarde et suspend l'écriture jusqu'au rechargement.

## Vérifié dans le navigateur (build WebDev, vraies touches et vrais clics, rechargement réel de la page)

1. Démarrage sans sauvegarde : « Niveau 1 · XP 0 / 50 », sac 1/24 (la lance), hache équipée, PV 100.
2. F3, puis équipement par clics : Hache runique, Plastron du seigneur de guerre, Amulette de vigueur. F8 deux fois : niveau 3. Statistiques affichées : PV max 135, Force 20, Agilité 8, Défense 12, dégâts x1,30 infligés et x0,89 reçus.
3. Le `localStorage` du navigateur contient bien la sauvegarde (version 1, expérience 120, 9 objets dans le sac, 3 objets équipés) et une copie de secours (écriture précédente).
4. **Rechargement de la page** : la sauvegarde est toujours là ; le jeu affiche « Niveau 3 », sac 9/24, « Hache runique », PV 135 ; la fenêtre du sac donne exactement les mêmes statistiques (Niveau 3, XP totale 120, PV 135, Force 20, Agilité 8, Défense 12, x1,30 / x0,89), le même équipement et le même sac, dans le même ordre, **sans doublon de la lance ni de la hache** et sans bonus doublé.
5. **Sauvegarde abîmée** (principale remplacée par du texte illisible, la copie de secours contenant le niveau 2) puis rechargement : le jeu démarre sur le niveau 2 (copie de secours), le contenu illisible est conservé dans la clé `.corrupt`, la sauvegarde principale est redevenue valide, la copie de secours est intacte.
6. **F9** : message « Sauvegarde effacée : rechargez la page pour repartir de zéro » ; la sauvegarde et sa copie de secours sont supprimées (le contenu illisible reste à part) ; **rechargement** : nouvelle partie normale (niveau 1, sac 1/24, hache de guerre naine, PV 100), et rien n'est écrit tant que rien ne change.

**Non observé dans le navigateur (couvert par les tests seulement)** : sauvegarde d'une version plus récente (jamais écrasée), échec d'écriture (quota), objet inconnu ignoré, migration d'une ancienne version, gain d'expérience en tuant un ennemi suivi d'un rechargement, fermeture brutale pendant la seconde d'attente. Les messages verts de chargement (« Sauvegarde chargée : niveau 3, 9 objet(s) dans le sac », « copie de secours chargée ») ne durent que 7 secondes : les captures d'écran du navigateur automatisé, prises après le chargement du jeu, ne les ont pas montrés ; leur texte est vérifié par les tests.

## Recette courte

| # | Action | Résultat attendu |
|---|---|---|
| 1 | Ouvrir l'adresse ci-dessus ; si vous avez déjà une sauvegarde de test, appuyer sur **F9** puis recharger la page (F5) | Niveau 1 · XP 0 / 50 ; sac (1/24) ; hache de guerre naine |
| 2 | **F3**, puis **B** ; équiper la **Hache runique**, le **Plastron du seigneur de guerre** et l'**Amulette de vigueur** (clic sur l'objet, puis « Équiper ») | Statistiques : Force 18, Défense 12, PV max 125, Agilité 8 |
| 3 | Fermer le sac, appuyer deux fois sur **F8** (+120 XP) | « Niveau supérieur ! Niveau 3 » ; PV max 135, Force 20 |
| 4 | Attendre 2 secondes, puis **recharger la page** (F5) | Message vert « Sauvegarde chargée : niveau 3, 9 objet(s) dans le sac » ; en haut « Niveau 3 · XP 0 / 90 » ; arme « Hache runique » |
| 5 | **B** | Niveau 3, XP totale 120, PV max 135, Force 20, Agilité 8, Défense 12, dégâts x1,30 / x0,89 ; équipement : Hache runique, Plastron, Amulette ; sac de 9 objets sans doublon (une seule Lance de garde, une seule Hache de guerre naine) |
| 6 | Tuer un ennemi (gobelin ou ennemi ordinaire), attendre 2 secondes, recharger | L'expérience gagnée (+10) est conservée |
| 7 | Retirer un objet équipé (clic sur son emplacement), recharger | L'objet est dans le sac, l'emplacement est vide, les statistiques correspondent |
| 8 | (Facultatif, avancé) Ouvrir la console du navigateur et saisir `localStorage.setItem('ashenfall.save.main','abime')`, puis recharger | Message « Sauvegarde endommagée : copie de secours chargée » ; le jeu démarre normalement avec l'écriture précédente |
| 9 | **F9**, puis recharger | Nouvelle partie (niveau 1, sac 1/24) |

## Limites connues (réserves)

- La sauvegarde est dans le navigateur : l'effacement des données du site ou la navigation privée la fait disparaître ; elle ne suit ni un autre navigateur ni une autre adresse (R52). Pas d'export ni d'import, pas d'emplacements multiples.
- Seuls le sac, l'équipement et l'expérience sont sauvegardés (voir le tableau).
- Une fermeture brutale dans la seconde qui suit un changement perd ce dernier changement.
- Les bonus de niveau et les seuils sont provisoires, sans équilibrage.
- Une sauvegarde modifiée à la main est acceptée si elle est lisible (sans signature, sans importance en solo).
- Dans l'éditeur Unity, la sauvegarde est désactivée (pour ne pas écraser une vraie sauvegarde pendant les tests) ; elle ne fonctionne que dans les builds.
