import { Emotion } from '../model/emotion';
import { anger } from '../data/emotions';
import { Trait } from './trait';
import { edgelord, empath, romantic } from '../data/traits';

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
  emotionalState: Map<Emotion, number>;
  status: Status;
}

export const updateHealth = (target: Combatant, change: number): void => {
  target.health = Math.min(target.maxHealth, target.health + change);
};
export const updateStamina = (target: Combatant, change: number): void => {
  target.stamina = Math.min(target.maxStamina, target.stamina + change);
};

export const updateEmotionalState = (targets: Combatant[], emotion: Emotion, change: number): void => {
  targets.forEach((target) => {
    const count = target.emotionalState.get(emotion) || 0;
    if (change > 0) {
      if (target.traits.has(empath)) change += 1;
      if (target.traits.has(romantic)) updateStamina(target, 50);
      if (target.traits.has(edgelord) && emotion !== anger) updateEmotionalState([target], anger, 1);
    }
    const update = count + change > 0 ? count + change : 0;
    target.emotionalState.set(emotion, update);
  });
};

export const updateDamage = (target: Combatant, change: number): void => {
  if (target.status === Status.EXHAUSTED) {
    target.health = Math.max(0, target.health - change);
    return;
  }
  target.stackedDamage += change;
};
