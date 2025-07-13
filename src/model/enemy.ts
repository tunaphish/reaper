import { Combatant } from './combatant';
import { OptionType } from './option';
import { Battle } from '../scenes/battle/Battle';
import { Action } from './action';
import { Item } from './item';
import { Folder } from './folder';

  // valid: (enemy: Enemy, scene: Battle) => boolean;
  // getTarget: (scene: Battle, caster: Combatant) => Combatant;

export interface PotentialOption {
  option: (Action | Item | Folder);
  getTarget: (scene: Battle, caster: Combatant) => Combatant | null;
  cadence: number;
  singleUse: boolean;
}



export interface Strategy {
  potentialOptions: PotentialOption[];
  toExit: (enemy: Enemy, battle: Battle) => boolean;
  toEnter: (enemy: Enemy, battle: Battle) => boolean;
}


export type Enemy = Combatant & {
  type: OptionType.ENEMY;

  strategies: Strategy[];
  
  // temp vars
  strategyIndex?: number;
  timeTilNextAction: number;
};
