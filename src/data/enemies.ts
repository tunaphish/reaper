import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { Combatant } from '../model/combatant';
import { OptionType } from '../model/option';
import { getRandomInt } from '../model/math';

import * as Actions from './actions';

import { Battle } from '../scenes/battle/Battle';


// Target Functions
const isAlive = (unit: Combatant) => unit.health !== 0;

const randomEnemy = (scene: Battle) => {
  const aliveEnemies = scene.battleStore.enemies.filter(isAlive);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
};

const randomAlly = (scene: Battle) => {
  const aliveEnemies = scene.battleStore.allies.filter(isAlive);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
};

const steepness = 5;
const sigmoidFunction = (enemy: Enemy, scene: Battle) => {
  const staminaRatio = enemy.stamina / enemy.maxStamina;
  const result = 1 / (1 + Math.exp(-steepness * (staminaRatio - 0.5)));
  return result;
}

function reverseSigmoid(enemy: Enemy, scene: Battle) {
  const staminaRatio =  enemy.bleed / 50; // 50 is avg attack
  const steepness = 5;
  const reverseProbability = 1 - (1 / (1 + Math.exp(-steepness * (staminaRatio - 0.5))));

  return reverseProbability;
}

export const healieBoi: Enemy = {
  type: OptionType.ENEMY,
  name: 'Healie Boi',
  health: 200,
  maxHealth: 200,
  bleed: 0,
  stamina: 0,
  maxStamina: 200,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 14,
  folder:{ type: OptionType.FOLDER, name: 'Healie Boi', desc: 'Healie Boi Menu', options: [Actions.bandage, Actions.attack]},
  
  status: Status.NORMAL,
  timeInStateInMs: 0,
  
  imageUrl: '/reaper/assets/characters/eji.png',
};
