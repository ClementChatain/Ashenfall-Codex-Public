import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {library} from '../site/assets/music-player-v1/library.mjs';
import {preferences,formatTime,nextId,previousId} from '../site/assets/music-player-v1/core.mjs';
const tracks=library.tracks;
test('ten original tracks have unique URLs, source checksums and explicit provisional groups',()=>{
 const source=JSON.parse(fs.readFileSync(new URL('../data/music-library-v1.json',import.meta.url)));
 assert.equal(tracks.length,10);assert.equal(new Set(tracks.map(t=>t.id)).size,10);assert.equal(library.groupingStatus,'provisional');
 assert.equal(new Set(tracks.map(t=>t.src)).size,10);
 for(const track of tracks){assert.ok(library.groups.some(g=>g.id===track.group));assert.ok(track.duration>0);const entry=source.files.find(f=>f.id===track.id);assert.ok(entry);const bytes=fs.readFileSync(new URL('../site/'+track.src,import.meta.url));assert.equal(bytes.length,entry.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256);}
});
test('preferences reject invalid saves and never restore playing intent',()=>{
 for(const raw of [null,[],true,{version:99},{version:'1'}])assert.equal(preferences(raw,tracks).trackId,tracks[0].id);
 const pref=preferences({version:1,trackId:'<script>',position:Infinity,volume:NaN,shuffle:'yes',repeat:'bad',playing:true},tracks);
 assert.equal(pref.trackId,tracks[0].id);assert.equal(pref.position,0);assert.equal(pref.volume,.45);assert.equal(pref.shuffle,false);assert.equal(pref.repeat,'off');assert.equal(preferences({version:1,trackId:'removed',position:45},tracks).position,0);assert.equal('playing' in pref,false);
 assert.equal(preferences({version:1,volume:0},tracks).volume,0);assert.equal(preferences({version:1,volume:8},tracks).volume,1);
 assert.equal(preferences({version:1,position:-10},tracks).position,0);assert.equal(preferences({version:1,position:tracks[0].duration},tracks).position,0);
});
test('saved volume, mute, selection and position survive independently of playback',()=>{
 const pref=preferences({version:1,trackId:tracks[2].id,position:42,volume:.2,muted:true,repeat:'one',shuffle:true,minimized:true},tracks);
 assert.equal(pref.trackId,tracks[2].id);assert.equal(pref.position,42);assert.equal(pref.volume,.2);assert.equal(pref.muted,true);assert.equal(pref.repeat,'one');assert.equal(pref.shuffle,true);assert.equal(pref.minimized,true);
});
test('normal completion stops at the last song; manual navigation and repeat are explicit',()=>{
 assert.equal(nextId(tracks,tracks[0].id,{ended:true}),tracks[1].id);
 assert.equal(nextId(tracks,tracks.at(-1).id,{ended:true}),null);
 assert.equal(nextId(tracks,tracks.at(-1).id),tracks[0].id);
 assert.equal(nextId(tracks,tracks.at(-1).id,{ended:true,repeat:'all'}),tracks[0].id);
 assert.equal(nextId(tracks,tracks[3].id,{ended:true,repeat:'one'}),tracks[3].id);
 assert.equal(nextId(tracks,tracks[3].id,{repeat:'one'}),tracks[4].id);
 assert.equal(previousId(tracks,tracks[0].id),tracks.at(-1).id);
});
test('shuffle avoids current/played tracks and honors end-of-playlist without infinite repeat',()=>{
 assert.equal(nextId(tracks,tracks[0].id,{shuffle:true,played:[tracks[0].id,tracks[1].id],random:()=>0}),tracks[2].id);
 assert.equal(nextId(tracks,tracks[0].id,{shuffle:true,played:tracks.map(t=>t.id),ended:true}),null);
 assert.notEqual(nextId(tracks,tracks[0].id,{shuffle:true,played:tracks.map(t=>t.id),repeat:'all',ended:true}),tracks[0].id);
 assert.equal(nextId([tracks[0]],tracks[0].id,{shuffle:true,ended:true}),null);
});
test('duration formatting handles unavailable metadata and hour-long tracks',()=>{
 assert.equal(formatTime(NaN),'0:00');assert.equal(formatTime(-1),'0:00');assert.equal(formatTime(181.99),'3:01');assert.equal(formatTime(3601),'60:01');
});
