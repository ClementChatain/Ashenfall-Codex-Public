const route=window.AshenfallRoute;
let mounted=null,key='',ticket=0,pending=false,routing=false,lastShared='';
const treeButton=dossier=>dossier.querySelector('[data-world-tab="tree"], [data-dossier-tab="tree"]');
const hostFor=dossier=>dossier?.querySelector('[data-mastery-host]');
const visible=host=>host&&host.isConnected&&!host.closest('[hidden]');
const modeFor=defId=>defId.endsWith(':v8')?'v8':'generic';
function modelFor(id,mode){return id+':'+(id==='rempart'&&mode!=='generic'?'v8':'generic');}
function cleanup(){mounted?.destroy();mounted=null;key='';}
async function sync(){
  pending=false;
  const target=route.read(),dossier=document.querySelector('#view .atlas-dossier[data-class-id]');
  if(!dossier){cleanup();return;}
  const id=dossier.dataset.classId,host=hostFor(dossier);
  if(target.id!==id||!host){cleanup();return;}
  if(target.tab==='maitrises'){
    const button=treeButton(dossier);
    if(button&&!button.hasAttribute('aria-current')){routing=true;button.click();routing=false;}
  }
  if(!visible(host))return;
  const modelId=modelFor(id,target.mode),nextKey=id+'|'+modelId;
  if(mounted?.root.isConnected&&key===nextKey){
    if(target.shared&&lastShared!==target.shared){lastShared=target.shared;mounted.loadShared(target.shared);}
    return;
  }
  cleanup();const currentTicket=++ticket;host.textContent='Chargement des maîtrises…';
  try{
    const {mountMasteries}=await import('./component.mjs?v=templates-v1');
    if(currentTicket!==ticket||!visible(host)||route.read().id!==id)return;
    mounted=mountMasteries(host,{classId:id,modelId,
      onModelChange(next){route.navigate(id,'maitrises',id==='rempart'?modeFor(next):null,{replace:true});schedule();},
      onChanged(){route.navigate(id,'maitrises',id==='rempart'?modeFor(modelId):null,{replace:true});},
      makeShareLink(token){const url=new URL(location.href);url.search='';url.hash=route.href(id,'maitrises',id==='rempart'?modeFor(modelId):null,token);return url.href;}
    });
    key=nextKey;
    if(target.shared){lastShared=target.shared;mounted.loadShared(target.shared);}
    else lastShared='';
  }catch(error){if(host.isConnected)host.textContent='Les maîtrises ne peuvent pas être chargées. Actualisez la page pour réessayer.';console.error('Mastery module:',error);}
}
function schedule(){if(!pending){pending=true;queueMicrotask(sync);}}
function handleRoute(){
  ticket++;
  const target=route.read(),dossier=document.querySelector('#view .atlas-dossier[data-class-id]');
  if(dossier&&target.tab!=='maitrises'&&treeButton(dossier)?.hasAttribute('aria-current')){
    routing=true;dossier.querySelector('[data-world-tab="equipment"], [data-dossier-tab="equipment"]')?.click();routing=false;
  }
  schedule();
}
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-world-tab], [data-dossier-tab]');
  if(button&&!routing){
    const id=button.closest('[data-class-id]')?.dataset.classId;if(!id)return;
    const tab=button.dataset.worldTab||button.dataset.dossierTab;
    route.navigate(id,tab==='tree'?'maitrises':null,tab==='tree'&&id==='rempart'?route.read().mode:null);
    if(tab==='tree')schedule();
  }
});
document.addEventListener('click',event=>{
  const link=event.target.closest('.atlas-class-selector a[href^="#/"]');
  if(link&&route.read().tab==='maitrises'&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){
    const id=link.getAttribute('href').slice(2);if(!/^[a-z0-9-]+$/.test(id))return;
    event.preventDefault();location.hash=route.href(id,'maitrises');
  }
},true);
new MutationObserver(schedule).observe(document.getElementById('view'),{childList:true});
window.addEventListener('hashchange',handleRoute);
// Hash changes also fire during history traversal; handling popstate as well
// would apply a shared build before the legacy hash renderer replaces its host.
schedule();
