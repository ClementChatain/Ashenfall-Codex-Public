# Commandes du jeu (PC)

Référence **actuelle** des commandes (mise à jour le 2026-10-26, étape M14 : esquive sur C, saut sur Espace, avancer avec les deux boutons de la souris). Les anciennes fiches `TESTER_*.md` écrites avant M14 citent encore **Espace** pour l'esquive : c'est **C** désormais.

Les touches sont liées à leur **position physique** (ZQSD sur un clavier AZERTY, C au même endroit sur AZERTY et QWERTY). Les actions sont définies dans `Unity/Assets/_Ashenfall/Data/Input/AshenfallControls.inputactions` ; le jeu lit des **intentions** (déplacer, esquiver, sauter, viser), pas des touches : une manette ou un écran tactile pourront fournir les mêmes intentions plus tard.

## Jeu

| Commande | Effet |
|---|---|
| **W A S D** (ZQSD sur AZERTY) ou **flèches** | Se déplacer (relativement à la caméra) |
| **Espace** | **Sauter** (M14) : au sol seulement, un appui = un saut, pas de double saut |
| **C** | **Esquiver** (M14, avant : Espace) : glissade, invulnérabilité brève, coût en endurance |
| **Clic gauche + clic droit maintenus** | **Avancer vers le point du sol visé par le curseur** (M14), même vitesse et mêmes collisions que le clavier |
| **1** | Attaque de base |
| **2, 3, 4** | Compétences |
| **R** | Changer d'arme (hors combat) |
| **Tab** / **Échap** | Cible suivante / libérer la cible |
| **Clic gauche** (bref) | Choisir une cible ; maintenu et glissé : regard libre |
| **Clic droit maintenu** (caméra libre) | Orienter la caméra et diriger le personnage |
| **Molette** | Zoom |
| **B** | Sac et apparences |
| **E** | Interagir (lancer la mission devant l'étendard) |
| **F6** / **F7** / **F4** | Performances / profil graphique / mesure de 10 s |

Manette (provisoire) : bouton Sud = saut, bouton Est = esquive, stick gauche = déplacement.

### Avancer avec les deux boutons

- Le personnage avance vers le point **du sol** visé par le curseur, recalculé à chaque image ; il s'arrête près du point (arrêt avec hystérésis, sans tremblement) ; ce n'est pas un trajet mémorisé : **relâcher un bouton arrête tout**.
- Le **clavier est prioritaire** : une direction de clavier saisie remplace celle de la souris (rien ne s'additionne).
- Pas de déplacement si le curseur est sur le sac ou hors de la fenêtre, si aucun point de sol n'est visé (curseur au-dessus de l'horizon), si le personnage est KO, ou après une perte de focus (il faut relâcher les deux boutons pour réarmer).
- Pendant la combinaison la caméra **ne tourne pas** et le curseur reste libre ; le bouton encore maintenu quand on en relâche un est ignoré jusqu'à son relâchement (ni orbite, ni choix de cible).
- L'esquive (C) et le saut (Espace) fonctionnent pendant ce déplacement.
- En vue isométrique, un clic gauche pressé AVANT le droit choisit une cible comme avant (la sélection est immédiate dans cette vue) ; pressé après le droit, il ne choisit rien.

### Saut

Hauteur **0,9 m** (`PlayerMotor.jumpHeight`, réglable dans `PlayerMobility.asset`), vitesse initiale 6,7 m/s, gravité −25 m/s² : ≈ 0,54 s en l'air. Même contrôleur que le déplacement (murs et plafonds respectés), même vitesse maximale (aucun bonus), direction contrôlable en l'air, aucune invulnérabilité, aucune attaque aérienne. Refusé : en KO, pendant une esquive, en l'air. Pas d'esquive en l'air (un appui de C fait en l'air est mémorisé 0,35 s comme d'habitude : l'esquive part à la réception si ce délai n'est pas écoulé). **Aucune animation de saut** : le personnage garde sa pose de course (présentation provisoire).

## Outils de test (éditeur et builds de développement seulement)

| Touche | Effet |
|---|---|
| **V** | Caméra libre / isométrique |
| **F1** / **F2** | Armure lourde / légère (visuel seulement) |
| **F3** | Ajoute tous les objets au sac ; **Maj + F3** : pose au sol un butin de chaque rareté (essai visuel) |
| **F8** / **F9** | +60 d'expérience / efface la sauvegarde |
| **F10** / **F11** | Éliminer la vague / se placer devant l'étendard |
| **Y U I O P L K N** | Banc d'essai des effets (poison, régénération, vigueur, fatigue, ralentissement, dissipations) |
