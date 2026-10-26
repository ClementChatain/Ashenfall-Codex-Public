# Tester M10.1 : mission rejouable « Défense de la forteresse »

**Statut : VALIDÉ MANUELLEMENT par le porteur du projet (2026-10-25).** Validé : lancement à l'étendard, combat et placement des ennemis, enchaînement des vagues, pauses et soin, victoire et récompenses, persistance après rechargement, défaite et possibilité de rejouer. **Durée rapportée par Clément : 3 min 02, en combat réel, sans aucune utilisation de F10** (précision confirmée par lui). Réserve d'équilibrage conservée (R53) : cible initiale de 5 à 10 minutes, durée rapportée plus courte, difficulté et récompenses provisoires ; la mission n'est pas rallongée pour autant à ce stade. Suite PlayMode complète : **575 tests réussis sur 575** (dont 16 `M10MissionTests`) ; build WebDev réussi. Premier jalon de M10 (« Mission rejouable (5 à 10 min) : début, vagues, fin, récompenses persistantes »).

Adresse du build : **http://127.0.0.1:8081** (serveur local : `node Tools/serve-web.js Unity/Builds/WebDev 8081` depuis `C:\DEV\ASHENFALL`). Utilisez toujours la même adresse (la sauvegarde appartient à un navigateur et à une adresse).

## La mission

