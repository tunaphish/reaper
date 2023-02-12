import { Combatant } from './combatant';

export interface Option {
  name: string;
}

export type Folder = Option & {
  options: Option[];
};

export type PartyMember = Combatant & {
  // imageUrl: String;
  primaryOptions: Folder[];
  options: Option[];
  // items
  // equipment
};

export interface Party {
  members: PartyMember[];
}
