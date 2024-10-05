import { Action, ActionTags } from '../model/action';
import { TargetType } from '../model/targetType';
import { updateDamage, updateHealth, updateStamina } from '../scenes/battle/Battle';

export const slash: Action = {
  name: 'Slash',
  staminaCost: 100,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals damage to target',
  execute: (target) => {
    updateDamage(target, 50);
  },
};

export const finisher: Action = {
  name: 'Finisher',
  staminaCost: 100,
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
  name: 'Assault',
  staminaCost: 100,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals double damage, but hurts yourself',
  execute: (target, source) => {
    updateDamage(target, 50);
    updateDamage(source, 50);
  },
};

export const ankleSlice: Action = {
  name: 'Ankle Slice',
  staminaCost: 150,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals damage and reduces stamina for target',
  execute: (target) => {
    updateDamage(target, 50);
    updateStamina(target, -50);
  },
};

export const drain: Action = {
  name: 'Drain',
  staminaCost: 150,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Drains health',
  execute: (target, source) => {
    updateDamage(target, 50);
    updateHealth(source, 25);
  },
};

export const block: Action = {
  name: 'Block',
  staminaCost: 50,
  tags: new Set([ActionTags.DEFEND]),
  targetType: TargetType.SELF,

  description:
    'Stops stamina regeneration, converts all additional to reduce stamina, stops stacked damage from applying',
  // eslint-disable-next-line @typescript-eslint/no-empty-function,
  execute: () => {},
};

export const idle: Action = {
  name: 'Idle',
  staminaCost: 0,
  tags: new Set([ActionTags.DEFEND]),
  targetType: TargetType.SELF,

  description: 'Does Nothing',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  execute: () => {},
};

export const heal: Action = {
  name: 'Heal',
  staminaCost: 100,
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

export const ACTION_SET: Set<Action> = new Set([slash, finisher, ankleSlice, block, idle, heal]);
