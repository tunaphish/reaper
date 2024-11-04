import { Action, ActionTags } from '../model/action';
import { Status } from '../model/combatant';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { updateDamage } from '../model/combatant';
import { updateBleed, updateHealth, updateStamina } from '../model/combatant';

export const attack: Action = {
  type: OptionType.ACTION,
  name: 'Attack',
  staminaCost: 100,
  castTimeInMs: 1500,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage to target',
  execute: (target, source, potency) => {
    updateDamage(target, potency);
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

  description: 'Refunds Stamina, Must be first action taken in battle',
  execute: (target, source, potency) => {
    updateDamage(target, potency);
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

  description: 'Heals bleed',
  execute: (target, source, potency) => {
    updateBleed(target, -potency);
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

  description: 'Damage scales with each damaged combatant',
  execute: (target, source, potency, scene) => {
    const damagedCombatants = scene.battleStore.getCombatants().filter(combatant => combatant.bleed > 0).length;
    const newPotency = damagedCombatants * potency;
    updateDamage(target, newPotency);
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

  description: 'Deals double damage, target must be exhausted',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency * 2);
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

  description: 'Deals double damage, target must have full health',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency * 2);
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

  description: 'Deals additional damage, target must be targetting someone other than caster',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency + 25);
  },
  isRestricted: (target, source, scene) => { 
    return !target.queuedTarget || target.queuedTarget.name === source.name;
  },
};

export const flourish: Action = {
  type: OptionType.ACTION,
  name: 'Flourish',
  staminaCost: 100,
  castTimeInMs: 250,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals double damage, caster must have full health',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency * 2);
  },
  isRestricted: (target, source, scene) => { 
    return source.health !== source.maxHealth
  },
};

export const gangup: Action = {
  type: OptionType.ACTION,
  name: 'Gangup',
  staminaCost: 100,
  castTimeInMs: 250,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  description: 'Damage scales with each damaged combatant',
  execute: (target, source, potency, scene) => {
    const damagedCombatants = scene.battleStore.getCombatants().filter(combatant => combatant.queuedTarget.name === target.name).length;
    const newPotency = damagedCombatants * potency;
    updateDamage(target, newPotency);
  },
  isRestricted: (target, source, scene) => { 
    return false;
  },
};

export const prick: Action = {
  type: OptionType.ACTION,
  name: 'Prick',
  staminaCost: 25,
  castTimeInMs: 100,
  potency: 5,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage to target',
  execute: (target, source, potency) => {
    updateDamage(target, potency);
  },
  isRestricted: () => { return false },
};

export const resurrect: Action = {
  type: OptionType.ACTION,
  name: 'Resurrect',
  staminaCost: 100,
  castTimeInMs: 2000,
  potency: 50,
  tags: new Set([ActionTags.HEAL]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',

  description: 'Heals target, target must be dead',
  execute: (target, source, potency) => {
    updateHealth(target, potency);
  },
  isRestricted: (target, source, scene) => { 
    return target.status !== Status.DEAD
   },
};

export const revenge: Action = {
  type: OptionType.ACTION,
  name: 'Revenge',
  staminaCost: 50,
  castTimeInMs: 500,
  potency: 0,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Potency equal to bleed',
  execute: (target, source, potency) => {
    updateDamage(target, source.bleed);
  },
  isRestricted: () => { return false },
};

export const salve: Action = {
  type: OptionType.ACTION,
  name: 'salve',
  staminaCost: 100,
  castTimeInMs: 250,
  potency: 50,
  tags: new Set([ActionTags.HEAL]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',

  description: 'Heals double bleed, target must be dying',
  execute: (target, source, potency) => {
    updateBleed(target, -potency*2);
  },
  isRestricted: () => (false)
};

export const splinter: Action = {
  type: OptionType.ACTION,
  name: 'Splinter',
  staminaCost: 100,
  castTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals double damage, must not have been used in battle yet',
  execute: (target, source, potency) => {
    updateDamage(target, potency*2);
  },
  isRestricted: (target, source, scene) => { 
    return scene.splinterUsed;
  },
};

export const block: Action = {
  type: OptionType.ACTION,
  name: 'Block',
  staminaCost: 10,
  castTimeInMs: 100,
  potency: 0,
  tags: new Set([ActionTags.DEFEND]),
  targetType: TargetType.SELF,
  soundKeyName: 'block',

  description: 'Switch to block stance, (block stance receives damage as stamina instead of bleed',
  execute: (target, source, potency) => {
    source.status = Status.BLOCKING;
  },
  isRestricted: (target, source, scene) => (false)
};
