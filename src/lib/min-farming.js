import { getProfile, updateProfile } from './min-profile.js';
export const CROPS = {
  carrot:{name:'Carrot',icon:'🥕',seedPrice:3,sellPrice:10,growMs:60000,yield:2,color:'#e7a15c'},
  wheat:{name:'Wheat',icon:'🌾',seedPrice:5,sellPrice:14,growMs:90000,yield:2,color:'#ddc276'},
  strawberry:{name:'Strawberry',icon:'🍓',seedPrice:8,sellPrice:22,growMs:120000,yield:2,color:'#d9778e'},
};
export function cropReadyAt(plot) { return plot ? plot.plantedAt + CROPS[plot.crop].growMs*(plot.watered?.75:1) : 0; }
export function plantCrop(index,crop) {
  const p=getProfile(),farm=p.farm;
  if(!CROPS[crop]||index<0||index>5||farm.plots[index])return 'Choose an empty plot.';
  if(farm.seeds[crop]<1)return `No ${CROPS[crop].name.toLowerCase()} seeds left. Buy more at Berry Market.`;
  const plots=[...farm.plots];plots[index]={crop,plantedAt:Date.now(),watered:false};
  updateProfile({farm:{...farm,plots,seeds:{...farm.seeds,[crop]:farm.seeds[crop]-1}}});
  return `${CROPS[crop].name} planted! Water it once for faster growth and an extra crop.`;
}
export function waterCrop(index) {
  const p=getProfile(),farm=p.farm,plot=farm.plots[index];
  if(!plot)return 'Plant a seed first.';
  if(Date.now()>=cropReadyAt(plot))return 'This crop is ready to harvest!';
  if(plot.watered)return 'Already watered. Your crop is growing happily.';
  const plots=[...farm.plots];plots[index]={...plot,watered:true};updateProfile({farm:{...farm,plots}});return 'Watered! Growth is 25% faster, and your harvest gets one extra crop. ♡';
}
export function harvestCrop(index) {
  const p=getProfile(),farm=p.farm,plot=farm.plots[index];
  if(!plot||Date.now()<cropReadyAt(plot))return 'This crop is still growing.';
  const crop=CROPS[plot.crop],amount=crop.yield+Number(plot.watered),plots=[...farm.plots];plots[index]=null;
  updateProfile({points:p.points+2,farm:{...farm,plots,harvested:farm.harvested+amount,produce:{...farm.produce,[plot.crop]:farm.produce[plot.crop]+amount}}});return `Harvested ${amount} ${crop.name.toLowerCase()}! +2 points. Sell your produce at Berry Market.`;
}
export function buySeed(crop) {
  const p=getProfile(),farm=p.farm,item=CROPS[crop];if(!item)return '';
  if(farm.coins<item.seedPrice)return 'Not enough farm coins. Sell your harvest to earn more.';
  updateProfile({farm:{...farm,coins:farm.coins-item.seedPrice,seeds:{...farm.seeds,[crop]:farm.seeds[crop]+1}}});return `Bought one ${item.name.toLowerCase()} seed.`;
}
export function sellProduce(crop) {
  const p=getProfile(),farm=p.farm,item=CROPS[crop];if(!item)return '';
  const amount=farm.produce[crop];if(!amount)return 'Grow and harvest this crop before selling it.';
  const earned=amount*item.sellPrice;
  updateProfile({farm:{...farm,coins:farm.coins+earned,sold:farm.sold+amount,produce:{...farm.produce,[crop]:0}}});return `Sold ${amount} ${item.name.toLowerCase()} for ${earned} farm coins!`;
}
