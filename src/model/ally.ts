import { Combatant } from './combatant';
import { OptionType } from './option';
import { Soul } from './soul';

export type Ally = Combatant & {
  primarySoul: Soul;
  secondarySoul: Soul;
  type: OptionType.ALLY;
  menuPortraitPath: string;
};

export type Allies = Ally[];