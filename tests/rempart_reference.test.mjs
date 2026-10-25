import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {definitions} from '../site/assets/classes/masteries-v1/definitions.mjs';
import {rempartReference as ref,compileReference,nodeEffects} from '../site/assets/classes/masteries-v1/reference.mjs';
import {buildPreset} from '../site/assets/classes/masteries-v1/presets.mjs';
import {emptyBuild,applyCommand} from '../site/assets/classes/masteries-v1/engine.mjs';
const def=definitions.models['rempart:v8'];
test('complete working reference and generated public projection stay identical',()=>{
 assert.deepEqual(ref,JSON.parse(fs.readFileSync(new URL('../data/rempart-reference-v1.json',import.meta.url))));
 assert.equal(Object.keys(ref.nodes).length,24);assert.equal(Object.keys(ref.synergies).length,6);assert.equal(Object.keys(ref.actions).length,25);
 for(const n of def.nodes){const x=nodeEffects(n,2,'a');assert.ok(x.preview.every(v=>!v.includes('undefined')));assert.equal(Object.keys(x.choices).length,2);}
});
test('rank totals are displayed with selected mastery and context, without inventing global resistance',()=>{
 assert.match(nodeEffects(def.nodes[0],2,'a').selected.join(),/repoussements réduite : 30 %/);
 assert.match(nodeEffects(def.nodes[8],2,'a').selected.join(),/25 %.*en PvE/);
 assert.match(nodeEffects(def.nodes[0],1).selected.join(),/10 %/);
 assert.equal(nodeEffects(def.nodes[0],0).selected.length,0);
});
test('template HP, cooldown and blocking cost use the same coefficient layer as simulation',()=>{
 const c=compileReference(def,buildPreset(def,'citadelle').build);assert.equal(c.actor.hp,11000);assert.equal(c.actor.blockEnduranceCost,6.8);assert.equal(c.actions.defi.cooldown,10.8);
 const g=compileReference(def,buildPreset(def,'garde-du-corps').build);assert.equal(g.actions['charge-inebranlable'].cooldown,12.75);
 assert.equal(c.actor.physicalMitigation,.3);assert.equal(c.actor.magicMitigation,.2);
});
test('stats do not mutate builds or redefine their version, and only active talents unlock actions',()=>{
 const initial=emptyBuild(def),saved=JSON.stringify(initial);compileReference(def,initial);assert.equal(JSON.stringify(initial),saved);
 assert.equal(compileReference(def,initial).actions['tenir-la-ligne'],undefined);
 const n=def.nodes.find(n=>n.legacyId==='b-1');const r=applyCommand(def,initial,{type:'rank',nodeId:n.id,delta:1});assert.ok(compileReference(def,r.build).actions['tenir-la-ligne']);
 assert.equal(compileReference(def,r.build).actions['pieds-de-pierre'],undefined);
 assert.throws(()=>compileReference(definitions.models['arcaniste:generic'],emptyBuild(definitions.models['arcaniste:generic'])));
});
test('every historical numeric effect remains explicit, including guard transfer and strong-defense rules',()=>{
 assert.equal(ref.actions.garde.transfer,.5);assert.equal(ref.actions.defi.pvpOtherTargetDamageReduction,.15);assert.equal(ref.actions.interposition.range,12);assert.equal(ref.actions['heurt-bastion'].targets,1);assert.equal(ref.actions['heurt-bastion'].knockback,8);
 assert.equal(ref.actions.souffle.enduranceRestored,35);assert.equal(ref.actions.souffle.duration,4);assert.equal(ref.actions.absolu.damageReduction,.45);assert.equal(ref.rules.strongDefense,'maximum_only');
});
