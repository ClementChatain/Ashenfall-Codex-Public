# Tester M4.2 : l'ennemi attaque (lisible et esquivable)

L'ennemi provisoire (le nain rouge-orangé derrière le grand mur) attaque maintenant au corps à corps. **Rien n'a changé pour le joueur** : vitesse, attaque à la hache, esquive (4 m, 0,30 s, 0,20 s d'invulnérabilité), endurance, caméra restent ceux de M1 à M3. Le gameplay reste l'unique autorité : ni l'animation ni l'indicateur ne décident des dégâts.

## Le coup de l'ennemi

| Moment (depuis le début de l'attaque) | Ce qui se passe |
|---|---|
| 0,00 à 0,60 s | **Anticipation** : il lève l'arme, un secteur rouge apparaît au sol et se remplit ; il te suit du regard, lentement (180°/s) |
| 0,45 s | **Verrouillage** : la direction du coup est figée, l'indicateur ne bouge plus, l'ennemi ne tourne plus |
| 0,60 à 0,75 s | **Phase active** : l'impact (secteur pâle) ; **10 dégâts** si tu es dans la zone |
| 0,75 à 1,45 s | **Récupération** : il baisse l'arme, immobile (tu peux le frapper) |
| 1,45 à 1,80 s | **Garde** : il te regarde, sans attaquer |
| 1,80 s | l'attaque suivante peut partir (si tu es toujours à portée et en face) |

Zone du coup : portée **1,6 m** (jusqu'au bord de ton personnage), arc **100°** devant lui. L'indicateur est fidèle à cette zone. Un coup reçu pendant son attaque ne l'interrompt pas (M4.3).

## Ouvrir et lancer

- **Dans Unity :** `Assets/_Ashenfall/Scenes/Sandbox`, **Play**, un clic dans la vue Game.
- **Dans le navigateur :** build de développement `http://127.0.0.1:8081/` (Ctrl+F5) : `node Tools\serve-web.js Unity\Builds\WebDev 8081`.

L'ennemi est en (6, 0, 11), derrière le mur. Contourne le mur par l'est ou l'ouest jusqu'à le voir à moins de 9 m. Le jeu écrit dans la console du navigateur ou de Unity chaque phase (`attaque Windup / Active / Recovery`), chaque coup (`Joueur : -10 PV`) et chaque coup bloqué.

## Les vérifications

| # | Test | Résultat attendu |
|---|---|---|
| 1 | Laisse l'ennemi venir et ne bouge pas | Il s'arrête, lève l'arme (secteur rouge qui se remplit), frappe : **−10 PV** (barre de vie), un seul coup par attaque ; **vignettage rouge discret sur les bords** de l'écran, bref, le centre reste net. |
| 2 | Compte les coups | Une attaque toutes les **1,8 s** environ tant que tu restes en face et à portée. |
| 3 | Esquive (Espace) pendant l'anticipation, au bon moment (entre 0,40 s et 0,60 s après le début du geste) | **Aucun dégât** ; si le coup arrive pendant ton invulnérabilité : texte « **ESQUIVÉ !** » au-dessus de toi et léger liseré bleu clair (distinct du rouge). |
| 3b | Esquive réussie en **sortant de la zone** (cas normal : l'esquive te déplace de 4 m) | « **ESQUIVÉ !** » s'affiche **à la fin de la phase active** (environ 0,75 s après le début du geste ennemi), une seule fois par attaque. |
| 3c | Appuie sur Espace sans attaque ennemie, marche simplement hors de portée, ou esquive depuis une position hors de la zone | **Aucun** « ESQUIVÉ ! ». |
| 4 | Esquive trop tôt (dès qu'il commence) ou trop tard (après l'impact) | Tu es touché si tu restes dans la zone (l'esquive te déplace de 4 m : en pratique tu sors presque toujours de la zone). |
| 5 | Sors de la portée **après le verrouillage** (recule d'au moins 1 m ou plus, sans esquiver) | **Aucun dégât**, aucune invulnérabilité utilisée. |
| 6 | Sors de l'arc après le verrouillage (passe sur le côté, à plus de 2 m environ, sans esquiver) | **Aucun dégât** ; l'ennemi ne se réoriente pas pendant la phase active. |
| 7 | Passe derrière un pilier ou le mur avant l'impact | Le coup ne traverse pas les obstacles. |
| 8 | Regarde l'animation | La hache monte pendant l'anticipation, reste en haut, puis la frappe part **un peu avant** l'impact (la lame est à mi-course quand les dégâts tombent), puis retour pendant la récupération. |
| 9 | Regarde l'indicateur sur le sol sombre du Sandbox | Contour rouge vif, intérieur rouge translucide, remplissage orangé qui atteint le bord à l'impact, puis éclair pâle. Lisible aussi sur sol clair : captures dans `Docs/Art/M4/`. |
| 10 | Frappe-le pendant qu'il attaque | Il continue son attaque (pas d'interruption en M4.2) ; flash blanc habituel. |
| 11 | Meurs (laisse-le te toucher 10 fois) | L'attaque s'arrête, l'ennemi retourne à son point de départ ; tu réapparais comme avant. |
| 12 | Tes propres attaques, déplacements, esquives, endurance | Identiques à M3. |
| 13 | Console | Aucune erreur rouge. |

M4.2 validé : la touche **T** (dégâts d'essai) et le diagnostic d'esquive temporaire ont été retirés.

## Mesures

Le HUD affiche les images par seconde (72 images/s dans le navigateur lors des essais). Détail dans `Docs/DECISIONS.md` (D84 à D92) et `Docs/RISKS.md`.

## Tests automatiques

Test Runner, PlayMode, Run All. Nouveaux : `MeleeHitResolverTests` (15), `M4EnemyAttackTests` (25), `M4EnemyDodgeTests` (4 : vrai joueur, vraie esquive, mur derrière le joueur, trop tôt).

## Reconstruire (si besoin)

```
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.EnemyBuilder.Build
Unity.exe -batchmode -quit -nographics -projectPath Unity -executeMethod Ashenfall.EditorTools.M1SandboxBuilder.Build
```

(Unity.exe : `C:\Program Files\Unity\Hub\Editor\6000.6.6f1\Editor\Unity.exe`, éditeur fermé sur ce projet.)
