export interface PartyMember {
  name: string;
  health: number;
  maxHealth: number;
  // stackedDamage: number;
  stamina: number;
  maxStamina: number;
  // imageUrl: String;
}

export interface Party {
  members: PartyMember[];
}

export const Eji: PartyMember = {
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
}

export const Keshi: PartyMember = {
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
}

export const Elise: PartyMember = {
  name: 'Elise',
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
}

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise]
}