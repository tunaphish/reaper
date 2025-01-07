import { Ally, Allies } from '../model/ally';
import { Folder } from '../model/folder';
import { Status } from '../model/combatant';

import * as Actions from './actions';
import * as Folders from './folders'
import * as Reactions from './reactions'
import { OptionType } from '../model/option';



const ejiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Cloud',
  desc: 'Soul of Cloud',
  options: [Actions.attack, Reactions.block, Actions.stanch],
}

export const Eji: Ally = {
  type: OptionType.ALLY,
  name: 'Cloud',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  stamina: 0,
  maxStamina: 150,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 5,
  folder: ejiFolder,
  
  status: Status.NORMAL,
  timeInStateInMs: 0,
  juggleDuration: 0,
  
  spritePath: '/reaper/sprites/allies/charizard.png',
  menuPortraitPath: '/reaper/characters/menu/cloud.png',
};


const keshiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Barret',
  desc: 'Soul of Barret',
  options: [Actions.attack, Reactions.block, Actions.stanch],
}

export const Keshi: Ally = {
  type: OptionType.ALLY,
  name: 'Barret',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  stamina: 0,
  maxStamina: 100,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 7,
  folder: keshiFolder,
  
  status: Status.NORMAL,
  timeInStateInMs: 0,
  juggleDuration: 0,
  
  spritePath: '/reaper/sprites/allies/gengar.png',
  menuPortraitPath: '/reaper/characters/menu/barret.png',
};

const eliseFolder: Folder = {
  type: OptionType.FOLDER,
  desc: 'Soul of Tifa',
  name: 'Tifa',
  options: [Actions.attack, Reactions.block, Actions.stanch],
};

export const Elise: Ally = {
  type: OptionType.ALLY,
  name: 'Tifa',
  health: 100,
  bleed: 0,
  maxHealth: 100,
  stamina: 0,
  maxStamina: 200,
  magic: 10,
  maxMagic: 100,
  staminaRegenRatePerSecond: 4,
  folder: eliseFolder,

  status: Status.NORMAL,
  timeInStateInMs: 0,
  juggleDuration: 0,

  spritePath: '/reaper/sprites/allies/snorlax.png',
  menuPortraitPath: '/reaper/characters/menu/tifa.png',
};

export const DefaultAllies: Allies = [Eji, Keshi, Elise];
