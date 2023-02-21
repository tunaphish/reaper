import { Emotion } from './emotion';
import { Trait } from './trait';

export enum Status {
  NORMAL = 'NORMAL',
  BLOCKING = 'BLOCKING',
  EXHAUSTED = 'EXHAUSTED', 
  DEAD = 'DEAD',
}

export interface Combatant {
  name: string;
  health: number;
  maxHealth: number;
  stackedDamage: number;
  stamina: number;
  maxStamina: number;
  staminaRegenRate: number; // per second
  traits: Trait[];
  emotionalState: { emotion: Emotion; count: number }[];
  status: Status;
}
