import { Battle } from "../scenes/battle/Battle";
import { Combatant } from "./combatant";
import { Effect } from "./effect";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";
import { ParticleEffect } from "./mediaEffect";

export type Restriction = {
  desc: string;
  isRestricted: (target: Combatant, source: Combatant, scene: Battle) => boolean;
}

export type Action = Option & {
  type: OptionType.ACTION;
  staminaCost: number;
  description: string;
  
  targetType: TargetType;
  castTimeInMs: number;

  effects: Effect[];
  restriction?: Restriction; 
  animTimeInMs: number;
  airtime?: number;

  soundKeyName: string;
  mediaEffects: (ParticleEffect)[];
}
