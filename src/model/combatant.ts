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
  magic: number;
  maxMagic: number;
  staminaRegenRate: number; // per second
  traits: Set<Trait>;
  status: Status;
}

export const updateHealth = (target: Combatant, change: number): void => {
  target.health = Math.min(target.maxHealth, target.health + change);
};
export const updateStamina = (target: Combatant, change: number): void => {
  target.stamina = Math.min(target.maxStamina, target.stamina + change);
};

export const updateDamage = (target: Combatant, change: number): void => {
  if (target.status === Status.EXHAUSTED) {
    target.health = Math.max(0, target.health - change);
    return;
  }
  target.stackedDamage += change;
};
