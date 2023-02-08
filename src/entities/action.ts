import { Enemy } from "./enemy";
import { Party, PartyMember } from "./party";
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
  execute: (enemies: Enemy[], party: Party, target: Enemy | PartyMember) => void; 
  tags: Set<ActionTags>,
}

export const slash: Action = {
  name: 'Slash',
  staminaCost: 50,
  tags: new Set([ActionTags.ATTACK]),
  execute: (enemies, party, target) => {
    const DAMAGE = 50;
    target.health -= DAMAGE;
  }
}

export const block: Action = {
  name: 'Block', 
  staminaCost: 50,
  tags: new Set([ActionTags.DEFEND]),
  execute: (enemies, party) => {
  }
}

export const idle: Action = {
  name: 'Idle', 
  staminaCost: 0,
  tags: new Set([ActionTags.ATTACK]),
  execute: () => {
  }
}

export const heal: Action = {
  name: 'Heal',
  staminaCost: 50,
  tags: new Set([ActionTags.HEAL]),
  execute: (enemies) => {
    const HEALTH = 50;
    const enemy = enemies[0];
    enemy.health = Math.min(enemy.maxHealth, enemy.health += HEALTH);
  }
}