import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { Combatant } from '../model/combatant';
import { OptionType } from '../model/option';
import { getRandomInt } from '../model/math';

import * as Actions from './actions';

import { Battle } from '../scenes/battle/Battle';


// #region Target
const isAlive = (unit: Combatant) => unit.health !== 0;

const randomEnemy = (scene: Battle, caster: Combatant) => {
  const aliveEnemies = scene.battleStore.enemies.filter(isAlive);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
};
const highestBleedEnemy = (scene: Battle, caster: Combatant) => {
  const aliveEnemies = scene.battleStore.enemies.filter(isAlive);
  return aliveEnemies.reduce((highest, enemy) => {
    return enemy.bleed > highest.bleed ? enemy : highest;
  });
};

export const randomAlly = (scene: Battle, caster: Combatant) => {
  const aliveAlly = scene.battleStore.allies.filter(isAlive);
  return aliveAlly.at(getRandomInt(aliveAlly.length));
};

export const randomFullHealthAlly = (scene: Battle, caster: Combatant) => {
  const fullHealthAlly = scene.battleStore.allies
    .filter(isAlive)
    .filter(combatant => combatant.health === combatant.maxHealth);
  return fullHealthAlly.length === 0 ? null : fullHealthAlly.at(getRandomInt(fullHealthAlly.length));
};

export const self = (scene: Battle, caster: Combatant) => caster;


// #endregion


// #region Enemies
export const fencer: Enemy = {
  type: OptionType.ENEMY,
  name: 'Fencer',
  health: 100,
  maxHealth: 200,
  bleed: 0,
  actionPoints: 0,
  maxActionPoints: 125,
  actionPointsRegenRatePerSecond: 8,
  
  strategies: [
    {
      potentialOptions: [
        { option: Actions.attack, getTarget: randomAlly, cadence: 500, singleUse: false }
      ],
      toExit: (enemy, battle): boolean => enemy.actionPoints < 25,
      toEnter: (enemy): boolean => enemy.actionPoints > 100,
    },
    {
      potentialOptions: [],
      toExit: (enemy, battle): boolean => enemy.actionPoints > 100,
      toEnter: (enemy): boolean => enemy.actionPoints > 50,
    },
    {
      potentialOptions: [],
      toExit: (enemy, battle): boolean => enemy.actionPoints > 50,
      toEnter: (): boolean => true,
    }
  ],

  // temp props
  timeTilNextAction: 0,
  status: Status.NORMAL,
  position: [-1, 0, -10],

  activeTechniques: new Set(),
};



export const knight: Enemy = {
  type: OptionType.ENEMY,
  name: 'Knight',
  health: 200,
  maxHealth: 200,
  bleed: 0,
  actionPoints: 0,
  maxActionPoints: 125,
  actionPointsRegenRatePerSecond: 5,

  strategies: [
    {
      potentialOptions: [
        { option: Actions.attack, getTarget: randomAlly, cadence: 500, singleUse: false  }
      ],

      toExit: (enemy, battle): boolean => enemy.actionPoints < 25,
      toEnter: (enemy): boolean => enemy.actionPoints > 75,
    },
    {
      potentialOptions: [],
      toExit: (enemy, battle): boolean => enemy.actionPoints > 75,
      toEnter: (): boolean => true,
    }
  ],

  // temp props
  timeTilNextAction: 0,

  status: Status.NORMAL,
  position: [1, 0, -5],

  activeTechniques: new Set(),
};

// #endregion