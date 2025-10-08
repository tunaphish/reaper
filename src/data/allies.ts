import { Ally, Allies } from '../model/ally';
import { Folder } from '../model/folder';
import { Status } from '../model/combatant';

import * as Actions from './actions';
import { OptionType } from '../model/option';



const ejiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Cloud',
  desc: 'Soul of Cloud',
  options: [Actions.attack, Actions.stanch],
}

export const Eji: Ally = {
  type: OptionType.ALLY,
  name: 'Cloud',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  actionPoints: .1,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .13,
  folder: ejiFolder,
  
  status: Status.NORMAL,
  position: [-2, 0, 2],
  
  spritePath: '/reaper/sprites/allies/charizard.png',
  menuPortraitPath: '/reaper/characters/menu/cloud.png',
};


const keshiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Barret',
  desc: 'Soul of Barret',
  options: [Actions.attack, Actions.stanch],
}

export const Keshi: Ally = {
  type: OptionType.ALLY,
  name: 'Barret',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  actionPoints: 0.4,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .12,
  folder: keshiFolder,
  
  status: Status.NORMAL,
  position: [0, 0, 2],
  
  spritePath: '/reaper/sprites/allies/gengar.png',
  menuPortraitPath: '/reaper/characters/menu/barret.png',
};

const eliseFolder: Folder = {
  type: OptionType.FOLDER,
  desc: 'Soul of Tifa',
  name: 'Tifa',
  options: [Actions.attack, Actions.stanch],
};

export const Elise: Ally = {
  type: OptionType.ALLY,
  name: 'Tifa',
  health: 100,
  bleed: 0,
  maxHealth: 100,
  actionPoints: 0,
  maxActionPoints: 3,
  actionPointsRegenRatePerSecond: .08,
  folder: eliseFolder,

  status: Status.NORMAL,
  position: [2, 0, 2],

  spritePath: '/reaper/sprites/allies/snorlax.png',
  menuPortraitPath: '/reaper/characters/menu/tifa.png',
};

export const DefaultAllies: Allies = [Eji, Keshi, Elise];
