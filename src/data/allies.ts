import { Ally, Allies } from '../model/ally';
import { Folder } from '../model/folder';
import { Status } from '../model/combatant';

import * as Actions from './actions';
import * as Techniques from './techniques';
import * as Folders from './folders';
import { OptionType } from '../model/option';



const ejiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Eji',
  desc: 'Soul of Eji',
  options: [Folders.basic],
}

export const Eji: Ally = {
  type: OptionType.ALLY,
  name: 'Eji',
  health: 50,
  maxHealth: 100,
  bleed: 0,
  actionPoints: 0,
  maxActionPoints: 1,
  actionPointsRegenRatePerSecond: .13,
  folder: ejiFolder,

  activeTechniques: [Techniques.buff, Techniques.haste, Techniques.counter],
  
  status: Status.NORMAL,
  
  menuPortraitPath: '/reaper/images/cloud.png',
  combatPortraitSrc: '/reaper/images/eji-ui.png',
};


const keshiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Keshi',
  desc: 'Soul of Keshi',
  options: [Folders.basic, Folders.fencer, Folders.hunter],
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
  combatPortraitSrc: '/reaper/images/eji-ui.png',
};

const phiaFolder: Folder = {
  type: OptionType.FOLDER,
  desc: 'Soul of Phia',
  name: 'Phia',
  options: [Folders.basic, Folders.cleric],
};

export const Phia: Ally = {
  type: OptionType.ALLY,
  name: 'Phia',
  health: 100,
  bleed: 0,
  maxHealth: 100,
  actionPoints: 0,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .08,
  folder: phiaFolder,

  activeTechniques: [],

  status: Status.NORMAL,

  menuPortraitPath: '/reaper/images/tifa.png',
  combatPortraitSrc: '/reaper/images/eji-ui.png',
};

export const DefaultAllies: Allies = [Eji, Keshi, Phia];
