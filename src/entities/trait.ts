import { Enemy, Behavior } from './enemy';
import { Party } from './party';

export interface Trait {
  name: string;
  description: string;
  onStart: (enemies: Enemy[], party: Party) => void;
  onUpdate: (enemies: Enemy[], party: Party, behaviors: Behavior[]) => Behavior[];
}
