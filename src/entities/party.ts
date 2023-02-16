import { Action } from './action';
import { Combatant } from './combatant';

export interface Option {
  name: string;
  options: string[];
  isInitialOption?: boolean;
}

export type PartyMember = Combatant & {
  // imageUrl: String;
  options: Option[];
  actions: Action[];
  // items
  // equipment
};

export interface Party {
  members: PartyMember[];
}
