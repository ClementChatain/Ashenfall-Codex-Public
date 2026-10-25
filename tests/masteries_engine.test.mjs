import test from 'node:test';
import assert from 'node:assert/strict';
import {definitions} from '../site/assets/classes/masteries-v1/definitions.mjs';
import {emptyBuild,validateBuild,applyCommand,pathPoints,spentPoints,migrateLegacy,exportBuild,importBuild} from '../site/assets/classes/masteries-v1/engine.mjs';
import {BuildStore} from '../site/assets/classes/masteries-v1/storage.mjs';
import {encodeShared,decodeShared} from '../site/assets/classes/masteries-v1/component.mjs';

const generic=definitions.models['arcaniste:generic'],rempart=definitions.models['rempart:v8'];
const node=(def,legacy)=>def.nodes.find(n=>n.legacyId===legacy);
function act(def,build,command){const result=applyCommand(def,build,command);assert.equal(result.valid,true,JSON.stringify(result.errors));return result.build;}
function rank(def,build,id,delta=1){return act(def,build,{type:'rank',nodeId:id,delta});}
function foundations(def,build,path,count=5){for(const n of def.nodes.filter(n=>n.pathId===path&&n.requiredPoints===0))for(let i=0;i<2&&count>0;i++,count--)build=rank(def,build,n.id);return build;}

test('24 classes, 25 distinct versioned models and stable IDs',()=>{
  assert.equal(Object.keys(definitions.classes).length,24);assert.equal(Object.keys(definitions.models).length,25);
  for(const def of Object.values(definitions.models)){
    assert.equal(def.nodes.length,24);assert.equal(new Set(def.nodes.map(n=>n.id)).size,24);assert.equal(def.paths.length,3);assert.equal(def.budget,20);
    assert.ok(validateBuild(def,emptyBuild(def)).valid);assert.equal(def.status,'EN_ETUDE');
  }
});

for(const def of Object.values(definitions.models))test(def.id+': tiers, 20-point budget and deterministic commands',()=>{
  let build=emptyBuild(def);const second=def.nodes.find(n=>n.requiredPoints===5);
  assert.equal(applyCommand(def,build,{type:'rank',nodeId:second.id,delta:1}).valid,false);
  build=foundations(def,build,second.pathId,4);
  assert.equal(applyCommand(def,build,{type:'rank',nodeId:second.id,delta:1}).valid,false);
  build=foundations(def,emptyBuild(def),second.pathId,5);build=rank(def,build,second.id);
  const onlyFoundation=def.nodes.find(n=>n.pathId===second.pathId&&build.ranks[n.id]===1&&n.requiredPoints===0);
  const snapshot=JSON.stringify(build);assert.equal(applyCommand(def,build,{type:'rank',nodeId:onlyFoundation.id,delta:-1}).valid,false);assert.equal(JSON.stringify(build),snapshot);
  build=emptyBuild(def);
  for(let iteration=0;iteration<25;iteration++)for(const n of def.nodes){const next=applyCommand(def,build,{type:'rank',nodeId:n.id,delta:1});if(next.valid)build=next.build;}
  assert.equal(spentPoints(def,build),20);assert.ok(validateBuild(def,build).valid);
  for(const n of def.nodes)assert.equal(applyCommand(def,build,{type:'rank',nodeId:n.id,delta:1}).valid,false);
});

test('malformed ranks and unknown fields are refused without mutation',()=>{
  const id=generic.nodes[0].id;
  for(const invalid of [-1,.5,3,NaN,Infinity,'2',true,null,{},[]]){
    const build=emptyBuild(generic);build.ranks[id]=invalid;assert.equal(validateBuild(generic,build).valid,false,String(invalid));
  }
  for(const mutate of [b=>b.ranks.unknown=1,b=>b.extra=true,b=>b.choices[id]={toString:null},b=>b.ranks=null,b=>b.synergies='bad',b=>b.modelId='rempart:v8',b=>b.definitionVersion='old']){
    const build=emptyBuild(generic);mutate(build);assert.doesNotThrow(()=>validateBuild(generic,build));assert.equal(validateBuild(generic,build).valid,false);
  }
});

