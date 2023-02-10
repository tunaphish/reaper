import { Enemy, TargetPriority } from '../entities/enemy';
import { Combatant } from '../entities/combatant';

import { slash, idle, heal } from './actions';
import { selfPreservation } from "./traits";

import { getRandomInt } from "../util/random"
import { anger } from './emotions';

// handle resurrection edge cases
// filter dead unit 
// dead enemy
// dead ally 
// random dead ally
const filterDeadUnits = (unit: Combatant) => unit.health !== 0;
export const self: TargetPriority = (enemies, party, enemy) => enemy;
export const randomEnemy: TargetPriority = (enemies, party) => {
  const aliveEnemies = enemies.filter(filterDeadUnits);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
}
export const randomParty: TargetPriority =  (enemies, party) => {
  const alivePartyMembers = party.members.filter(filterDeadUnits);
  return alivePartyMembers.at(getRandomInt(alivePartyMembers.length));
}
export const lowestHealthPartyMember: TargetPriority = (enemies, party) => party.members.filter(filterDeadUnits).reduce((prevMember, currMember) => prevMember === null  || currMember.health < prevMember.health ? currMember : prevMember);

export const healieBoi: Enemy = {
  name: 'Healie Boi',
  health: 25,
  maxHealth: 200,
  stamina: 0,
  maxStamina: 200,
  behaviors: [
    { action: slash, weight: 100, targetPriority: randomParty }, 
    { action: heal, weight: 100, targetPriority: randomEnemy },
    { action: idle, weight: 100, targetPriority: self },
  ],
  emotionalState: [], //[{ emotion: anger, count: 1}],
  traits: [
    selfPreservation,
  ],
}