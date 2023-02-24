import { Enemy, TargetPriority } from '../entities/enemy';
import { Combatant, Status } from '../entities/combatant';

import { slash, idle, heal } from './actions';
import { selfPreservation } from './traits';

import { getRandomInt } from '../util/random';
import { anger, disgusted, emptyEmotionalStateMap, envious, confusion } from './emotions';

const filterDeadUnits = (unit: Combatant) => unit.health !== 0;
export const self: TargetPriority = (enemies, party, enemy) => [enemy];
export const randomEnemy: TargetPriority = (enemies, party) => {
  const aliveEnemies = enemies.filter(filterDeadUnits);
  return [aliveEnemies.at(getRandomInt(aliveEnemies.length))];
};
export const randomParty: TargetPriority = (enemies, party) => {
  const alivePartyMembers = party.members.filter(filterDeadUnits);
  return [alivePartyMembers.at(getRandomInt(alivePartyMembers.length))];
};
export const lowestHealthPartyMember: TargetPriority = (enemies, party) => {
  const member = party.members
  .filter(filterDeadUnits)
  .reduce((prevMember, currMember) =>
    prevMember === null || currMember.health < prevMember.health ? currMember : prevMember,
  );
  return [member];
}

export const healieBoi: Enemy = {
  name: 'Healie Boi',
  health: 200,
  maxHealth: 200,
  stackedDamage: 0,
  stamina: 20,
  maxStamina: 800,
  staminaRegenRate: 25,
  behaviors: [
    { action: slash, weight: 100, targetPriority: randomParty },
    { action: heal, weight: 100, targetPriority: randomEnemy },
    { action: idle, weight: 100, targetPriority: self },
  ],
  emotionalState: new Map([
    [anger, 0],
    [confusion, 0],
    [disgusted, 0],
    [envious, 0]
  ]),
  traits: [selfPreservation],
  status: Status.NORMAL,
};
