import { Combatant } from './combatant';
import { OptionType } from './option';

export type Ally = Combatant & {
  type: OptionType.ALLY;
};

export type Allies = Ally[];