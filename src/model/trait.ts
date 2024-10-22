import { Combatant } from './combatant';
import { Enemy, Behavior } from './enemy';
import { Allies } from './ally';

export interface Trait {
  name: string;
  description: string;
  onStart?: (combatant: Combatant) => void;
  onUpdate: (enemies: Enemy[], allies: Allies, behaviors: Behavior[]) => Behavior[];
}
