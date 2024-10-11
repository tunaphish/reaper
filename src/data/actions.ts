import { Action, ActionTags } from '../model/action';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { updateDamage, updateHealth, updateStamina } from '../scenes/battle/Battle';

export const slash: Action = {
  type: OptionType.ACTION,
  name: 'Slash',
  staminaCost: 100,
  castTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals damage to target',
  execute: (target, source) => {
    updateDamage(target, 50, source);
  },
};

export const finisher: Action = {
  type: OptionType.ACTION,
  name: 'Finisher',
  staminaCost: 100,
  castTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Immediately applies all stacked damage',
  execute: (target) => {
    if (target) {
      target.health = Math.max(0, target.health - target.bleed);
      target.bleed = 0;
    }
  },
};

export const assault: Action = {
  type: OptionType.ACTION,
  name: 'Assault',
  staminaCost: 100,
  castTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals double damage, but hurts yourself',
  execute: (target, source) => {
    updateDamage(target, 50, source);
    updateDamage(source, 50, source);
  },
};

export const ankleSlice: Action = {
  type: OptionType.ACTION,
  name: 'Ankle Slice',
  staminaCost: 150,
  castTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals damage and reduces stamina for target',
  execute: (target, source) => {
    updateDamage(target, 50, source);
    updateStamina(target, -50);
  },
};

export const drain: Action = {
  type: OptionType.ACTION,
  name: 'Drain',
  staminaCost: 150,
  castTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Drains health',
  execute: (target, source) => {
    updateDamage(target, 50, source);
    updateHealth(source, 25);
  },
};

export const block: Action = {
  type: OptionType.ACTION,
  name: 'Block',
  staminaCost: 50,
  castTimeInMs: 100,
  potency: 50,
  tags: new Set([ActionTags.DEFEND]),
  targetType: TargetType.SELF,

  description:
    'Stops stamina regeneration, converts all additional to reduce stamina, stops stacked damage from applying',
  // eslint-disable-next-line @typescript-eslint/no-empty-function,
  execute: () => {},
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
};

export const heal: Action = {
  type: OptionType.ACTION,
  name: 'Heal',
  staminaCost: 100,
  castTimeInMs: 200,
  potency: 50,
  tags: new Set([ActionTags.HEAL]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',
  imageKeyName: 'heal.gif',

  description: 'Restores health to target',
  execute: (target) => {
    const HEALTH = 50;
    target.health = Math.min(target.maxHealth, (target.health += HEALTH));
  },
};
