import { Option } from './option';
import { Action } from './action';
import { Item } from './item';
import { clamp } from './math';
import { Folder } from './folder';

export enum Status {
  NORMAL = 'NORMAL',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
  CASTING = 'CASTING',  
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

  status: Status;
  queuedOption?: Action | Item | Folder;
  queuedTarget?: Combatant;
  timeInStateInMs: number;

  juggleDuration: number;
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

export const updateStamina = (target: Combatant, change: number): void => {
  target.stamina = Math.min(target.maxStamina, target.stamina + change);
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

export const updateMagic = (caster: Combatant, change: number): void => {
  const magicCost = clamp(0, change, caster.magic);
  const healthCost = clamp(0, change - caster.magic, caster.health);
  
  caster.magic -= magicCost;
  caster.health -= healthCost;
};

export const resetCombatantBattleState = (combatant: Combatant): void => {
  combatant.status = Status.NORMAL;
  combatant.queuedOption = null;
  combatant.queuedTarget = null;
  combatant.timeInStateInMs = 0;
}