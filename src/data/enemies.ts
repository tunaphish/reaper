import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { Combatant } from '../model/combatant';
import { OptionType } from '../model/option';
import { getRandomInt } from '../model/math';

import * as Actions from './actions';
import * as Reactions from './reactions';

import { Battle } from '../scenes/battle/Battle';


// #region Target
const isAlive = (unit: Combatant) => unit.health !== 0;

const randomEnemy = (scene: Battle, caster: Combatant) => {
  const aliveEnemies = scene.battleStore.enemies.filter(isAlive);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
};

export const randomAlly = (scene: Battle, caster: Combatant) => {
  const aliveEnemies = scene.battleStore.allies.filter(isAlive);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
};

export const self = (scene: Battle, caster: Combatant) => caster;

// #endregion


// #region Valid 
const isTrue = (enemy: Enemy, scene: Battle) => true;
const enoughStamina = (enemy: Enemy, scene: Battle) => {
  return enemy.stamina > 75;
}
const isCloseToBeingAttacked = (enemy: Enemy, scene: Battle) => {
  const actionsAtEnemyCloseToExecution = scene.battleStore.deferredActions.filter(
    deferredAction => deferredAction.target.name === enemy.name &&
    deferredAction.timeTilExecute < 500 &&
    deferredAction.reactions.length === 0
  );
  return actionsAtEnemyCloseToExecution.length > 0;
};

// #endregion

// #region Enemies
export const thief: Enemy = {
  type: OptionType.ENEMY,
  name: 'Thief',
  health: 200,
  maxHealth: 200,
  bleed: 0,
  stamina: 0,
  maxStamina: 125,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 10,
  
  cadence: 5000,
  behaviors: [
    { options: [Actions.attack, Actions.attack], valid: enoughStamina, getTarget: randomAlly, text: 'Thief is attacking randomly!' },
    { options: [], valid: isTrue, getTarget: randomAlly, text: 'Thief is waiting...' },
  ],
  reactions: [
    // { options: [Reactions.evade], valid: isCloseToBeingAttacked, getTarget: self, text: 'Thief avoids your attack!' },
    { options: [Reactions.block], valid: isCloseToBeingAttacked, getTarget: self, text: 'Thief blocks your attack!' },
  ],

  spritePath: '/reaper/sprites/enemies/ninetails.png',

  // temp props
  optionQueue: [],
  targetFn: randomAlly,
  status: Status.NORMAL,
  timeInStateInMs: 0,
  juggleDuration: 0,  
  timeSinceLastAction: 0,
  dialogue: '...',
};

export const thief2: Enemy = {
  type: OptionType.ENEMY,
  name: 'Thief2',
  health: 200,
  maxHealth: 200,
  bleed: 0,
  stamina: 0,
  maxStamina: 125,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 10,
  cadence: 5000,

  behaviors: [
    { options: [Actions.attack, Actions.attack], valid: enoughStamina, getTarget: randomAlly, text: 'Thief is attacking randomly!' },
    { options: [], valid: isTrue, getTarget: randomAlly, text: 'Thief is waiting...' },
  ],
  reactions: [],

  spritePath: '/reaper/sprites/enemies/thief-idle.png',

  // temp props
  optionQueue: [],
  targetFn: randomAlly,
  status: Status.NORMAL,
  timeInStateInMs: 0,
  juggleDuration: 0,  
  timeSinceLastAction: 0,
  dialogue: '...',
};


// #endregion