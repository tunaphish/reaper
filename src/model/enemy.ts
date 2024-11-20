import { Combatant } from './combatant';
import { Option, OptionType } from './option';

import { Battle } from '../scenes/battle/Battle';
import { Folder } from './folder';

export interface Behavior {
  option: Option[]; // array to navigate through multiple menus
  getProbability: (enemy: Enemy, scene: Battle) => number;
  getTarget: (scene: Battle) => Combatant;
  dialoguePool: string[];
}

export type Enemy = Combatant & {
  type: OptionType.ENEMY;
  behaviors: Behavior[];
  imageUrl: string;
  folder: Folder;
};
