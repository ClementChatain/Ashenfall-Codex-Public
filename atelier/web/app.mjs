const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const states = {
  ideas: "Idées",
  deepen: "À approfondir",
  review: "À relire",
  rework: "À retravailler",
  approved: "Validées",
};
const colors = {
  gold: "#dfba72",
  sage: "#9dbb9e",
  rose: "#c99892",
  blue: "#a1bdd1",
};
const uid = () => crypto.randomUUID();
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let state,
  doc,
  selected = "",
  view = "board",
  filter = "all",
  query = "",
  dirty = false,
  saving = false,
  conflicted = false,
  timer,
  linkSource = "",
  tool = "move";
let pan = { x: 40, y: 100, z: 1 },
  gesture = null,
  autosaveError = false;
const byId = (id) => doc?.nodes.find((n) => n.id === id);
const say = (text) => {
  $("#message").textContent = text;
  $("#message").hidden = !text;
  $("#announcer").textContent = text;
};
const sync = (text) => ($("#sync").textContent = text);
function canonical(v) {
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  if (v && typeof v === "object")
    return (
      "{" +
      Object.keys(v)
        .sort()
        .map((k) => JSON.stringify(k) + ":" + canonical(v[k]))
        .join(",") +
      "}"
    );
  return JSON.stringify(v);
}
async function hashNode(n) {
  const copy = { ...n };
  delete copy.x;
  delete copy.y;
  return [
    ...new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(canonical(copy)),
      ),
    ),
  ]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}
const hashes = new Map();
async function updateHashes() {
  await Promise.all(
    doc.nodes.map(async (n) => hashes.set(n.id, await hashNode(n))),
  );
}
const approval = (n) =>
  state.approvals
    .filter((a) => a.node_id === n.id && a.digest === hashes.get(n.id))
    .at(-1);
const file = (id) => state.files.find((f) => f.id === id);
const readable = (size) =>
  size > 1048576
    ? (size / 1048576).toFixed(1) + " Mo"
    : Math.ceil(size / 1024) + " Ko";
