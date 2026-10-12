import { WORLDS } from './min-worlds.js';
import { RESOURCES } from './min-resource-data.js';
import { CROPS } from './min-farming.js';
import { getProfile, updateProfile } from './min-profile.js';

export const FRIENDS=Object.values(WORLDS).flatMap(world=>world.npcs.map(npc=>({...npc,worldName:world.name})));
export const friendById=id=>FRIENDS.find(npc=>npc.id===id);
export const affectionFor=(profile,id)=>profile.friendship?.affection?.[id]||0;

export function giftOptions(profile=getProfile()) {
  return [
    ...Object.entries(RESOURCES).map(([id,item])=>({key:`resource-${id}`,name:item.name,image:`/game-art/items/resource-${id}.png`,count:profile.gathering.inventory[id]||0,kind:'resource',id})),
    ...Object.entries(CROPS).map(([id,item])=>({key:`produce-${id}`,name:item.name,image:`/game-art/items/crop-${id}-harvest.png`,count:profile.farm.produce[id]||0,kind:'produce',id})),
  ].filter(item=>item.count>0);
}

export function giveGift(npcId,giftKey) {
  if(!friendById(npcId))return null;
  const profile=getProfile(),item=giftOptions(profile).find(option=>option.key===giftKey);
  if(!item)return null;
  const amount=item.kind==='produce'?15:10;
  const before=affectionFor(profile,npcId),after=Math.min(100,before+amount);
  const patch={friendship:{...profile.friendship,affection:{...profile.friendship.affection,[npcId]:after}}};
  if(item.kind==='produce')patch.farm={...profile.farm,produce:{...profile.farm.produce,[item.id]:item.count-1}};
  else patch.gathering={...profile.gathering,inventory:{...profile.gathering.inventory,[item.id]:item.count-1}};
  updateProfile(patch);
  return {item,amount:after-before,affection:after};
}

export function callFriend(id) {
  const profile=getProfile();
  if(id!==null&&(!friendById(id)||affectionFor(profile,id)<10))return false;
  updateProfile({friendship:{...profile.friendship,companion:id}});
  return true;
}

export function playWithFriend() {
  const profile=getProfile(),id=profile.friendship.companion;
  if(!id||!friendById(id))return null;
  const before=affectionFor(profile,id),after=Math.min(100,before+3);
  updateProfile({friendship:{...profile.friendship,affection:{...profile.friendship.affection,[id]:after}}});
  return {friend:friendById(id),affection:after};
}
