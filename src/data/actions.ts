import { Action } from '../model/action';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { updateDamage, updateActionPoints, updateBleed, updateHealth, Combatant } from "../model/combatant";

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
  actionPointsCost: 0,
  targetType: TargetType.SELF,
  soundKeyName: 'charged',

  description: 'Deals damage',
  resolve: (target, source: Combatant, potency) => {
    const totalAp = [...source.activeTechniques].reduce((total, curr) => curr.actionPointsCost+total, 0);
    source.actionPoints += totalAp;
    source.activeTechniques = new Set();
  },
  potency: 50,
}

export const attack: Action = {
  type: OptionType.ACTION,
  name: 'Attack',
  actionPointsCost: 1,
  targetType: TargetType.ENEMIES,
  soundKeyName: 'attack',

  description: 'Deals damage',
  resolve: dealDamage,
  potency: 50,

};

export const stanch: Action = {
  type: OptionType.ACTION,
  name: 'Stanch',
  actionPointsCost: 1,
  targetType: TargetType.SELF,

  description: 'Heals bleed on self',
  resolve: healBleed,
  potency: 50,
  soundKeyName: 'heal',
}
