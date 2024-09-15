import { BattleModel } from './battleModel';
import { Combatant } from './combatant';
import { Enemy, Behavior } from './enemy';
import { Party } from './party';

export interface Trait {
  name: string;
  description: string;
  onStart?: (model: BattleModel, combatant: Combatant) => void;
  onUpdate: (enemies: Enemy[], party: Party, behaviors: Behavior[]) => Behavior[];
}
