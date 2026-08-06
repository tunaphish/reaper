import { Battle } from "../scenes/battle/Battle";
import { Combatant } from "./combatant";
import { WindowLayout } from "./encounter";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export type Technique = Option & {
  type: OptionType.TECHNIQUE;
  actionPointsCost: number;

  imageSrc?: string;
  windowLayout: WindowLayout;
  description: string;


  castTimeInMs: number;

  targetType: TargetType;
  
  soundKeyName: string;
  iconSrc?: string;
  conditionMet?: (battle: Battle, caster: Combatant, targets: Combatant[]) => boolean;

  options: Option[];
}
