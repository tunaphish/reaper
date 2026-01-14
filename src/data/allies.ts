import { Ally, Allies } from '../model/ally';
import { Folder } from '../model/folder';
import { Status } from '../model/combatant';

import * as Actions from './actions';
import * as Techniques from './techniques';
import { OptionType } from '../model/option';



const ejiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Eji',
  desc: 'Soul of Eji',
  options: [Actions.attack, Actions.stanch, Techniques.haste, Techniques.buff, Actions.shatter],
}

export const Eji: Ally = {
  type: OptionType.ALLY,
  name: 'Eji',
  health: 50,
  maxHealth: 100,
  bleed: 0,
  actionPoints: .1,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .13,
  folder: ejiFolder,

  activeTechniques: new Set(),
  
  status: Status.NORMAL,
  position: [-2, 0, 2],
  
  menuPortraitPath: '/reaper/images/cloud.png',
};


const keshiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Keshi',
  desc: 'Soul of Keshi',
  options: [Actions.attack, Actions.stanch],
}

export const Keshi: Ally = {
  type: OptionType.ALLY,
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  actionPoints: 0.4,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .12,
  folder: keshiFolder,

  activeTechniques: new Set(),
  
  status: Status.NORMAL,
  position: [0, 0, 2],
  
  menuPortraitPath: '/reaper/images/barret.png',
};

const eliseFolder: Folder = {
  type: OptionType.FOLDER,
  desc: 'Soul of Elise',
  name: 'Elise',
  options: [Actions.attack, Actions.stanch],
};

export const Elise: Ally = {
  type: OptionType.ALLY,
  name: 'Elise',
  health: 100,
  bleed: 0,
  maxHealth: 100,
  actionPoints: 0,
  maxActionPoints: 3,
  actionPointsRegenRatePerSecond: .08,
  folder: eliseFolder,

  activeTechniques: new Set(),

  status: Status.NORMAL,
  position: [2, 0, 2],

  menuPortraitPath: '/reaper/images/tifa.png',
};

export const DefaultAllies: Allies = [Eji, Keshi, Elise];
