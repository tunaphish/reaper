import { Combatant } from "./combatant";
import { Event } from "./encounter";
import { EncounterScene } from "../scenes/encounter/Encounter";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export type Action = Option & {
  type: OptionType.ACTION;
  description: string;
  targetType: TargetType;

  actionPointsCost: number;
  castTimeInMs: number;

  castingImageSrc?: string;

  conditionMet?: (encounter: EncounterScene, caster: Combatant, target: Combatant) => boolean;
  events: Event[];
  interruptible?: boolean;
}
