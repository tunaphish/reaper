import { World } from '../scenes/world/World';
import { Action } from './action';
import { Combatant } from './combatant';
import { Option, OptionType } from './option';

export type Strategy = {
  option: Option; 
  weight: number;
  isValid: (world: World, caster: Combatant) => boolean;
  getTarget: (world: World, action: Action, caster: Enemy) => Combatant;
}

export type Enemy = Combatant & {
  journalDescription: string;
  type: OptionType.ENEMY;
  baseImageSrc: string;
  strategies: Strategy[];  
  selectedStrategyIndex: number;
};
