import { Trait } from './trait';
import { Option } from './option';
import { Action } from './action';
import { Item } from './item';
import { Spell } from './spell';
import { Enemy } from './enemy';
import { Ally } from './ally';

export enum Status {
  NORMAL = 'NORMAL',
  BLOCKING = 'BLOCKING',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
  CASTING = 'CASTING',
  ATTACKING = 'ATTACKING',
  CHARGING = 'CHARGING',
}

export enum JankenbowThrow {
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

  jankenboThrow: (combatant: Combatant) => JankenbowThrow;
  previousJankenboThrow?: JankenbowThrow;
}
