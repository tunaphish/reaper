import { PartyMember, Party, Option } from "./party"
import { slash, block, heal } from "./actions"

export const Eji: PartyMember = {
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  traits: [],
  primaryOptions: [
    {
      name: "ATTACK",
      options: [slash]
    },
    {
      name: "DEFEND",
      options: [block, heal]
    },
    {
      name: "TALK",
      options: [heal]
    },
    {
      name: "ITEM",
      options: [slash]
    }
  ],
  options: [],
}

export const Keshi: PartyMember = {
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  traits: [],
  primaryOptions: [
    {
      name: "KILL",
      options: [slash]
    },
    {
      name: "COWARD",
      options: [block, heal]
    },
    {
      name: "TALK",
      options: [heal]
    },
    {
      name: "ITEM",
      options: [slash]
    }
  ],  options: [],
}

export const Elise: PartyMember = {
  name: 'Elise',
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  traits: [],
  primaryOptions: [
    {
      name: "WHAM",
      options: [slash]
    },
    {
      name: "NOT WHAM",
      options: [block, heal]
    },
    {
      name: "TALK",
      options: [heal]
    },
    {
      name: "ITEM",
      options: [slash]
    }
  ],
  options: [],
}

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise]
}