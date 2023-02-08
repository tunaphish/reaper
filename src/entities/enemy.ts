import { Emotion, Anger } from "./emotion";
import { Action, slash, idle, healSelf } from './action';
import { Trait, selfPreservation } from "./trait";

export interface Behavior {
  action: Action;
  weight: number;
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
    { action: slash, weight: 100 }, 
    { action: healSelf, weight: 25 },
    { action: idle, weight: 200 },
  ],
  emotionalState: new Map(),
  traits: [
    selfPreservation,
  ],
}
