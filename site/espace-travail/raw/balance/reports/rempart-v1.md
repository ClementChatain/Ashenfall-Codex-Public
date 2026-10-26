# Rempart V1 — résultats de référence

Statut : EN_ETUDE. Même personnage normalisé, mêmes budgets de soin externes et mêmes traces ennemies. Chaque template utilise 20 points validés. Résultats expérimentaux du moteur Rempart, pas mesures du jeu Unity ni preuve d’équilibre global.

| Template | Scénario | DPS sur durée totale | PV Rempart finaux | PV allié finaux | Mort du tank |
|---|---|---:|---:|---:|---|
| citadelle | boss-180 | 158.1 | 8819 | 8000 | Non |
| citadelle | pack-5-60 | 241.0 | 5139 | 8000 | Non |
| citadelle | garde-60 | 161.2 | 8459 | 4896 | Non |
| citadelle | mobilite-60 | 207.4 | 7125 | 5273 | Non |
| broyeur | boss-180 | 187.6 | 0 | 8000 | 135 s |
| broyeur | pack-5-60 | 623.2 | 0 | 7880 | 57 s |
| broyeur | garde-60 | 243.3 | 2755 | 4000 | Non |
| broyeur | mobilite-60 | 541.8 | 622 | 4800 | Non |
| garde-du-corps | boss-180 | 175.7 | 0 | 8000 | 113 s |
| garde-du-corps | pack-5-60 | 601.6 | 0 | 7942 | 56 s |
| garde-du-corps | garde-60 | 258.3 | 3890 | 5241 | Non |
| garde-du-corps | mobilite-60 | 443.5 | 0 | 5379 | 59 s |

## Interprétation et limites

- La Citadelle a la meilleure survie personnelle dans les scénarios soutenus de ce protocole ; le Broyeur augmente les dégâts de zone mais peut mourir sous la même pression. Le Garde du corps protège davantage les PV de l’allié dans le scénario de protection, avec une survie personnelle inférieure à la Citadelle.
- Le tableau ne démontre pas un optimum : la rotation est une politique commune déterministe, pas une recherche exhaustive. Les ennemis regroupés rendent les bonus de rayon peu utiles ; les contrôles hostiles, les dégâts magiques, les objectifs PvP et la menace de plusieurs PNJ demandent d’autres rencontres.
- Le témoin sans point contenu dans le JSON mesure l’effet d’investissement. Il n’est pas un concurrent à budget égal ; comparer les trois candidats à 20 points entre eux.
- Les métriques de Garde séparent dégâts bruts transférés, mitigation de chaque destinataire et dégâts effectivement reçus ; le transfert n’est pas compté comme une seconde absorption.
- Les protections fortes utilisent le maximum, pas leur somme. Les réductions de sources différentes se multiplient. Le rang 2 remplace le rang 1.
- La sensibilité JSON contient 27 essais complémentaires : trois templates, pressions à 90/100/110 % et trois graines appariées. Cela ne constitue pas un intervalle de confiance statistique ni une simulation de joueurs.

## Reproduction

```sh
node scripts/simulate_rempart.mjs --output /tmp/rempart-v1.json
node --test tests/*.test.mjs
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -q
```

Empreinte moteur : `59d2026f4074b90ea8a63e3b11012c6bafaa48524205facb16d4fe595cf51a91`.
Empreinte référence : `efa04db6623b5cb249d5cd02557c0c388b282a2785ebfa4afbd834e39c8f6242`.
Entrées : `balance/rempart-reference-v1.json`, `balance/rempart-v1/`, scénarios et politique dans `scripts/simulate_rempart.mjs`. Résultats complets : `balance/reports/rempart-v1.json`.
