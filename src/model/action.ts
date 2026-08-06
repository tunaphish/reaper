import { Combatant } from "./combatant";
import { Event } from "./encounter";
import { Battle } from "../scenes/battle/Battle";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export type Action = Option & {
  type: OptionType.ACTION;
  description: string;
  targetType: TargetType;

  actionPointsCost: number;
  castTimeInMs?: number;

  castingImageSrc?: string;

  conditionMet?: (battle: Battle, caster: Combatant, target: Combatant) => boolean;
  events: Event[];
  interruptible?: boolean;
}
