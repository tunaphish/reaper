import { Battle } from "../scenes/battle/Battle";
import { Combatant } from "./combatant";
import { ParticleEffect } from "./mediaEffect";

export type Action = {
  name: string;
  staminaCost: number;
  description: string;
  effect: (battle: Battle, caster: Combatant, target: Combatant) => void;

  soundKeyName: string;
  // mediaEffects: (ParticleEffect)[];
}
