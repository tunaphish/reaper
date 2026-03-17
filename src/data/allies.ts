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
  options: [Actions.attack, Actions.stanch, Techniques.buff, Actions.magic],
}

export const Eji: Ally = {
  type: OptionType.ALLY,
  name: 'Eji',
  health: 50,
  maxHealth: 100,
  bleed: 0,
  actionPoints: .8,
  maxActionPoints: 1,
  actionPointsRegenRatePerSecond: .13,
  folder: ejiFolder,

  activeTechniques: [],
  
  status: Status.NORMAL,
  
  menuPortraitPath: '/reaper/images/cloud.png',
};


const keshiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Keshi',
  desc: 'Soul of Keshi',
  options: [Actions.attack, Actions.stanch, Actions.engage, Actions.smash, Actions.splinter],
}

export const Keshi: Ally = {
  type: OptionType.ALLY,
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  actionPoints: 0,
  maxActionPoints: 1,
  actionPointsRegenRatePerSecond: .12,
  folder: keshiFolder,

  activeTechniques: [],
  
  status: Status.NORMAL,
  
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
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .08,
  folder: eliseFolder,

  activeTechniques: [],

  status: Status.NORMAL,

  menuPortraitPath: '/reaper/images/tifa.png',
};

export const DefaultAllies: Allies = [Eji, Keshi, Elise];
