import { Trait } from './trait';
import { isSameOption, Option } from './option';
import { Action } from './action';
import { Item } from './item';
import { Spell } from './spell';
import { Enemy } from './enemy';
import { Ally } from './ally';
import { clamp } from '../features/math';

export enum Status {
  NORMAL = 'NORMAL',
  BLOCKING = 'BLOCKING',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
  CASTING = 'CASTING',
  ATTACKING = 'ATTACKING',
  CHARGING = 'CHARGING',
}

export enum JankenboThrow {
  ROCK = "ROCK",
  PAPER = "PAPER",
  SCISSORS = "SCISSORS",
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
  flowDecayRatePerSecond: number;
  staminaRegenRatePerSecond: number; 
  
  traits: Set<Trait>;
  status: Status;
  takingDamage: boolean;
  queuedOption?: Action | Item | Spell;
  queuedTarget?: Enemy | Ally;

  activeSpells: Spell[];

  jankenboThrow: (combatant: Combatant) => JankenboThrow;
  previousJankenboThrow?: JankenboThrow;
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
  if (change > 0) {
    target.takingDamage = true;
  }

  if (target.status === Status.EXHAUSTED) {
    change *= 2;
  }

  if (change < 0) {
    updateBleed(target, change);
    return;
  }

  const newBleed = target.bleed + change;
  // const newHealth = target.health - (target.bleed+change - target.health);
  target.bleed = clamp(0, newBleed, target.health);
  // target.health = clamp(0, newHealth, target.maxHealth);
};

export const toggleActiveSpell = (caster: Combatant, spell: Spell): void => {
  const foundSpell: Spell = caster.activeSpells.find(isSameOption(spell));
  if (!!foundSpell) {
    const idx = caster.activeSpells.indexOf(foundSpell);
    caster.activeSpells.splice(idx, 1);
    return;
  }

  const flowCost = Math.min(spell.magicCost, caster.flow);
  const magicCost = clamp(0, spell.magicCost - caster.flow, caster.magic);
  const healthCost = clamp(0, spell.magicCost - (caster.flow + caster.magic), caster.health);
  caster.flow -= flowCost;
  caster.magic -= magicCost;
  caster.health -= healthCost;

  caster.activeSpells.push(spell);
};
