import { Combatant } from './combatant';
import { Folder } from './folder';
import { OptionType } from './option';

export type Ally = Combatant & {
  folder: Folder;
  type: OptionType.ALLY;  
  spritePath: string;
  menuPortraitPath: string;
};

export type Allies = Ally[];