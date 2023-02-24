import { BattleModel } from '../scenes/battle/battleModel';
import { Combatant } from './combatant';

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
  description: string;
  staminaCost: number;
  execute: (model: BattleModel, targets: Combatant[]) => void;
  tags: Set<ActionTags>;
  targetType: TargetType;
  soundKeyName?: string;
  imageKeyName?: string;
};
