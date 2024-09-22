import { Combatant } from './combatant';
import { Option } from './option';

export type Folder = Option & {
  options: Option[];
};

export type PartyMember = Combatant & {
  folder: Folder;
};

export interface Party {
  members: PartyMember[];
}
