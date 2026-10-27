export const STORAGE_KEY='ashenfall-music-v1';
export function formatTime(seconds){if(!Number.isFinite(seconds)||seconds<0)return '0:00';const s=Math.floor(seconds);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
export function preferences(raw,tracks){
 const base={version:1,trackId:tracks[0].id,volume:.45,position:0,shuffle:false,repeat:'off',minimized:false,muted:false};
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==1)return base;
 const found=tracks.find(t=>t.id===raw.trackId),track=found||tracks[0];
 return {...base,trackId:track.id,volume:typeof raw.volume==='number'&&Number.isFinite(raw.volume)?Math.max(0,Math.min(1,raw.volume)):base.volume,position:found&&typeof raw.position==='number'&&Number.isFinite(raw.position)&&raw.position>=0&&raw.position<track.duration?raw.position:0,shuffle:raw.shuffle===true,repeat:['off','all','one'].includes(raw.repeat)?raw.repeat:'off',minimized:raw.minimized===true,muted:raw.muted===true};
}
export function nextId(tracks,current,{shuffle=false,repeat='off',ended=false,played=[],random=Math.random}={}){
 if(ended&&repeat==='one')return current;
 const index=tracks.findIndex(t=>t.id===current);
 if(shuffle){let rest=tracks.filter(t=>t.id!==current&&!played.includes(t.id));if(!rest.length){if(ended&&repeat==='off')return null;rest=tracks.filter(t=>t.id!==current);}return rest.length?rest[Math.min(rest.length-1,Math.max(0,Math.floor(random()*rest.length)))].id:current;}
 if(index+1<tracks.length)return tracks[index+1].id;
 return !ended||repeat==='all'?tracks[0].id:null;
}
export function previousId(tracks,current){const index=tracks.findIndex(t=>t.id===current);return tracks[(index-1+tracks.length)%tracks.length].id;}
