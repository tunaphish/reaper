import { Enemy } from '../model/enemy';
import { Combatant, Status } from '../model/combatant';
import { OptionType } from '../model/option';

import * as Actions from './actions';
import * as Techniques from './techniques';
import { getRandomInt } from '../model/math';
import { World } from '../scenes/world/World';


const isAlive = (targets: Combatant) => targets.status !== Status.DEAD;

const randomTarget = (potentialTargets: Combatant[]) => {
  return potentialTargets.at(getRandomInt(potentialTargets.length));
};

const randomAliveTarget = (scene: World, potentialTargets: Combatant[]): Combatant => randomTarget(potentialTargets.filter(isAlive));


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
    { 
      option: Actions.attack, 
      weight: 100, 
      getTarget: (world, potentialTargets) => randomTarget(potentialTargets), 
      isValid: (world, caster) => true 
    },
    { 
      option: Actions.splinter, 
      weight: 500, 
      getTarget: randomAliveTarget, 
      isValid: (world, caster) => world.splinterNotCasted },
    { 
      option: Actions.engage, 
      weight: 500, 
      getTarget: randomAliveTarget, 
      isValid: (world, caster) => world.worldStore.allies.some(ally => ally.health === ally.maxHealth ) },
    { 
      option: Techniques.counter, 
      weight: 2000, 
      getTarget: randomAliveTarget, //
      isValid: (world, caster) => caster.activeTechniques.every(technique => technique.name !== Techniques.counter.name) 
    },
  ],
  selectedStrategyIndex: 0,

  activeTechniques: [Techniques.counter],
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

  activeTechniques: [],
};

export const enemies = [
  fencer,
  knight
]

// #endregion