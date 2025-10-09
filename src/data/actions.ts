import { Action } from '../model/action';
import { MediaEffectType } from '../model/mediaEffect';
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { updateDamage, updateActionPoints, updateBleed, updateHealth, Combatant } from "../model/combatant";
import { Technique } from './techniques';

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

export const attack: Action = {
  type: OptionType.ACTION,
  name: 'Attack',
  actionPointsCost: 1,
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage',
  resolve: dealDamage,
  potency: 50,

  mediaEffects: [{ type: MediaEffectType.PARTICLE, jsonPath: '/reaper/effects/energy-explosion.json' }],

};

export const stanch: Action = {
  type: OptionType.ACTION,
  name: 'Stanch',
  actionPointsCost: 1,
  targetType: TargetType.SELF,

  description: 'Heals bleed on self',
  resolve: healBleed,
  potency: 50,

  mediaEffects: [{ type: MediaEffectType.PARTICLE, jsonPath: '/reaper/effects/cartoon-starfield.json' }],
  soundKeyName: 'heal',
}


export const haste: Action = {
  type: OptionType.ACTION,
  name: 'Haste',
  actionPointsCost: 1,
  targetType: TargetType.SELF,

  description: 'Technique: Increase Speed',
  resolve: (target: Combatant, source, potency) => {
    target.activeTechniques.add(Technique.HASTE)
  },
  potency: 0,

  mediaEffects: [{ type: MediaEffectType.PARTICLE, jsonPath: '/reaper/effects/cartoon-starfield.json' }],
  soundKeyName: 'smirk',
};

export const buff: Action = {
  type: OptionType.ACTION,
  name: 'Buff',
  actionPointsCost: 1,
  targetType: TargetType.SELF,

  description: 'Technique: Increase Speed',
  resolve: (target: Combatant, source, potency) => {
    target.activeTechniques.add(Technique.BUFF)
  },
  potency: 0,

  mediaEffects: [{ type: MediaEffectType.PARTICLE, jsonPath: '/reaper/effects/cartoon-starfield.json' }],
  soundKeyName: 'smirk',
};
