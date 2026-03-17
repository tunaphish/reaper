import { World } from "../scenes/world/World";
import { Combatant } from "./combatant";
import { Event } from "./encounter";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export type Action = Option & {
  type: OptionType.ACTION;
  description: string;
  targetType: TargetType;

  actionPointsCost: number;
  castTimeInMs: number;

  castingImageSrc: string;

  conditionMet?: (world: World, caster: Combatant, target: Combatant) => boolean;
  events: Event[];
}
