
import { Emotion, Anger } from "./emotion";
import { Action, Slash, Block, Idle, HealSelf } from './action';


interface Behavior  {
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
  // imageUrl: String;
}

export const Sei: Enemy = {
  name: 'Sei',
  health: 100,
  maxHealth: 100,
  stamina: 0,
  maxStamina: 200,
  behaviors: [
    { action: Slash, weight: 100 }, 
    { action: Block, weight: 100 },
    { action: HealSelf, weight: 50 },
    { action: Idle, weight: 200 },
  ],
  emotionalState: new Map(),
}
