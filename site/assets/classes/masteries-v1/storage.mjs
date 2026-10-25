import {emptyBuild,validateBuild,migrateLegacy} from './engine.mjs?v=native-v1';

export class BuildStore{
  constructor(def,storage){this.def=def;this.storage=storage;this.key='ashenfall-build-v2:'+def.id;this.originalRaw=null;this.legacyRaw=null;this.backupRaw=null;}
  load(){
    const fallback=emptyBuild(this.def);let raw;
    try{raw=this.storage?.getItem(this.key)??null;}catch{return {build:fallback,notice:'Le stockage local est indisponible. Vous pouvez construire et exporter votre build.'};}
    if(raw!==null){
      try{const result=validateBuild(this.def,JSON.parse(raw));if(result.valid)return {build:result.build,notice:''};this.originalRaw=raw;return {build:fallback,notice:'Sauvegarde incompatible conservée : '+result.errors[0].message};}
      catch{this.originalRaw=raw;return {build:fallback,notice:'Sauvegarde illisible conservée. Exportez l’original avant de la remplacer.'};}
    }
    try{this.legacyRaw=this.storage?.getItem(this.def.legacy.key)??null;}catch{}
    if(this.legacyRaw!==null){
      try{const result=migrateLegacy(this.def,JSON.parse(this.legacyRaw));if(result.valid){const save=this.save(result.build);return {build:result.build,notice:'Ancien build repris. La sauvegarde historique reste conservée.'+(save.ok?'':' '+save.message)};}return {build:fallback,notice:'Ancien build conservé, mais incompatible : '+result.errors[0].message};}
      catch{return {build:fallback,notice:'Ancienne sauvegarde illisible, conservée sans modification.'};}
    }
    return {build:fallback,notice:this.storage?'':'Sauvegarde locale indisponible ; pensez à exporter votre build.'};
  }
  save(build){
    const result=validateBuild(this.def,build);if(!result.valid)return {ok:false,message:result.errors[0].message};
    if(!this.storage)return {ok:false,message:'Sauvegarde locale indisponible. Votre build reste en mémoire ; exportez-le pour le conserver.'};
    try{
      if(this.originalRaw!==null&&this.backupRaw!==this.originalRaw){this.storage.setItem(this.key+':backup:'+Date.now(),this.originalRaw);this.backupRaw=this.originalRaw;}
      this.storage.setItem(this.key,JSON.stringify(result.build));this.originalRaw=null;return {ok:true};
    }catch{return {ok:false,message:'Écriture locale impossible. Le build reste cohérent en mémoire ; exportez-le. Les données précédentes ne sont pas effacées.'};}
  }
  original(){return this.originalRaw??this.backupRaw??this.legacyRaw;}
}
