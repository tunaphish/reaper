import { Combatant } from './combatant';
import { Option } from './option';
import { TargetType } from "./targetType";

export enum ActionTags {
  HEAL,
  ATTACK,
  DEFEND,
  DEBUFF,
  BUFF,
}

export type Action = Option & {
  description: string;
  staminaCost: number;
  execute: (target: Combatant, source: Combatant) => void;
  tags: Set<ActionTags>;
  targetType: TargetType;
  soundKeyName?: string;
  imageKeyName?: string;
};
