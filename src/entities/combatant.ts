import { Emotion } from './emotion';
import { Trait } from './trait';
import { empath, romantic } from './traits';

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
  staminaRegenRate: number; // per second
  traits: Set<Trait>;
  emotionalState: Map<Emotion, number>;
  status: Status;
}

export const updateStamina = (target: Combatant, change: number): void => { target.stamina = Math.min(target.maxStamina, target.stamina + change) };

export const updateEmotionalState = (targets: Combatant[], emotion: Emotion, change: number): void => {
  targets.forEach((target) => {
    const count = target.emotionalState.get(emotion) || 0;
    if (change > 0) {
      if (target.traits.has(empath)) change += 1;
      if (target.traits.has(romantic)) updateStamina(target, 50);
    }
    const update = count + change > 0 ? count + change : 0;
    target.emotionalState.set(emotion, update);
    console.log(target);
  });
};
