import { Trait } from "./trait";

export interface Combatant {
  name: string,
  health: number;
  maxHealth: number;
  // stackedDamage: number;
  stamina: number;
  maxStamina: number;
  // defense?
  traits: Trait[];
}