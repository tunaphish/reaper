import { EncounterScene } from "../scenes/encounter/Encounter";
import { Combatant } from "./combatant";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export type Technique = Option & {
  type: OptionType.TECHNIQUE;
  actionPointsCost: number;
  description: string;
  castTimeInMs: number;

  targetType: TargetType;
  
  soundKeyName: string;
  iconSrc?: string;
  conditionMet?: (encounter: EncounterScene, caster: Combatant, targets: Combatant[]) => boolean;

}
