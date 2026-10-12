export const ROOM_ITEMS=[
 {id:'sofa',name:'Strawberry cake sofa',x:305,y:400,w:196},
 {id:'table',name:'Cupcake coffee table',x:480,y:440,w:138},
 {id:'chair',name:'Cookie armchair',x:665,y:485,w:140},
 {id:'shelf',name:'Macaron bookshelf',x:610,y:330,w:128},
 {id:'plant',name:'Strawberry teacup plant',x:755,y:407,w:85},
 {id:'cart',name:'Afternoon tea cart',x:210,y:475,w:105},
];
export const newRoom=()=>({name:'Mini’s Dessert Room',theme:'strawberry',rug:'strawberry',items:ROOM_ITEMS.map(i=>({...i,visible:true}))});
export function normalizeRoom(value){const room=newRoom();room.name=typeof value?.name==='string'&&value.name.trim()?value.name.slice(0,32):room.name;room.theme=['strawberry','mint','lavender'].includes(value?.theme)?value.theme:room.theme;room.rug=['none','strawberry','mint','lavender'].includes(value?.rug)?value.rug:room.rug;room.items=ROOM_ITEMS.map(item=>{const saved=value?.items?.find(i=>i.id===item.id);return{...item,x:Number.isFinite(saved?.x)?Math.max(120,Math.min(840,saved.x)):item.x,y:Number.isFinite(saved?.y)?Math.max(280,Math.min(545,saved.y)):item.y,visible:saved?.visible!==false};});return room;}
