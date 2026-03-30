import { Ally, Allies } from '../model/ally';
import { Folder } from '../model/folder';
import { Status } from '../model/combatant';

import * as Techniques from './techniques';
import * as Folders from './folders';
import { OptionType } from '../model/option';

const ejiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Eji',
  desc: 'Soul of Eji',
  options: [Folders.basic, Folders.knight, Folders.fighter],
}

export const Eji: Ally = {
  type: OptionType.ALLY,
  name: 'Eji',
  health: 10,
  maxHealth: 100,
  bleed: 10,
  actionPoints: -1,
  maxActionPoints: 1,
  actionPointsRegenRatePerSecond: .13,
  folder: ejiFolder,

  activeTechniques: [],
};


const keshiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Keshi',
  desc: 'Soul of Keshi',
  options: [Techniques.shadow, Folders.basic, Folders.fencer, Folders.hunter, Folders.bandit],
}

export const Keshi: Ally = {
  type: OptionType.ALLY,
  name: 'Keshi',
  health: 10,
  maxHealth: 100,
  bleed: 10,
  actionPoints: -1,
  maxActionPoints: 1,
  actionPointsRegenRatePerSecond: .12,
  folder: keshiFolder,

  activeTechniques: [],

};

const phiaFolder: Folder = {
  type: OptionType.FOLDER,
  desc: 'Soul of Phia',
  name: 'Phia',
  options: [Techniques.reciprocity, Folders.basic, Folders.cleric, Folders.mage],
};

export const Phia: Ally = {
  type: OptionType.ALLY,
  name: 'Phia',
  health: 10,
  bleed: 10,
  maxHealth: 100,
  actionPoints: -1,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .08,
  folder: phiaFolder,

  activeTechniques: [],
};

export const DefaultAllies: Allies = [Eji, Keshi, Phia];
