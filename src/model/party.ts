import { Combatant } from './combatant';
import { Option } from './option';
import { OptionType } from './option';

export type Folder = Option & {
  type: OptionType.FOLDER;
  options: Option[];
};

export type PartyMember = Combatant & {
  type: OptionType.MEMBER;
  folder: Folder;
};

export interface Party {
  members: PartyMember[];
}
