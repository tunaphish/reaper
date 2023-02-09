import { Behavior, Enemy } from "./enemy";
import { Party } from "./party";

export interface Emotion {
  name: string,
  display: string,
  // onApply: () => void; 
  onUpdate: (enemies: Enemy[], party: Party, behaviors: Behavior[]) => void;
  // onRemove
}