test('rank-2 choices, optional draft state and refund cleanup',()=>{
  let build=emptyBuild(rempart),id=rempart.nodes[0].id;
  assert.equal(applyCommand(rempart,build,{type:'choice',nodeId:id,choice:'a'}).valid,false);
  build=rank(rempart,rank(rempart,build,id),id);
  assert.ok(validateBuild(rempart,build).warnings.some(w=>w.code==='PENDING_CHOICE'));
  build=act(rempart,build,{type:'choice',nodeId:id,choice:'a'});assert.equal(build.choices[id],'a');
  assert.equal(applyCommand(rempart,build,{type:'choice',nodeId:id,choice:{toString:null}}).valid,false);
  build=rank(rempart,build,id,-1);assert.equal(build.choices[id],undefined);
});

test('synergy budget, uniqueness and dependency-safe refunds',()=>{
  let build=emptyBuild(rempart);const syn=rempart.synergies[0];
  assert.equal(applyCommand(rempart,build,{type:'synergy',synergyId:syn.id}).valid,false);
  for(const path of syn.pathIds)build=foundations(rempart,build,path);
  build=act(rempart,build,{type:'synergy',synergyId:syn.id});assert.equal(spentPoints(rempart,build),12);
  const refunded=rempart.nodes.find(n=>n.pathId===syn.pathIds[0]&&build.ranks[n.id]===1);
  assert.equal(applyCommand(rempart,build,{type:'rank',nodeId:refunded.id,delta:-1}).valid,false);
  const duplicate=structuredClone(build);duplicate.synergies.push(syn.id);assert.equal(validateBuild(rempart,duplicate).valid,false);
  build=act(rempart,build,{type:'synergy',synergyId:syn.id});build=rank(rempart,build,refunded.id,-1);assert.equal(spentPoints(rempart,build),9);
});

test('existing other-points threshold rule is retained explicitly',()=>{
  let build=emptyBuild(generic);const p=generic.paths[0].id;
  for(const n of generic.nodes.filter(n=>n.pathId===p&&n.requiredPoints<10).slice(0,5))build=rank(generic,rank(generic,build,n.id),n.id);
  for(const n of generic.nodes.filter(n=>n.pathId===p&&n.requiredPoints===10))build=rank(generic,build,n.id);
  build=rank(generic,build,generic.nodes.find(n=>n.pathId===p&&n.requiredPoints===0).id,-1);
  assert.equal(pathPoints(generic,build,p),11);assert.ok(validateBuild(generic,build).valid);
});

test('loadout validates every slot and refuses HTML and invisible assignment',()=>{
  let build=emptyBuild(rempart);
  for(const mutate of [b=>b.loadout.slots[0]=null,b=>b.loadout.slots=[],b=>b.loadout.count=0,b=>b.loadout.weapon='unknown',b=>b.loadout.slots[0].shortcut='<img src=x>',b=>b.loadout.slots[0].shortcut='x'.repeat(41),b=>b.loadout.slots[0].abilityId='unknown']){
    const bad=structuredClone(build);mutate(bad);assert.equal(validateBuild(rempart,bad).valid,false);
  }
  build=act(rempart,build,{type:'resize',count:10});assert.equal(applyCommand(rempart,build,{type:'slot',index:29,abilityId:'',shortcut:'1'}).valid,false);
  const action='ability:'+rempart.abilities[0].id;build=act(rempart,build,{type:'slot',index:0,abilityId:action,shortcut:'control + 1'});
  assert.equal(build.loadout.slots[0].shortcut,'Ctrl+1');build=act(rempart,build,{type:'slot',index:1,abilityId:action,shortcut:'CTRL+1'});
  assert.ok(validateBuild(rempart,build).warnings.some(w=>w.code==='DUPLICATE_SHORTCUT'));
});

