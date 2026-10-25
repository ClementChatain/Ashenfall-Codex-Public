export const SCHEMA_VERSION=2;
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
const copy=value=>JSON.parse(JSON.stringify(value));
const problem=(code,message,details={})=>({code,message,...details});
const allowed=(object,keys)=>Object.keys(object).every(key=>keys.includes(key));
export const normalizeShortcut=value=>value.trim().replace(/\s*\+\s*/g,'+').replace(/\b(ctrl|control)\b/ig,'Ctrl').replace(/\bshift\b/ig,'Shift').replace(/\balt\b/ig,'Alt').replace(/\b(command|cmd|meta)\b/ig,'Meta');
export function emptyBuild(def){return {schemaVersion:SCHEMA_VERSION,definitionVersion:def.version,classId:def.classId,modelId:def.id,ranks:{},choices:{},synergies:[],loadout:{count:20,weapon:def.weapons[0]||'',slots:Array.from({length:30},()=>({abilityId:'',shortcut:''}))}};}
export const pathPoints=(def,build,id)=>def.nodes.filter(node=>node.pathId===id).reduce((total,node)=>total+(build.ranks[node.id]||0),0);
export const spentPoints=(def,build)=>Object.values(build.ranks).reduce((total,rank)=>total+rank,0)+build.synergies.reduce((total,id)=>total+(def.synergies.find(s=>s.id===id)?.cost||0),0);
export function availableActions(def,build){return [...def.abilities.map(a=>({id:'ability:'+a.id,label:a.label,group:a.kind==='legacy'?'Actions historiques':'Compétences de classe'})),...def.nodes.filter(n=>build.ranks[n.id]>0).map(n=>({id:'talent:'+n.id,label:n.label,group:'Talents acquis · type à préciser'})),...def.synergies.filter(s=>build.synergies.includes(s.id)).map(s=>({id:'synergy:'+s.id,label:s.label,group:'Synergies de conception'}))];}

export function validateBuild(def,input){
  const errors=[],warnings=[];
  if(!plain(input))return {valid:false,errors:[problem('SHAPE','Le build doit être un objet.')],warnings};
  if(!allowed(input,['schemaVersion','definitionVersion','classId','modelId','ranks','choices','synergies','loadout']))errors.push(problem('FIELDS','Le build contient des champs inconnus.'));
  if(input.schemaVersion!==SCHEMA_VERSION)errors.push(problem('VERSION','Format de sauvegarde incompatible.'));
  if(input.definitionVersion!==def.version)errors.push(problem('DEFINITION_VERSION','Ce build utilise une autre version des définitions. L’original est conservé.'));
  if(input.classId!==def.classId||input.modelId!==def.id)errors.push(problem('CLASS','Ce build concerne une autre classe ou un autre modèle.'));
  if(!plain(input.ranks)||!plain(input.choices)||!Array.isArray(input.synergies))return {valid:false,errors:[...errors,problem('SHAPE','Rangs, choix ou synergies mal formés.')],warnings};
  for(const [id,rank] of Object.entries(input.ranks)){
    const node=def.nodes.find(n=>n.id===id);
    if(!node)errors.push(problem('UNKNOWN_TALENT','Talent inconnu : '+id));
    else if(!Number.isInteger(rank)||rank<0||rank>node.maxRank)errors.push(problem('RANK','Le rang de '+node.label+' doit être un entier entre 0 et '+node.maxRank+'.'));
  }
  for(const [id,choice] of Object.entries(input.choices)){
    const node=def.nodes.find(n=>n.id===id);
    if(!node||input.ranks[id]!==node.maxRank||typeof choice!=='string'||!Object.hasOwn(node.choices,choice))errors.push(problem('CHOICE','Choix de maîtrise invalide pour '+(node?.label||id)+'.'));
  }
  if(input.synergies.some(id=>typeof id!=='string'||!def.synergies.some(s=>s.id===id)))errors.push(problem('UNKNOWN_SYNERGY','Synergie inconnue.'));
  if(new Set(input.synergies).size!==input.synergies.length)errors.push(problem('DUPLICATE_SYNERGY','Une même synergie ne peut être acquise deux fois.'));
  if(errors.length)return {valid:false,errors,warnings};
  const build=copy(input);
  for(const node of def.nodes){
    const rank=build.ranks[node.id]||0;
    if(rank>0&&pathPoints(def,build,node.pathId)-rank<node.requiredPoints){const path=def.paths.find(p=>p.id===node.pathId);errors.push(problem('TIER',node.label+' exige '+node.requiredPoints+' autres points dans la voie '+path.label+'.',{nodeId:node.id}));}
    if(rank===node.maxRank&&!build.choices[node.id])warnings.push(problem('PENDING_CHOICE','Un choix de maîtrise reste à sélectionner pour '+node.label+'.',{nodeId:node.id}));
    if(rank===0)delete build.ranks[node.id];
  }
  for(const id of build.synergies){const syn=def.synergies.find(s=>s.id===id);if(syn.pathIds.some(path=>pathPoints(def,build,path)<syn.requiredPoints))errors.push(problem('SYNERGY_TIER',syn.label+' exige '+syn.requiredPoints+' points dans chacune de ses deux voies.'));}
  if(spentPoints(def,build)>def.budget)errors.push(problem('BUDGET','Le budget de '+def.budget+' points est dépassé.'));
  const loadout=build.loadout;
  if(!plain(loadout)||!allowed(loadout,['count','weapon','slots'])||![10,20,30].includes(loadout.count)||!Array.isArray(loadout.slots)||loadout.slots.length!==30){errors.push(problem('LOADOUT','La barre doit contenir 30 emplacements et afficher 10, 20 ou 30 cases.'));return {valid:false,errors,warnings};}
  if(typeof loadout.weapon!=='string'||(def.weapons.length?!def.weapons.includes(loadout.weapon):loadout.weapon!==''))errors.push(problem('WEAPON','Équipement indicatif inconnu.'));
  const actions=new Set(availableActions(def,build).map(a=>a.id));const shortcuts=new Map();
  for(const [index,slot] of loadout.slots.entries()){
    if(!plain(slot)||!allowed(slot,['abilityId','shortcut'])||typeof slot.abilityId!=='string'||typeof slot.shortcut!=='string'){errors.push(problem('SLOT','Emplacement '+(index+1)+' mal formé.'));continue;}
    if(slot.abilityId&&!actions.has(slot.abilityId))errors.push(problem('ACTION','L’action de l’emplacement '+(index+1)+' est inconnue ou n’est plus disponible.'));
    if(slot.shortcut.length>40||/[<>\u0000-\u001f\u007f]/.test(slot.shortcut)){errors.push(problem('SHORTCUT','Le raccourci de l’emplacement '+(index+1)+' doit être un texte court, sans balise ni caractère de contrôle.'));continue;}
    slot.shortcut=normalizeShortcut(slot.shortcut);
    if(index<loadout.count&&slot.shortcut){const key=slot.shortcut.toLocaleLowerCase();if(shortcuts.has(key))warnings.push(problem('DUPLICATE_SHORTCUT','Le raccourci '+slot.shortcut+' est utilisé aux emplacements '+(shortcuts.get(key)+1)+' et '+(index+1)+'.'));else shortcuts.set(key,index);}
  }
  return {valid:errors.length===0,errors,warnings,...(errors.length?{}:{build})};
}

