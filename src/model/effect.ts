import { Battle } from "../scenes/battle/Battle";
import { Combatant } from "./combatant";
import { Option, OptionType } from "./option";


export type Effect = Option & {
  type: OptionType.EFFECT,
  description: string;
  
};
