import { Combatant } from "../model/combatant";
import { World } from "../scenes/world/World";
import { getRandomInt } from "../model/math";


// const highestBleedEnemy = (scene: World, caster: Combatant, potentialTargets: Combatant[]) => {
//   const aliveEnemies = scene.worldStore.enemies.filter(isAlive);
//   return aliveEnemies.reduce((highest, enemy) => {
//     return enemy.bleed > highest.bleed ? enemy : highest;
//   });
// };

// export const randomFullHealthAlly = (scene: World, caster: Combatant, potentialTargets: Combatant[]) => {
//   const fullHealthAlly = scene.worldStore.allies
//     .filter(isAlive)
//     .filter(combatant => combatant.health === combatant.maxHealth);
//   return fullHealthAlly.length === 0 ? null : fullHealthAlly.at(getRandomInt(fullHealthAlly.length));
// };

export const randomTarget = (scene: World, potentialTargets: Combatant[]) => {
  return potentialTargets.at(getRandomInt(potentialTargets.length));
};

