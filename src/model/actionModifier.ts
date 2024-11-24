import { Combatant } from "./combatant";

export type ActionModifier = {
  targets: Combatant[];
  potency: number;
  multiplier: number;
};
