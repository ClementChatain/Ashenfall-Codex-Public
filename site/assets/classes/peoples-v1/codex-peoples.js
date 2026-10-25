/* Shared illustrated presentation. Reads only existing public records and mechanics. */
(() => {
  'use strict';
  const visuals = window.AshenfallPeopleVisuals;
  if (!visuals) return;
  const previousClass = renderClassDossier;
  const previousFiche = renderFiche;
  const previousRender = render;
  const classTabs = new Map(), galleries = new Map();
  const baseLabels = ['Départ', 'Premières protections', 'Tenue renforcée', 'Tenue avancée', 'Tenue accomplie', 'Tenue de maître'];
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const entryFor = id => data.find(entry => entry[0] === id);
  const absolute = src => new URL(src, document.baseURI).href;
  const roleName = entry => /heal/i.test(roleInfo(entry).role) ? 'Soigneur' : roleInfo(entry).role;
  const classesFor = race => Object.keys(classInfo).filter(id => classInfo[id][0] === race).map(entryFor).filter(Boolean);
  const emblemFor = entry => (classArtwork(entry) || {}).src || classPortraits[entry[0]].src;
  const raceFor = entry => entry && (entry[1] === 'peuples' ? entry[0] : (classInfo[entry[0]] || classInfo[getClass(entry)] || [])[0]);
  const note = 'Concepts artistiques · aucun niveau requis, statistique ou pouvoir supplémentaire. Les fiches existantes restent la référence.';

  function selector(id, race) {
    return '<nav class="atlas-class-selector" aria-label="Classes du peuple '+esc(visuals.peoples[race].title)+'">'+classesFor(race).map(entry=>'<a href="#/'+entry[0]+'" class="atlas-class-choice '+(entry[0]===id?'is-selected':'')+'"'+(entry[0]===id?' aria-current="page"':'')+' style="--class-portrait:url(\''+absolute(classPortraits[entry[0]].src)+'\')"><img src="'+emblemFor(entry)+'" width="56" height="56" alt=""><span><strong>'+esc(entry[2])+'</strong><small>'+esc(roleName(entry))+'</small></span></a>').join('')+'</nav>';
  }

  function artCards(id, mode) {
    const config=visuals.classes[id];
    const labels=mode==='base'?baseLabels:config.skinLabels;
    return '<div class="atlas-stage-grid">'+labels.map((label,index)=>'<button type="button" class="atlas-stage world-art-card" data-world-art="'+mode+'" data-world-art-class="'+id+'" data-world-art-index="'+index+'" aria-haspopup="dialog"><span class="atlas-stage-heading"><strong>'+esc(mode==='base'?roman[index]+' · '+label:label)+'</strong><small>'+esc(mode==='base'?'PROGRESSION VISUELLE':'APPARENCE ALTERNATIVE · '+String(index+1).padStart(2,'0'))+'</small></span><img src="'+config[mode][index]+'" alt="Concept de '+esc(config.title)+' — '+esc(label)+'" width="320" height="640" loading="lazy"><span class="atlas-stage-zoom">Examiner <span aria-hidden="true">↗</span></span></button>').join('')+'</div>';
  }

  function equipment(id) {
    const config=visuals.classes[id], mode=galleries.get(id)||'skins';
    return '<nav class="atlas-equipment-switch" aria-label="Choisir une galerie d’équipements"><button type="button" data-world-gallery-tab="base" aria-pressed="'+(mode==='base')+'"><span aria-hidden="true">Ⅰ—Ⅵ</span>Équipement de base<small>Progression visuelle</small></button><button type="button" data-world-gallery-tab="skins" aria-pressed="'+(mode==='skins')+'"><span aria-hidden="true">✧</span>Skins de maître<small>Six apparences alternatives</small></button></nav>'+['base','skins'].map(key=>'<section class="atlas-progression" data-world-gallery="'+key+'"'+(mode===key?'':' hidden')+' aria-labelledby="world-'+key+'-title"><div class="atlas-section-heading"><span aria-hidden="true">✧</span><div><h2 id="world-'+key+'-title">'+(key==='base'?'Progression de l’équipement de base':'Tenues de maître · exemples de skins')+'</h2><p>'+esc(config.title)+' · '+esc(visuals.peoples[config.race].title)+' · '+(key==='base'?'Six études, du départ à la tenue de maître.':'Six alternatives visuelles au même stade de maîtrise.')+'</p></div></div>'+artCards(id,key)+'<p class="atlas-concept-note">'+note+'</p></section>').join('')+'<section class="world-equipment-details"><h3>Vues de détail</h3><div class="atlas-detail-grid">'+config.details.map((src,index)=>'<button type="button" data-world-art="details" data-world-art-class="'+id+'" data-world-art-index="'+index+'" aria-haspopup="dialog"><img src="'+src+'" alt="Détail artistique '+(index+1)+' de '+esc(config.title)+'" loading="lazy"><span>Détail '+roman[index]+'</span></button>').join('')+'</div></section>';
  }

  renderClassDossier = function(item) {
    const id=item[0], config=visuals.classes[id];
    if(!config)return previousClass(item);
    const race=config.race, people=visuals.peoples[race];
    const old=document.createElement('div');old.innerHTML=previousClass(item);
    const overview=classOverview(item), profile=conceptClassProfiles[id];
    const intro=profile?profile.intro:(overview.identity||item[3]);
    const identity=profile?profile.equipment:overview.clearIdentity;
    const lead=identity||item[3];
    const description=intro===lead?'':intro.startsWith(lead)?intro.slice(lead.length).trim():intro;
    const mechanics=typeof newClassMechanics!=='undefined'?newClassMechanics[id]:null;
    const resource=mechanics?mechanics.resource:overview.resourceIntro;
    const spellbook=old.querySelector('.spellbook');
    if(spellbook){spellbook.id='class-skills';spellbook.hidden=false;spellbook.removeAttribute('data-dossier-panel');spellbook.setAttribute('data-world-panel','skills');}
    const overviewNodes=[...old.querySelectorAll('.dossier-details:not(.editorial-source), .fiche-section')].filter(node=>!node.closest('.spellbook'));
    overviewNodes.forEach(node=>{node.hidden=false;node.removeAttribute('data-dossier-panel');if(node.tagName==='DETAILS')node.open=true;});
    const current=classTabs.get(id)||'equipment';
    const tabList=[['overview','◈','Aperçu'],['skills','⚔','Compétences'],['tree','⌘','Arbre'],['equipment','⛨','Équipements'],['lore','◷','Archives'],['art','▧','Illustrations']];
    const oldStudy=dwarfEquipmentStudies[id];
    const hero='<header class="atlas-hero atlas-hero-universal" style="--hero-art:url(\''+absolute(people.landscape)+'\')"><img class="world-hero-portrait" src="'+classPortraits[id].src+'" alt="" width="411" height="732"><div class="atlas-hero-copy"><div class="atlas-title"><img src="'+emblemFor(item)+'" alt="" width="70" height="85"><div><a class="atlas-kicker" href="#/'+race+'">'+esc(people.title)+' · CLASSE JOUABLE</a><h1>'+esc(item[2])+'</h1></div></div><p class="atlas-identity">'+esc(lead)+'</p><p class="atlas-description">'+esc(description)+'</p>'+(overview.quote?'<blockquote>'+esc(overview.quote)+'</blockquote>':'')+'<span class="atlas-art-label">ILLUSTRATION DE CONCEPTION</span></div><dl class="atlas-facts"><div><dt><span aria-hidden="true">⛨</span>Rôle principal</dt><dd>'+esc(roleName(item))+'</dd></div><div><dt><span aria-hidden="true">◈</span>Peuple</dt><dd>'+esc(people.title)+'</dd></div><div><dt><span aria-hidden="true">✧</span>Arsenal</dt><dd>'+data.filter(e=>e[1]==='competences'&&getClass(e)===id).length+' compétences de référence</dd></div>'+(resource?'<div><dt><span aria-hidden="true">ϟ</span>Ressource</dt><dd>'+esc(resource.split(/[.:]/)[0])+'</dd></div>':'')+'</dl></header>';
    const panels={
      equipment:equipment(id),
      skills:spellbook?spellbook.outerHTML:'',
      overview:overviewNodes.length?overviewNodes.map(node=>node.outerHTML).join(''):'<article class="world-overview"><h2>Identité de la classe</h2><p>'+esc(intro)+'</p></article>',
      tree:'<section class="atlas-tree-panel"><span class="atlas-kicker">PRÉPARER SA CONFIGURATION</span><h2>Arbre de maîtrises</h2><p>Le simulateur existant permet d’explorer les maîtrises de cette classe.</p><a class="atlas-action" href="simulateur/classes/?classe='+encodeURIComponent(id)+'">Ouvrir le simulateur '+esc(item[2])+' ↗</a></section>',
      lore:'<details class="dossier-details editorial-source" open><summary>Fiche de conception intégrale<span>Version déjà présente dans le Codex</span></summary><pre class="world-source-body">'+esc(item[4])+'</pre></details>',
      art:'<section class="atlas-art-panel"><h2>Illustrations de '+esc(item[2])+'</h2><p>Les illustrations d’origine sont conservées. Les nouvelles tenues sont des concepts artistiques.</p><button type="button" data-portrait-open="'+id+'" aria-haspopup="dialog"><img src="'+classPortraits[id].src+'" alt="Portrait conceptuel de '+esc(item[2])+'" loading="lazy"><span>Examiner le portrait ↗</span></button><button type="button" data-world-art="board" data-world-art-class="'+id+'" data-world-art-index="0" aria-haspopup="dialog"><img src="'+config.board+'" alt="Planche des équipements et skins de '+esc(item[2])+'" loading="lazy"><span>Examiner la nouvelle planche ↗</span></button>'+(oldStudy?'<button type="button" data-equipment-open="'+id+'" aria-haspopup="dialog"><img src="'+oldStudy.src+'" alt="Planche de progression d’origine" loading="lazy"><span>Planche d’origine ↗</span></button>':'')+'</section>'
    };
    document.body.dataset.faction=race;
    return '<section class="atlas-dossier world-class-dossier" data-class-id="'+id+'">'+selector(id,race)+hero+'<nav class="atlas-tabs" aria-label="Sections de la classe">'+tabList.map(([key,icon,label])=>'<button type="button" data-world-tab="'+key+'"'+(current===key?' aria-current="page"':'')+'><span aria-hidden="true">'+icon+'</span>'+label+'</button>').join('')+'</nav>'+Object.entries(panels).map(([key,html])=>'<div data-world-panel="'+key+'"'+(current===key?'':' hidden')+'>'+html+'</div>').join('')+'<p class="dossier-provisional">Concepts visuels et fiches de conception · les mentions de statut des contenus existants restent applicables.</p></section>';
  };

  renderFiche = function(item) {
    if(item[1]!=='peuples'||!visuals.peoples[item[0]])return previousFiche(item);
    const config=visuals.peoples[item[0]];
    const page=document.createElement('div');page.innerHTML=previousFiche(item);
    const sheet=page.querySelector('.people-sheet');sheet.classList.add('world-people-sheet');
    sheet.querySelector('.fiche-top').outerHTML='<header class="world-people-hero" style="--people-scene:url(\''+absolute(config.landscape)+'\')"><div><span class="atlas-kicker">LES PEUPLES D’ASHENFALL</span><h1>'+esc(item[2])+'</h1><p>'+esc(item[3])+'</p><div class="world-people-facts"><span>'+classesFor(item[0]).length+' classes jouables</span><span>Illustration de conception</span></div></div><img src="assets/emblems/v1/peuples-'+item[0]+'.webp" alt="Emblème conceptuel de '+esc(item[2])+'" width="200" height="200"></header>';
    document.body.dataset.faction=item[0];
    return page.innerHTML;
  };

  function peopleIndex() {
    return '<section class="hero world-index-hero"><p class="eyebrow">LES CIVILISATIONS D’ASHENFALL</p><h1>Six peuples.<br><em>Un monde à explorer.</em></h1><p>Découvrez leurs classes, leurs illustrations et les récits déjà présents dans le Codex.</p></section><section class="content"><div class="world-people-index">'+Object.entries(visuals.peoples).map(([id,config])=>{const entry=entryFor(id);return '<a class="world-people-index-card" href="#/'+id+'" style="--people-scene:url(\''+absolute(config.landscape)+'\')"><div><img src="assets/emblems/v1/peuples-'+id+'.webp" alt="" width="74" height="74"><span class="atlas-kicker">PEUPLE JOUABLE</span><h2>'+esc(entry[2])+'</h2><p>'+esc(entry[3])+'</p><span class="world-card-classes">'+classesFor(id).map(e=>esc(e[2])).join(' · ')+'</span><span class="world-card-link">Explorer ce peuple ↗</span></div></a>';}).join('')+'</div><p class="atlas-concept-note">Illustrations de conception. Les textes conservent leurs statuts et leurs réserves de validation.</p></section>';
  }

  function updateWorldChrome() {
    let route;try{route=decodeURIComponent(location.hash.slice(2)||'home');}catch{route='home';}
    const entry=entryFor(route), race=raceFor(entry)||'nains', config=visuals.peoples[race];
    document.body.dataset.worldRace=race;
    document.body.style.setProperty('--world-landscape','url("'+absolute(config.landscape)+'")');
    document.body.style.setProperty('--world-accent',config.accent);
    // Contextual class links lead to the current people's classes, while the global catalogue stays accessible.
    const context=document.querySelector('.atlas-context-nav');
    if(context&&entry){
      const classesLink=context.querySelector('a[href="#/classes"]');
      if(classesLink){classesLink.href='#/'+race;classesLink.textContent='Les classes du peuple';}
    }
    if(route==='peuples'&&!search.value.trim())view.innerHTML=peopleIndex();
    if(route==='home'&&!search.value.trim()){
      const hero=view.querySelector('.hero');
      if(hero&&!view.querySelector('.world-home-peoples'))hero.insertAdjacentHTML('afterend','<nav class="world-home-peoples" aria-label="Explorer les peuples">'+Object.entries(visuals.peoples).map(([id,p])=>'<a href="#/'+id+'"><img src="assets/emblems/v1/peuples-'+id+'.webp" alt="" width="42" height="42"><span>'+esc(p.title)+'</span></a>').join('')+'</nav>');
    }
  }
  render = function(){previousRender();updateWorldChrome();};

  const dialog=document.createElement('dialog');dialog.className='atlas-stage-dialog world-art-dialog';dialog.setAttribute('aria-labelledby','world-art-title');
  dialog.innerHTML='<div class="atlas-dialog-toolbar"><h2 id="world-art-title"></h2><button type="button" data-world-art-close aria-label="Fermer l’illustration" autofocus>✕</button></div><div class="atlas-stage-full"><img alt=""></div><div class="atlas-dialog-controls"><button type="button" data-world-art-direction="-1">← Précédent</button><span>Concept artistique · <span data-world-counter></span></span><button type="button" data-world-art-direction="1">Suivant →</button></div>';
  document.body.append(dialog);
  let viewer={id:'',mode:'skins',index:0,focus:null};
  function viewerItems(){const config=visuals.classes[viewer.id];return viewer.mode==='board'?[config.board]:config[viewer.mode];}
  function updateViewer(){
    const config=visuals.classes[viewer.id],items=viewerItems();
    const labels=viewer.mode==='base'?baseLabels:viewer.mode==='skins'?config.skinLabels:viewer.mode==='details'?roman.map(x=>'Détail '+x):['Planche complète'];
    const title=config.title+' · '+labels[viewer.index];
    dialog.querySelector('h2').textContent=title;
    const img=dialog.querySelector('img');img.src=items[viewer.index];img.alt='Concept artistique — '+title;
    dialog.querySelector('[data-world-counter]').textContent=(viewer.index+1)+' / '+items.length;
    dialog.querySelectorAll('[data-world-art-direction]').forEach(button=>button.disabled=items.length===1);
    dialog.querySelector('.atlas-stage-full').scrollTop=0;
  }
  document.addEventListener('click',event=>{
    const tab=event.target.closest('[data-world-tab]');
    if(tab){const section=tab.closest('[data-class-id]');classTabs.set(section.dataset.classId,tab.dataset.worldTab);section.querySelectorAll('[data-world-tab]').forEach(button=>{if(button===tab)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});section.querySelectorAll('[data-world-panel]').forEach(panel=>panel.hidden=panel.dataset.worldPanel!==tab.dataset.worldTab);}
    const gallery=event.target.closest('[data-world-gallery-tab]');
    if(gallery){const section=gallery.closest('[data-class-id]');galleries.set(section.dataset.classId,gallery.dataset.worldGalleryTab);section.querySelectorAll('[data-world-gallery-tab]').forEach(button=>button.setAttribute('aria-pressed',String(button===gallery)));section.querySelectorAll('[data-world-gallery]').forEach(panel=>panel.hidden=panel.dataset.worldGallery!==gallery.dataset.worldGalleryTab);}
    const art=event.target.closest('[data-world-art]');
    if(art){viewer={id:art.dataset.worldArtClass,mode:art.dataset.worldArt,index:Number(art.dataset.worldArtIndex),focus:art};updateViewer();dialog.showModal();}
    if(event.target.closest('[data-world-art-close]'))dialog.close();
    const arrow=event.target.closest('[data-world-art-direction]');
    if(arrow){const count=viewerItems().length;viewer.index=(viewer.index+Number(arrow.dataset.worldArtDirection)+count)%count;updateViewer();}
  });
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{if(viewer.focus&&viewer.focus.isConnected)viewer.focus.focus();});
  document.addEventListener('keydown',event=>{if(dialog.open&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const count=viewerItems().length;viewer.index=(viewer.index+(event.key==='ArrowRight'?1:count-1))%count;updateViewer();}});
  window.addEventListener('hashchange',()=>{if(dialog.open)dialog.close();updateWorldChrome();});
  search.addEventListener('input',updateWorldChrome);
  render();
})();
