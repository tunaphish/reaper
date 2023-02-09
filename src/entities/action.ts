import { Enemy } from "./enemy";
import { Party, PartyMember } from "./party";

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
