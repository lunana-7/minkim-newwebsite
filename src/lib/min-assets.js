const root = '/mini/layers';
const looks = '/mini/looks';
export const MINI_SIZE = { width:128, height:192 };
export const MINI_OPTIONS = {
  outfit:[{id:'classic',name:'Original cream dress',image:`${looks}/ombre-classic.png?v=unity-1`},{id:'berry',name:'Berry cardigan',image:`${looks}/ombre-berry.png?v=unity-1`},{id:'ocean',name:'Sailor dress',image:`${looks}/ombre-ocean.png?v=unity-1`},{id:'meadow',name:'Meadow knit',image:`${looks}/ombre-meadow.png?v=unity-1`}],
  hair:[{id:'ombre',name:'Original long ombre',image:`${looks}/ombre-classic.png?v=unity-1`},{id:'bob',name:'Chestnut bob',image:`${looks}/bob-classic.png?v=unity-1`},{id:'twintails',name:'Twin ribbons',image:`${looks}/twintails-classic.png?v=unity-1`}],
  eyes:[{id:'brown',name:'Original brown',image:'/favicon-mini.png?v=unity-1'},{id:'hazel',name:'Hazel',image:'/favicon-mini.png?v=unity-1'},{id:'blue',name:'Blue',image:'/favicon-mini.png?v=unity-1'}],
  face:[{id:'soft',name:'Original smile',image:'/favicon-mini.png?v=unity-1'},{id:'rosy',name:'Rosy cheeks',image:'/favicon-mini.png?v=unity-1'},{id:'freckles',name:'Freckles',image:'/favicon-mini.png?v=unity-1'}],
  hat:[{id:'none',name:'None',image:null},{id:'beret',name:'Berry beret',image:`${root}/hat-beret.png?v=parts-3`},{id:'flower',name:'Flower clip',image:`${root}/hat-flower.png?v=parts-3`},{id:'crown',name:'Star crown',image:`${root}/hat-crown.png?v=parts-3`}],
};
export function miniLayerPaths(profile) {
  return {skin:`${looks}/${profile.hair}-${profile.outfit}.png?v=unity-1`,hat:profile.hat==='none'?null:`${root}/hat-${profile.hat}.png?v=parts-3`,studyProp:`${root}/prop-study.png?v=parts-3`,prop:profile.activeActivity?`${root}/prop-${profile.activeActivity.kind}.png?v=parts-3`:null};
}
