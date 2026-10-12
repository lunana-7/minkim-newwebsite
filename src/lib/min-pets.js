import {drawItem} from './min-world-assets.js';
export const PET_TYPES=[{id:'none',name:'No companion',icon:'—'},{id:'cat',name:'Cat',icon:'🐈'},{id:'dog',name:'Dog',icon:'🐕'}];
export const PET_COLORS=[{id:'cream',name:'Cream',coat:'#f3e4c8',shade:'#d2b895'},{id:'ginger',name:'Ginger',coat:'#dca269',shade:'#a86b48'},{id:'cocoa',name:'Cocoa',coat:'#a17b66',shade:'#705242'},{id:'midnight',name:'Midnight',coat:'#697480',shade:'#444d5b'}];
export const PET_ACCESSORIES=[{id:'none',name:'None'},{id:'bow',name:'Berry bow'},{id:'bandana',name:'Sage bandana'}];
export const DEFAULT_PET={kind:'none',color:'cream',accessory:'none',name:'',follow:true};
export function normalizePet(p){return {kind:PET_TYPES.some(t=>t.id===p?.kind)?p.kind:'none',color:PET_COLORS.some(c=>c.id===p?.color)?p.color:'cream',accessory:PET_ACCESSORIES.some(a=>a.id===p?.accessory)?p.accessory:'none',name:typeof p?.name==='string'?p.name.replace(/[\u0000-\u001f\u007f]/g,'').slice(0,16):'',follow:p?.follow!==false};}
export function petName(p){return p.name?.trim()||(p.kind==='cat'?'Mochi':'Biscuit');}
// Registered full-frame images retain the same forty-by-thirty-two follow footprint.
export function drawPet(ctx,p,time,{x=20,feet=32,scale=1,moving=false,jumping=false,facing=1,reduced=false}={}){
 if(!p||p.kind==='none')return;const frame=moving&&!reduced?Math.floor(time/130)%4:0,bob=moving&&!reduced?frame%2:0;
 ctx.save();ctx.translate(Math.round(x),Math.round(feet-bob));ctx.scale(facing*scale,scale);drawItem(ctx,`pet-${p.kind}-${p.color}-${frame}`,0,0,31);
 if(p.accessory!=='none')drawItem(ctx,p.accessory==='bow'?'prop-flower':'prop-scarf',5,-10,8,12);ctx.restore();
}
