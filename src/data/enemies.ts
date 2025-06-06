import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { Combatant } from '../model/combatant';
import { getRandomInt } from '../model/math';
import * as Actions from './actions';


import { Battle } from '../scenes/battle/Battle';


// #region Target
const isAlive = (combatant: Combatant) => combatant.health !== 0;

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
  name: 'Fencer',
  health: 200,
  maxHealth: 200,
  spritePath: '/reaper/sprites/enemies/chansey.png',
  strategies: [
    {
      actions: [Actions.attack, Actions.attack],
      timeTilExecute: 5000,
      name: 'Dual Attack',
      selectTarget: randomAlly,
    },
    {
      actions: [Actions.attack, Actions.attack, Actions.attack],
      timeTilExecute: 7000,
      name: 'Triple Attack',
      selectTarget: randomAlly,
    },
  ],

    // temp
    bleed: 0,
    timeSinceLastAction: 0,
    status: Status.NORMAL,
    position: [3, 0, -5],
    actionIdx: 0,
    selectedStrategy: {
      actions: [Actions.attack, Actions.attack],
      timeTilExecute: 5000,
      name: 'Dual Attack',
      selectTarget: randomAlly,
    },
}

export const cleric: Enemy = {
  name: 'Cleric',
  health: 200,
  maxHealth: 200,
  spritePath: '/reaper/sprites/enemies/chansey.png',
  strategies: [
    {
      actions: [Actions.attack, Actions.attack],
      timeTilExecute: 5000,
      name: 'Dual Attack',
      selectTarget: randomAlly,
    },
    {
      actions: [Actions.attack, Actions.attack, Actions.attack],
      timeTilExecute: 7000,
      name: 'Triple Attack',
      selectTarget: randomAlly,
    },
  ],

  // temp
  bleed: 0,
  timeSinceLastAction: 0,
  status: Status.NORMAL,
  position: [3, 0, -5],
  actionIdx: 0,
  selectedStrategy: {
    actions: [Actions.attack, Actions.attack],
    timeTilExecute: 5000,
    name: 'Dual Attack',
    selectTarget: randomAlly,
  },
};

// #endregion