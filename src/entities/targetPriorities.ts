import { TargetPriority } from "./enemy";
import { Combatant } from "./combatant";

import { getRandomInt } from "../util";

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
};