import { TargetPriority } from './enemy';
import { Combatant } from './combatant';

import { getRandomInt } from '../util';

const filterDeadUnits = (unit: Combatant) => unit.health !== 0;
export const self: TargetPriority = (enemies, allies, enemy) => enemy;
export const randomEnemy: TargetPriority = (enemies) => {
  const aliveEnemies = enemies.filter(filterDeadUnits);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
};
export const randomAlly: TargetPriority = (enemies, allies) => {
  const alivealliesMembers = allies.filter(filterDeadUnits);
  return alivealliesMembers.at(getRandomInt(alivealliesMembers.length));
};
export const lowestHealthalliesMember: TargetPriority = (enemies, allies) => {
  const member = allies
    .filter(filterDeadUnits)
    .reduce((prevMember, currMember) =>
      prevMember === null || currMember.health < prevMember.health ? currMember : prevMember,
    );
  return member;
};
