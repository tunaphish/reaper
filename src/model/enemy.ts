import { Action } from './action';
import { Party } from './party';
import { Combatant } from './combatant';
import { OptionType } from './option';

export type TargetPriority = (enemies: Enemy[], party: Party, enemy: Enemy) => Combatant;

export interface Behavior {
  action: Action;
  weight: number;
  targetPriority: TargetPriority;
  dialoguePool?: string[];
}

export type Enemy = Combatant & {
  type: OptionType.ENEMY
  behaviors: Behavior[];
  imageUrl: string;
};