export function applyCommand(def,current,command){
  const initial=validateBuild(def,current);if(!initial.valid)return initial;
  const next=initial.build;const fail=message=>({valid:false,errors:[problem('COMMAND',message)],warnings:[]});
  if(!plain(command))return fail('Commande invalide.');
  if(command.type==='rank'){
    const node=def.nodes.find(n=>n.id===command.nodeId);if(!node||![1,-1].includes(command.delta))return fail('Talent ou modification de rang inconnu.');
    const rank=(next.ranks[node.id]||0)+command.delta;if(rank<0||rank>node.maxRank)return fail('Le rang doit rester entre 0 et '+node.maxRank+'.');
    if(rank)next.ranks[node.id]=rank;else delete next.ranks[node.id];
    if(rank<node.maxRank)delete next.choices[node.id];
  }else if(command.type==='choice'){
    const node=def.nodes.find(n=>n.id===command.nodeId);if(!node||next.ranks[node.id]!==node.maxRank||typeof command.choice!=='string'||!Object.hasOwn(node.choices,command.choice))return fail('Le choix nécessite le second rang de ce talent.');next.choices[node.id]=command.choice;
  }else if(command.type==='synergy'){
    const syn=def.synergies.find(s=>s.id===command.synergyId);if(!syn)return fail('Synergie inconnue.');
    next.synergies=next.synergies.includes(syn.id)?next.synergies.filter(id=>id!==syn.id):[...next.synergies,syn.id];
  }else if(command.type==='resize'){
    if(![10,20,30].includes(command.count))return fail('Nombre d’emplacements invalide.');next.loadout.count=command.count;
  }else if(command.type==='slot'){
    if(!Number.isInteger(command.index)||command.index<0||command.index>=next.loadout.count)return fail('Sélectionnez un emplacement visible.');
    next.loadout.slots[command.index]={abilityId:command.abilityId,shortcut:command.shortcut};
  }else if(command.type==='weapon')next.loadout.weapon=command.weapon;
  else if(command.type==='reset')return validateBuild(def,emptyBuild(def));
  else return fail('Commande inconnue.');
  // A refund clears only actions that have just become unavailable; shortcuts are retained.
  if(command.type==='rank'||command.type==='synergy'){
    const available=new Set(availableActions(def,next).map(a=>a.id));for(const slot of next.loadout.slots)if(slot.abilityId&&!available.has(slot.abilityId))slot.abilityId='';
  }
  return validateBuild(def,next);
}

