import { Combatant } from './combatant';
import { Enemy } from './enemy';
import { Party } from './party';

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

export type Action = {
  name: string;
  staminaCost: number;
  execute: (enemies: Enemy[], party: Party, target: Combatant) => void;
  tags: Set<ActionTags>;
  targetType: TargetType;
  soundKeyName?: string;
  imageKeyName?: string;
};
