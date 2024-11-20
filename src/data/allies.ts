import { Ally, Allies } from '../model/ally';
import { Status } from '../model/combatant';

import * as JankenboBehaviors from './jankenboBehaviors';
import * as Souls from './souls'
import { OptionType } from '../model/option';


export const Eji: Ally = {
  type: OptionType.ALLY,
  activeSpells: [],
  name: 'Cloud',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  stamina: 0,
  maxStamina: 200,
  magic: 100,
  maxMagic: 100,
  flow: 0,
  flowDecayRatePerSecond: 3,
  staminaRegenRatePerSecond: 7,
  
  status: Status.NORMAL,
  takingDamage: false,
  timeInStateInMs: 0,
  
  jankenboThrow: JankenboBehaviors.cycle,

  menuPortraitPath: '/reaper/assets/characters/menu/cloud.png',
};

export const Keshi: Ally = {
  type: OptionType.ALLY,
  activeSpells: [],
  name: 'Barret',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  stamina: 0,
  maxStamina: 150,
  magic: 100,
  maxMagic: 100,
  flow: 0,
  flowDecayRatePerSecond: 5,
  staminaRegenRatePerSecond: 8,
  
  status: Status.NORMAL,
  takingDamage: false,
  timeInStateInMs: 0,
  
  jankenboThrow: JankenboBehaviors.random,

  menuPortraitPath: '/reaper/assets/characters/menu/barret.png',
};

export const Elise: Ally = {
  type: OptionType.ALLY,
  activeSpells: [],
  name: 'Tifa',
  health: 100,
  bleed: 0,
  maxHealth: 100,
  stamina: 0,
  maxStamina: 250,
  magic: 10,
  maxMagic: 100,
  flow: 15,
  flowDecayRatePerSecond: 7,
  staminaRegenRatePerSecond: 5,

  status: Status.NORMAL,
  takingDamage: false,
  timeInStateInMs: 0,

  jankenboThrow: JankenboBehaviors.alwaysRock,

  menuPortraitPath: '/reaper/assets/characters/menu/tifa.png',
};

export const DefaultAllies: Allies = [Eji, Keshi, Elise];
