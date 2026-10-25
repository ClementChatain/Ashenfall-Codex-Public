/* One hash route parser shared by the existing Codex renderers and native masteries. */
(() => {
  const read=()=>{
    const raw=location.hash.startsWith('#/')?location.hash.slice(2):'home';
    const [path,query='']=raw.split('?');let id='home';
    try{id=decodeURIComponent(path.split('/')[0]||'home');}catch{}
    if(!/^[a-z0-9-]+$/.test(id))id='home';
    const params=new URLSearchParams(query);
    return {id,tab:path.split('/')[1]==='maitrises'?'maitrises':null,mode:params.get('mode'),shared:params.get('build')};
  };
  const href=(id,tab=null,mode=null,shared=null)=>{
    const params=new URLSearchParams();if(mode)params.set('mode',mode);if(shared)params.set('build',shared);
    return '#/'+encodeURIComponent(id)+(tab==='/maitrises'||tab==='maitrises'?'/maitrises':'')+(params.size?'?'+params:'');
  };
  const navigate=(id,tab=null,mode=null,{replace=false,shared=null}={})=>{
    const target=href(id,tab,mode,shared);if(location.hash!==target)history[replace?'replaceState':'pushState'](null,'',target);
  };
  window.AshenfallRoute=Object.freeze({read,href,navigate});
  document.addEventListener('click',event=>{
    if(event.target.closest('a.skip')){event.preventDefault();const main=document.getElementById('main');if(main){main.tabIndex=-1;main.focus();main.scrollIntoView({block:'start'});}}
  });
})();
