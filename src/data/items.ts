import { Item } from "../model/item";
import { TargetType } from '../model/targetType';
import { updateDamage, updateHealth, updateStamina } from '../scenes/battle/Battle';

export const bomb: Item = {
    name: 'Bomb',
    targetType: TargetType.SINGLE_TARGET,
    soundKeyName: 'attack',
    imageKeyName: 'attack.gif',
    description: 'Deals damage to target',
    execute: (target) => {
      updateDamage(target, 50);
    },
    charges: 0,
    maxCharges: 3,
};

export const potion: Item = {
  name: 'Potion',
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',
  imageKeyName: 'heal.gif',
  description: 'Heals target',
  execute: (target) => {
    updateHealth(target, 50);
  },
  charges: 3,
  maxCharges: 3,
};