import { Combatant } from './combatant';
import { Folder } from './folder';
import { OptionType } from './option';

export type Ally = Combatant & {
  folder: Folder;
  type: OptionType.ALLY;
  menuPortraitPath: string;
};

export type Allies = Ally[];