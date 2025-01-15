import { Combatant } from './combatant';
import { OptionType } from './option';
import { Battle } from '../scenes/battle/Battle';
import { Action } from './action';
import { Item } from './item';
import { Folder } from './folder';
import { Reaction } from './reaction';

  // valid: (enemy: Enemy, scene: Battle) => boolean;
  // getTarget: (scene: Battle, caster: Combatant) => Combatant;

export interface PotentialOption {
  option: (Action | Item | Folder);
  getTarget: (scene: Battle, caster: Combatant) => Combatant | null;
  cadence: number;
}

export interface PotentialReaction {
  reaction: Reaction;
  getTarget: (scene: Battle, caster: Combatant) => Combatant | null;
}

export interface Strategy {
  potentialOptions: PotentialOption[];
  potentialReactions: PotentialReaction[];
  notification: string;
  strategyFulFilled: (enemy: Enemy, battle: Battle) => boolean;
  conditionFulfilled: (enemy: Enemy, battle: Battle) => boolean;
}

// reaction

export type Enemy = Combatant & {
  type: OptionType.ENEMY;

  strategies: Strategy[];
  
  // temp vars
  strategyIndex?: number;
  timeTilNextAction: number;
};
