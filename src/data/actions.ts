import { Action } from '../model/action';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { updateDamage, updateBleed, updateHealth, Combatant } from "../model/combatant";
import { updateActionPoints } from '../model/combatant';
import { EventType } from '../model/encounter';

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


// #region Actions

export const shatter: Action = {
  type: OptionType.ACTION,
  name: 'Shatter',
  description: 'Deals damage',
  targetType: TargetType.SELF,

  actionPointsCost: 0,

  events: [
    { type: EventType.SOUND, key: 'charged' },
    { type: EventType.SHATTER }

  ]
}

export const attack: Action = {
  type: OptionType.ACTION,
  name: 'Attack',
  description: 'Deals damage',
  targetType: TargetType.SINGLE_TARGET,


  actionPointsCost: 1,


    events: [
      { type: EventType.SOUND, key: 'attack' },
      { type: EventType.UPDATE_DAMAGE, value: 50 }
  
    ]
};

export const engage: Action = {
  type: OptionType.ACTION,
  name: 'Engage',
  description: 'Deals high damage. Condition: target must have full health.',
  targetType: TargetType.SINGLE_TARGET,


  actionPointsCost: 1,

  conditionMet: (world, caster, target) => target.health === target.maxHealth,
  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 70 }
  ]
};

export const splinter: Action = {
  type: OptionType.ACTION,
  name: 'Splinter',
  description: 'Deals high damage. Condition: Splinter must not have been used during this combat.',
  targetType: TargetType.SINGLE_TARGET,


  actionPointsCost: 1,

  conditionMet: (world, caster, target) => world.splinterNotCasted,
  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 70 }
  ]
};

export const smash: Action = {
  type: OptionType.ACTION,
  name: 'Smash',
  description: 'Deals high damage',
  targetType: TargetType.SINGLE_TARGET,


  actionPointsCost: 2,

  events: [
    { type: EventType.SOUND, key: 'attack' },
    { type: EventType.UPDATE_DAMAGE, value: 120 }
  ]
};

export const stanch: Action = {
  type: OptionType.ACTION,
  name: 'Stanch',
  description: 'Heals bleed on self',
  targetType: TargetType.SELF,
  
  actionPointsCost: 1,

    events: [
      { type: EventType.SOUND, key: 'heal' },
      { type: EventType.UPDATE_DAMAGE, value: -50 }
    ]
  
}