test('refunding a bound talent clears its unavailable action, retaining its shortcut',()=>{
  let build=emptyBuild(rempart);const id=rempart.nodes[0].id;
  build=rank(rempart,build,id);build=act(rempart,build,{type:'slot',index:0,abilityId:'talent:'+id,shortcut:'1'});build=rank(rempart,build,id,-1);
  assert.deepEqual(build.loadout.slots[0],{abilityId:'',shortcut:'1'});assert.ok(validateBuild(rempart,build).valid);
});

test('legacy models migrate independently and preserve their exact talent IDs',()=>{
  const raw={ranks:{'b-0':2},choices:{'b-0':'a'},owned:[],slots:Array.from({length:30},()=>({ability:'',key:''})),count:'20',weapon:"Arme d'hast"};raw.slots[0]={ability:'Pieds de Pierre',key:'Shift+1'};
  const migrated=migrateLegacy(rempart,raw);assert.ok(migrated.valid);assert.equal(migrated.build.ranks[node(rempart,'b-0').id],2);assert.equal(migrated.build.choices[node(rempart,'b-0').id],'a');assert.equal(migrated.build.loadout.weapon,'Arme d’hast');assert.equal(migrated.build.loadout.slots[0].abilityId,'talent:'+node(rempart,'b-0').id);
  const general=definitions.models['rempart:generic'];const other=migrateLegacy(general,{ranks:{'0-0':1},choices:{},synergies:[]});assert.ok(other.valid);assert.equal(other.build.ranks[node(general,'0-0').id],1);assert.notEqual(other.build.modelId,migrated.build.modelId);
});

test('malformed legacy saves are rejected atomically, including fractions and duplicated synergies',()=>{
  for(const raw of [null,{ranks:{'b-0':-.5}},{ranks:{'b-0':3}},{ranks:{'b-0':{valueOf:null,toString:null}}},{ranks:{},slots:Array(30).fill(null)},{ranks:{},owned:[0,0]},{ranks:{unknown:1}},{ranks:{},count:'bad'},{ranks:{},owned:['1']}]){
    assert.doesNotThrow(()=>migrateLegacy(rempart,raw));assert.equal(migrateLegacy(rempart,raw).valid,false,JSON.stringify(raw));
  }
  const old={ranks:{'0-0':.5},choices:{},synergies:[]};assert.equal(migrateLegacy(generic,old).valid,false);assert.deepEqual(old.ranks,{'0-0':.5});
});

class MemoryStorage{constructor(){this.map=new Map();}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}}
test('storage migrates without overwriting the original legacy record',()=>{
  const storage=new MemoryStorage(),raw=JSON.stringify({ranks:{'b-0':1},choices:{},owned:[]});storage.setItem(rempart.legacy.key,raw);
  const store=new BuildStore(rempart,storage),restored=store.load();assert.equal(restored.build.ranks[node(rempart,'b-0').id],1);assert.equal(storage.getItem(rempart.legacy.key),raw);assert.ok(storage.getItem(store.key));
});

test('unreadable current storage is backed up before replacement',()=>{
  const storage=new MemoryStorage(),store=new BuildStore(rempart,storage);storage.setItem(store.key,'corrupt original');const loaded=store.load();assert.equal(spentPoints(rempart,loaded.build),0);assert.equal(store.original(),'corrupt original');assert.ok(store.save(loaded.build).ok);assert.ok([...storage.map.values()].includes('corrupt original'));assert.ok(validateBuild(rempart,JSON.parse(storage.getItem(store.key))).valid);
});

test('quota or access denial never throws or destroys existing data',()=>{
  const broken={getItem(){throw new Error('blocked');},setItem(){throw new Error('full');}};const store=new BuildStore(rempart,broken);const loaded=store.load();assert.ok(validateBuild(rempart,loaded.build).valid);assert.equal(store.save(loaded.build).ok,false);
  const storage=new MemoryStorage(),protectedStore=new BuildStore(rempart,storage);storage.setItem(protectedStore.key,'original');protectedStore.load();storage.setItem=()=>{throw new Error('full');};assert.equal(protectedStore.save(emptyBuild(rempart)).ok,false);assert.equal(storage.getItem(protectedStore.key),'original');
});

