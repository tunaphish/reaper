import { Option, OptionType } from './option';
import { clamp } from './math';
import { Technique } from './technique';
import { Action } from './action';

export enum Status {
  NORMAL = 'NORMAL',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
}


export type Combatant = Option & {
  type: OptionType;

  health: number;
  maxHealth: number;
  bleed: number;

  actionPoints: number;
  maxActionPoints: number;
  actionPointsRegenRatePerSecond: number; 

  activeTechniques: Technique[];
  status: Status;

  castingAction?: {
    target: Combatant;
    action: Action;
    castedTimeInMs: number;
  }
}

export const updateHealth = (target: Combatant, change: number): void => {
  if (target.health + change > target.maxHealth) {
    target.bleed -= (target.health + change) - target.maxHealth;
  }
  target.health = Math.min(target.maxHealth, target.health + change);
};

export const updateBleed = (target: Combatant, change: number): void => {
  const newBleed = target.bleed + change;
  target.bleed = clamp(0, newBleed, target.health);
};

export const updateDamage = (target: Combatant, change: number): void => {
  if (target.status === Status.EXHAUSTED) {
    change *= 2;
  }
  
  if (change < 0) {
    updateBleed(target, change);
    return;
  }

  if (target.bleed + change > target.health) {
    const newHealth = target.health - (target.bleed+change - target.health);
    target.health = clamp(0, newHealth, target.maxHealth);
    target.bleed = target.health;
  } else {
    const newBleed = target.bleed + change;
    target.bleed = clamp(0, newBleed, target.health);
  }
};


export const updateActionPoints = (target: Combatant, change: number): void => {
  target.actionPoints = target.actionPoints + change;
};

export const techniqueIsActive = (combatant: Combatant, technique: Technique): boolean => combatant.activeTechniques.some(t => t.name === technique.name);
