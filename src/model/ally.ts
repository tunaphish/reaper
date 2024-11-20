import { Combatant } from './combatant';
import { OptionType } from './option';
import { Soul } from './soul';

export type Ally = Combatant & {
  type: OptionType.ALLY;
  menuPortraitPath: string;
};

export type Allies = Ally[];