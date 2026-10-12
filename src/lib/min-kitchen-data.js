export const KITCHENS={
 icecream:{name:'Cloud Scoop Ice Cream',job:'Ice cream maker',host:'Coco',icon:'🍦',base:['Milk 200 ml + cream 100 ml + sugar 45 g','Milk 150 ml + yogurt 150 g + sugar 45 g','Fruit 200 g + water 100 ml + sugar 45 g'],flavors:['Vanilla','Strawberry','Chocolate'],toppings:['Cherry + cream','Cookie crumbs','Rainbow sprinkles'],steps:['Measure','Whisk','Chill & churn','Scoop & decorate','Serve'],process:'Chill the base, then churn to create a smooth frozen texture.',target:-6,min:-14,max:4,unit:'°C',duration:8000},
 bakery:{name:'Honeycrumb Bakery',job:'Cake baker',host:'Honey',icon:'🍰',base:['Flour 100 g + butter 60 g + egg + sugar 70 g','Flour 100 g + oil 50 ml + egg + sugar 70 g','Flour 100 g + butter 60 g + milk 80 ml + sugar 70 g'],flavors:['Vanilla','Strawberry','Chocolate'],toppings:['Cherry + cream','Cookie crumbs','Rainbow sprinkles'],steps:['Measure','Fold batter','Bake','Frost & decorate','Serve'],process:'Fold the batter gently, bake the sponge, cool it, then add frosting.',target:175,min:150,max:200,unit:'°C',duration:10000}
};
export const JOB_IDS=Object.keys(KITCHENS);
export function ticketFor(job,count){const i=count%3;return {base:i===2?1:0,flavor:i,topping:(i+1)%3};}
export function newJobs(){return {icecream:{hired:false,completed:0,xp:0,best:0},bakery:{hired:false,completed:0,xp:0,best:0},active:null};}
