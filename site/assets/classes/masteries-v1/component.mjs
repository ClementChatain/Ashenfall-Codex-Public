import {definitions} from './definitions.mjs?v=native-v1';
import {emptyBuild,validateBuild,applyCommand,availableActions,pathPoints,spentPoints,exportBuild,importBuild} from './engine.mjs?v=native-v1';
import {BuildStore} from './storage.mjs?v=native-v1';

const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let instance=0;
export function encodeShared(def,build){const bytes=new TextEncoder().encode(JSON.stringify(JSON.parse(exportBuild(def,build))));return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
export function decodeShared(def,token){
  try{if(typeof token!=='string'||token.length>32000||!/^[A-Za-z0-9_-]+$/.test(token))throw new Error('Lien de build invalide.');const raw=atob(token.replaceAll('-','+').replaceAll('_','/'));return importBuild(def,new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(raw,c=>c.charCodeAt(0))));}
  catch(error){return {valid:false,errors:[{message:error.message}],warnings:[]};}
}

export function mountMasteries(host,{classId,modelId,onModelChange=()=>{},onChanged=()=>{},makeShareLink=()=>''}={}){
  const cls=Object.hasOwn(definitions.classes,classId)&&definitions.classes[classId];
  const def=cls&&definitions.models[modelId||cls.defaultModel];
  if(!def||def.classId!==classId)throw new Error('Classe ou modèle de maîtrises inconnu.');
  const uid='masteries-'+(++instance);const abort=new AbortController();
  let storage;try{storage=window.localStorage;}catch{storage=null;}
  const store=new BuildStore(def,storage);const restored=store.load();
  let build=restored.build,storageNotice=restored.notice,selected=0,barOpen=false,shareLink='',undo=[],redo=[],dialogFocus='';
  host.innerHTML='<section class="native-masteries" data-class-id="'+e(classId)+'" data-model-id="'+e(def.id)+'"><p class="mastery-live" data-ms-live role="status" aria-live="polite" aria-atomic="true"></p><div data-ms-content></div></section>';
  const root=host.firstElementChild,content=root.querySelector('[data-ms-content]'),live=root.querySelector('[data-ms-live]');
  function notify(message,error=false){live.textContent=message;live.classList.toggle('is-error',error);}
  function actions(){return availableActions(def,build);}
  function save(){const result=store.save(build);storageNotice=result.ok?'':result.message;}
  function commit(result,focus,message){
    if(!result.valid){notify(result.errors.map(error=>error.message).join(' '),true);return false;}
    undo.push(build);if(undo.length>40)undo.shift();redo=[];build=result.build;selected=Math.min(selected,build.loadout.count-1);shareLink='';
    save();onChanged();render(focus);notify(message||('Configuration mise à jour · '+(def.budget-spentPoints(def,build))+' points libres.'));return true;
  }
  function command(value,focus,message){return commit(applyCommand(def,build,value),focus,message);}
  function nodeCard(node){
    const rank=build.ranks[node.id]||0,points=pathPoints(def,build,node.pathId),plus=applyCommand(def,build,{type:'rank',nodeId:node.id,delta:1});
    const reason=plus.valid?'':plus.errors[0].message;
    return '<article class="mastery-node '+(rank?'is-owned':'')+'" data-node-id="'+e(node.id)+'"><div class="mastery-node-top"><span class="mastery-node-rank">'+rank+'/'+node.maxRank+'</span><h4 tabindex="-1" data-node-heading="'+e(node.id)+'">'+e(node.label)+'</h4></div><p>'+e(node.description)+'</p><div class="mastery-node-controls"><button type="button" data-ms="rank" data-node="'+e(node.id)+'" data-delta="-1" data-focus-key="'+e(node.id)+':minus" aria-label="Retirer un point de '+e(node.label)+'" '+(!rank?'disabled':'')+'>−</button><span>Rang '+rank+' sur '+node.maxRank+'</span><button type="button" data-ms="rank" data-node="'+e(node.id)+'" data-delta="1" data-focus-key="'+e(node.id)+':plus" aria-label="Ajouter un point à '+e(node.label)+'" '+(!plus.valid?'disabled aria-describedby="'+uid+'-reason-'+def.nodes.indexOf(node)+'"':'')+'>+</button></div>'+(!plus.valid&&rank<node.maxRank?'<p class="mastery-node-reason" id="'+uid+'-reason-'+def.nodes.indexOf(node)+'">'+e(reason)+'</p>':'')+(rank===node.maxRank?'<fieldset class="mastery-choices"><legend>Choix de maîtrise'+(!build.choices[node.id]?' · à compléter':'')+'</legend>'+Object.entries(node.choices).map(([key,label])=>'<label><input type="radio" name="'+uid+'-'+e(node.id)+'" data-ms-choice="'+e(node.id)+'" value="'+key+'" data-focus-key="'+e(node.id)+':choice:'+key+'" '+(build.choices[node.id]===key?'checked':'')+'><span>'+e(label)+'</span></label>').join('')+'</fieldset>':'')+'</article>';
  }
  function synergyCard(syn){
    const owned=build.synergies.includes(syn.id),result=applyCommand(def,build,{type:'synergy',synergyId:syn.id});
    return '<article class="mastery-synergy '+(owned?'is-owned':'')+'"><h4>'+e(syn.label)+'</h4><p>'+e(syn.description)+'</p><ul>'+syn.pathIds.map(id=>'<li>'+e(def.paths.find(p=>p.id===id).label)+' : '+pathPoints(def,build,id)+' / '+syn.requiredPoints+' points requis</li>').join('')+'</ul><button type="button" data-ms="synergy" data-synergy="'+e(syn.id)+'" data-focus-key="synergy:'+e(syn.id)+'" '+(!result.valid?'disabled':'')+'>'+(owned?'Retirer · récupérer '+syn.cost+' points':'Activer · '+syn.cost+' points')+'</button>'+(!result.valid?'<small>'+e(result.errors[0].message)+'</small>':'')+'</article>';
  }
  function bar(){
    const opts=actions(),groups=[...new Set(opts.map(a=>a.group))],slot=build.loadout.slots[selected];
    return '<details class="mastery-loadout" '+(barOpen?'open':'')+'><summary>Barre de préparation · '+build.loadout.count+' emplacements</summary><p>Organisez les compétences et les éléments de conception. Les talents et synergies ne sont pas tous définis comme actions actives ; cette barre ne déclenche aucun combat.</p><div class="mastery-loadout-settings"><label>Emplacements visibles<select data-ms-count data-focus-key="count">'+[10,20,30].map(n=>'<option value="'+n+'" '+(build.loadout.count===n?'selected':'')+'>'+n+'</option>').join('')+'</select></label>'+(def.weapons.length?'<label>Équipement indicatif<select data-ms-weapon data-focus-key="weapon">'+def.weapons.map(w=>'<option '+(build.loadout.weapon===w?'selected':'')+'>'+e(w)+'</option>').join('')+'</select></label>':'')+'</div>'+(def.weapons.length?'<p class="mastery-note">Le choix d’arme est conservé à titre indicatif. Aucune restriction d’équipement supplémentaire n’est définie par ce prototype.</p>':'')+'<div class="mastery-action-bar">'+build.loadout.slots.slice(0,build.loadout.count).map((s,index)=>'<button type="button" data-ms="slot-select" data-slot="'+index+'" data-focus-key="slot:'+index+'" aria-pressed="'+(index===selected)+'" aria-label="Choisir l’emplacement '+(index+1)+'"><span>'+(index+1)+'</span><strong>'+e(opts.find(a=>a.id===s.abilityId)?.label||'Libre')+'</strong><small>'+e(s.shortcut)+'</small></button>').join('')+'</div><form class="mastery-slot-editor"><strong>Emplacement '+(selected+1)+'</strong><label>Élément<select data-ms-action-select><option value="">Emplacement libre</option>'+groups.map(group=>'<optgroup label="'+e(group)+'">'+opts.filter(a=>a.group===group).map(a=>'<option value="'+e(a.id)+'" '+(slot.abilityId===a.id?'selected':'')+'>'+e(a.label)+'</option>').join('')+'</optgroup>').join('')+'</select></label><label>Raccourci<input type="text" maxlength="40" data-ms-shortcut value="'+e(slot.shortcut)+'" placeholder="Ex. Ctrl+1" autocomplete="off"></label><button type="submit" data-focus-key="assign">Attribuer</button><button type="button" data-ms="slot-clear" data-focus-key="clear-slot">Vider</button></form><p class="mastery-note">Les emplacements masqués sont conservés. Un remboursement libère les éléments devenus indisponibles ; les raccourcis sont conservés.</p></details>';
  }
  function render(focus){
    const result=validateBuild(def,build),spent=spentPoints(def,build),pending=result.warnings.filter(w=>w.code==='PENDING_CHOICE').length;
    content.innerHTML='<div class="mastery-heading"><div><span class="mastery-kicker">ATELIER DE CONCEPTION · '+e(cls.people)+'</span><h2>Maîtrises · '+e(cls.label)+'</h2><p>Préparez votre configuration sans quitter la fiche de classe.</p></div><span class="mastery-status">'+(pending?pending+' choix à compléter':'Configuration cohérente')+'</span></div><div class="mastery-toolbar">'+(cls.modelIds.length>1?'<label>Définition du build<select data-ms-model data-focus-key="model">'+cls.modelIds.map(id=>'<option value="'+e(id)+'" '+(id===def.id?'selected':'')+'>'+e(definitions.models[id].label)+'</option>').join('')+'</select></label>':'')+'<div class="mastery-toolbar-buttons"><button type="button" data-ms="undo" data-focus-key="undo" '+(!undo.length?'disabled':'')+'>Annuler</button><button type="button" data-ms="redo" data-focus-key="redo" '+(!redo.length?'disabled':'')+'>Rétablir</button><button type="button" data-ms="export" data-focus-key="export">Exporter</button><button type="button" data-ms="import" data-focus-key="import">Importer</button><button type="button" data-ms="share" data-focus-key="share">Partager</button><button type="button" data-ms="reset" data-focus-key="reset">Réinitialiser</button></div></div>'+(cls.modelIds.length>1?'<p class="mastery-note">Ces deux définitions historiques restent distinctes : chacune conserve ses propres points et sa sauvegarde.</p>':'')+'<div class="mastery-budget" role="region" aria-label="Budget du build"><div><strong data-ms-remaining>'+(def.budget-spent)+'</strong><span> / '+def.budget+' points libres</span></div><div class="mastery-distribution">'+def.paths.map(path=>'<span>'+e(path.label)+' <b>'+pathPoints(def,build,path.id)+'</b></span>').join('')+'<span>Synergies <b>'+build.synergies.length+'</b> · '+build.synergies.reduce((n,id)=>n+def.synergies.find(s=>s.id===id).cost,0)+' points</span></div><div class="mastery-progress" aria-hidden="true">'+def.paths.map((path,index)=>'<span style="width:'+pathPoints(def,build,path.id)/def.budget*100+'%;--path-color:'+['#d8b478','#9db9a5','#9eaed2'][index]+'"></span>').join('')+'<span style="width:'+build.synergies.reduce((n,id)=>n+def.synergies.find(s=>s.id===id).cost,0)/def.budget*100+'%;--path-color:#d5cec1"></span></div></div>'+(storageNotice?'<div class="mastery-storage-notice" role="status">'+e(storageNotice)+(store.original()!==null?'<button type="button" data-ms="original">Exporter l’original conservé</button>':'')+'</div>':'')+(shareLink?'<label class="mastery-share">Lien du build<input type="text" readonly data-ms-share-link value="'+e(shareLink)+'"></label>':'')+'<p class="mastery-note">'+def.budget+' points, deux rangs par talent. Les paliers comptent les autres points de la voie, y compris les talents supérieurs. Les choix manquants restent un brouillon. Aucun calcul de DPS, soin ou combat.</p><div class="mastery-paths">'+def.paths.map((path,index)=>'<section class="mastery-path" style="--path-color:'+['#d8b478','#9db9a5','#9eaed2'][index]+'"><div class="mastery-path-heading"><span>VOIE '+(index+1)+'</span><h3>'+e(path.label)+'</h3><p>'+e(path.description)+'</p><strong>'+pathPoints(def,build,path.id)+' points investis</strong></div>'+[0,5,10].map((tier,ti)=>'<section class="mastery-tier"><h4>'+['I · Fondations','II · Techniques','III · Maîtrise'][ti]+'<small>'+tier+' autres points requis</small></h4>'+def.nodes.filter(n=>n.pathId===path.id&&n.requiredPoints===tier).map(nodeCard).join('')+'</section>').join('')+'</section>').join('')+'</div><section class="mastery-synergies"><h3>Synergies hybrides</h3><p>Chaque synergie exige ses points dans les deux voies et consomme le même budget de '+def.budget+' points.</p><div>'+def.synergies.map(synergyCard).join('')+'</div></section>'+bar()+(result.warnings.length?'<details class="mastery-warnings"><summary>'+result.warnings.length+' point(s) à vérifier dans ce brouillon</summary><ul>'+result.warnings.map(w=>'<li>'+e(w.message)+'</li>').join('')+'</ul></details>':'')+'<p class="mastery-note">Conception en étude · les effets restent descriptifs et ne constituent pas de nouvelles règles de gameplay validées.</p><dialog class="mastery-dialog" aria-labelledby="'+uid+'-dialog-title"><div data-ms-dialog-content></div></dialog>';
    if(focus){let target=[...root.querySelectorAll('[data-focus-key]')].find(el=>el.dataset.focusKey===focus&&!el.disabled);if(!target&&focus.endsWith(':plus'))target=[...root.querySelectorAll('[data-focus-key]')].find(el=>el.dataset.focusKey===focus.slice(0,-5)+':minus'&&!el.disabled);if(!target&&focus.endsWith(':minus'))target=[...root.querySelectorAll('[data-focus-key]')].find(el=>el.dataset.focusKey===focus.slice(0,-6)+':plus'&&!el.disabled);if(!target&&['undo','redo'].includes(focus))target=root.querySelector('[data-ms="'+(focus==='undo'?'redo':'undo')+'"]:not(:disabled)');target?.focus({preventScroll:true});}
  }
  function download(text,name,type='application/json'){
    const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function dialog(){return root.querySelector('.mastery-dialog');}
  function closeDialog(){dialog().close();[...root.querySelectorAll('[data-focus-key]')].find(el=>el.dataset.focusKey===dialogFocus)?.focus({preventScroll:true});}
  function showDialog(kind){
    dialogFocus=kind;const inner=root.querySelector('[data-ms-dialog-content]');
    inner.innerHTML='<div class="mastery-dialog-top"><h3 id="'+uid+'-dialog-title">'+(kind==='reset'?'Réinitialiser ce build ?':'Importer un build')+'</h3><button type="button" data-ms="dialog-close" aria-label="Fermer">✕</button></div>'+(kind==='reset'?'<p>Les points, choix, synergies et emplacements de ce build seront remis à zéro. Les autres classes et les anciennes sauvegardes ne seront pas modifiées. Vous pourrez annuler cette action.</p><div class="mastery-dialog-actions"><button type="button" data-ms="dialog-close" autofocus>Conserver le build</button><button type="button" data-ms="reset-confirm">Réinitialiser</button></div>':'<p>Choisissez un export de la même classe et de la même définition. Aucun changement ne sera appliqué avant validation complète.</p><label>Fichier JSON<input type="file" accept=".json,application/json" data-ms-file></label><label>Ou collez le JSON<textarea data-ms-import-text maxlength="100000" rows="9" spellcheck="false"></textarea></label><p data-ms-import-error role="alert"></p><div class="mastery-dialog-actions"><button type="button" data-ms="dialog-close">Annuler</button><button type="button" data-ms="import-confirm">Valider l’import</button></div>');
    dialog().showModal();if(kind==='import')inner.querySelector('textarea').focus();
  }
  root.addEventListener('click',async event=>{
    const button=event.target.closest('[data-ms]');if(!button)return;const action=button.dataset.ms,focus=button.dataset.focusKey;
    if(action==='rank')command({type:'rank',nodeId:button.dataset.node,delta:Number(button.dataset.delta)},focus);
    else if(action==='synergy')command({type:'synergy',synergyId:button.dataset.synergy},focus);
    else if(action==='slot-select'){selected=Number(button.dataset.slot);render(focus);}
    else if(action==='slot-clear')command({type:'slot',index:selected,abilityId:'',shortcut:''},focus,'Emplacement libéré.');
    else if(action==='undo'||action==='redo'){
      const from=action==='undo'?undo:redo,to=action==='undo'?redo:undo;if(!from.length)return;to.push(build);build=from.pop();selected=Math.min(selected,build.loadout.count-1);shareLink='';save();onChanged();render(focus);notify(action==='undo'?'Modification annulée.':'Modification rétablie.');
    }else if(action==='export')download(exportBuild(def,build),'ashenfall-'+classId+'-'+(def.id.endsWith(':v8')?'rempart-v8':'maitrises')+'.json');
    else if(action==='original')download(store.original()||'','ashenfall-'+classId+'-sauvegarde-originale.txt','text/plain');
    else if(action==='import'||action==='reset')showDialog(action);
    else if(action==='dialog-close')closeDialog();
    else if(action==='reset-confirm'){closeDialog();command({type:'reset'},'reset','Build réinitialisé. La commande Annuler permet de le retrouver.');}
    else if(action==='import-confirm'){
      const result=importBuild(def,root.querySelector('[data-ms-import-text]').value);
      if(!result.valid){root.querySelector('[data-ms-import-error]').textContent=result.errors.map(error=>error.message).join(' ');return;}
      closeDialog();commit(result,'import','Build importé et validé.');
    }else if(action==='share'){
      shareLink=makeShareLink(encodeShared(def,build));render('share');
      try{await navigator.clipboard.writeText(shareLink);notify('Lien du build copié.');}catch{notify('Le lien est prêt ci-dessous. Copiez-le pour partager ce build.');root.querySelector('[data-ms-share-link]')?.select();}
    }
  },{signal:abort.signal});
  root.addEventListener('change',event=>{
    const input=event.target;
    if(input.matches('[data-ms-choice]'))command({type:'choice',nodeId:input.dataset.msChoice,choice:input.value},input.dataset.focusKey);
    else if(input.matches('[data-ms-count]')){barOpen=true;command({type:'resize',count:Number(input.value)},'count','Barre redimensionnée ; la sélection reste sur un emplacement visible.');}
    else if(input.matches('[data-ms-weapon]'))command({type:'weapon',weapon:input.value},'weapon','Équipement indicatif mis à jour.');
    else if(input.matches('[data-ms-model]'))onModelChange(input.value);
    else if(input.matches('[data-ms-file]')){
      const file=input.files[0];if(!file)return;if(file.size>100000){root.querySelector('[data-ms-import-error]').textContent='Fichier trop volumineux (100 Ko maximum).';return;}
      file.text().then(text=>{const field=root.querySelector('[data-ms-import-text]');if(root.isConnected&&field)field.value=text;}).catch(()=>{const field=root.querySelector('[data-ms-import-error]');if(root.isConnected&&field)field.textContent='Lecture du fichier impossible.';});
    }
  },{signal:abort.signal});
  root.addEventListener('submit',event=>{if(event.target.matches('.mastery-slot-editor')){event.preventDefault();barOpen=true;command({type:'slot',index:selected,abilityId:root.querySelector('[data-ms-action-select]').value,shortcut:root.querySelector('[data-ms-shortcut]').value},'assign','Emplacement '+(selected+1)+' mis à jour.');}},{signal:abort.signal});
  root.addEventListener('toggle',event=>{if(event.target.matches('.mastery-loadout'))barOpen=event.target.open;}, {capture:true,signal:abort.signal});
  root.addEventListener('close',event=>{if(event.target.matches('.mastery-dialog'))[...root.querySelectorAll('[data-focus-key]')].find(el=>el.dataset.focusKey===dialogFocus)?.focus({preventScroll:true});},{capture:true,signal:abort.signal});
  render();
  return {root,def,getBuild:()=>JSON.parse(JSON.stringify(build)),loadShared(token){const result=decodeShared(def,token);if(result.valid)commit(result,null,'Build partagé chargé. Vous pouvez l’annuler pour revenir à votre configuration.');else notify(result.errors.map(error=>error.message).join(' '),true);return result;},destroy(){abort.abort();if(dialog()?.open)dialog().close();}};
}
