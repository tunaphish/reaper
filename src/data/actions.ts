import { Action, Restriction } from '../model/action';
import { Status } from '../model/combatant';
import { MediaEffectType } from '../model/mediaEffect';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { dealDamage, healStamina, healBleed, healHealth, scaleDamageOnBleedCombatants, scaleDamageOnCasterBleed, scaleDamageOnCombatantsTargetingTarget } from './effects';

// #region Restrictions

export const firstActionTaken: Restriction = {
  desc: 'Action must be first in Battle',
  isRestricted: (target, source, scene) => { 
    return scene.firstActionTaken;
  },
}

export const targetExhausted: Restriction = {
  desc: 'Target must be exhausted',
  isRestricted: (target, source, scene) => { 
    return scene.firstActionTaken;
  },
}

export const targetFullHealth: Restriction = {
  desc: 'Target must have full health',
  isRestricted: (target, source, scene) => { 
    return target.health !== target.maxHealth
  },
}

export const targetTargetingOther: Restriction = {
  desc: 'Target must be acting on anyone besides caster',
  isRestricted: (target, source, scene) => { 
    return !target.queuedTarget || target.queuedTarget.name === source.name;
  },
}

export const casterFullHealth: Restriction = {
  desc: 'Caster must have full health',
  isRestricted: (target, source, scene) => { 
    return source.health !== source.maxHealth
  },
}

export const targetDead: Restriction = {
  desc: 'Target must be Dead',
  isRestricted: (target, source, scene) => { 
    return target.status !== Status.DEAD
  },
}

export const actionSingleUse: Restriction = {
  desc: 'Action must not have been previously used in battle',
  isRestricted: (target, source, scene) => { 
    return scene.splinterUsed;
  },
}

export const targetDying: Restriction = {
  desc: 'Target must be dying',
  isRestricted: (target, source, scene) => { 
    return target.bleed !== target.health;
  },
}

// #endregion

// #region Actions

export const attack: Action = {
  type: OptionType.ACTION,
  name: 'Attack',
  staminaCost: 50,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage',
  effects: [{execute: dealDamage, potency: 50}],
  mediaEffects: [{ type: MediaEffectType.PARTICLE, jsonPath: '/reaper/effects/energy-explosion.json' }],
};

export const stanch: Action = {
  type: OptionType.ACTION,
  name: 'Stanch',
  staminaCost: 25,
  targetType: TargetType.SELF,

  description: 'Heals bleed on self',
  effects: [{execute: healBleed, potency: 25}],

  mediaEffects: [{ type: MediaEffectType.PARTICLE, jsonPath: '/reaper/effects/cartoon-starfield.json' }],
  soundKeyName: 'heal',
};

export const ambush: Action = {
  type: OptionType.ACTION,
  name: 'Ambush',
  staminaCost: 100,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage, refunds stamina cost',
  effects: [{execute: dealDamage, potency: 50,}, {execute: healStamina, potency: 100}],
  restriction: firstActionTaken,
  mediaEffects: [],
};

export const bandage: Action = {
  type: OptionType.ACTION,
  name: 'Bandage',
  staminaCost: 25,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',

  description: 'Heals bleed',
  effects: [{execute: healBleed, potency: 25}],
  mediaEffects: [],
};

export const bloodlust: Action = {
  type: OptionType.ACTION,
  name: 'Bloodlust',
  staminaCost: 100,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Damage scales with each damaged combatant',
  effects: [{execute: scaleDamageOnBleedCombatants, potency: 25}],
  mediaEffects: [],
};

export const debilitate: Action = {
  type: OptionType.ACTION,
  name: 'Debilitate',
  staminaCost: 100,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals high damage',
  effects: [{execute: dealDamage, potency: 100}],
  restriction: targetExhausted,
  mediaEffects: [],
};

export const engage: Action = {
  type: OptionType.ACTION,
  name: 'Engage',
  staminaCost: 50,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals high damage',
  effects: [{execute: dealDamage, potency: 100}],
  restriction: targetFullHealth,
  mediaEffects: [],
};

export const flank: Action = {
  type: OptionType.ACTION,
  name: 'Flank',
  staminaCost: 100,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals medium damage',
  effects: [{execute: dealDamage, potency: 75}],
  restriction: targetTargetingOther,
  mediaEffects: [],
};

export const flourish: Action = {
  type: OptionType.ACTION,
  name: 'Flourish',
  staminaCost: 100,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals high damage',
  effects: [{execute: dealDamage, potency: 100}],
  restriction: casterFullHealth,
  mediaEffects: [],
};

export const gangup: Action = {
  type: OptionType.ACTION,
  name: 'Gangup',
  staminaCost: 100,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  description: 'Deals scaling damage based on number of combatants acting on target',
  effects: [{execute: scaleDamageOnCombatantsTargetingTarget, potency: 30}],
  mediaEffects: [],
};

export const prick: Action = {
  type: OptionType.ACTION,
  name: 'Prick',
  staminaCost: 25,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals low damage to target with quick attack time',
  effects: [{execute: dealDamage, potency: 5}],
  mediaEffects: [],
};

export const resurrect: Action = {
  type: OptionType.ACTION,
  name: 'Resurrect',
  staminaCost: 100,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',

  description: 'Heals target, target must be dead',
  effects: [{execute: healHealth, potency: 50}],
  restriction: targetDead,
  mediaEffects: [],
};

export const revenge: Action = {
  type: OptionType.ACTION,
  name: 'Revenge',
  staminaCost: 50,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deal scaling damage equal to bleed on caster',
  effects: [{execute: scaleDamageOnCasterBleed, potency: 50}],
  mediaEffects: [],
};

export const salve: Action = {
  type: OptionType.ACTION,
  name: 'salve',
  staminaCost: 100,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',

  description: 'Heals high bleed, target must be dying',
  effects: [{execute: healBleed, potency: 100}],
  restriction: targetDying,
  mediaEffects: [],
};

export const splinter: Action = {
  type: OptionType.ACTION,
  name: 'Splinter',
  staminaCost: 100,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals high damage',
  effects: [{execute: dealDamage, potency: 100}],
  restriction: actionSingleUse,
  mediaEffects: [],
};

// #endregion

// #region Monk Actions

export const jab: Action = {
  type: OptionType.ACTION,
  name: 'Jab',
  staminaCost: 10,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage',
  effects: [{execute: dealDamage, potency: 10}],
  mediaEffects: [],
};


// #endregion