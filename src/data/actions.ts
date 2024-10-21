import { Action, ActionTags } from '../model/action';
import { Status } from '../model/combatant';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { updateBleed, updateDamage, updateHealth, updateStamina } from '../scenes/battle/Battle';

export const attack: Action = {
  type: OptionType.ACTION,
  name: 'Attack',
  staminaCost: 100,
  castTimeInMs: 3000,
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

export const bandage: Action = {
  type: OptionType.ACTION,
  name: 'Bandage',
  staminaCost: 100,
  castTimeInMs: 250,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Heals bleed',
  execute: (target, source, potency) => {
    updateBleed(target, potency);
  },
  isRestricted: (target, source, scene) => { 
    return false;
  },
};

export const bloodlust: Action = {
  type: OptionType.ACTION,
  name: 'Bloodlust',
  staminaCost: 100,
  castTimeInMs: 250,
  potency: 25,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Damage scales with each damaged combatant',
  execute: (target, source, potency, scene) => {
    const damagedCombatants = scene.getCombatants().filter(combatant => combatant.bleed > 0).length;
    const newPotency = damagedCombatants * potency;
    updateDamage(target, newPotency, source);
  },
  isRestricted: (target, source, scene) => { 
    return false;
  },
};

export const debilitate: Action = {
  type: OptionType.ACTION,
  name: 'Debilitate',
  staminaCost: 100,
  castTimeInMs: 250,
  potency: 25,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals double damage, target must be exhausted',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency * 2, source);
  },
  isRestricted: (target, deals, scene) => { 
    return target.status !== Status.EXHAUSTED;
  },
};

export const engage: Action = {
  type: OptionType.ACTION,
  name: 'Engage',
  staminaCost: 100,
  castTimeInMs: 250,
  potency: 25,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals double damage, target must have full health',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency * 2, source);
  },
  isRestricted: (target, deals, scene) => { 
    return target.health !== target.maxHealth
  },
};

export const flank: Action = {
  type: OptionType.ACTION,
  name: 'Flank',
  staminaCost: 100,
  castTimeInMs: 250,
  potency: 25,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  imageKeyName: 'attack.gif',

  description: 'Deals additional damage, target must be targetting someone other than caster',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency + 25, source);
  },
  isRestricted: (target, source, scene) => { 
    return !target.queuedTarget || target.queuedTarget.name === source.name;
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
