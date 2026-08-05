import { Battle } from '../scenes/battle/Battle';
import { Action } from './action';
import { Combatant } from './combatant';
import { Option, OptionType } from './option';

export type Strategy = {
  option: Option; 
  weight: number;
  isValid: (battle: Battle, caster: Combatant) => boolean;
  getTargets: (battle: Battle, action: Action, caster: Enemy) => Combatant[];
}

export type Enemy = Combatant & {
  journalDescription: string;
  type: OptionType.ENEMY;

  strategies: Strategy[];  
  selectedStrategyIndex: number;
  
  combatPortraitSrc: string; 
};
