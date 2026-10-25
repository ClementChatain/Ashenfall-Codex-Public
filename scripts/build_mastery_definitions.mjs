import fs from 'node:fs';
import crypto from 'node:crypto';

// The reviewed source snapshot is public design material, not canonical new rules.
const source = JSON.parse(fs.readFileSync(new URL('../data/masteries-source-v1.json', import.meta.url), 'utf8'));
const slug = text => text.replaceAll('œ','oe').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const models = {}, classes = {};
for (const cls of source.general.classes) {
  const abilities = cls.skills.map(skill => {
    const record = source.abilities.find(record => record.id.startsWith(cls.id+'-') && slug(record.name) === slug(skill.name));
    if (!record) throw new Error('Missing public ability: '+cls.id+'/'+skill.name);
    return {id:record.id,label:skill.name,description:skill.effect,artwork:record.artwork,kind:'reference'};
  });
  const paths = source.general.roles[cls.role].map(([label,description,keywords],index)=>({id:slug(label),label,description,keywords,legacyId:String(index)}));
  const nodes = paths.flatMap((path,p)=>Array.from({length:8},(_,i)=>{
    const ability=abilities[(i*3+p*2)%abilities.length];
    const tag=['Approfondissement','Affinement','Maîtrise'][p];
    return {id:cls.id+':'+path.id+':'+ability.id,pathId:path.id,legacyId:p+'-'+i,abilityId:ability.id,label:ability.label+' · '+tag,description:ability.description,requiredPoints:i<3?0:i<6?5:10,maxRank:2,choices:{a:'Spécialisation : renforcer l’effet de '+ability.label+'.',b:'Spécialisation : favoriser son usage tactique ou son utilité de groupe.'}};
  }));
  const synergies=[[0,1],[0,2],[1,2]].map(([a,b])=>({id:paths[a].id+'+'+paths[b].id,label:paths[a].label+' + '+paths[b].label,description:'Un style hybride combinant '+paths[a].description.toLowerCase()+' et '+paths[b].description.toLowerCase()+'.',pathIds:[paths[a].id,paths[b].id],requiredPoints:5,cost:2,legacyId:a+'-'+b}));
  const def={id:cls.id+':generic',classId:cls.id,className:cls.name,people:cls.people,role:cls.role,label:'Modèle par rôle · '+paths.map(p=>p.label).join(' / '),status:'EN_ETUDE',budget:20,prerequisiteScope:'other-points-in-path',paths,nodes,synergies,abilities,weapons:[],legacy:{kind:'general',key:'ashenfall-all-masteries-v1-'+cls.id}};
  models[def.id]=def;
  classes[cls.id]={id:cls.id,label:cls.name,people:cls.people,role:cls.role,defaultModel:def.id,modelIds:[def.id]};
}
const r=source.rempart;
const abilities=structuredClone(models['rempart:generic'].abilities);
for(const label of r.base)if(!abilities.some(ability=>slug(ability.label)===slug(label)))abilities.push({id:'legacy:'+slug(label),label,description:'Action historique du planificateur Rempart.',artwork:null,kind:'legacy'});
const paths=r.paths.map(path=>({id:slug(path.name),label:path.name,legacyId:path.id,description:{b:'Défense et survie',f:'Offensive et zone',v:'Protection et contrôle'}[path.id],keywords:''}));
const nodes=r.paths.flatMap((path,p)=>path.nodes.map((node,index)=>({id:'rempart:'+paths[p].id+':'+slug(node[0]),pathId:paths[p].id,legacyId:path.id+'-'+index,abilityId:null,label:node[0],description:r.expandedDescriptions[path.id+'-'+index]||node[1],requiredPoints:node[4],maxRank:2,choices:{a:node[2],b:node[3]}})));
models['rempart:v8']={id:'rempart:v8',classId:'rempart',className:'Rempart',people:'Nain',role:'Tank',label:'Rempart · Bastion / Fracture / Vigie',status:'EN_ETUDE',budget:20,prerequisiteScope:'other-points-in-path',paths,nodes,synergies:r.syn.map(([a,b,label,description],index)=>({id:slug(label),label,description,pathIds:[paths.find(p=>p.legacyId===a).id,paths.find(p=>p.legacyId===b).id],requiredPoints:5,cost:2,legacyId:String(index)})),abilities,weapons:['Bouclier + arme à une main','Arme à deux mains',"Arme d’hast"],legacy:{kind:'rempart',key:'ashenfall-rempart-v8'}};
classes.rempart.defaultModel='rempart:v8';classes.rempart.modelIds.unshift('rempart:v8');
for(const def of Object.values(models))def.version=crypto.createHash('sha256').update(JSON.stringify(def)).digest('hex').slice(0,16);
const output={schemaVersion:2,sourceCommit:source.sourceCommit,classes,models};
fs.mkdirSync(new URL('../site/assets/classes/masteries-v1/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('../site/assets/classes/masteries-v1/definitions.mjs',import.meta.url),'// Generated from data/masteries-source-v1.json. Do not hand-edit.\nexport const definitions = '+JSON.stringify(output)+';\n');
console.log('Definitions:',Object.keys(classes).length,'classes,',Object.keys(models).length,'models.');
