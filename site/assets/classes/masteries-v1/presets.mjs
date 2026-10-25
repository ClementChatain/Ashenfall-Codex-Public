import {emptyBuild,applyCommand,validateBuild,availableActions} from './engine.mjs?v=templates-v1';

// Approved example builds from the project conversation; existing V8 rules only.
export const rempartPresets=[
  {id:'citadelle',name:'La Citadelle',style:'Tank principal · résistance et protection',distribution:'12 Bastion · 6 Vigie · 2 synergie',description:'Tenir une position, absorber la pression et protéger un allié sous Garde.',tradeoff:'Peu de renforcement offensif et aucune amélioration de mobilité.',nodes:[['b-0',2,'a'],['b-1',2,'a'],['b-2',2,'a'],['b-3',2,'a'],['b-4',2,'b'],['b-7',2,'a'],['v-0',2,'a'],['v-1',2,'a'],['v-2',1],['v-5',1]],synergy:'rempart-vivant'},
  {id:'broyeur',name:'Le Broyeur',style:'Tank offensif · contre-attaques et zone',distribution:'6 Bastion · 12 Fracture · 2 synergie',description:'Bloquer puis riposter sur plusieurs cibles, avec une pression de zone soutenue.',tradeoff:'Moins de survie que la Citadelle et aucun renforcement de Garde.',nodes:[['b-0',2,'a'],['b-1',2,'a'],['b-2',2,'a'],['f-0',2,'a'],['f-1',2,'a'],['f-2',2,'a'],['f-4',2,'a'],['f-5',2,'a'],['f-6',2,'a']],synergy:'riposte-de-fer'},
  {id:'garde-du-corps',name:'Le Garde du corps',style:'Protection mobile · interruptions et contre-pression',distribution:'6 Fracture · 12 Vigie · 2 synergie',description:'Accompagner un allié menacé, repousser ses assaillants et exploiter les interruptions pour contre-attaquer.',tradeoff:'Aucun renforcement Bastion : le placement reste essentiel. Le choix de Balayage est orienté PvE.',nodes:[['v-0',2,'a'],['v-1',2,'b'],['v-2',2,'b'],['v-3',2,'a'],['v-5',2,'b'],['v-6',2,'b'],['f-0',2,'a'],['f-1',2,'a'],['f-2',2,'b']],synergy:'defi-fracassant'}
];
export function buildPreset(def,id,current=null){
  const preset=rempartPresets.find(p=>p.id===id);
  if(def.id!=='rempart:v8'||!preset)throw new Error('Template indisponible pour ce modèle.');
  let build=emptyBuild(def);
  const act=command=>{const result=applyCommand(def,build,command);if(!result.valid)throw new Error(result.errors.map(e=>e.message).join(' '));build=result.build;};
  for(const [legacyId,rank,choice] of preset.nodes){
    const node=def.nodes.find(n=>n.legacyId===legacyId);if(!node)throw new Error('Talent du template introuvable.');
    for(let i=0;i<rank;i++)act({type:'rank',nodeId:node.id,delta:1});
    if(choice)act({type:'choice',nodeId:node.id,choice});
  }
  act({type:'synergy',synergyId:preset.synergy});
  if(current){
    const previous=validateBuild(def,current);if(!previous.valid)throw new Error('Build précédent invalide.');
    build.loadout=previous.build.loadout;
    const allowed=new Set(availableActions(def,build).map(action=>action.id));
    build.loadout.slots=build.loadout.slots.map(slot=>({...slot,abilityId:allowed.has(slot.abilityId)?slot.abilityId:''}));
  }
  return validateBuild(def,build);
}
