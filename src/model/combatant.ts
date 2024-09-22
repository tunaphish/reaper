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

export const updateHealth = (target: Combatant, change: number): void => {
  target.health = Math.min(target.maxHealth, target.health + change);
};
export const updateStamina = (target: Combatant, change: number): void => {
  target.stamina = Math.min(target.maxStamina, target.stamina + change);
};

export const updateDamage = (target: Combatant, change: number): void => {
  target.bleed += change;
  target.takingDamage = true;
};
