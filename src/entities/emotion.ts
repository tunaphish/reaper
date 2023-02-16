import { BattleModel } from '../scenes/battle/battleModel';
import { Behavior, Enemy } from './enemy';
import { Party } from './party';

export interface Emotion {
  name: string;
  display: string;
  // onApply: () => void;
  onUpdate: (enemies: Enemy[], party: Party, behaviors: Behavior[], count: number) => Behavior[];
  // onRemove
  // player behavior
  onClick: (model: BattleModel, options: string[], count: number) => string[];
}
