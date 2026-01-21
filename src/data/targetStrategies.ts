import { Combatant } from "../model/combatant";
import { Battle } from "../scenes/battle/Battle";
import { getRandomInt } from "../model/math";

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


