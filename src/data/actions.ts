import { Action, ActionTags, Restriction } from '../model/action';
import { Status } from '../model/combatant';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { updateDamage } from '../model/combatant';
import { updateBleed, updateHealth, updateStamina } from '../model/combatant'

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
    return target.bleed === target.health;
  },
}

// #endregion

// #region Actions

export const attack: Action = {
  type: OptionType.ACTION,
  name: 'Attack',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage',
  execute: (target, source, potency) => {
    updateDamage(target, potency);
  },
};

export const ambush: Action = {
  type: OptionType.ACTION,
  name: 'Ambush',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage, refunds stamina cost',
  execute: (target, source, potency) => {
    updateDamage(target, potency);
    updateStamina(source, 100)
  },
  restriction: firstActionTaken,
};

export const bandage: Action = {
  type: OptionType.ACTION,
  name: 'Bandage',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 500,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Heals bleed',
  execute: (target, source, potency) => {
    updateBleed(target, -potency);
  },
};

export const bloodlust: Action = {
  type: OptionType.ACTION,
  name: 'Bloodlust',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 1000,
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
};

export const debilitate: Action = {
  type: OptionType.ACTION,
  name: 'Debilitate',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 500,
  potency: 25,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals high damage',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency * 2);
  },
  restriction: targetExhausted,
};

export const engage: Action = {
  type: OptionType.ACTION,
  name: 'Engage',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 1000,
  potency: 25,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals high damage',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency * 2);
  },
  restriction: targetFullHealth,
};

export const flank: Action = {
  type: OptionType.ACTION,
  name: 'Flank',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 500,
  potency: 25,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals medium damage',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency + 25);
  },
  restriction: targetTargetingOther
};

export const flourish: Action = {
  type: OptionType.ACTION,
  name: 'Flourish',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals high damage',
  execute: (target, source, potency, scene) => {
    updateDamage(target, potency * 2);
  },
  restriction: casterFullHealth,
};

export const gangup: Action = {
  type: OptionType.ACTION,
  name: 'Gangup',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 500,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
  description: 'Deals scaling damage based on number of combatants acting on target',
  execute: (target, source, potency, scene) => {
    const damagedCombatants = scene.battleStore.getCombatants().filter(combatant => combatant.queuedTarget.name === target.name).length;
    const newPotency = damagedCombatants * potency;
    updateDamage(target, newPotency);
  }
};

export const prick: Action = {
  type: OptionType.ACTION,
  name: 'Prick',
  staminaCost: 25,
  castTimeInMs: 0,
  animTimeInMs: 100,
  potency: 5,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage to target',
  execute: (target, source, potency) => {
    updateDamage(target, potency);
  },
};

export const resurrect: Action = {
  type: OptionType.ACTION,
  name: 'Resurrect',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 2000,
  potency: 50,
  tags: new Set([ActionTags.HEAL]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',

  description: 'Heals target, target must be dead',
  execute: (target, source, potency) => {
    updateHealth(target, potency);
  },
  restriction: targetDead,
};

export const revenge: Action = {
  type: OptionType.ACTION,
  name: 'Revenge',
  staminaCost: 50,
  castTimeInMs: 0,
  animTimeInMs: 500,
  potency: 0,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Potency equal to bleed',
  execute: (target, source, potency) => {
    updateDamage(target, source.bleed);
  },
};

export const salve: Action = {
  type: OptionType.ACTION,
  name: 'salve',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 500,
  potency: 50,
  tags: new Set([ActionTags.HEAL]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',

  description: 'Heals double bleed, target must be dying',
  execute: (target, source, potency) => {
    updateBleed(target, -potency*2);
  },
  restriction: targetDying,
};

export const splinter: Action = {
  type: OptionType.ACTION,
  name: 'Splinter',
  staminaCost: 100,
  castTimeInMs: 0,
  animTimeInMs: 1000,
  potency: 50,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals high damage',
  execute: (target, source, potency) => {
    updateDamage(target, potency*2);
  },
  restriction: actionSingleUse,
};

// #endregion
