import { Enemy } from '../model/enemy';
import { Combatant, Status } from '../model/combatant';
import { OptionType } from '../model/option';

import * as Actions from './actions';
import * as Techniques from './techniques';
import { getRandomInt } from '../model/math';
import { World } from '../scenes/world/World';
import { Action } from '../model/action';


const isAlive = (target: Combatant) => target.status !== Status.DEAD;
const hasTechnique = (combatant => combatant.activeTechniques.length > 0);

const randomTarget = (potentialTargets: Combatant[]) => {
  return potentialTargets.at(getRandomInt(potentialTargets.length));
};

const randomAliveAlly = (scene: World, action: Action, caster: Enemy): Combatant => {
  const potentialTargets = scene.worldStore.allies
    .filter(ally => !action.conditionMet || action.conditionMet(this, caster, ally))
    .filter(isAlive);
  return randomTarget(potentialTargets.length > 0 ? potentialTargets : scene.worldStore.allies);
};


const randomAllyWithTechnique = (scene: World, action: Action, caster: Enemy): Combatant => {
  const potentialTargets = scene.worldStore.allies
    .filter(hasTechnique)
    .filter(isAlive);
  return randomTarget(potentialTargets.length > 0 ? potentialTargets : scene.worldStore.allies);
};

const self = (scene: World, action: Action, caster: Enemy): Combatant => caster;


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
      option: Actions.magic, 
      weight: 0, 
      getTarget: randomAllyWithTechnique, 
      isValid: (world, caster) => world.worldStore.allies.some(hasTechnique) 
    },
    { 
      option: Actions.attack, 
      weight: 100, 
      getTarget: randomAliveAlly, 
      isValid: (world, caster) => true 
    },
    { 
      option: Actions.splinter, 
      weight: 500, 
      getTarget: randomAliveAlly, 
      isValid: (world, caster) => world.splinterNotCasted },
    { 
      option: Actions.engage, 
      weight: 500, 
      getTarget: randomAliveAlly, 
      isValid: (world, caster) => world.worldStore.allies.some(ally => ally.health === ally.maxHealth ) },
    { 
      option: Techniques.counter, 
      weight: 2000, 
      getTarget: self, 
      isValid: (world, caster) => caster.activeTechniques.every(technique => technique.name !== Techniques.counter.name) 
    },
  ],
  selectedStrategyIndex: 4,

  activeTechniques: [],
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