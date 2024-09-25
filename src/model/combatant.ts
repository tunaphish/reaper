import { Trait } from './trait';
import { Option } from './option';

export enum Status {
  NORMAL = 'NORMAL',
  BLOCKING = 'BLOCKING',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
}

export type Combatant = Option & {
  health: number;
  maxHealth: number;
  bleed: number;
  stamina: number;
  maxStamina: number;
  magic: number;
  maxMagic: number;
  staminaRegenRatePerSecond: number; 
  traits: Set<Trait>;
  status: Status;
  takingDamage: boolean;
}
