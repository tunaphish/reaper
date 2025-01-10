import { Combatant } from './combatant';
import { OptionType } from './option';
import { Battle } from '../scenes/battle/Battle';
import { Action } from './action';
import { Item } from './item';
import { Folder } from './folder';
import { Reaction } from './reaction';

export interface Behavior {
  options: (Action | Item | Folder | Reaction)[];
  valid: (enemy: Enemy, scene: Battle) => boolean;
  getTarget: (scene: Battle, caster: Combatant) => Combatant;
  text: string;
}

export type Enemy = Combatant & {
  type: OptionType.ENEMY;

  reactions: Behavior[];
  behaviors: Behavior[];
  cadence: number;

  // temp vars
  optionQueue: (Action | Item | Folder | Reaction)[];
  targetFn: (scene: Battle, caster: Combatant) => Combatant;
  timeSinceLastAction: number;
  dialogue: string;
};
