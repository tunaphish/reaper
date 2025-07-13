import { Battle } from "../scenes/battle/Battle";
import { Combatant } from "./combatant";
import { Effect } from "./effect";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";
import { ParticleEffect } from "./mediaEffect";


export type Action = Option & {
  type: OptionType.ACTION;
  staminaCost: number;
  description: string;
  
  targetType: TargetType;

  effects: Effect[];

  soundKeyName: string;
  mediaEffects: (ParticleEffect)[];
}
