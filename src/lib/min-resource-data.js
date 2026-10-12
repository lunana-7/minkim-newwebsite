export const RESOURCES = {
 herb:{name:'Meadow herbs',icon:'🌿',price:4,amount:2,action:'Pick',tool:'hand'},
 wood:{name:'Timber',icon:'🪵',price:6,amount:2,action:'Chop',tool:'axe'},
 acorn:{name:'Acorns',icon:'🌰',price:5,amount:2,action:'Gather',tool:'hand'},
 shell:{name:'Seashells',icon:'🐚',price:8,amount:2,action:'Collect',tool:'hand'},
 fish:{name:'Harbor fish',icon:'🐟',price:12,amount:1,action:'Fish',tool:'rod'},
 mushroom:{name:'Moon mushrooms',icon:'🍄',price:10,amount:2,action:'Pick',tool:'hand'},
 crystal:{name:'Forest crystals',icon:'💎',price:18,amount:1,action:'Mine',tool:'pickaxe'},
 ore:{name:'Desert ore',icon:'🪨',price:14,amount:2,action:'Mine',tool:'pickaxe'},
 cactus:{name:'Cactus fruit',icon:'🌵',price:9,amount:2,action:'Pick',tool:'hand'},
};
export const GATHER_NODES = [
 {id:'meadow-herbs-a',world:'sunny',resource:'herb',x:420},{id:'meadow-herbs-b',world:'sunny',resource:'herb',x:2560},
 {id:'forest-timber-a',world:'forest',resource:'wood',x:430},{id:'forest-timber-b',world:'forest',resource:'wood',x:1600},{id:'forest-acorns',world:'forest',resource:'acorn',x:2850},
 {id:'harbor-shells-a',world:'night',resource:'shell',x:430},{id:'harbor-shells-b',world:'night',resource:'shell',x:1550},{id:'harbor-fishing',world:'night',resource:'fish',x:2850},
 {id:'secret-mushrooms-a',world:'secret',resource:'mushroom',x:430},{id:'secret-crystals',world:'secret',resource:'crystal',x:1600},{id:'secret-mushrooms-b',world:'secret',resource:'mushroom',x:2850},
 {id:'desert-ore-a',world:'desert',resource:'ore',x:430},{id:'desert-cactus',world:'desert',resource:'cactus',x:1600},{id:'desert-ore-b',world:'desert',resource:'ore',x:2850},
];
export const RESOURCE_IDS=Object.keys(RESOURCES);
export const NODE_IDS=GATHER_NODES.map(node=>node.id);
export const GATHER_COOLDOWN=30000;
export const worldNodes=id=>GATHER_NODES.filter(node=>node.world===id);
export function nodeReadyAt(node,gathering){const last=gathering.cooldowns[node.id];return last?last+GATHER_COOLDOWN:0;}
