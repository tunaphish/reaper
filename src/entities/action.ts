import { Enemy } from "./enemy";
import { Party } from "./party";
import { getRandomInt } from "../util/random";

export enum ActionTags {
  HEAL,
  ATTACK,
  DEFEND,
  DEBUFF,
  BUFF
}

export interface Action {
  name: string;
  staminaCost: number;
  execute: (enemy: Enemy, party: Party) => void; 
  tags: Set<ActionTags>,
}

export const slash: Action = {
  name: 'Slash',
  staminaCost: 50,
  tags: new Set([ActionTags.ATTACK]),
  execute: (enemy, party) => {
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

export const block: Action = {
  name: 'Block', 
  staminaCost: 50,
  tags: new Set([ActionTags.DEFEND]),
  execute: (enemy, party) => {
    console.log('im a blockeeee');
  }
}

export const idle: Action = {
  name: 'Idle', 
  staminaCost: 0,
  tags: new Set([ActionTags.ATTACK]),
  execute: () => {
    console.log('im aint not doingo nothg');
  }
}

export const healSelf: Action = {
  name: 'Heal Self',
  staminaCost: 50,
  tags: new Set([ActionTags.HEAL]),
  execute: (enemy) => {
    const HEALTH = 50;
    enemy.health = Math.min(enemy.maxHealth, enemy.health += HEALTH);
    console.log('we self healin');
  }
}