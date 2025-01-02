import { Combatant } from './combatant';
import { OptionType } from './option';
import { Battle } from '../scenes/battle/Battle';
import { Action } from './action';
import { Item } from './item';
import { Folder } from './folder';

export interface Behavior {
  options: (Action | Item | Folder)[];
  valid: (enemy: Enemy, scene: Battle) => boolean;
  getTarget: (scene: Battle) => Combatant;
  text: string;
}

export type Enemy = Combatant & {
  type: OptionType.ENEMY;
  behaviors: Behavior[];
  cadence: number;

  // temp vars
  timeSinceLastAction: number;
};
