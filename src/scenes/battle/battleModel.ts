import { Enemy } from '../../entities/enemy';
import { Party } from '../../entities/party';

export interface DialogueTrigger {
  trigger: (enemies: Enemy[], party: Party) => boolean;
  scriptKeyName: string, 
}

export type BattleModel = {
  enemies: Enemy[];
  party: Party;
  activePartyMemberIndex: number;
  scriptFileName: string;
  dialogueTriggers: DialogueTrigger[];
};