Une arène de 22 x 22 m au **nord-est du départ** (sol rouge sombre, quatre piliers, un **étendard** : mât et fanion rouge). On se place près de l'étendard (moins de 4 m) et on appuie sur **E** : compte à rebours de 3 s, puis six vagues d'ennemis existants (apparaissant sur cinq points de l'arène, au nord, à l'est et à l'ouest). Les ennemis de mission attaquent aussitôt et ne rentrent jamais chez eux.

| Vague | Titre | Ennemis |
|---|---|---|
| 1 | Éclaireurs | 4 gobelins |
| 2 | La meute | 6 gobelins |
| 3 | Lames et arbalètes | 3 gobelins, 1 Maraudeur, 1 Traqueur |
| 4 | Assaut | 4 gobelins, 2 Maraudeurs, 1 Traqueur |
| 5 | Les briseurs | 3 gobelins, 2 Briseurs, 2 Traqueurs |
| 6 | Le champion | 4 gobelins, la Sentinelle de Fer |

Entre deux vagues : 10 s de pause et **40 % de vos PV max rendus**. **Victoire** : toutes les vagues vaincues → **+150 XP** et **deux objets garantis** (table d'élite) dans le sac (au sol près de vous si le sac est plein), en plus de l'expérience et du butin de chaque ennemi ; temps et record affichés. **Défaite** : vous tombez → les ennemis restants disparaissent, aucune récompense, la tentative est comptée ; après votre réapparition, retournez à l'étendard et appuyez sur E pour rejouer. On peut rejouer aussitôt après une victoire (« [E] Rejouer la mission »). Records enregistrés et **sauvegardés** (tentatives, victoires, meilleur temps) : voir `Docs/TESTER_M9_1.md` pour la sauvegarde.

Affichage : en haut à droite, nom de la mission, « Vague n / 6 · x ennemi(s) » (ou « Vague n dans x s ») et chronomètre ; bandeau central (vague, victoire, défaite) ; près de l'étendard, l'invite et « Victoires n · meilleur temps mm:ss · tentatives n ».

Touches de test (build de développement seulement, éditeur compris) : **F11** vous place devant l'étendard (hors mission) ; **F10** saute le compte à rebours en cours, ou, sinon, **élimine tous les ennemis de la vague** (pour parcourir la mission sans combattre les 34 ennemis) ; **F3** tous les objets ; **F8** +60 XP ; **F9** efface la sauvegarde.

## Vérifié dans le navigateur (build WebDev, vraies touches, rechargements réels de la page)

1. F11 : le joueur est devant l'étendard, l'invite « [E] Lancer la mission : Défense de la forteresse » s'affiche.
2. E : « Mission lancée : Défense de la forteresse », « Vague 1 dans 2 s », chronomètre.
3. **Vague 1 « Éclaireurs »** : quatre gobelins apparaissent à la périphérie de l'arène, puis passent en « Chase / mission » ; le jeu passe en combat (« changement d'arme verrouillé »).
4. Vague éliminée (F10) : « Vague 1 terminée », « Vague 2 dans 9 s », l'expérience monte (XP 40/50) et du butin tombe au sol (Capuchon de cuir).
5. **Vague 2 « La meute »** : six ennemis, engagés ; après leur élimination : « Niveau supérieur ! Niveau 2 », PV 105, « Vague 2 terminée ».
6. **Vague 3 « Lames et arbalètes »** puis les vagues 4, 5 et **6 « Le champion »** (cinq ennemis dont la Sentinelle, tous « Chase / mission ») parcourues avec F10, avec montées de niveau en cours de route (jusqu'au niveau 8).
7. **Victoire** : bandeau « Victoire ! », résumé en haut à droite « Victoire en 01:00 (meilleur temps !) · +150 XP · Objets : Hache runique, Plastron du seigneur de guerre », objets ajoutés au sac (« Ramassé : Plastron du seigneur de guerre » pour un butin ramassé en passant), « Victoires 1 · meilleur temps 01:00 · tentatives 2 », invite « [E] Rejouer la mission ». La durée de 1 minute vient des touches de test, **pas d'un combat réel**.
8. La sauvegarde du navigateur passe en **version 2** et contient le record (`mission.fortress.defense` : 2 tentatives, 1 victoire, meilleur temps 60,2 s).
9. **Rechargement de la page** : « Niveau 8 », sac 3/24 ; devant l'étendard : « [E] Lancer la mission » et « Victoires 1 · meilleur temps 01:00 · tentatives 2 » (record restauré). Une mission n'est jamais reprise à la relance.
10. **Migration** : une sauvegarde de **version 1** (celle de M9.1, sans record) injectée dans le navigateur se charge normalement après rechargement (« Niveau 3 », sac 2/24, arme « Hache runique », PV 110) et reste en version 1 jusqu'au prochain changement, qui l'écrit en version 2.

**Non observé dans le navigateur (couvert par les tests seulement)** : la défaite et sa reprise, le sac plein à la victoire (objets au sol), le meilleur temps qui ne s'améliore pas, la poursuite des ennemis de mission quand le joueur s'éloigne, l'absence de réapparition, le soin de 40 % entre les vagues (visible dans le test, pas mesuré à l'écran). **La durée d'une vraie mission jouée au combat n'a pas été mesurée dans ce navigateur automatisé ; elle l'a été ensuite par Clément : 3 min 02, sans F10** (voir le statut en tête).

## Recette courte

| # | Action | Résultat attendu |
|---|---|---|
| 1 | Ouvrir l'adresse ; appuyer sur **F11** | Vous êtes devant un étendard rouge dans une arène au sol rouge sombre ; « [E] Lancer la mission : Défense de la forteresse » |
| 2 | **E** | « Mission lancée », compte à rebours de 3 s, puis « Vague 1 / 6 : Éclaireurs » et quatre gobelins qui foncent sur vous ; chronomètre en haut à droite |
| 3 | **Combattre pour de vrai** vos premières vagues (touche 1 et compétences 2, 3, 4), sans les touches de test | Les ennemis arrivent de plusieurs côtés (au plus trois au contact, les autres attendent) ; à la fin de la vague : « Vague 1 terminée », pause de 10 s, **PV rendus à 40 %** |
| 4 | Pendant une pause, courir loin de l'arène | Rien ne se passe : la mission continue, les vagues suivantes viennent vous chercher ; **noter quand vous seriez à court de PV** |
| 5 | Pour parcourir vite le reste : **F10** (saute la pause), **F10** (élimine la vague), ainsi de suite | Les six vagues défilent, la dernière avec la Sentinelle de Fer |
| 6 | Après la dernière vague | « Victoire ! » ; résumé : temps, **+150 XP**, **deux objets** ; invite « [E] Rejouer la mission » ; « Victoires 1 · meilleur temps ... » |
| 7 | **B** | Les deux objets sont dans le sac (ou au sol près de vous si le sac était plein) |
| 8 | Recharger la page (F5), puis **F11** | Niveau et sac conservés ; « Victoires 1 · meilleur temps ... · tentatives 1 » ; aucune mission en cours |
| 9 | **E** puis laisser les ennemis vous vaincre (ne pas vous défendre) | « Défaite », les ennemis disparaissent, aucune récompense ; vous réapparaissez ; retour à l'étendard (F11) puis **E** : la mission repart de la vague 1 ; tentatives +1 |
| 10 | Rejouer et gagner plus vite | Le meilleur temps ne diminue que si vous faites mieux |
| 11 | **Mesures utiles** (à noter pour la suite) | Durée d'une mission jouée vraiment (cible initiale 5 à 10 minutes ; première mesure rapportée : 3 min 02), vague la plus dure, moment où vous manquez de PV |

## Limites connues (réserves)

- Composition, difficulté, durée et récompenses **non équilibrées** (R53) : valeurs de départ, à régler après vos essais ; elles sont en données (`MissionDefinition`).
- Un seul objectif (vaincre les vagues) ; arène sans décor de forteresse ; présentation provisoire.
- Une mission n'est pas reprise à la relance du jeu (position, ennemis et vague ne sont pas sauvegardés).
- Les récompenses sont très généreuses (deux objets d'élite à chaque victoire) : farm possible.
- Les ennemis de mission sont acharnés : fuir ne sert qu'à les entraîner (ils disparaissent à la défaite).
