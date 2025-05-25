import { Action } from './action';
import { Combatant } from './combatant';

export type Ally = Combatant & {
  stamina: number;
  maxStamina: number;
  staminaRegenRatePerSecond: number;
  actions: Action[];


  menuPortraitPath: string;
};
