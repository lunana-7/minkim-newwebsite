// Every route is bidirectional. Portals exist in the side-scrolling world itself.
export const WORLD_LINKS=[['sunny','forest'],['sunny','night'],['sunny','farm'],['sunny','market'],['forest','secret'],['secret','desert'],['desert','night'],['farm','market'],['market','night']];
export function portalsFor(world){const neighbors=WORLD_LINKS.flatMap(([a,b])=>a===world?[b]:b===world?[a]:[]),positions=neighbors.length===4?[160,1900,2750,3340]:neighbors.length===3?[160,1900,3340]:[160,3340];return neighbors.map((to,i)=>({id:`${world}-${to}`,from:world,to,x:positions[i]}));}
export function portalArrival(from,to){const back=portalsFor(to).find(p=>p.to===from);return back?back.x+(back.x<1800?105:-105):90;}
export const NPC_LOOKS={
 pippin:{hair:'bob',outfit:'meadow',accessory:'star'},mabel:{hair:'ombre',outfit:'berry',accessory:'apron'},
 sage:{hair:'ombre',outfit:'ocean',accessory:'book'},fern:{hair:'bob',outfit:'meadow',accessory:'satchel'},
 marina:{hair:'ombre',outfit:'ocean',accessory:'sailor'},kip:{hair:'bob',outfit:'berry',accessory:'satchel'},
 lumi:{hair:'ombre',outfit:'berry',accessory:'crystal'},moss:{hair:'ombre',outfit:'meadow',accessory:'flower'},
 saffron:{hair:'bob',outfit:'classic',accessory:'scarf'},dune:{hair:'ombre',outfit:'meadow',accessory:'satchel'},
 clover:{hair:'ombre',outfit:'classic',accessory:'apron'},pip:{hair:'bob',outfit:'ocean',accessory:'flower'},
 coco:{hair:'bob',outfit:'ocean',accessory:'chef'},honey:{hair:'bob',outfit:'classic',accessory:'chef'},
 bram:{hair:'ombre',outfit:'ocean',accessory:'apron'},poppy:{hair:'bob',outfit:'berry',accessory:'flower'},
};
export function npcImage(npc){const look=NPC_LOOKS[npc.id]||NPC_LOOKS.pippin;return `/mini/rig-v2/${look.hair}-${look.outfit}.png?v=rig-2-final`;}
