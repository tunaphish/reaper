import { Combatant } from './combatant';
import { Enemy } from './enemy';
import { Party, PartyMember } from './party';
import { Option } from './party';

export enum ActionTags {
  HEAL,
  ATTACK,
  DEFEND,
  DEBUFF,
  BUFF,
}

export type Action = Option & {
  staminaCost: number;
  execute: (enemies: Enemy[], party: Party, target: Combatant) => void;
  tags: Set<ActionTags>;
};
