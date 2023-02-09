import { Combatant } from "./combatant";

export type PartyMember = Combatant & {
  // imageUrl: String;
}

export interface Party {
  members: PartyMember[];
}
