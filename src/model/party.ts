import { Combatant } from './combatant';

export interface Option {
  name: string;
}

export type Folder = Option & {
  options: Option[];
};

export type PartyMember = Combatant & {
  folder: Folder;
};

export interface Party {
  members: PartyMember[];
}
