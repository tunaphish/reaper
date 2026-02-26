import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { OptionType } from '../model/option';

import * as Actions from './actions';
import { randomAlly } from './targetStrategies';

export const fencer: Enemy = {
  type: OptionType.ENEMY,
  name: 'Fencer',
  journalDescription: 'Debug Enemy meant to use specialized attacks',
  baseImageSrc: '/reaper/images/fencer.png',

  health: 100,
  maxHealth: 200,
  bleed: 0,
  status: Status.NORMAL,

  
  // strategies: [
  //   {
  //     potentialOptions: [
  //       { option: Actions.attack, getTarget: randomAlly, cadence: 500, singleUse: false }
  //     ],
  //     toExit: (enemy, battle): boolean => enemy.actionPoints < 25,
  //     toEnter: (enemy): boolean => enemy.actionPoints > 100,
  //   },
  //   {
  //     potentialOptions: [],
  //     toExit: (enemy, battle): boolean => enemy.actionPoints > 100,
  //     toEnter: (enemy): boolean => enemy.actionPoints > 50,
  //   },
  //   {
  //     potentialOptions: [],
  //     toExit: (enemy, battle): boolean => enemy.actionPoints > 50,
  //     toEnter: (): boolean => true,
  //   }
  // ],
  // timeTilNextAction: 0,

  activeTechniques: new Set(),

};



export const knight: Enemy = {
  type: OptionType.ENEMY,
  name: 'Knight',
  journalDescription: 'Debug Enemy meant to use defensive actions',
  baseImageSrc: '/reaper/images/knight.gif',

  health: 200,
  maxHealth: 200,
  bleed: 0,

  // strategies: [
  //   {
  //     potentialOptions: [
  //       { option: Actions.attack, getTarget: randomAlly, cadence: 500, singleUse: false  }
  //     ],

  //     toExit: (enemy, battle): boolean => enemy.actionPoints < 25,
  //     toEnter: (enemy): boolean => enemy.actionPoints > 75,
  //   },
  //   {
  //     potentialOptions: [],
  //     toExit: (enemy, battle): boolean => enemy.actionPoints > 75,
  //     toEnter: (): boolean => true,
  //   }
  // ],
  // timeTilNextAction: 0,

  status: Status.NORMAL,

  activeTechniques: new Set(),
};

export const enemies = [
  fencer,
  knight
]

// #endregion