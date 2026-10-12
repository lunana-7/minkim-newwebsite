export const ROOM_THEMES=[
 {id:'strawberry',name:'Strawberry afternoon',image:'/room-art/dessert-room.webp'},
 {id:'mint',name:'Mint garden morning',image:'/room-art/mint-room.webp'},
 {id:'lavender',name:'Lavender moonlight',image:'/room-art/lavender-room.webp'},
 {id:'cocoa',name:'Cocoa bakery',image:'/room-art/cocoa-room.webp'},
];
export const ROOM_ITEMS=[
 {id:'sofa',name:'Strawberry cake sofa',category:'strawberry',x:305,y:400,w:196},
 {id:'table',name:'Cupcake coffee table',category:'strawberry',x:480,y:440,w:138},
 {id:'chair',name:'Cookie armchair',category:'cocoa',x:665,y:485,w:140},
 {id:'shelf',name:'Macaron bookshelf',category:'lavender',x:610,y:330,w:128},
 {id:'plant',name:'Strawberry teacup plant',category:'mint',x:755,y:407,w:85},
 {id:'cart',name:'Afternoon tea cart',category:'cocoa',x:210,y:475,w:105},
 {id:'cushion',name:'Strawberry floor cushion',category:'strawberry',x:410,y:500,w:105,visible:false,crop:[80,107,1171,995]},
 {id:'book',name:'Storybook stand',category:'lavender',x:560,y:505,w:100,visible:false,crop:[283,80,989,848]},
 {id:'petbed',name:'Biscuit pet bed',category:'cocoa',x:735,y:525,w:105,visible:false,crop:[194,138,1149,782]},
 {id:'lamp',name:'Macaron floor lamp',category:'lavender',x:160,y:395,w:65,visible:false,crop:[167,30,692,1455]},
];
export const ROOM_RUGS=[
 {id:'strawberry',name:'Strawberry shortcake',image:'/room-art/rug-strawberry.webp'},
 {id:'mint',name:'Mint garden',image:'/room-art/rug-mint.webp'},
 {id:'lavender',name:'Lavender moon',image:'/room-art/rug-lavender.webp'},
 {id:'cocoa',name:'Cocoa cookie',image:'/room-art/rug-cocoa.webp'},
 {id:'blueberry',name:'Blueberry tea',image:'/room-art/rug-blueberry.webp'},
];
export const newRoom=()=>({name:'Mini’s Dessert Room',theme:'strawberry',rug:'strawberry',items:ROOM_ITEMS.filter(item=>item.visible!==false).map(item=>({...item,instanceId:`${item.id}-1`,visible:true}))});
export function normalizeRoom(value){
 const room=newRoom();
 room.name=typeof value?.name==='string'&&value.name.trim()?value.name.slice(0,32):room.name;
 room.theme=ROOM_THEMES.some(theme=>theme.id===value?.theme)?value.theme:room.theme;
 room.rug=value?.rug==='none'||ROOM_RUGS.some(rug=>rug.id===value?.rug)?value.rug:room.rug;
 if(Array.isArray(value?.items)){
  const used=new Set();
  room.items=value.items.slice(0,60).flatMap((saved,index)=>{
   const template=ROOM_ITEMS.find(item=>item.id===saved?.id);
   if(!template||saved.visible===false)return[];
   let instanceId=typeof saved.instanceId==='string'&&/^[a-z0-9-]{1,64}$/i.test(saved.instanceId)?saved.instanceId:`${template.id}-${index+1}`;
   if(used.has(instanceId))instanceId=`${template.id}-${index+1}`;
   used.add(instanceId);
   return[{...template,instanceId,visible:true,x:Number.isFinite(saved.x)?Math.max(120,Math.min(840,saved.x)):template.x,y:Number.isFinite(saved.y)?Math.max(280,Math.min(545,saved.y)):template.y}];
  });
 }
 return room;
}
