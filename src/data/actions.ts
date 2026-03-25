import { Action } from '../model/action';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { updateDamage, updateBleed, updateHealth, Combatant } from "../model/combatant";
import { updateActionPoints } from '../model/combatant';
import { EventType, ShatterTechniqueTarget } from '../model/encounter';
import { Folder } from '../model/folder';

export const actionIsAnAttack = (action: Action): boolean => action.events.some(event => event.type === EventType.UPDATE_DAMAGE && event.value > 0);

export const dealDamage = (target, source, potency) => {
  updateDamage(target, potency);
};

// these are potentially confusing lol
export const healStamina = (target, source, potency) => {
  updateActionPoints(target, potency);
};
export const healBleed = (target, source, potency) => {
  updateBleed(target, -potency);
};
export const healHealth = (target, source, potency) => {
  updateHealth(target, potency);
};

// consider converting to getPotency functions
export const scaleDamageOnBleedCombatants = (target, source, potency, scene) => {
  const damagedCombatants = scene.battleStore.getCombatants().filter(combatant => combatant.bleed > 0).length;
  const newPotency = damagedCombatants * potency;
  updateDamage(target, newPotency);
};
export const scaleDamageOnCombatantsTargetingTarget = (target, source, potency, scene) => {
  const damagedCombatants = scene.battleStore.getCombatants().filter(combatant => combatant.queuedTarget.name === target.name).length;
  const newPotency = damagedCombatants * potency;
  updateDamage(target, newPotency);
};
export const scaleDamageOnCasterBleed = (target, source, potency) => {
  updateDamage(target, source.bleed);
};


// #region Basic
export const attack: Action = {
  type: OptionType.ACTION,
  name: 'Attack',
  description: 'Deals damage',
  targetType: TargetType.SINGLE_TARGET,
  castTimeInMs: 1500,

  actionPointsCost: 1,


  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 50 }

  ],

  castingImageSrc:'/reaper/images/test.gif',
};

export const smash: Action = {
  type: OptionType.ACTION,
  name: 'Smash',
  description: 'Deals high damage, long cast time',
  targetType: TargetType.SINGLE_TARGET,
  castTimeInMs: 2500,

  actionPointsCost: 2,

  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 120 }
  ],

  castingImageSrc:'/reaper/images/test.jpeg',
};


export const stanch: Action = {
  type: OptionType.ACTION,
  name: 'Stanch',
  description: 'Heals bleed on self',
  targetType: TargetType.SELF,
  castTimeInMs: 300,
  actionPointsCost: 1,

  events: [
    { type: EventType.SOUND, key: 'heal' },
    { type: EventType.UPDATE_DAMAGE, value: -50 }
  ],

  
}

export const magic: Action = {
  type: OptionType.ACTION,
  name: 'Magic',
  description: 'Deals Damage. Shatters random technique.',
  targetType: TargetType.SINGLE_TARGET,
  
  castTimeInMs: 2000,
  actionPointsCost: 1,

  events: [
    { type: EventType.SOUND, key: 'debuff' },
    { type: EventType.UPDATE_DAMAGE, value: 50 },
    { type: EventType.SHATTER_TECHNIQUE, target: ShatterTechniqueTarget.RANDOM }
  ],

  castingImageSrc:'/reaper/images/test.jpeg',
}

export const shatter: Action = {
  type: OptionType.ACTION,
  name: 'Shatter',
  description: 'Deals damage',
  targetType: TargetType.SELF,
  castTimeInMs: 300,

  actionPointsCost: 0,

  events: [
    { type: EventType.SOUND, key: 'charged' },
    { type: EventType.SHATTER }

  ]
}


// #endregion

// #region fencer
export const pristine: Action = {
  type: OptionType.ACTION,
  name: 'Pristine',
  description: 'Deals high damage. Condition: caster must have full health.',
  targetType: TargetType.SINGLE_TARGET,
  castTimeInMs: 1500,

  actionPointsCost: 1,

  conditionMet: (world, caster, target) => caster.health === caster.maxHealth,
  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 70 }
  ],
  castingImageSrc:'/reaper/images/test.jpeg',

};

export const engage: Action = {
  type: OptionType.ACTION,
  name: 'Engage',
  description: 'Deals high damage. Condition: target must have full health.',
  targetType: TargetType.SINGLE_TARGET,
  castTimeInMs: 1500,

  actionPointsCost: 1,

  conditionMet: (world, caster, target) => target.health === target.maxHealth,
  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 70 }
  ],
  castingImageSrc:'/reaper/images/test.jpeg',

};

export const splinter: Action = {
  type: OptionType.ACTION,
  name: 'Splinter',
  description: 'Deals high damage. Condition: Splinter must not have been used during this combat.', // consider turning splinter into a technique
  targetType: TargetType.SINGLE_TARGET,
  castTimeInMs: 1500,

  actionPointsCost: 1,

  conditionMet: (world, caster, target) => world.splinterNotCasted,
  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 70 }
  ],

  castingImageSrc:'/reaper/images/test.jpeg',
};

export const prick: Action = {
  type: OptionType.ACTION,
  name: 'Prick',
  description: 'Deals very low damage. Fast cast time.',
  targetType: TargetType.SINGLE_TARGET,
  castTimeInMs: 50,

  actionPointsCost: 1,

  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 5 }
  ],

};

// #endregion


// #region hunter

export const ambush: Action = {
  type: OptionType.ACTION,
  name: 'Ambush',
  description: "Deals damage. Restore's AP used. Condition: Must be first action taken this combat.",
  targetType: TargetType.SINGLE_TARGET,
  castTimeInMs: 1500,

  actionPointsCost: 1,

  conditionMet: (world, caster, target) => world.firstActionNotTaken,
  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 50 },
    { type: EventType.UPDATE_AP, value: 1 }
  ],

  castingImageSrc:'/reaper/images/test.jpeg',
};

// #endregion

// #region cleric

export const heal: Action = {
  type: OptionType.ACTION,
  name: 'Heal',
  description: "Heals bleed",
  targetType: TargetType.SINGLE_TARGET,
  castTimeInMs: 300,

  actionPointsCost: 1,

  conditionMet: (world, caster, target) => world.firstActionNotTaken,
  events: [
    { type: EventType.SOUND, key: 'heal' },
    { type: EventType.UPDATE_DAMAGE, value: -50 },
  ],

};

// #endregion

// #region knight
export const cleave: Action = {
  type: OptionType.ACTION,
  name: 'Cleave',
  description: "Weak attacks all enemies",
  targetType: TargetType.AOE,
  castTimeInMs: 1500,
  actionPointsCost: 1,
  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 50 },
  ]
}
// #endregion