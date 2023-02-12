import { Enemy } from '../../entities/enemy';
import { Party } from '../../entities/party';

export type BattleModel = {
  enemies: Enemy[];
  party: Party;
  activePartyMemberIndex: number;
}