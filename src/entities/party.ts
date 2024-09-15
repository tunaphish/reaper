import { Action } from './action';
import { Combatant } from './combatant';

export interface Option {
  name: string;
  isInitialOption?: boolean;
}

export type Folder = Option & {
  options: Option[];
};

export type PartyMember = Combatant & {
  // imageUrl: String;
  options: Option[];
  // items
  // equipment
};

export interface Party {
  members: PartyMember[];
}
