import { Enemy } from "./enemy"
import { Party, PartyMember } from "./party"
import { getRandomInt } from "../util/random"


// handle resurrection edge cases
// filter dead unit 
// dead enemy
// dead ally 
// random dead ally

export interface TargetPriority {
  selectTarget: (enemies: Enemy[], party: Party) => Enemy | PartyMember
}

export const self: TargetPriority = {
  selectTarget: (enemies, party) => {
    return enemies[0];
  }
}

export const randomEnemy: TargetPriority = {
  selectTarget: (enemies, party) => {
    return enemies[getRandomInt(enemies.length)]
  }
}

export const randomParty: TargetPriority = {
  selectTarget: (enemies, party) => {
    return party.members[getRandomInt(party.members.length)];
  }
}

export const lowestHealthPartyMember: TargetPriority = {
  selectTarget: (enemies, party) => {
    return party.members.reduce((prevMember, currMember) => prevMember === null  || currMember.health < prevMember.health ? currMember : prevMember);
  }
}