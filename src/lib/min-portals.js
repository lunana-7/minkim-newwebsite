// Every route is bidirectional. Portals exist in the side-scrolling world itself.
export const WORLD_LINKS=[['sunny','forest'],['sunny','night'],['sunny','farm'],['sunny','market'],['forest','secret'],['secret','desert'],['desert','night'],['farm','market'],['market','night']];
export function portalsFor(world){const neighbors=WORLD_LINKS.flatMap(([a,b])=>a===world?[b]:b===world?[a]:[]),positions=neighbors.length===4?[160,1900,2750,3340]:neighbors.length===3?[160,1900,3340]:[160,3340];return neighbors.map((to,i)=>({id:`${world}-${to}`,from:world,to,x:positions[i]}));}
export function portalArrival(from,to){const back=portalsFor(to).find(p=>p.to===from);return back?back.x+(back.x<1800?105:-105):90;}
const NPC_IDS=new Set(['pippin','mabel','sage','fern','marina','kip','lumi','moss','saffron','dune','clover','pip','coco','honey','bram','poppy']);
export function npcImage(npc){return `/mini/npcs/${NPC_IDS.has(npc.id)?npc.id:'pippin'}.webp`;}
