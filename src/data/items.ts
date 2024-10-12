import { Item } from "../model/item";
import { OptionType } from "../model/option";
import { TargetType } from '../model/targetType';
import { updateDamage, updateHealth, updateStamina } from '../scenes/battle/Battle';

export const bomb: Item = {
  type: OptionType.ITEM,
  name: 'Bomb',
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',
  description: 'Deals damage to target',
  execute: (target, source) => {
    updateDamage(target, 50, source);
  },
  charges: 0,
  maxCharges: 3,
  castTimeInMs: 250,
};

export const potion: Item = {
  type: OptionType.ITEM,
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
  castTimeInMs: 250,
};