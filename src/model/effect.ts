import { Battle } from "../scenes/battle/Battle";
import { Combatant } from "./combatant";


export type Effect = {
  execute: (target: Combatant, source: Combatant, potency: number, scene: Battle) => void;
  potency: number;
};
