import { Combatant } from './combatant';
import { Option } from './party';

export enum ActionTags {
  HEAL,
  ATTACK,
  DEFEND,
  DEBUFF,
  BUFF,
}

export enum TargetType {
  SELF = 'SElF',
  SINGLE_TARGET = 'SINGLE_TARGET',
  AOE = 'AOE',
  ALL = 'ALL',
}

export type Action = Option & {
  description: string;
  staminaCost: number;
  execute: (targets: Combatant[], source: Combatant) => void;
  tags: Set<ActionTags>;
  targetType: TargetType;
  soundKeyName?: string;
  imageKeyName?: string;
};
