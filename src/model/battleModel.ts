import { Enemy } from './enemy';
import { Party } from './party';

export interface DialogueTrigger {
  trigger: (enemies: Enemy[], party: Party) => boolean;
  scriptKeyName: string;
}

export type BattleModel = {
  enemies: Enemy[];
  party: Party;
  scriptFileName: string;
  dialogueTriggers: DialogueTrigger[];
};
