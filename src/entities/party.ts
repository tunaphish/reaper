import { Action } from './action';
import { Combatant } from './combatant';

export interface Option {
  name: string;
  options: string[];
  isInitialOption?: boolean;
}

export enum Status {
  NORMAL = 'NORMAL',
  BLOCKING = 'BLOCKING',
  EXHAUSTED = 'EXHAUSTED', 
  DEAD = 'DEAD',
}

export type PartyMember = Combatant & {
  // imageUrl: String;
  options: Option[];
  actions: Action[];
  status: Status;
  // items
  // equipment
};

export interface Party {
  members: PartyMember[];
}
