import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { Combatant } from '../model/combatant';
import { getRandomInt } from '../model/math';



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
  name: 'Fencer',
  health: 100,
  maxHealth: 200,

  spritePath: '/reaper/sprites/enemies/ninetails.png',

  // temp props
  bleed: 0,
  status: Status.NORMAL,
  position: [-1, 0, -10],
};

export const cleric: Enemy = {
  name: 'Cleric',
  health: 200,
  maxHealth: 200,
  bleed: 0,




  spritePath: '/reaper/sprites/enemies/chansey.png',

  // temp props

  status: Status.NORMAL,
  position: [3, 0, -5],
};

// #endregion