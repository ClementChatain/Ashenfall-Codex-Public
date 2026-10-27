import {library} from './library.mjs?v=music-polish-v2';
import {STORAGE_KEY,preferences,formatTime,nextId,previousId} from './core.mjs?v=music-polish-v2';
const ICONS={play:'<path d="m9 5 11 7-11 7Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',previous:'<path d="M6 5v14m13-14L8 12l11 7Z"/>',next:'<path d="M18 5v14M5 5l11 7-11 7Z"/>',list:'<path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',down:'<path d="m6 9 6 6 6-6"/>',volume:'<path d="m11 5-6 4H2v6h3l6 4Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',muted:'<path d="m11 5-6 4H2v6h3l6 4Zm5 4 6 6m0-6-6 6"/>',shuffle:'<path d="M3 6h3c5 0 6 12 11 12h4m-4-4 4 4-4 4M3 18h3c2 0 3-2 5-6m3-4c1-2 2-2 4-2h3m-4-4 4 4-4 4"/>',repeat:'<path d="m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3"/>'};
const icon=name=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+ICONS[name]+'</svg>';
const seal='<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor"><circle cx="24" cy="24" r="20"/><path d="m24 2 4 7-4 4-4-4ZM24 46l-4-7 4-4 4 4ZM2 24l7-4 4 4-4 4ZM46 24l-7 4-4-4 4-4ZM17 14l15-3v20m-15-14v17m0-17 15-3"/><ellipse cx="13" cy="35" rx="4" ry="3"/><ellipse cx="28" cy="32" rx="4" ry="3"/></svg>';
let saved;try{saved=JSON.parse(localStorage.getItem(STORAGE_KEY));}catch{}
let prefs=preferences(saved,library.tracks),current=library.tracks.find(t=>t.id===prefs.trackId),filter='all',wanted=false,request=0,saveAt=0,history=[],sourceId=null,shufflePlayed=[prefs.trackId],lastVolume=prefs.volume||.45,resumeAt=prefs.position;
const root=document.createElement('section');root.className='codex-music';root.setAttribute('aria-label','Lecteur des musiques du Codex');root.dataset.minimized=String(prefs.minimized);
root.innerHTML='<button type="button" class="music-launcher" data-music="restore" aria-label="Ouvrir le lecteur musical">'+seal+'<span>Musiques</span><i aria-hidden="true"></i></button><div class="music-panel" id="codex-music-panel" hidden><div class="music-panel-heading"><div><span class="music-eyebrow">LES ÉCHOS D’ASHENFALL</span><h2>Musiques du Codex</h2></div><button type="button" data-music="playlist" aria-label="Fermer la playlist">'+icon('close')+'</button></div><p class="music-library-note">10 morceaux · ambiances proposées, classement ajustable</p><div class="music-filters" role="group" aria-label="Filtrer par ambiance"></div><ol class="music-tracklist" aria-label="Morceaux disponibles"></ol><div class="music-options"><button type="button" data-music="shuffle" aria-label="Lecture aléatoire" aria-pressed="false">'+icon('shuffle')+'</button><button type="button" data-music="repeat" aria-label="Répétition désactivée">'+icon('repeat')+'<span data-repeat-text>Non</span></button><button type="button" data-music="mute" aria-label="Couper le son">'+icon('volume')+'</button><label class="music-volume-label">Volume<input type="range" data-music-volume min="0" max="1" step="0.01" aria-label="Volume de la musique"></label></div></div><div class="music-dock"><div class="music-seal" aria-hidden="true">'+seal+'</div><div class="music-now"><span class="music-eyebrow">MUSIQUES DU CODEX</span><strong data-music-title></strong><span data-music-group></span></div><div class="music-transport"><button type="button" data-music="previous" aria-label="Morceau précédent">'+icon('previous')+'</button><button type="button" class="music-play" data-music="play" aria-label="Lancer la musique">'+icon('play')+'</button><button type="button" data-music="next" aria-label="Morceau suivant">'+icon('next')+'</button></div><div class="music-dock-tools"><button type="button" data-music="playlist" aria-label="Ouvrir la playlist" aria-expanded="false" aria-controls="codex-music-panel">'+icon('list')+'</button><button type="button" data-music="minimize" aria-label="Réduire le lecteur">'+icon('down')+'</button></div><p class="music-feedback" data-music-status role="status" aria-live="polite"></p><div class="music-timeline"><span data-music-elapsed>0:00</span><input type="range" data-music-seek min="0" max="1" step="0.1" value="0" aria-label="Position dans le morceau" disabled><span data-music-duration>0:00</span></div></div>';
document.body.append(root);document.body.classList.add('has-codex-music');
const audio=document.createElement('audio');audio.preload='none';audio.setAttribute('aria-hidden','true');audio.dataset.codexAudio='';root.append(audio);
const $=selector=>root.querySelector(selector),panel=$('.music-panel'),seek=$('[data-music-seek]'),volume=$('[data-music-volume]');
$('.music-library-note').textContent=library.tracks.length+' morceaux · ambiances proposées';
function status(text){$('[data-music-status]').textContent=text;}
function save(){prefs={...prefs,trackId:current.id,volume:audio.volume,muted:audio.muted,position:Number.isFinite(audio.currentTime)&&audio.currentTime>0?audio.currentTime:resumeAt};try{localStorage.setItem(STORAGE_KEY,JSON.stringify(prefs));}catch{}}
function paintState(){
 const playing=!audio.paused&&!audio.ended;root.dataset.playing=String(playing);volume.style.setProperty('--music-progress',(audio.volume*100)+'%');
 const button=$('[data-music="play"]');button.innerHTML=icon(playing?'pause':'play');button.setAttribute('aria-label',playing?'Mettre la musique en pause':'Lancer la musique');
 $('[data-music="shuffle"]').setAttribute('aria-pressed',String(prefs.shuffle));
 const repeatText={off:'Non',all:'Tout',one:'1 titre'}[prefs.repeat];$('[data-repeat-text]').textContent=repeatText;$('[data-music="repeat"]').setAttribute('aria-label','Répétition : '+repeatText);
 const mute=$('[data-music="mute"]');mute.innerHTML=icon(audio.muted||audio.volume===0?'muted':'volume');mute.setAttribute('aria-label',audio.muted||audio.volume===0?'Rétablir le son':'Couper le son');
 for(const item of root.querySelectorAll('[data-track-id]')){const selected=item.dataset.trackId===current.id;if(selected)item.setAttribute('aria-current','true');else item.removeAttribute('aria-current');item.querySelector('.music-track-state').textContent=selected?(playing?'En lecture':'Sélectionné'):'';}
 if('mediaSession' in navigator)try{navigator.mediaSession.playbackState=playing?'playing':'paused';}catch{}
}
function paintTrack(){
 $('[data-music-title]').textContent=current.title;$('[data-music-title]').title=current.title;
 $('[data-music-group]').textContent=library.groups.find(g=>g.id===current.group).label;
 $('[data-music-duration]').textContent=formatTime(current.duration);$('[data-music-elapsed]').textContent=formatTime(resumeAt);
 seek.max=String(current.duration);seek.value=String(resumeAt);seek.style.setProperty('--music-progress',(resumeAt/current.duration*100)+'%');seek.disabled=true;seek.setAttribute('aria-valuetext',formatTime(resumeAt)+' sur '+formatTime(current.duration));
 if('mediaSession' in navigator&&'MediaMetadata' in window)navigator.mediaSession.metadata=new MediaMetadata({title:current.title,album:'Musiques du Codex Ashenfall'});
 paintState();
}
function renderList(){
 const filters=$('.music-filters');filters.replaceChildren();
 for(const group of [{id:'all',label:'Tout'},...library.groups]){const button=document.createElement('button');button.type='button';button.dataset.musicFilter=group.id;button.textContent=group.label;button.setAttribute('aria-pressed',String(filter===group.id));filters.append(button);}
 const list=$('.music-tracklist');list.replaceChildren();
 for(const track of library.tracks.filter(t=>filter==='all'||t.group===filter)){
  const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.dataset.trackId=track.id;
  const count=document.createElement('span');count.className='music-track-number';count.textContent=String(library.tracks.indexOf(track)+1).padStart(2,'0');
  const info=document.createElement('span');info.className='music-track-info';const name=document.createElement('strong');name.textContent=track.title;const detail=document.createElement('small');detail.textContent=library.groups.find(g=>g.id===track.group).label;info.append(name,detail);
  const duration=document.createElement('span');duration.className='music-track-length';duration.textContent=formatTime(track.duration);const state=document.createElement('span');state.className='music-track-state';info.append(state);button.append(count,info,duration);li.append(button);list.append(li);
 }
 paintState();
}
function playlist(open=!panel.hidden){panel.hidden=open;const expanded=!panel.hidden;const toggle=$('.music-dock-tools [data-music="playlist"]');toggle.setAttribute('aria-expanded',String(expanded));toggle.setAttribute('aria-label',expanded?'Fermer la playlist':'Ouvrir la playlist');if(expanded)$('.music-filters button').focus();else toggle.focus();}
async function play(){
 if(sourceId!==current.id||audio.error){if(audio.error)resumeAt=audio.currentTime||resumeAt;audio.src=new URL(current.src,document.baseURI).href;sourceId=current.id;}
 if(audio.ended){audio.currentTime=0;resumeAt=0;if(prefs.shuffle&&shufflePlayed.length>=library.tracks.length)shufflePlayed=[current.id];}
 wanted=true;const token=++request;status('Chargement du morceau…');
 try{await audio.play();if(token!==request)return;status('');}
 catch(error){if(token!==request||error.name==='AbortError')return;wanted=false;status(error.name==='NotAllowedError'?'Appuyez sur Lecture pour lancer ce morceau.':'Lecture impossible. Réessayez ou choisissez un autre morceau.');paintState();}
}
function pause(){wanted=false;request++;audio.pause();save();paintState();}
function select(id,{start=false,remember=true}={}){
 const track=library.tracks.find(t=>t.id===id);if(!track)return;
 if(track.id===current.id){if(start)play();return;}
 if(remember)history.push(current.id);if(history.length>50)history.shift();
 request++;audio.pause();current=track;if(prefs.shuffle&&!shufflePlayed.includes(track.id))shufflePlayed.push(track.id);resumeAt=0;sourceId=null;audio.removeAttribute('src');audio.load();status('');paintTrack();save();if(start)play();else wanted=false;
}
function next(ended=false){const id=nextId(library.tracks,current.id,{shuffle:prefs.shuffle,repeat:prefs.repeat,ended,played:shufflePlayed});if(id===null){pause();status('Fin de la playlist.');return;}if(id===current.id){audio.currentTime=0;resumeAt=0;play();return;}if(prefs.shuffle&&shufflePlayed.length>=library.tracks.length)shufflePlayed=[current.id];select(id,{start:ended||wanted||!audio.paused});}
function previous(){if(audio.currentTime>3){audio.currentTime=0;resumeAt=0;save();return;}const id=history.pop()||previousId(library.tracks,current.id);select(id,{start:wanted||!audio.paused,remember:false});}
root.addEventListener('click',event=>{
 const track=event.target.closest('[data-track-id]');if(track){select(track.dataset.trackId,{start:true});return;}
 const group=event.target.closest('[data-music-filter]');if(group){filter=group.dataset.musicFilter;renderList();root.querySelector('[data-music-filter="'+filter+'"]').focus();return;}
 const button=event.target.closest('[data-music]');if(!button)return;
 switch(button.dataset.music){
 case 'play':audio.paused?play():pause();break;
 case 'previous':previous();break;
 case 'next':next();break;
 case 'playlist':playlist();break;
 case 'shuffle':prefs.shuffle=!prefs.shuffle;shufflePlayed=[current.id];save();paintState();break;
 case 'repeat':prefs.repeat={off:'all',all:'one',one:'off'}[prefs.repeat];save();paintState();break;
 case 'mute':if(audio.muted||audio.volume===0){audio.muted=false;if(audio.volume===0)audio.volume=lastVolume;}else{lastVolume=audio.volume;audio.muted=true;}volume.value=String(audio.volume);save();paintState();break;
 case 'minimize':playlist(true);prefs.minimized=true;root.dataset.minimized='true';save();$('.music-launcher').focus();break;
 case 'restore':prefs.minimized=false;root.dataset.minimized='false';save();$('[data-music="play"]').focus();break;
 }
});
root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopPropagation();playlist(true);}});
volume.addEventListener('input',()=>{audio.volume=Number(volume.value);if(audio.volume>0){lastVolume=audio.volume;audio.muted=false;}save();paintState();});
seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)){audio.currentTime=Math.min(audio.duration,Math.max(0,Number(seek.value)));resumeAt=audio.currentTime;save();}});
audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(audio.duration)){seek.max=String(audio.duration);seek.disabled=false;$('[data-music-duration]').textContent=formatTime(audio.duration);if(resumeAt>0){audio.currentTime=Math.min(resumeAt,Math.max(0,audio.duration-1));resumeAt=0;}}});
audio.addEventListener('timeupdate',()=>{seek.style.setProperty('--music-progress',(audio.duration?audio.currentTime/audio.duration*100:0)+'%');if(!seek.matches(':active'))seek.value=String(audio.currentTime);$('[data-music-elapsed]').textContent=formatTime(audio.currentTime);seek.setAttribute('aria-valuetext',formatTime(audio.currentTime)+' sur '+formatTime(audio.duration||current.duration));if(Date.now()-saveAt>5000){saveAt=Date.now();save();}});
audio.addEventListener('play',()=>{wanted=true;paintState();});audio.addEventListener('playing',()=>status(''));audio.addEventListener('pause',()=>{save();paintState();});audio.addEventListener('ended',()=>{wanted=true;next(true);});
audio.addEventListener('error',()=>{wanted=false;request++;status('Ce morceau ne peut pas être chargé. Réessayez ou choisissez un autre titre.');paintState();});
window.addEventListener('pagehide',save);
if('mediaSession' in navigator){for(const [key,handler] of Object.entries({play, pause,previoustrack:previous,nexttrack:()=>next(),seekto:event=>{if(Number.isFinite(audio.duration))audio.currentTime=Math.min(audio.duration,Math.max(0,event.seekTime));}}))try{navigator.mediaSession.setActionHandler(key,handler);}catch{}}
audio.volume=prefs.volume;audio.muted=prefs.muted;volume.value=String(prefs.volume);renderList();paintTrack();
