import { Combatant } from './combatant';
import { OptionType } from './option';

export type Enemy = Combatant & {
  type: OptionType.ENEMY;
  imageUrl: string;
};
