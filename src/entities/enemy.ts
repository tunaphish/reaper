import { Emotion, Anger } from "./emotion";
import { Action, slash, idle, heal } from './action';
import { Trait, selfPreservation } from "./trait";
import { TargetPriority, self, randomEnemy, randomParty } from "./targetPriority";

export interface Behavior {
  action: Action;
  weight: number;
  targetPriority: TargetPriority;
}

export interface Enemy {
  name: string,
  health: number;
  maxHealth: number;
  // stackedDamage: number;
  stamina: number;
  maxStamina: number;
  behaviors: Behavior[];
  emotionalState: Map<Emotion, Number>;
  traits: Trait[];
  // imageUrl: String;
}

export const healieBoi: Enemy = {
  name: 'Healie Boi',
  health: 25,
  maxHealth: 200,
  stamina: 0,
  maxStamina: 200,
  behaviors: [
    { action: slash, weight: 100, targetPriority: randomParty }, 
    { action: heal, weight: 25, targetPriority: randomEnemy },
    { action: idle, weight: 200, targetPriority: self },
  ],
  emotionalState: new Map(),
  traits: [
    selfPreservation,
  ],
}