test('JSON and shared links round-trip without accepting mismatched models or broken payloads',()=>{
  const build=rank(generic,emptyBuild(generic),generic.nodes[0].id);const text=exportBuild(generic,build);assert.deepEqual(importBuild(generic,text).build,build);assert.equal(importBuild(rempart,text).valid,false);assert.equal(importBuild(generic,'broken').valid,false);assert.equal(importBuild(generic,'x'.repeat(100001)).valid,false);
  const shared=encodeShared(generic,build);assert.deepEqual(decodeShared(generic,shared).build,build);assert.equal(decodeShared(rempart,shared).valid,false);assert.equal(decodeShared(generic,'!bad').valid,false);assert.equal(decodeShared(generic,'x'.repeat(32001)).valid,false);
});

test('random command sequences preserve invariants and never mutate their input',()=>{
  let seed=1234567;const random=n=>{seed=(seed*1664525+1013904223)>>>0;return seed%n;};
  for(const def of Object.values(definitions.models)){
    let build=emptyBuild(def);
    for(let i=0;i<180;i++){
      const n=def.nodes[random(def.nodes.length)],snapshot=JSON.stringify(build);
      const command=i%8===0?{type:'synergy',synergyId:def.synergies[random(def.synergies.length)].id}:{type:'rank',nodeId:n.id,delta:random(3)===0?-1:1};
      const result=applyCommand(def,build,command);assert.equal(JSON.stringify(build),snapshot);if(result.valid)build=result.build;
      assert.ok(validateBuild(def,build).valid);assert.ok(spentPoints(def,build)<=20);
    }
  }
});

const {rempartPresets,buildPreset}=await import('../site/assets/classes/masteries-v1/presets.mjs');
for(const [index,preset] of rempartPresets.entries())test('default template '+preset.id+': complete, reachable 20-point build',()=>{
  const result=buildPreset(rempart,preset.id);
  assert.equal(result.valid,true);assert.deepEqual(result.warnings,[]);assert.equal(spentPoints(rempart,result.build),20);
  assert.deepEqual(rempart.paths.map(p=>pathPoints(rempart,result.build,p.id)),[[12,0,6],[6,12,0],[0,6,12]][index]);
  assert.deepEqual(result.build.synergies,[preset.synergy]);
  for(const [legacy,points,choice] of preset.nodes){const n=node(rempart,legacy);assert.equal(result.build.ranks[n.id],points);if(choice)assert.equal(result.build.choices[n.id],choice);}
});
test('templates preserve loadout and shortcuts, release unavailable talents and reject wrong models',()=>{
  const previous=buildPreset(rempart,'citadelle').build;
  previous.loadout.count=30;
  previous.loadout.slots[29]={abilityId:'talent:'+rempart.nodes.find(n=>n.legacyId==='b-7').id,shortcut:'Ctrl+9'};
  // Use an always-available reference ability alongside a talent removed by the template.
  previous.loadout.slots[0]={abilityId:'ability:'+rempart.abilities[0].id,shortcut:'1'};
  const original=JSON.stringify(previous);const result=buildPreset(rempart,'broyeur',previous);
  assert.equal(result.valid,true);assert.equal(JSON.stringify(previous),original);
  assert.equal(result.build.loadout.count,30);assert.equal(result.build.loadout.slots[29].abilityId,'');assert.equal(result.build.loadout.slots[29].shortcut,'Ctrl+9');
  assert.deepEqual(result.build.loadout.slots[0],previous.loadout.slots[0]);
  assert.throws(()=>buildPreset(generic,'citadelle'));assert.throws(()=>buildPreset(rempart,'missing'));
});
