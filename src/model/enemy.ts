import { EncounterScene } from '../scenes/encounter/Encounter';
import { Action } from './action';
import { Combatant } from './combatant';
import { Option, OptionType } from './option';

export type Strategy = {
  option: Option; 
  weight: number;
  isValid: (encounter: EncounterScene, caster: Combatant) => boolean;
  getTargets: (encounter: EncounterScene, action: Action, caster: Enemy) => Combatant[];
}

export type Enemy = Combatant & {
  journalDescription: string;
  type: OptionType.ENEMY;
  strategies: Strategy[];  
  selectedStrategyIndex: number;
  combatPortraitSrc: string; 
};
