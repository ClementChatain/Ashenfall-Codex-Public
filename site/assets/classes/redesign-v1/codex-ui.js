/* Presentation layer only. The approved records and existing routes remain authoritative. */
(() => {
  'use strict';
  const asset = 'assets/classes/redesign-v1/';
  const dwarfIds = ['rempart', 'brise-fer', 'artilleur-runique', 'accordeur'];
  const tabs = new Map();
  const originalDossier = renderClassDossier;
  const originalRender = render;
  const archiveNavigation = nav.innerHTML;
  const stages = ['Départ', 'Premières protections', 'Mailles', 'Premières plaques', 'Armure lourde', 'Armure de maître'];
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const emblem = id => 'assets/emblems/v1/classes-' + id + '.webp';
  const entryFor = id => data.find(entry => entry[0] === id);
  const roleLabel = entry => {
    const role = roleInfo(entry).role;
    return /heal/i.test(role) ? 'SOIGNEUR' : role.toUpperCase();
  };
  document.body.classList.add('atlas');
  document.querySelector('main > header').classList.add('app-toolbar');
  document.querySelector('.brand').innerHTML = '<a href="#/home">ASHENFALL<span>CODEX</span></a>';
  document.querySelector('aside > .sub').textContent = 'LES ARCHIVES DU MONDE';
  const top = document.createElement('nav');
  top.className = 'world-nav'; top.setAttribute('aria-label', 'Explorer le Codex');
  top.innerHTML = [['home','Monde'],['peuples','Peuples'],['classes','Classes'],['competences','Compétences'],['bestiaire','Bestiaire'],['regions','Lieux'],['equipements','Objets'],['lore','Lore']].map(([id,label]) => '<a href="#/'+id+'" data-top-route="'+id+'">'+label+'</a>').join('');
  document.querySelector('.app-toolbar').insertBefore(top, search);
  search.placeholder = 'Rechercher…';

  function classSelector(id) {
    return '<nav class="atlas-class-selector" aria-label="Classes naines">'+dwarfIds.map(key => {
      const entry = entryFor(key);
      return '<a href="#/'+key+'" class="atlas-class-choice '+(key===id?'is-selected':'')+'"'+(key===id?' aria-current="page"':'')+' style="--class-portrait:url(\''+new URL(classPortraits[key].src, document.baseURI).href+'\')"><img src="'+emblem(key)+'" alt="" width="64" height="64"><span><strong>'+esc(entry[2])+'</strong><small>'+esc(roleLabel(entry))+'</small></span></a>';
    }).join('')+'</nav>';
  }

  function progression(id) {
    const art = dwarfEquipmentStudies[id];
    return '<section class="atlas-progression" aria-labelledby="atlas-equipment-title"><div class="atlas-section-heading"><span aria-hidden="true">✧</span><div><h2 id="atlas-equipment-title">Évolution des équipements</h2><p>Du premier départ à l’armure de maître : explorez la progression visuelle du '+esc(art.title)+'.</p></div><button class="atlas-board-open" data-equipment-open="'+id+'" aria-haspopup="dialog" aria-label="Voir la planche d’origine">Planche d’origine ↗</button></div><div class="atlas-stage-grid">'+stages.map((label,index) => {
      const visual = id==='rempart' ? '<img src="'+asset+'rempart-stage-0'+(index+1)+'.webp" alt="Concept du Rempart — '+esc(label)+', vue complète, angles et détails" width="384" height="1024"'+(index>2?' loading="lazy"':'')+'>' : '<span class="atlas-original-stage" style="--stage-source:url(\''+new URL(art.src, document.baseURI).href+'\');--stage-position:'+(index*20)+'%" role="img" aria-label="'+esc(label)+' — illustration de progression existante"></span>';
      return '<button class="atlas-stage '+(index===5?'is-selected':'')+'" type="button" data-stage-class="'+id+'" data-stage-index="'+index+'" aria-haspopup="dialog"><span class="atlas-stage-heading"><strong>'+roman[index]+' · '+esc(label)+'</strong><small>ÉTUDE DE CONCEPTION · '+String(index+1).padStart(2,'0')+'</small></span>'+visual+'<span class="atlas-stage-zoom">Examiner les détails <span aria-hidden="true">↗</span></span></button>';
    }).join('')+'</div><p class="atlas-concept-note">Illustrations de conception · progression visuelle indicative, sans niveau ni statistique supplémentaire. Les originaux restent consultables.</p></section>';
  }

  renderClassDossier = function(item) {
    if (!dwarfIds.includes(item[0])) return originalDossier(item);
    const id = item[0], overview = classOverview(item), role = roleInfo(item);
    const page = document.createElement('div');
    page.innerHTML = originalDossier(item);
    const section = page.firstElementChild;
    section.className = 'atlas-dossier';
    section.dataset.classId = id;
    section.querySelector('.codex-class-selector').outerHTML = classSelector(id);
    section.querySelector('.dossier-breadcrumb').remove();
    const identity = overview.identity || overview.clearIdentity;
    const first = overview.clearIdentity;
    const description = identity.startsWith(first) ? identity.slice(first.length).trim() : identity;
    const resource = overview.resourceIntro.split(':')[0].trim();
    const portrait = id==='rempart' ? asset+'rempart-hero.webp' : classPortraits[id].src;
    section.querySelector('.dossier-hero').outerHTML = '<header class="atlas-hero '+(id==='rempart'?'atlas-hero-rempart':'')+'" style="--hero-art:url(\''+new URL(portrait, document.baseURI).href+'\')"><div class="atlas-hero-copy"><div class="atlas-title"><img src="'+emblem(id)+'" alt="" width="88" height="96"><div><span class="atlas-kicker">NAINS · CLASSE JOUABLE</span><h1>'+esc(item[2])+'</h1></div></div><p class="atlas-identity">'+esc(first)+'</p><p class="atlas-description">'+esc(description)+'</p>'+(overview.quote?'<blockquote>'+esc(overview.quote)+'</blockquote>':'')+'<span class="atlas-art-label">ILLUSTRATION DE CONCEPTION</span></div><dl class="atlas-facts"><div><dt><span aria-hidden="true">⛨</span>Rôle principal</dt><dd>'+esc(roleLabel(item))+'</dd></div><div><dt><span aria-hidden="true">⚔</span>Identité de combat</dt><dd>'+esc(first)+'</dd></div><div><dt><span aria-hidden="true">ϟ</span>Ressource principale</dt><dd>'+esc(resource || 'Voir le dossier de classe')+'</dd></div><div><dt><span aria-hidden="true">✧</span>Arsenal</dt><dd>'+data.filter(e=>e[1]==='competences'&&e[0].startsWith(id+'-')).length+' compétences de référence</dd></div></dl></header>';
    const current = tabs.get(id) || 'equipment';
    const tabList = [['overview','◈','Aperçu'],['skills','⚔','Compétences'],['passives','✧','Passifs'],['tree','⌘','Arbre'],['equipment','⛨','Équipements'],['lore','◷','Lore'],['art','▧','Illustrations']];
    section.querySelector('.codex-class-tabs').outerHTML = '<nav class="atlas-tabs" aria-label="Sections de la classe">'+tabList.map(([key,icon,label])=>'<button type="button" data-dossier-tab="'+key+'"'+(key===current?' aria-current="page"':'')+(key==='passives'?' disabled title="Aucun passif distinct renseigné dans les fiches actuelles"':'')+'><span aria-hidden="true">'+icon+'</span>'+label+'</button>').join('')+'</nav>';
    const equipment = section.querySelector('#class-equipment');
    equipment.innerHTML = progression(id)+'<details class="atlas-alternative-studies"><summary>Explorer les six styles alternatifs et l’atelier de composition</summary>'+renderMasterSets(id)+'</details>';
    equipment.dataset.dossierPanel = 'equipment';
    section.querySelector('#class-skills').dataset.dossierPanel = 'skills';
    section.querySelectorAll('.dossier-details:not(.editorial-source)').forEach(e=>{e.dataset.dossierPanel='overview';e.open=true;});
    const source = section.querySelector('.editorial-source');
    source.dataset.dossierPanel = 'lore'; source.open = true;
    section.insertAdjacentHTML('beforeend','<section class="atlas-tree-panel" data-dossier-panel="tree"><span class="atlas-kicker">PLANIFIER SON STYLE DE JEU</span><h2>Arbre de maîtrises</h2><p>Retrouvez le simulateur existant pour explorer les maîtrises et préparer votre configuration.</p><a class="atlas-action" href="simulateur/'+(id==='rempart'?'rempart':'classes')+'/">Ouvrir le simulateur '+esc(item[2])+' ↗</a></section><section class="atlas-art-panel" data-dossier-panel="art"><h2>Les illustrations de la classe</h2><p>Concepts artistiques · les illustrations d’origine sont conservées.</p><button type="button" data-portrait-open="'+id+'" aria-haspopup="dialog"><img src="'+classPortraits[id].src+'" alt="Portrait conceptuel de '+esc(item[2])+'" loading="lazy"><span>Examiner le portrait ↗</span></button><button type="button" data-equipment-open="'+id+'" aria-haspopup="dialog"><img src="'+dwarfEquipmentStudies[id].src+'" alt="Planche de progression d’origine du '+esc(item[2])+'" loading="lazy"><span>Examiner la progression d’origine ↗</span></button></section>');
    section.querySelectorAll('[data-dossier-panel]').forEach(panel => panel.hidden = panel.dataset.dossierPanel !== current);
    return page.innerHTML;
  };

  function updateChrome() {
    const route = (()=>{try{return decodeURIComponent(location.hash.slice(2)||'home');}catch{return 'home';}})();
    const entry = entryFor(route);
    const race = entry && (entry[1]==='peuples'?entry[0]:(classInfo[entry[0]]||[])[0]);
    const people = ['nains','elfes','humains','kharun','vaelith','orynth'].map(entryFor).filter(Boolean);
    nav.innerHTML = '<div class="atlas-side-heading">PEUPLES</div><div class="atlas-peoples">'+people.map(p=>'<a href="#/'+p[0]+'" class="atlas-people '+(p[0]===race?'is-selected':'')+'"'+(p[0]===race?' aria-current="page"':'')+'><img src="assets/emblems/v1/peuples-'+p[0]+'.webp" alt="" width="42" height="42"><span>'+esc(p[2])+'</span></a>').join('')+'</div><div class="atlas-side-heading">'+esc(race ? (entryFor(race)||[])[2] || 'EXPLORER' : 'EXPLORER')+'</div><nav class="atlas-context-nav" aria-label="Navigation du peuple">'+(race?'<a href="#/'+race+'">Aperçu du peuple</a>':'<a href="#/home">Accueil du Codex</a>')+'<a href="#/classes"'+(entry&&entry[1]==='classes'?' aria-current="page"':'')+'>Classes</a><a href="#/competences">Compétences</a><a href="#/regions">Lieux majeurs</a><a href="#/equipements">Équipements</a><a href="#/bestiaire">Bestiaire</a><a href="#/chronologie">Chronologie</a></nav><details class="atlas-archives"><summary>Toutes les archives</summary>'+archiveNavigation+'</details><div class="atlas-side-signature"><span>ASHENFALL</span><small>Les archives d’un monde en devenir</small></div>';
    document.querySelectorAll('[data-top-route]').forEach(link=>{
      const active = link.dataset.topRoute === (entry ? (entry[1]==='classes'?'peuples':entry[1]) : route);
      if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
  }
  render = function(){ originalRender(); updateChrome(); };

  document.addEventListener('click',event=>{
    const tab = event.target.closest('[data-dossier-tab]');
    if(!tab)return;
    const dossier=tab.closest('[data-class-id]');
    tabs.set(dossier.dataset.classId,tab.dataset.dossierTab);
    dossier.querySelectorAll('[data-dossier-tab]').forEach(button=>{if(button===tab)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    dossier.querySelectorAll('[data-dossier-panel]').forEach(panel=>panel.hidden=panel.dataset.dossierPanel!==tab.dataset.dossierTab);
  });

  const stageDialog = document.createElement('dialog');
  stageDialog.className='atlas-stage-dialog';
  stageDialog.setAttribute('aria-labelledby','atlas-stage-title');
  stageDialog.innerHTML='<div class="atlas-dialog-toolbar"><h2 id="atlas-stage-title"></h2><button type="button" data-stage-close autofocus aria-label="Fermer l’illustration">✕</button></div><div class="atlas-stage-full"><img alt=""></div><div class="atlas-dialog-controls"><button type="button" data-stage-direction="-1" aria-label="Équipement précédent">← Précédent</button><span>Concept artistique · <span data-stage-counter></span> / 6</span><button type="button" data-stage-direction="1" aria-label="Équipement suivant">Suivant →</button></div>';
  document.body.append(stageDialog);
  let stageIndex=0, stageFocus=null;
  function updateStage(){
    stageDialog.querySelector('h2').textContent='Rempart · '+roman[stageIndex]+' · '+stages[stageIndex];
    const img=stageDialog.querySelector('img');img.src=asset+'rempart-stage-0'+(stageIndex+1)+'.webp';img.alt='Étude de conception du Rempart — '+stages[stageIndex]+', face, angles et détails';
    stageDialog.querySelector('[data-stage-counter]').textContent=stageIndex+1;
    document.querySelectorAll('[data-stage-class="rempart"]').forEach(button=>button.classList.toggle('is-selected',Number(button.dataset.stageIndex)===stageIndex));
  }
  document.addEventListener('click',event=>{
    const stage=event.target.closest('[data-stage-class]');
    if(stage){
      if(stage.dataset.stageClass!=='rempart'){const trigger=document.querySelector('[data-equipment-open="'+stage.dataset.stageClass+'"]');if(trigger)trigger.click();return;}
      stageFocus=stage;stageIndex=Number(stage.dataset.stageIndex);updateStage();stageDialog.showModal();
    }
    if(event.target.closest('[data-stage-close]'))stageDialog.close();
    const arrow=event.target.closest('[data-stage-direction]');
    if(arrow){stageIndex=(stageIndex+Number(arrow.dataset.stageDirection)+6)%6;updateStage();}
  });
  stageDialog.addEventListener('click',event=>{if(event.target===stageDialog)stageDialog.close();});
  stageDialog.addEventListener('close',()=>{if(stageFocus&&stageFocus.isConnected)stageFocus.focus();});
  document.addEventListener('keydown',event=>{if(stageDialog.open&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();stageIndex=(stageIndex+(event.key==='ArrowRight'?1:5))%6;updateStage();}});
  window.addEventListener('hashchange',()=>{if(stageDialog.open)stageDialog.close();});
  window.addEventListener('hashchange', updateChrome);
  render();
})();
