const root = '/mini/layers';
export const MINI_SIZE = { width: 128, height: 192 };
export const MINI_OPTIONS = {
  outfit: [
    { id: 'classic', name: 'Cloud dress', image: `${root}/clothes-classic.png?v=parts-3` },
    { id: 'berry', name: 'Berry cardigan', image: `${root}/clothes-berry.png?v=parts-3` },
    { id: 'ocean', name: 'Sailor dress', image: `${root}/clothes-ocean.png?v=parts-3` },
    { id: 'meadow', name: 'Meadow knit', image: `${root}/clothes-meadow.png?v=parts-3` }
  ],
  hair: [
    { id: 'ombre', name: 'Long ombre', image: `${root}/hair-ombre-front.png?v=parts-3` },
    { id: 'bob', name: 'Chestnut bob', image: `${root}/hair-bob-front.png?v=parts-3` },
    { id: 'twintails', name: 'Twin ribbons', image: `${root}/hair-twintails-front.png?v=parts-3` }
  ],
  eyes: [
    { id: 'brown', name: 'Brown', image: `${root}/eyes-brown.png?v=parts-3` },
    { id: 'hazel', name: 'Hazel', image: `${root}/eyes-hazel.png?v=parts-3` },
    { id: 'blue', name: 'Blue', image: `${root}/eyes-blue.png?v=parts-3` }
  ],
  face: [
    { id: 'soft', name: 'Soft smile', image: `${root}/face-soft.png?v=parts-3` },
    { id: 'rosy', name: 'Rosy cheeks', image: `${root}/face-rosy.png?v=parts-3` },
    { id: 'freckles', name: 'Freckles', image: `${root}/face-freckles.png?v=parts-3` }
  ],
  hat: [
    { id: 'none', name: 'None', image: null },
    { id: 'beret', name: 'Berry beret', image: `${root}/hat-beret.png?v=parts-3` },
    { id: 'flower', name: 'Flower clip', image: `${root}/hat-flower.png?v=parts-3` },
    { id: 'crown', name: 'Star crown', image: `${root}/hat-crown.png?v=parts-3` }
  ]
};
export function miniLayerPaths(profile) {
  return {
    body: `${root}/body.png?v=parts-3`,
    leftArm: `${root}/arm-left.png?v=parts-3`, rightArm: `${root}/arm-right.png?v=parts-3`,
    hairBack: `${root}/hair-${profile.hair}-back.png?v=parts-3`, hairFront: `${root}/hair-${profile.hair}-front.png?v=parts-3`,
    face: `${root}/face-${profile.face}.png?v=parts-3`, eyes: `${root}/eyes-${profile.eyes}.png?v=parts-3`,
    clothes: `${root}/clothes-${profile.outfit}.png?v=parts-3`,
    leftSleeve: `${root}/sleeve-${profile.outfit}-left.png?v=parts-3`, rightSleeve: `${root}/sleeve-${profile.outfit}-right.png?v=parts-3`,
    hat: profile.hat === 'none' ? null : `${root}/hat-${profile.hat}.png?v=parts-3`,
    prop: profile.activeActivity ? `${root}/prop-${profile.activeActivity.kind}.png?v=parts-3` : null
  };
}