export function migrateLegacy(def,input){
  if(!plain(input))return {valid:false,errors:[problem('LEGACY','Ancienne sauvegarde mal formée.')],warnings:[]};
  const build=emptyBuild(def),errors=[];
  if(!allowed(input,def.legacy.kind==='rempart'?['ranks','choices','owned','slots','weapon','count']:['ranks','choices','synergies']))errors.push(problem('LEGACY','Champs inconnus dans l’ancienne sauvegarde.'));
  if(input.ranks!==undefined&&!plain(input.ranks))errors.push(problem('LEGACY','Anciens rangs mal formés.'));
  for(const [legacy,rank] of Object.entries(plain(input.ranks)?input.ranks:{})){
    const node=def.nodes.find(n=>n.legacyId===legacy);if(!node)errors.push(problem('LEGACY','Ancien talent inconnu : '+legacy));else build.ranks[node.id]=rank;
  }
  if(input.choices!==undefined&&!plain(input.choices))errors.push(problem('LEGACY','Anciens choix mal formés.'));
  for(const [legacy,choice] of Object.entries(plain(input.choices)?input.choices:{})){
    const node=def.nodes.find(n=>n.legacyId===legacy);if(!node)errors.push(problem('LEGACY','Ancien choix inconnu : '+legacy));else build.choices[node.id]=choice;
  }
  const owned=def.legacy.kind==='rempart'?input.owned:input.synergies;
  if(owned!==undefined&&!Array.isArray(owned))errors.push(problem('LEGACY','Anciennes synergies mal formées.'));
  for(const legacy of Array.isArray(owned)?owned:[]){const typeOK=def.legacy.kind==='rempart'?Number.isInteger(legacy):typeof legacy==='string';const syn=typeOK&&def.synergies.find(s=>s.legacyId===String(legacy));if(!syn)errors.push(problem('LEGACY','Ancienne synergie inconnue.'));else build.synergies.push(syn.id);}
  if(errors.length)return {valid:false,errors,warnings:[]};
  const baseCheck=validateBuild(def,build);if(!baseCheck.valid)return baseCheck;
  if(def.legacy.kind==='rempart'){
    if(input.count!==undefined){const count=typeof input.count==='string'&&/^(10|20|30)$/.test(input.count)?Number(input.count):input.count;build.loadout.count=count;}
    if(input.weapon!==undefined)build.loadout.weapon=input.weapon==="Arme d'hast"?'Arme d’hast':input.weapon;
    if(input.slots!==undefined){
      if(!Array.isArray(input.slots)||input.slots.length!==30)errors.push(problem('LEGACY','Ancienne barre mal formée.'));
      else{
        const actions=availableActions(def,build);
        build.loadout.slots=input.slots.map((slot,index)=>{
          if(!plain(slot)||typeof slot.ability!=='string'||typeof slot.key!=='string'){errors.push(problem('LEGACY','Ancien emplacement '+(index+1)+' invalide.'));return {abilityId:'',shortcut:''};}
          const action=actions.find(a=>a.label===slot.ability);if(slot.ability&&!action)errors.push(problem('LEGACY','Ancienne action indisponible à l’emplacement '+(index+1)+'.'));
          return {abilityId:action?.id||'',shortcut:slot.key};
        });
      }
    }
  }
  if(errors.length)return {valid:false,errors,warnings:[]};
  return validateBuild(def,build);
}

export function exportBuild(def,build){const result=validateBuild(def,build);if(!result.valid)throw new Error(result.errors[0].message);return JSON.stringify({format:'ashenfall-build',version:SCHEMA_VERSION,build:result.build},null,2);}
export function importBuild(def,text){
  if(typeof text!=='string'||text.length>100000)return {valid:false,errors:[problem('IMPORT','Fichier trop volumineux ou invalide.')],warnings:[]};
  try{const payload=JSON.parse(text);if(!plain(payload)||!allowed(payload,['format','version','build'])||payload.format!=='ashenfall-build'||payload.version!==SCHEMA_VERSION)throw new Error('Format de build incompatible.');return validateBuild(def,payload.build);}catch(error){return {valid:false,errors:[problem('IMPORT','Impossible de lire ce build : '+error.message)],warnings:[]};}
}
