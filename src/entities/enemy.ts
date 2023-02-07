
import { Emotion, Anger } from "./emotion";
import { Action, Slash, Block, Idle } from './action';


interface Behavior  {
  action: Action;
  weight: number;
}

export interface Enemy {
  health: number;
  maxHealth: number;
  // stackedDamage: number;
  stamina: number;
  maxStamina: number;
  behaviors: Behavior[];
  emotionalState: Map<Emotion, Number>;
  // imageUrl: String;
}

export const Eji: Enemy = {
  health: 100,
  maxHealth: 100,
  stamina: 0,
  maxStamina: 200,
  behaviors: [
    { action: Slash, weight: 100 }, 
    { action: Block, weight: 100 },
    { action: Idle, weight: 200 },
  ],
  emotionalState: new Map(),
}
