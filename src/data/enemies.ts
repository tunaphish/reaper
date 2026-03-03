import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { OptionType } from '../model/option';

import * as Actions from './actions';
import { randomTarget } from './targetStrategies'
import * as Techniques from './techniques';

export const fencer: Enemy = {
  type: OptionType.ENEMY,
  name: 'Fencer',
  journalDescription: 'Debug Enemy meant to use specialized attacks',
  baseImageSrc: '/reaper/images/fencer.png',

  health: 100,
  maxHealth: 200,
  bleed: 0,
  status: Status.NORMAL,
  actionPoints: 0,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .13,
  
  strategies: [
    { action: Actions.attack, weight: 100, getTarget: randomTarget, isValid: (world, caster) => true },
    { action: Actions.splinter, weight: 500, getTarget: randomTarget, isValid: (world, caster) => world.splinterNotCasted },
    { action: Actions.engage, weight: 500, getTarget: randomTarget, isValid: (world, caster) => world.worldStore.allies.some(ally => ally.health === ally.maxHealth ) },
  ],
  selectedStrategyIndex: 0,

  activeTechniques: new Set([Techniques.haste]),

};



export const knight: Enemy = {
  type: OptionType.ENEMY,
  name: 'Knight',
  journalDescription: 'Debug Enemy meant to use defensive actions',
  baseImageSrc: '/reaper/images/knight.gif',

  health: 200,
  maxHealth: 200,
  bleed: 0,

  actionPoints: 0,
  maxActionPoints: 2,
  actionPointsRegenRatePerSecond: .13,

  strategies: [],
  selectedStrategyIndex: 0,
  status: Status.NORMAL,

  activeTechniques: new Set(),
};

export const enemies = [
  fencer,
  knight
]

// #endregion