async function api(path, body, raw = false) {
  const headers = {};
  if (body !== undefined) {
    headers["X-CSRF-Token"] = state?.csrf || "";
    if (!raw) headers["Content-Type"] = "application/json";
  }
  const r = await fetch("/api/" + path, {
    method: body === undefined ? "GET" : "POST",
    credentials: "same-origin",
    headers,
    body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
  });
  let data;
  try {
    data = await r.json();
  } catch {
    throw new Error(
      "Le serveur ne répond pas. Ton travail reste dans cet onglet.",
    );
  }
  if (!r.ok) {
    const e = new Error(data.error || "Action indisponible");
    e.status = r.status;
    throw e;
  }
  return data;
}
async function load(initial = false) {
  try {
    const data = await api("state");
    state = data;
    doc = data.document;
    await updateHashes();
    dirty = false;
    conflicted = false;
    autosaveError = false;
    $("#conflict").hidden = true;
    $("#login").hidden = true;
    $("#loading").hidden = true;
    $("#app").hidden = false;
    $("#identity").textContent =
      data.user.name +
      " · " +
      (data.user.role === "reviewer"
        ? "Relecture et validation"
        : "Contributeur");
    $("#top-user").textContent = data.user.name;
    $("#top-user").dataset.initial = data.user.name.slice(0, 1).toUpperCase();
    sync("Enregistré · privé");
    render();
    renderInspector();
  } catch (e) {
    $("#loading").hidden = true;
    if (e.status === 401) {
      $("#login").hidden = false;
      $("#app").hidden = true;
    } else if (initial) {
      $("#login").hidden = false;
      $("#login-error").textContent =
        "Atelier indisponible. Vérifie la connexion au serveur.";
    } else say(e.message);
  }
}
function changed() {
  dirty = true;
  autosaveError = false;
  sync("Modifications à enregistrer…");
  clearTimeout(timer);
  timer = setTimeout(save, 700);
}
async function save() {
  if (!dirty || saving || conflicted) return !dirty;
  saving = true;
  sync("Enregistrement…");
  const snapshot = JSON.stringify(doc);
  try {
    const r = await api("workspace", {
      revision: state.revision,
      document: JSON.parse(snapshot),
    });
    state.revision = r.revision;
    dirty = JSON.stringify(doc) !== snapshot;
    sync(dirty ? "Modifications à enregistrer…" : "Enregistré · privé");
    await updateHashes();
    autosaveError = false;
    if (dirty) timer = setTimeout(save, 200);
    return !dirty;
  } catch (e) {
    autosaveError = true;
    sync(
      e.status === 409
        ? "Conflit · version locale conservée"
        : "Non enregistré · réessayer",
    );
    if (e.status === 409) {
      conflicted = true;
      $("#conflict").hidden = false;
    }
    say(e.message);
    return false;
  } finally {
    saving = false;
  }
}
async function flush() {
  clearTimeout(timer);
  while (saving) await new Promise((r) => setTimeout(r, 40));
  if (dirty) return save();
  return !conflicted;
}
function filtered() {
  return doc.nodes.filter(
    (n) =>
      (!query ||
        [n.title, n.body, n.tag].join(" ").toLowerCase().includes(query)) &&
      (filter === "all" ||
        (filter === "inbox" && !n.parent) ||
        (filter === "review" && n.status === "review") ||
        (filter === "approved" && approval(n))),
  );
}
function children(id) {
  return doc.nodes.filter((n) => n.parent === id);
}
function descendants(id) {
  const result = new Set([id]);
  let more = true;
  while (more) {
    more = false;
    for (const n of doc.nodes)
      if (result.has(n.parent) && !result.has(n.id)) {
        result.add(n.id);
        more = true;
      }
  }
  return result;
}
function noteHTML(n, compact = false) {
  const image = n.attachments
    .map(file)
    .find((f) => f?.mime.startsWith("image/"));
  const comments = state.comments.filter((c) => c.node_id === n.id).length;
  return (
    '<article class="note ' +
    esc(n.color) +
    (selected === n.id ? " active" : "") +
    '" tabindex="0" role="button" aria-label="Ouvrir ' +
    esc(n.title) +
    '" data-node="' +
    esc(n.id) +
    '" draggable="' +
    (view === "board") +
    '"><h3>' +
    esc(n.title) +
    "</h3>" +
    (n.tag ? '<span class="note-tag">' + esc(n.tag) + "</span>" : "") +
    (approval(n) ? '<span class="note-tag">✓ Version validée</span>' : "") +
    (n.parent
      ? '<span class="note-tag">↳ ' + esc(byId(n.parent)?.title) + "</span>"
      : "") +
    (image && !compact
      ? '<img src="/api/files/' +
        esc(image.id) +
        '/preview" alt="Illustration de ' +
        esc(n.title) +
        '" loading="lazy">'
      : "") +
    "<p>" +
    esc(n.body.slice(0, compact ? 90 : 170)) +
    (n.body.length > (compact ? 90 : 170) ? "…" : "") +
    '</p><div class="note-meta"><span>' +
    children(n.id).length +
    " sous-idée(s)</span><span>" +
    n.attachments.length +
    " PJ · " +
    comments +
    " avis</span></div></article>"
  );
}
function render() {
  if (!doc) return;
  const nodes = filtered();
  $("#count").textContent =
    doc.nodes.length + " idée(s) · " + state.files.length + " fichier(s)";
  $$("[data-view]").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === view);
    b.setAttribute("aria-pressed", b.dataset.view === view);
  });
  $$("[data-filter]").forEach((b) =>
    b.classList.toggle("active", b.dataset.filter === filter),
  );
  const workspace = $("#workspace");
  workspace.innerHTML = "";
  if (!doc.nodes.length) {
    workspace.innerHTML =
      '<div class="empty"><div class="sigil">✧</div><h2>Tout commence par une idée.</h2><p>Une phrase, un lieu, une image, une question… Déposez vos premières pistes ici. Vous pourrez les imbriquer, les relier et les développer ensemble.</p><button class="primary" data-action="first">＋ Créer la première idée</button><p><small>Votre atelier est vide. Aucun exemple n’est présenté comme du lore établi.</small></p></div>';
    return;
  }
  if (view === "canvas") {
    renderCanvas(nodes);
    return;
  }
  if (view === "tree") {
    const visible = new Set(nodes.map((n) => n.id));
    const out = [];
    const walk = (n, d) => {
      if (visible.has(n.id))
        out.push(
          '<div class="tree-row" style="--depth:' +
            Math.min(d, 12) +
            '">' +
            noteHTML(n, true) +
            "</div>",
        );
      for (const c of children(n.id)) walk(c, d + 1);
    };
    for (const n of doc.nodes.filter((n) => !n.parent)) walk(n, 0);
    workspace.innerHTML =
      out.join("") ||
      '<p class="empty">Aucune idée ne correspond à ce filtre.</p>';
    return;
  }
  workspace.innerHTML =
    '<div class="board">' +
    Object.entries(states)
      .map(([key, label]) => {
        const list = nodes.filter((n) =>
          key === "approved" ? approval(n) : !approval(n) && n.status === key,
        );
        return (
          '<section class="column" data-column="' +
          key +
          '"><h2>' +
          label +
          " <small>" +
          list.length +
          "</small></h2>" +
          list.map((n) => noteHTML(n)).join("") +
          '<div class="empty-column">' +
          (key === "approved"
            ? "Validation réservée au relecteur"
            : "Déposer une idée ici") +
          "</div></section>"
        );
      })
      .join("") +
    "</div>";
}
function openNode(id) {
  selected = id;
  renderInspector();
  if (view !== "canvas") render();
  else
    $$(".note").forEach((n) =>
      n.classList.toggle("active", n.dataset.node === selected),
    );
  $("#announcer").textContent = "Fiche ouverte : " + byId(id)?.title;
}
function renderInspector() {
  const panel = $("#inspector"),
    n = byId(selected);
  panel.hidden = !n;
  if (!n) return;
  const editing =
    panel.dataset.idea === n.id && panel.querySelector(".idea-editor")?.open;
  const resources =
    panel.dataset.idea === n.id && panel.querySelector(".idea-resources")?.open;
  panel.dataset.idea = n.id;
  const excluded = descendants(n.id);
  const comments = state.comments.filter((c) => c.node_id === n.id);
  const approvals = state.approvals.filter((a) => a.node_id === n.id);
  const active = approval(n);
  panel.innerHTML =
    '<div class="panel-top"><span class="status">' +
    (active ? "✓ VERSION VALIDÉE" : "PROPOSITION · NON CANONIQUE") +
    '</span><button class="close" data-action="close" aria-label="Fermer la fiche">×</button></div><h2>' +
    esc(n.title) +
    '</h2><div class="idea-reading"><p>' +
    esc(n.body || "Une nouvelle piste à développer…") +
    '</p></div><details class="idea-editor"' +
    (editing ? " open" : "") +
    '><summary>✎ Modifier et organiser l’idée</summary><p class="hint">Les sous-idées gardent leur propre validation.</p><label>Titre<input id="node-title" value="' +
    esc(n.title) +
    '" maxlength="180" required></label><div class="row"><label>Étape<select id="node-status">' +
    Object.entries(states)
      .filter(([k]) => k !== "approved")
      .map(
        ([k, v]) =>
          '<option value="' +
          k +
          '"' +
          (n.status === k ? " selected" : "") +
          ">" +
          v +
          "</option>",
      )
      .join("") +
    '</select></label><label>Couleur<select id="node-color">' +
    Object.entries({ gold: "Or", sage: "Sauge", rose: "Rose", blue: "Bleu" })
      .map(
        ([k, v]) =>
          '<option value="' +
          k +
          '"' +
          (n.color === k ? " selected" : "") +
          ">" +
          v +
          "</option>",
      )
      .join("") +
    '</select></label></div><label>Étiquette<input id="node-tag" value="' +
    esc(n.tag) +
    '" placeholder="Lieu, tradition, personnage…" maxlength="80"></label><label>Idée parente<select id="node-parent"><option value="">Aucune · dans le vrac</option>' +
    doc.nodes
      .filter((c) => !excluded.has(c.id))
      .map(
        (c) =>
          '<option value="' +
          esc(c.id) +
          '"' +
          (n.parent === c.id ? " selected" : "") +
          ">" +
          esc(c.title) +
          "</option>",
      )
      .join("") +
    '</select></label><label>Texte et pistes à explorer<textarea id="node-body" maxlength="100000" rows="9" placeholder="Développez l’idée à votre rythme…">' +
    esc(n.body) +
    '</textarea></label><button data-action="child">＋ Ajouter une sous-idée</button>' +
    children(n.id)
      .map(
        (c) =>
          '<button class="related" data-open="' +
          esc(c.id) +
          '">↳ ' +
          esc(c.title) +
          "</button>",
      )
      .join("") +
    '</details><details class="idea-resources"' +
    (resources ? " open" : "") +
    "><summary>◇ Images, fichiers et relations <span>" +
    n.attachments.length +
    ' PJ</span></summary><p class="hint">20 Mo par fichier. Téléchargement privé.</p><div>' +
    n.attachments
      .map((id) => {
        const f = file(id);
        return f
          ? '<div class="attachment">' +
              (f.mime.startsWith("image/")
                ? '<img src="/api/files/' + esc(id) + '/preview" alt="">'
                : "") +
              '<a href="/api/files/' +
              esc(id) +
              '">' +
              esc(f.name) +
              " <small>" +
              readable(f.size) +
              '</small></a><button data-detach="' +
              esc(id) +
              '" aria-label="Détacher ' +
              esc(f.name) +
              '">×</button></div>'
          : "";
      })
      .join("") +
    '</div><button data-action="attach">＋ Joindre des fichiers</button><h3>Relations</h3>' +
    doc.edges
      .filter((e) => e.from === n.id || e.to === n.id)
      .map(
        (e) =>
          '<div class="attachment"><button data-open="' +
          esc(e.from === n.id ? e.to : e.from) +
          '">' +
          esc(e.label || "Lié à") +
          " · " +
          esc(byId(e.from === n.id ? e.to : e.from)?.title) +
          '</button><button data-unlink="' +
          esc(e.id) +
          '" aria-label="Supprimer le lien">×</button></div>',
      )
      .join("") +
    '<p class="hint">Tracez les relations avec l’outil Relier sur la toile.</p></details><h3 class="review-heading">Ton avis</h3>' +
    comments
      .map(
        (c) =>
          '<div class="comment"><strong>' +
          esc(c.author) +
          "</strong><time>" +
          new Date(c.created * 1000).toLocaleString("fr-FR") +
          "</time><p>" +
          esc(c.body) +
          "</p></div>",
      )
      .join("") +
    '<form id="comment-form"><label class="comment-label">Ajouter un commentaire<textarea id="comment-body" rows="3" maxlength="10000" required placeholder="Une question, une suggestion…"></textarea></label><button type="submit">Ajouter mon commentaire</button></form><div class="actions">' +
    (state.user.role === "reviewer"
      ? '<button class="primary" data-action="approve">✓ Valider cette version</button>'
      : '<p class="hint">La validation appartient au compte de relecture.</p>') +
    '<button data-action="rework">À retravailler</button><p class="hint">♧ Aucune de ces actions ne publie sur le Codex.</p></div>' +
    (approvals.length
      ? "<h3>Historique des validations</h3>" +
        approvals
          .map(
            (a) =>
              '<p class="history">' +
              esc(a.author) +
              " · " +
              new Date(a.created * 1000).toLocaleString("fr-FR") +
              "<br>" +
              (active?.id === a.id
                ? "Version actuelle validée"
                : "Version antérieure · contenu modifié depuis") +
              "</p>",
          )
          .join("")
      : "") +
    '<h3>Gérer cette idée</h3><button data-action="delete" class="danger">Supprimer l’idée…</button>';
}
function newNode(parent = "") {
  const pos =
    view === "canvas"
      ? { x: (180 - pan.x) / pan.z, y: (180 - pan.y) / pan.z }
      : {
          x: 70 + (doc.nodes.length % 4) * 300,
          y: 100 + Math.floor(doc.nodes.length / 4) * 260,
        };
  const n = {
    id: uid(),
    parent,
    title: "Nouvelle idée",
    body: "",
    status: "ideas",
    tag: "",
    color: "gold",
    ...pos,
    attachments: [],
  };
  doc.nodes.push(n);
  selected = n.id;
  changed();
  render();
  renderInspector();
  $(".idea-editor").open = true;
  $("#node-title")?.select();
}
function exportLocal() {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          format: "ashenfall-atelier-v1",
          revision: state.revision,
          document: doc,
          files: state.files,
          comments: state.comments,
          approvals: state.approvals,
          notice:
            "Export privé. Fichiers binaires dans la sauvegarde serveur. Aucune publication autorisée par cet export.",
        },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download =
    "atelier-prive-" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const button = e.target.querySelector("button");
  button.disabled = true;
  try {
    await api("login", {
      name: form.get("name"),
      password: form.get("password"),
    });
    e.target.reset();
    await load();
  } catch (e) {
    $("#login-error").textContent = e.message;
  } finally {
    button.disabled = false;
  }
});
$("#mobile-menu").onclick = () => {
  const open = $("#app").classList.toggle("sidebar-open");
  $("#mobile-menu").setAttribute("aria-expanded", open);
};
$("#new").onclick = () => newNode();
$("#export").onclick = exportLocal;
$("#export-conflict").onclick = exportLocal;
$("#load-shared").onclick = async () => {
  if (
    confirm(
      "Charger la version partagée remplacera le travail non enregistré de cet onglet. As-tu exporté ta version ?",
    )
  ) {
    clearTimeout(timer);
    await load();
  }
};
$("#logout").onclick = async () => {
  if (!(await flush())) return;
  await api("logout", {});
  state = null;
  doc = null;
  $("#app").hidden = true;
  $("#login").hidden = false;
};
$("#search").oninput = (e) => {
  query = e.target.value.toLowerCase().trim();
  render();
};
$("#sync").onclick = () => {
  if (dirty && !conflicted) save();
};
$("#import").onchange = async (e) => {
  try {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 4 * 1024 * 1024)
      throw new Error("Export trop volumineux (4 Mo maximum).");
    const imported = JSON.parse(await f.text());
    if (
      imported.format !== "ashenfall-atelier-v1" ||
      !imported.document ||
      !Array.isArray(imported.document.nodes)
    )
      throw new Error("Format d’export non reconnu.");
    if (!(await flush()))
      throw new Error(
        "Enregistre ou exporte le travail actuel avant l’import.",
      );
    if (
      !confirm(
        "Remplacer l’espace actuel par cet export ? Les fichiers binaires doivent déjà exister sur ce serveur. Les validations ne sont jamais créées par un import.",
      )
    )
      return;
    await api("workspace", {
      revision: state.revision,
      document: imported.document,
    });
    await load();
    say("Export importé. Les validations sont vérifiées par le serveur.");
  } catch (e) {
    say(e.message);
  } finally {
    e.target.value = "";
  }
};
$("#attachment-input").onchange = async (e) => {
  const target = selected;
  try {
    for (const f of e.target.files) {
      if (f.size > 20 * 1024 * 1024)
        throw new Error(f.name + " dépasse 20 Mo.");
      const r = await fetch("/api/files", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRF-Token": state.csrf,
          "X-File-Name": encodeURIComponent(f.name),
        },
        body: f,
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      state.files.push(data);
      const n = byId(target);
      if (n) {
        n.attachments.push(data.id);
        changed();
      }
    }
    render();
    renderInspector();
  } catch (e) {
    say(e.message);
  } finally {
    e.target.value = "";
  }
};
document.addEventListener("input", (e) => {
  const n = byId(selected);
  if (!n || !e.target.id.startsWith("node-")) return;
  const key = e.target.id.slice(5);
  if (["title", "body", "tag", "status", "parent", "color"].includes(key)) {
    n[key] = e.target.value;
    hashes.delete(n.id);
    const reading = $("#inspector .idea-reading p");
    if (reading && key === "body")
      reading.textContent = n.body || "Une nouvelle piste à développer…";
    const heading = $("#inspector > h2");
    if (heading && key === "title") heading.textContent = n.title;
    const badge = $("#inspector .status");
    if (badge) badge.textContent = "PROPOSITION · NON CANONIQUE";
    changed();
    if (e.target.tagName === "SELECT") {
      render();
      renderInspector();
    } else {
      const card = $('[data-node="' + n.id + '"] h3');
      if (card && key === "title") card.textContent = n.title;
    }
  }
});
document.addEventListener("change", (e) => {
  if (e.target.id.startsWith("node-")) render();
});
document.addEventListener("click", async (e) => {
  try {
    const v = e.target.closest("[data-view]");
    if (v) {
      view = v.dataset.view;
      linkSource = "";
      render();
      return;
    }
    const f = e.target.closest("[data-filter]");
    if (f) {
      filter = f.dataset.filter;
      $("#app").classList.remove("sidebar-open");
      $("#mobile-menu").setAttribute("aria-expanded", "false");
      render();
      return;
    }
    const op = e.target.closest("[data-open]");
    if (op) {
      openNode(op.dataset.open);
      return;
    }
    const detach = e.target.closest("[data-detach]");
    if (detach) {
      byId(selected).attachments = byId(selected).attachments.filter(
        (id) => id !== detach.dataset.detach,
      );
      hashes.delete(selected);
      changed();
      render();
      renderInspector();
      return;
    }
    const unlink = e.target.closest("[data-unlink]");
    if (unlink) {
      doc.edges = doc.edges.filter((x) => x.id !== unlink.dataset.unlink);
      changed();
      render();
      renderInspector();
      return;
    }
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "first") {
      newNode();
      return;
    }
    if (action === "close") {
      $("#inspector").hidden = true;
      selected = "";
      render();
      return;
    }
    if (action === "child") {
      newNode(selected);
      return;
    }
    if (action === "attach") {
      $("#attachment-input").click();
      return;
    }
    if (action === "rework") {
      byId(selected).status = "rework";
      hashes.delete(selected);
      changed();
      render();
      renderInspector();
      return;
    }
    if (action === "approve") {
      if (!(await flush())) return;
      await api("validate", { node: selected, revision: state.revision });
      const saved = selected;
      await load();
      selected = saved;
      renderInspector();
      say("Cette version de l’idée est validée. Aucun contenu n’a été publié.");
      return;
    }
    if (action === "delete") {
      const n = byId(selected);
      if (
        !confirm(
          "Supprimer « " +
            n.title +
            " » ? Ses sous-idées seront remontées d’un niveau. La sauvegarde serveur conserve les versions précédentes.",
        )
      )
        return;
      for (const child of children(n.id)) child.parent = n.parent;
      doc.nodes = doc.nodes.filter((c) => c.id !== n.id);
      doc.edges = doc.edges.filter(
        (edge) => edge.from !== n.id && edge.to !== n.id,
      );
      selected = "";
      changed();
      render();
      renderInspector();
      return;
    }
    if (e.target.closest("[data-canvas-tool]")) {
      tool = e.target.closest("[data-canvas-tool]").dataset.canvasTool;
      linkSource = "";
      render();
      return;
    }
    const zoom = e.target.closest("[data-zoom]");
    if (zoom) {
      if (zoom.dataset.zoom === "fit") {
        pan = { x: 40, y: 100, z: 0.7 };
        if (doc.nodes.length) {
          pan.x = 40 - Math.min(...doc.nodes.map((n) => n.x)) * 0.7;
          pan.y = 100 - Math.min(...doc.nodes.map((n) => n.y)) * 0.7;
        }
      } else zoomAt(zoom.dataset.zoom === "in" ? 1.2 : 1 / 1.2, 280, 220);
      transform();
      return;
    }
    const card = e.target.closest("[data-node]");
    if (card) {
      if (gesture?.moved) return;
      if (view === "canvas" && tool === "link") {
        if (!linkSource) {
          linkSource = card.dataset.node;
          say("Choisis la deuxième idée à relier.");
        } else if (linkSource !== card.dataset.node) {
          const label = prompt("Nom de la relation (facultatif)", "Lié à");
          if (label !== null) {
            doc.edges.push({
              id: uid(),
              from: linkSource,
              to: card.dataset.node,
              label: label.slice(0, 120),
            });
            changed();
          }
          linkSource = "";
          say("");
          render();
        }
        return;
      }
      openNode(card.dataset.node);
    }
  } catch (err) {
    say(err.message);
  }
});
document.addEventListener("submit", async (e) => {
  if (e.target.id !== "comment-form") return;
  e.preventDefault();
  const body = $("#comment-body").value;
  try {
    if (!(await flush())) return;
    await api("comments", { node: selected, body });
    const saved = selected;
    await load();
    selected = saved;
    renderInspector();
  } catch (e) {
    say(e.message);
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("#app").classList.remove("sidebar-open");
    $("#mobile-menu").setAttribute("aria-expanded", "false");
    if (selected) {
      selected = "";
      $("#inspector").hidden = true;
      render();
    } else {
      tool = "move";
      linkSource = "";
      render();
    }
  }
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-node]")) {
    e.preventDefault();
    openNode(e.target.dataset.node);
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    flush();
  }
});
document.addEventListener("dragstart", (e) => {
  const card = e.target.closest("[data-node]");
  if (card && view === "board")
    e.dataTransfer.setData("text/ashenfall-node", card.dataset.node);
});
document.addEventListener("dragover", (e) => {
  const c = e.target.closest("[data-column]");
  if (c) {
    e.preventDefault();
    c.classList.add("drag-over");
  }
});
document.addEventListener("dragleave", (e) =>
  e.target.closest("[data-column]")?.classList.remove("drag-over"),
);
document.addEventListener("drop", (e) => {
  const c = e.target.closest("[data-column]");
  if (!c) return;
  e.preventDefault();
  const n = byId(e.dataTransfer.getData("text/ashenfall-node"));
  if (!n) return;
  if (c.dataset.column === "approved") {
    say(
      "Pour valider une version, ouvre la fiche avec le compte de relecture.",
    );
    render();
    return;
  }
  n.status = c.dataset.column;
  hashes.delete(n.id);
  changed();
  render();
  renderInspector();
});
function transform() {
  const world = $(".canvas-world");
  if (world)
    world.style.transform = `translate(${pan.x}px,${pan.y}px) scale(${pan.z})`;
  const z = $("#zoom-label");
  if (z) z.textContent = Math.round(pan.z * 100) + " %";
}
function zoomAt(f, x, y) {
  const next = Math.max(0.2, Math.min(2, pan.z * f));
  pan.x = x - ((x - pan.x) * next) / pan.z;
  pan.y = y - ((y - pan.y) * next) / pan.z;
  pan.z = next;
}
function renderCanvas(nodes) {
  $("#workspace").innerHTML =
    '<div class="canvas-shell" aria-label="Toile libre : déplacer, relier et dessiner"><div class="canvas-tools">' +
    [
      ["move", "↖ Déplacer"],
      ["draw", "✎ Dessiner"],
      ["link", "⌁ Relier"],
      ["erase", "⌫ Effacer trait"],
    ]
      .map(
        ([k, v]) =>
          '<button data-canvas-tool="' +
          k +
          '" class="' +
          (tool === k ? "active" : "") +
          '" aria-pressed="' +
          (tool === k) +
          '">' +
          v +
          "</button>",
      )
      .join("") +
    '<button data-zoom="out" aria-label="Dézoomer">−</button><span id="zoom-label"></span><button data-zoom="in" aria-label="Zoomer">＋</button><button data-zoom="fit">Recentrer</button></div><div class="canvas-world"><svg aria-hidden="true"><g transform="translate(10000 10000)"></g></svg>' +
    nodes.map((n) => noteHTML(n)).join("") +
    '</div><div class="canvas-help">Déplacer : glisser le fond ou une carte · Molette : déplacer · Ctrl + molette : zoomer · Les sous-idées se gèrent dans les fiches.</div></div>';
  for (const n of nodes) {
    const card = $('[data-node="' + n.id + '"]');
    card.style.left = n.x + "px";
    card.style.top = n.y + "px";
  }
  drawSVG();
  transform();
  const shell = $(".canvas-shell");
  shell.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const r = shell.getBoundingClientRect();
        zoomAt(
          Math.exp(-e.deltaY * 0.005),
          e.clientX - r.left,
          e.clientY - r.top,
        );
      } else {
        pan.x -= e.deltaX;
        pan.y -= e.deltaY;
      }
      transform();
    },
    { passive: false },
  );
  shell.addEventListener("pointerdown", canvasDown);
  shell.addEventListener("pointermove", canvasMove);
  shell.addEventListener("pointerup", canvasUp);
  shell.addEventListener("pointercancel", canvasUp);
}
function svgEl(tag, attrs) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}
function drawSVG() {
  const g = $(".canvas-world g");
  if (!g) return;
  g.replaceChildren();
  for (const edge of doc.edges) {
    const a = byId(edge.from),
      b = byId(edge.to);
    if (!a || !b) continue;
    const x1 = a.x + 120,
      y1 = a.y + 80,
      x2 = b.x + 120,
      y2 = b.y + 80;
    g.append(
      svgEl("path", {
        d: `M${x1} ${y1} C${x1 + 100} ${y1} ${x2 - 100} ${y2} ${x2} ${y2}`,
        class: "wire",
      }),
    );
    const t = svgEl("text", {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2 - 8,
      "text-anchor": "middle",
    });
    t.textContent = edge.label;
    g.append(t);
  }
  for (const stroke of doc.strokes)
    g.append(
      svgEl("polyline", {
        points: stroke.points.map((p) => p.join(",")).join(" "),
        stroke: colors[stroke.color],
      }),
    );
}
function localPoint(e) {
  const r = $(".canvas-shell").getBoundingClientRect();
  return [
    (e.clientX - r.left - pan.x) / pan.z,
    (e.clientY - r.top - pan.y) / pan.z,
  ].map((v) => Math.max(-9900, Math.min(9900, v)));
}
function canvasDown(e) {
  if (e.target.closest(".canvas-tools") || e.button !== 0) return;
  const card = e.target.closest("[data-node]");
  if (tool === "link") return;
  if (card && tool !== "move") return;
  const point = localPoint(e);
  gesture = {
    kind: card
      ? "node"
      : tool === "draw"
        ? "draw"
        : tool === "erase"
          ? "erase"
          : "pan",
    id: card?.dataset.node,
    start: [e.clientX, e.clientY],
    point,
    pan: { ...pan },
    moved: false,
  };
  if (card) {
    const n = byId(card.dataset.node);
    gesture.orig = { x: n.x, y: n.y };
  }
  if (gesture.kind === "draw") {
    gesture.stroke = { id: uid(), points: [point], color: "gold" };
    doc.strokes.push(gesture.stroke);
  }
  if (gesture.kind === "erase") {
    let best = 30 / pan.z,
      index = -1;
    doc.strokes.forEach((s, i) =>
      s.points.forEach((p) => {
        const d = Math.hypot(p[0] - point[0], p[1] - point[1]);
        if (d < best) {
          best = d;
          index = i;
        }
      }),
    );
    if (index >= 0) {
      doc.strokes.splice(index, 1);
      changed();
      drawSVG();
    }
  }
  e.currentTarget.setPointerCapture(e.pointerId);
}
function canvasMove(e) {
  if (!gesture) return;
  const dx = e.clientX - gesture.start[0],
    dy = e.clientY - gesture.start[1];
  if (Math.hypot(dx, dy) > 4) gesture.moved = true;
  if (gesture.kind === "pan") {
    pan.x = gesture.pan.x + dx;
    pan.y = gesture.pan.y + dy;
    transform();
  }
  if (gesture.kind === "node" && gesture.moved) {
    const n = byId(gesture.id);
    n.x = Math.max(-9900, Math.min(9900, gesture.orig.x + dx / pan.z));
    n.y = Math.max(-9900, Math.min(9900, gesture.orig.y + dy / pan.z));
    const el = $('[data-node="' + n.id + '"]');
    el.style.left = n.x + "px";
    el.style.top = n.y + "px";
    drawSVG();
  }
  if (gesture.kind === "draw" && gesture.stroke.points.length < 2000) {
    gesture.stroke.points.push(localPoint(e));
    drawSVG();
  }
}
function canvasUp(e) {
  if (!gesture) return;
  const g = gesture;
  if (g.kind === "draw") {
    if (g.stroke.points.length < 2)
      doc.strokes = doc.strokes.filter((s) => s.id !== g.stroke.id);
    else changed();
    drawSVG();
  }
  if (g.kind === "node" && g.moved) changed();
  if (g.kind === "node" && !g.moved) openNode(g.id);
  setTimeout(() => {
    gesture = null;
  }, 0);
}
window.addEventListener("beforeunload", (e) => {
  if (dirty || saving) {
    e.preventDefault();
    e.returnValue = "";
  }
});
setInterval(async () => {
  if (
    !state ||
    dirty ||
    saving ||
    conflicted ||
    document.hidden ||
    $("#comment-body")?.value
  )
    return;
  try {
    const fresh = await api("state");
    if (
      fresh.revision !== state.revision ||
      fresh.comments.length !== state.comments.length ||
      fresh.approvals.length !== state.approvals.length
    ) {
      state = fresh;
      doc = fresh.document;
      await updateHashes();
      render();
      renderInspector();
    }
  } catch (e) {
    if (e.status === 401) {
      sync("Session expirée · exporte avant de recharger");
      say(e.message);
    } else sync("Connexion interrompue · version en mémoire");
  }
}, 7000);
load(true);
