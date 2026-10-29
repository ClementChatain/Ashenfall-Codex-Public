// Données du bestiaire. Une entrée par créature ; le rendu est fait par bestiaire.js.
// "statut" : integre | prevu. Les statistiques de jeu ne sont pas encore définies (aucune invention).
window.BESTIAIRE = [
  {
    id: "golem-pierre-blinde",
    nom: "Golem de pierre blindé",
    categorie: "Boss",
    statut: "prevu",
    image: "img/golem.png",
    resume: "Colosse de pierre et de métal usé, armé d'un marteau et d'un bouclier massifs, animé par une rune qui brille dans sa poitrine.",
    details: [
      ["Rôle prévu", "Boss de forteresse (à confirmer)"],
      ["Armes", "Marteau, bouclier"],
      ["Apparences", "4 skins fournis avec l'asset"],
      ["Animations fournies", "25 : 5 attaques, 3 morts, esquive, 3 réactions aux coups, 4 repos, marche et course dans 4 directions, demi-tour"],
      ["Statistiques de jeu", "À définir"]
    ],
    source: {
      titre: "Armored Stone Golem - Dark Fantasy Boss",
      auteur: "Alexander Lenski",
      lieu: "Fab (fab.com)",
      url: "https://www.fab.com/listings/e40713f0-ebea-4f4d-ad9b-b577db4432d5",
      licence: "Licence Fab de l'achat/ajout à la bibliothèque : usage dans le jeu permis, redistribution des fichiers seuls interdite. Fichiers sources absents de ce dépôt public."
    }
  }
];
