import { Battle } from "../scenes/battle/Battle";
import { Combatant } from "./combatant";
import { ParticleEffect } from "./mediaEffect";

export enum ActionType {
  ATTACK = 'attack',
  DEFENSE = 'defense',
}

export type Action = {
  name: string;
  staminaCost: number;
  actionType: ActionType;
  description: string;
  effect: (battle: Battle, caster: Combatant, target: Combatant) => void;

  soundKeyName: string;
  // mediaEffects: (ParticleEffect)[];
}
