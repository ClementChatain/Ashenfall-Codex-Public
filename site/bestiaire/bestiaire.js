(function () {
  var liste = document.getElementById("liste");
  var filtre = document.getElementById("filtre");
  var data = window.BESTIAIRE || [];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function carte(c) {
    var a = el("article", "carte");
    a.id = c.id;
    var vignette = el("div", "vignette");
    if (c.image) {
      var img = el("img");
      img.src = c.image; img.alt = c.nom; img.loading = "lazy";
      vignette.appendChild(img);
    } else {
      vignette.textContent = "Rendu à venir";
    }
    a.appendChild(vignette);
    var corps = el("div", "corps");
    var t = el("h2", null, c.nom);
    var tags = el("p", "tags");
    tags.appendChild(el("span", "tag", c.categorie));
    tags.appendChild(el("span", "tag " + c.statut, c.statut === "integre" ? "Intégré au jeu" : "Prévu"));
    corps.appendChild(t);
    corps.appendChild(tags);
    corps.appendChild(el("p", null, c.resume));
    var dl = el("dl");
    c.details.forEach(function (d) {
      dl.appendChild(el("dt", null, d[0]));
      dl.appendChild(el("dd", null, d[1]));
    });
    corps.appendChild(dl);
    var s = el("p", "source");
    s.appendChild(document.createTextNode("Source : " + c.source.titre + " par " + c.source.auteur + " sur " + c.source.lieu + " — "));
    var lien = el("a", null, "page de l'asset");
    lien.href = c.source.url; lien.rel = "noopener"; lien.target = "_blank";
    s.appendChild(lien);
    s.appendChild(el("br"));
    s.appendChild(document.createTextNode(c.source.licence));
    corps.appendChild(s);
    a.appendChild(corps);
    return a;
  }

  function rendre() {
    liste.textContent = "";
    var cat = filtre.value;
    data.filter(function (c) { return !cat || c.categorie === cat; })
        .forEach(function (c) { liste.appendChild(carte(c)); });
  }

  var cats = [];
  data.forEach(function (c) { if (cats.indexOf(c.categorie) < 0) cats.push(c.categorie); });
  cats.forEach(function (c) { var o = el("option", null, c); o.value = c; filtre.appendChild(o); });
  filtre.addEventListener("change", rendre);
  rendre();
})();
