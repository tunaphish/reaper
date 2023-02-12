import { Action } from './action';
import { Party } from './party';
import { Combatant } from './combatant';
import { Emotion } from './emotion';

export type TargetPriority = (enemies: Enemy[], party: Party, enemy: Enemy) => Combatant;

export interface Behavior {
  action: Action;
  weight: number;
  targetPriority: TargetPriority;
}

export type Enemy = Combatant & {
  behaviors: Behavior[];
  emotionalState: { emotion: Emotion; count: number }[];
  // imageUrl: String;
};
