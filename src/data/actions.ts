import { Action, ActionTags } from '../model/action';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { updateDamage, updateHealth, updateStamina } from '../scenes/battle/Battle';

export const attack: Action = {
  type: OptionType.ACTION,
  name: 'Attack',
  staminaCost: 100,
  castTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals damage to target',
  execute: (target, source, potency) => {
    updateDamage(target, potency, source);
  },
  isRestricted: () => { return false },
};

export const ambush: Action = {
  type: OptionType.ACTION,
  name: 'Ambush',
  staminaCost: 100,
  castTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Refunds Stamina, Must be first action taken in battle',
  execute: (target, source, potency) => {
    updateDamage(target, potency, source);
    updateStamina(source, 100)
  },
  isRestricted: (target, source, scene) => { 
    return scene.firstActionTaken;
  },
};


export const idle: Action = {
  type: OptionType.ACTION,
  name: 'Idle',
  staminaCost: 0,
  castTimeInMs: 0,
  potency: 50,
  tags: new Set([ActionTags.DEFEND]),
  targetType: TargetType.SELF,

  description: 'Does Nothing',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  execute: () => {},
  isRestricted: () => { return false },
};
