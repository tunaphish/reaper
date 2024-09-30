import { Trait } from './trait';
import { Option } from './option';
import { Action } from './action';

export enum Status {
  NORMAL = 'NORMAL',
  BLOCKING = 'BLOCKING',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
  CASTING = 'CASTING',
  ATTACKING = 'ATTACKING',
}

export type Combatant = Option & {
  health: number;
  maxHealth: number;
  bleed: number;
  stamina: number;
  maxStamina: number;
  magic: number;
  maxMagic: number;
  flow: number;

  staminaRegenRatePerSecond: number; 
  traits: Set<Trait>;
  status: Status;
  takingDamage: boolean;
  queuedAction?: Action;
  queuedTarget?: Combatant;
}
