import { Item } from "../model/item";
import { OptionType } from "../model/option";
import { TargetType } from '../model/targetType';
import { updateHealth } from '../model/combatant';

import { updateDamage } from '../model/combatant';

export const bomb: Item = {
  type: OptionType.ITEM,
  name: 'Bomb',
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  description: 'Deals damage to target',
  execute: (target, source) => {
    updateDamage(target, 50);
  },
  charges: 1,
  maxCharges: 3,
  castTimeInMs: 250,
  canUseOutsideBattle: false,
};

export const potion: Item = {
  type: OptionType.ITEM,
  name: 'Potion',
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',
  description: 'Heals target',
  execute: (target) => {
    updateHealth(target, 50);
  },
  charges: 3,
  maxCharges: 3,
  castTimeInMs: 250,
  canUseOutsideBattle: true,
};

export const DEFAULT_INVENTORY = [bomb, potion];