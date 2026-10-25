import {rempartReference as ref} from './reference-data.mjs?v=rempart-stats-v1';
import {validateBuild} from './engine.mjs?v=rempart-stats-v1';
export {rempartReference} from './reference-data.mjs?v=rempart-stats-v1';
export const statLabels={knockback_reduction:'Distance des repoussements réduite',stability_on_knockback:'Stabilité après repoussement',damage_reduction:'Dégâts reçus réduits',duration:'Durée supplémentaire',stability_regen:'Stabilité par seconde',block_cost_reduction:'Coût du blocage réduit',damage_bonus:'Dégâts supplémentaires',max_hp_bonus:'PV maximum supplémentaires',stability_on_resist:'Stabilité après résistance',control_duration_reduction:'Durée des contrôles réduite',transferred_damage_reduction:'Dégâts transférés subis réduits',stability_per_target:'Stabilité par cible',secondary_targets:'Cibles secondaires',slow:'Ralentissement',enemy_damage_reduction:'Dégâts ennemis réduits',radius_bonus:'Rayon supplémentaire',stability_on_hit:'Stabilité par utilisation réussie',parry_chance:'Chance de parade supplémentaire',interrupt:'Interruption',cooldown_reduction:'Recharge réduite',move_speed_bonus:'Vitesse supplémentaire',veille_range:'Portée supplémentaire de Veille',share_veille:'Résistance de Veille également sur le Rempart',heal_max_hp:'Soin des PV maximum',next_attack_bonus:'Dégâts supplémentaires de la prochaine attaque'};
const conditions={always:'',after_block:'après blocage',pve:'en PvE',target_slowed:'sur cible ralentie',hp_below_35:'sous 35 % de PV',after_knockback:'après repoussement réussi',target_casting:'sur cible en incantation',guarded_ally_within_12m:'allié gardé à moins de 12 m',within_veille_range:'à portée de Veille',after_charge:'après charge',serment_and_ally_hp_below_35:'pendant Serment, allié sous 35 % de PV',stability_at_least_20:'à partir de 20 Stabilité',after_interrupt:'après interruption'};
const scopes={self:'',guarded_ally:'allié gardé',party:'groupe',incoming_aoe:'dégâts de zone',aoe:'attaques de zone'};
const fmt=n=>Number(n.toFixed(3)).toLocaleString('fr-FR');
export function effectText(effect,value=effect.values.at(-1)){
  const amount=effect.unit==='flag'?'':effect.unit==='percent'?fmt(value*100)+' %':fmt(value)+' '+({seconds:'s',meters:'m',points:'points',targets:'cibles','points/s':'points/s'}[effect.unit]||effect.unit);
  const context=[scopes[effect.scope]??ref.actions[effect.scope]?.label??effect.scope,conditions[effect.condition]??ref.actions[effect.condition]?.label??effect.condition].filter(Boolean).join(' · ');
  return (statLabels[effect.stat]||effect.stat)+(amount?' : '+amount:'')+(effect.coefficient?' · '+fmt(effect.coefficient*100)+' % de dégâts par cible secondaire':'')+(effect.duration?' · '+fmt(effect.duration)+' s':'')+(effect.window?' · fenêtre '+fmt(effect.window)+' s':'')+(effect.targetCap?' · '+effect.targetCap+' cibles maximum':'')+(effect.internalCooldown?' · au plus une fois / '+effect.internalCooldown+' s':'')+(context?' · '+context:'');
}
export function nodeEffects(node,rank,choice=null){
  const entry=ref.nodes[node.legacyId];if(!entry)return null;
  const selected=[];
  if(rank){
    const inputs=[...entry.ranks.map(e=>({...e,value:e.values[rank-1]})),...(choice?entry.choices[choice].map(e=>({...e,value:e.values[0]})):[])];
    for(const effect of inputs){
      const existing=selected.find(e=>e.stat===effect.stat&&e.scope===effect.scope&&e.unit===effect.unit&&(e.condition===effect.condition||(['always','pve'].includes(e.condition)&&['always','pve'].includes(effect.condition))));
      if(existing){existing.value+=effect.value;if(effect.condition==='pve')existing.condition='pve';}else selected.push({...effect});
    }
  }
  return {selected:selected.map(e=>effectText(e,e.value)),kind:entry.kind,ranks:entry.ranks.map(e=>effectText(e,e.values[Math.max(0,rank-1)])),preview:[1,2].map(r=>entry.ranks.map(e=>effectText(e,e.values[r-1])).join(' ; ')),choices:Object.fromEntries(Object.entries(entry.choices).map(([k,rows])=>[k,rows.map(e=>effectText(e)).join(' ; ')]))};
}
export function compileReference(def,build){
  if(def.id!=='rempart:v8')throw new Error('Reference reserved for Rempart V8');
  const checked=validateBuild(def,build);if(!checked.valid)throw new Error(checked.errors.map(e=>e.message).join(' '));
  const effects=[];const ranks={};
  for(const node of def.nodes){const rank=build.ranks[node.id]||0;ranks[node.legacyId]=rank;if(!rank)continue;const data=ref.nodes[node.legacyId];
    for(const e of data.ranks)effects.push({...e,value:e.values[rank-1],source:node.legacyId});
    if(build.choices[node.id])for(const e of data.choices[build.choices[node.id]])effects.push({...e,value:e.values[0],source:node.legacyId});
  }
  for(const id of build.synergies)for(const e of ref.synergies[id])effects.push({...e,value:e.values[0],source:id});
  const sum=(stat,scope='self',condition='always')=>effects.filter(e=>e.stat===stat&&e.scope===scope&&e.condition===condition).reduce((s,e)=>s+e.value,0);
  const actor={...ref.actor};actor.hp*=1+sum('max_hp_bonus');actor.blockEnduranceCost*=1-sum('block_cost_reduction');actor.veilleRange+=sum('veille_range');
  actor.physicalMitigation=actor.armor/(actor.armor+actor.armorConstant);actor.magicMitigation=actor.magicResistance/(actor.magicResistance+actor.resistanceConstant);
  const actions=Object.fromEntries(Object.entries(ref.actions).filter(([,a])=>!a.unlock||ranks[a.unlock]>0).map(([id,a])=>[id,{...a,id,cooldown:a.cooldown*(1-sum('cooldown_reduction',id)),duration:a.duration+sum('duration',id),radius:a.radius*(1+sum('radius_bonus',id))}]));
  return {version:ref.version,actor,actions,effects,ranks,synergies:[...build.synergies],sum};
}
export function referenceSummary(def,build){return compileReference(def,build);}
