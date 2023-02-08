import { Enemy } from "./enemy";
import { Party } from "./party";
import { getRandomInt } from "../util/random";

export interface Action {
  name: string;
  staminaCost: number;
  executeAbility: (enemy: Enemy, party: Party) => void; // event emitters and listeners?
}

export const Slash: Action = {
  name: 'Slash',
  staminaCost: 50,
  executeAbility: (enemy, party) => {
    const randomTarget = getRandomInt(party.members.length);
    const DAMAGE = 50;
    party.members[randomTarget].health -= DAMAGE;
    // check min dmg
    // check defense
    // play sound
    // check if dead
    console.log('here i go slashin again');
  }
}

export const Block: Action = {
  name: 'Block', 
  staminaCost: 50,
  executeAbility: (enemy, party) => {
    console.log('im a blockeeee');
  }
}

export const Idle: Action = {
  name: 'Idle', 
  staminaCost: 0,
  executeAbility: () => {
    console.log('im aint not doingo nothg');
  }
}

export const HealSelf: Action = {
  name: 'Heal Self',
  staminaCost: 50,
  executeAbility: (enemy) => {
    const HEALTH = 50;
    enemy.health = Math.min(enemy.maxHealth, enemy.health += HEALTH);
    console.log('we self healin');
  }
}