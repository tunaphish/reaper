import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { Combatant } from '../model/combatant';
import { OptionType } from '../model/option';
import { getRandomInt } from '../model/math';

import * as Actions from './actions';

import { Battle } from '../scenes/battle/Battle';


// #region Target
const isAlive = (unit: Combatant) => unit.health !== 0;

const randomEnemy = (scene: Battle) => {
  const aliveEnemies = scene.battleStore.enemies.filter(isAlive);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
};

const randomAlly = (scene: Battle) => {
  const aliveEnemies = scene.battleStore.allies.filter(isAlive);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
};

// #endregion


// #region Valid 
const steepness = 5;
const enoughStamina = (enemy: Enemy, scene: Battle) => {
  return enemy.stamina > 100;
}

// #endregion

// #region Enemies
export const slime: Enemy = {
  type: OptionType.ENEMY,
  name: 'Slime',
  health: 200,
  maxHealth: 200,
  bleed: 0,
  stamina: 0,
  maxStamina: 200,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 12,

  behaviors: [
    { option: Actions.attack, valid: enoughStamina, getTarget: randomAlly },
  ],

  imageUrl: '/reaper/assets/characters/eji.png',

  // temp props
  status: Status.NORMAL,
  timeInStateInMs: 0,
  juggleDuration: 0,  
};


// #endregion