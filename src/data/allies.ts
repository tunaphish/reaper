import { Ally, Allies } from '../model/ally';
import { Folder } from '../model/folder';
import { Status } from '../model/combatant';

import * as Actions from './actions';
import * as Folders from './folders'
import { OptionType } from '../model/option';



const ejiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Eji',
  desc: 'Soul of Eji',
  options: [Actions.attack, Actions.block, Folders.fencer],
}

export const Eji: Ally = {
  type: OptionType.ALLY,
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
  folder: ejiFolder,
  
  status: Status.NORMAL,
  takingDamage: false,
  timeInStateInMs: 0,
  
  menuPortraitPath: '/reaper/assets/characters/menu/cloud.png',
};


const keshiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Keshi',
  desc: 'Soul of Keshi',
  options: [Actions.attack, Actions.block, Folders.berserker, Folders.hunter],
}

export const Keshi: Ally = {
  type: OptionType.ALLY,
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
  folder: keshiFolder,
  
  status: Status.NORMAL,
  takingDamage: false,
  timeInStateInMs: 0,
  
  menuPortraitPath: '/reaper/assets/characters/menu/barret.png',
};

const eliseFolder: Folder = {
  type: OptionType.FOLDER,
  desc: 'Soul of Elise',
  name: 'Elise',
  options: [Actions.attack, Actions.block, Folders.cleric],
};

export const Elise: Ally = {
  type: OptionType.ALLY,
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
  folder: eliseFolder,

  status: Status.NORMAL,
  takingDamage: false,
  timeInStateInMs: 0,

  menuPortraitPath: '/reaper/assets/characters/menu/tifa.png',
};

export const DefaultAllies: Allies = [Eji, Keshi, Elise];
