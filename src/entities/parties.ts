import { PartyMember, Party } from "../entities/party"

export const Eji: PartyMember = {
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  traits: [],
}

export const Keshi: PartyMember = {
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  traits: [],
}

export const Elise: PartyMember = {
  name: 'Elise',
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  traits: [],
}

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise]
}