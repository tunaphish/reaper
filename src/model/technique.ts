import { World } from "../scenes/world/World";
import { Combatant } from "./combatant";
import { Option, OptionType } from "./option";

export type Technique = Option & {
  type: OptionType.TECHNIQUE;
  actionPointsCost: number;
  description: string;
  castTimeInMs: number;
  
  soundKeyName: string;
  iconSrc?: string;
  conditionMet?: (world: World, caster: Combatant, target: Combatant) => boolean;

}
