const root = '/mini/layers';
const looks = '/mini/rig-v2';
export const MINI_SIZE = { width:192, height:192 };
export const MINI_OPTIONS = {
  outfit:[{id:'classic',name:'Original cream dress',image:`${looks}/ombre-classic.png?v=rig-2-final`},{id:'berry',name:'Berry cardigan',image:`${looks}/ombre-berry.png?v=rig-2-final`},{id:'ocean',name:'Sailor dress',image:`${looks}/ombre-ocean.png?v=rig-2-final`},{id:'meadow',name:'Meadow knit',image:`${looks}/ombre-meadow.png?v=rig-2-final`}],
  hair:[{id:'ombre',name:'Original long ombre',image:`${looks}/ombre-classic.png?v=rig-2-final`},{id:'bob',name:'Chestnut bob',image:`${looks}/bob-classic.png?v=rig-2-final`},{id:'twintails',name:'Twin ribbons',image:`${looks}/twintails-classic.png?v=rig-2-final`}],
  eyes:[{id:'brown',name:'Original brown',image:'/favicon-mini.png?v=rig-2-final'},{id:'hazel',name:'Hazel',image:'/favicon-mini.png?v=rig-2-final'},{id:'blue',name:'Blue',image:'/favicon-mini.png?v=rig-2-final'}],
  face:[{id:'soft',name:'Original smile',image:'/favicon-mini.png?v=rig-2-final'},{id:'rosy',name:'Rosy cheeks',image:'/favicon-mini.png?v=rig-2-final'},{id:'freckles',name:'Freckles',image:'/favicon-mini.png?v=rig-2-final'}],
  hat:[{id:'none',name:'None',image:null},{id:'beret',name:'Berry beret',image:`${root}/hat-beret.png?v=parts-3`},{id:'flower',name:'Flower clip',image:`${root}/hat-flower.png?v=parts-3`},{id:'crown',name:'Star crown',image:`${root}/hat-crown.png?v=parts-3`}],
};
export function miniLayerPaths(profile) {
  return {skin:`${looks}/${profile.hair}-${profile.outfit}.png?v=rig-2-final`,hat:profile.hat==='none'?null:`${root}/hat-${profile.hat}.png?v=parts-3`,studyProp:`${root}/prop-study.png?v=parts-3`,coffeeProp:`${root}/prop-coffee.png?v=parts-3`,prop:profile.activeActivity?`${root}/prop-${profile.activeActivity.kind}.png?v=parts-3`:null};
}

export function miniWalkPaths(profile){return Array.from({length:6},(_,frame)=>`/mini/walk-cycles/${profile.hair}-${profile.outfit}-${frame}.png?v=full-walk-3`);}
