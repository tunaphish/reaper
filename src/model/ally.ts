import { Combatant } from './combatant';
import { Folder } from './folder';
import { OptionType } from './option';

export type Ally = Combatant & {
  type: OptionType.ALLY;
  folder: Folder;
};

export type Allies = Ally[];