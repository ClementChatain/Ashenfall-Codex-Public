# Assets : origine et licences

Registre tenu à jour (règle 15 de `CLAUDE.md`, D315). **Toute ressource externe** doit y figurer avec son origine à la source et ses conditions d'utilisation avant d'entrer dans le projet ; une ressource dont les droits sont incertains n'est pas intégrée.

## Lot M13.1 (2026-10-26) : aucune ressource externe

| Asset | Origine | Droits |
|---|---|---|
| Textures de `Art/Environment/Textures/` (dalles, pierre, sol, fer, bronze, braises, flamme, étincelle) | **Créées pour le projet** par `Blender/Scripts/m13_textures.py` (synthèse procédurale, numpy) | Projet ASHENFALL, aucune dépendance externe |
| Modèles de `Art/Environment/Models/` (dalle, bordure, mur, pilier, brasero, gravats) | **Créés pour le projet** par `Blender/Scripts/m13_modules.py` (Blender 5.2) ; source `Blender/m13_fortress_modules.blend` | Projet ASHENFALL |
| Matériaux et prefabs de `Art/Environment/` | Créés dans Unity par `Editor/M13EnvironmentBuilder.cs` | Projet ASHENFALL |
| Script `BrazierFlicker`, outils `Tools/capture-server.js` | Écrits pour le projet | Projet ASHENFALL |

Aucun téléchargement, aucun achat, aucune bibliothèque d'images ou de modèles tierce n'a été utilisé pour ce lot.

## Antérieur

Le nain, ses armures, ses animations, les ennemis et le décor provisoire des jalons M1 à M12 sont des **créations du projet** (scripts Blender et Unity du dépôt) ; voir `Docs/ART_PIPELINE.md`. Les paquets Unity (URP, Input System, etc.) restent soumis à leurs licences Unity.
