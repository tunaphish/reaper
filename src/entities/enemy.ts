import { Action } from './action';
import { Party } from './party';
import { Combatant } from './combatant';

export type TargetPriority = (enemies: Enemy[], party: Party, enemy: Enemy) => Combatant[];

export interface Behavior {
  action: Action;
  weight: number;
  targetPriority: TargetPriority;
  dialoguePool?: string[];
}

export type Enemy = Combatant & {
  behaviors: Behavior[];
  // imageUrl: String;
};
