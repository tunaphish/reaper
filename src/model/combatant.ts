import { Trait } from './trait';
import { Option } from './option';
import { Action } from './action';
import { Item } from './item';
import { Spell } from './spell';
import { Enemy } from './enemy';
import { PartyMember } from './party';

export enum Status {
  NORMAL = 'NORMAL',
  BLOCKING = 'BLOCKING',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
  CASTING = 'CASTING',
  ATTACKING = 'ATTACKING',
  CHARGING = 'CHARGING',
}

export enum JankenboBehavior {
  RANDOM,
  CYCLE,
  ALWAYS_ROCK,
}

export enum JankenbowThrow {
  ROCK,
  PAPER,
  SCISSORS,
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
  queuedTarget?: Enemy | PartyMember;

  activeSpells: Spell[];

  jankenboBehavior: JankenboBehavior;
  previousJankenboThrow?: JankenbowThrow;
}
