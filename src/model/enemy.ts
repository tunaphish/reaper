import { World } from '../scenes/world/World';
import { Action } from './action';
import { Combatant } from './combatant';
import { Option, OptionType } from './option';

export type Strategy = {
  action: Action; // likely to change to option at some point.. use items stuff like that.. also apply technique lmao.. 
  weight: number;
  isValid: (world: World, caster: Combatant) => boolean;
  getTarget: (world: World, potentialTargets: Combatant[]) => Combatant;

}

export type Enemy = Combatant & {
  journalDescription: string;
  type: OptionType.ENEMY;
  baseImageSrc: string;
  strategies: Strategy[];  
  selectedStrategyIndex: number;
};
