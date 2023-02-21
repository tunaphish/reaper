import { PartyMember, Party } from './party';
import { Status } from './combatant';
import { slash, block, heal, annoy, stifle } from './actions';
import { anger, confusion } from './emotions';

export const Eji: PartyMember = {
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  stackedDamage: 0,
  stamina: 0,
  maxStamina: 400,
  traits: [],
  actions: [slash, block, heal, stifle],
  staminaRegenRate: 13,
  options: [
    {
      name: 'Attack',
      options: [slash.name],
      isInitialOption: true,
    },
    {
      name: 'Defend',
      options: [block.name],
      isInitialOption: true,
    },
    {
      name: stifle.name,
      options: [],
      isInitialOption: true,
    }
  ],
  status: Status.NORMAL,
  emotionalState: [{ emotion: confusion, count: 1 }],
};

export const Keshi: PartyMember = {
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  stackedDamage: 0,
  stamina: 0,
  maxStamina: 300,
  staminaRegenRate: 15,
  traits: [],
  actions: [slash, block, heal],
  options: [
    {
      name: 'Attack',
      options: [slash.name],
      isInitialOption: true,
    },
    {
      name: 'Defend',
      options: [block.name, 'Restoration'],
      isInitialOption: true,
    },
    {
      name: 'Restoration',
      options: [heal.name],
    },
  ],
  status: Status.NORMAL,
  emotionalState: [{ emotion: anger, count: 1 }],
};

export const Elise: PartyMember = {
  name: 'Elise',
  health: 100,
  stackedDamage: 0,
  maxHealth: 100,
  stamina: 0,
  maxStamina: 500,
  staminaRegenRate: 10,
  traits: [],
  actions: [slash, block, heal, annoy],
  options: [
    {
      name: 'Attack',
      options: [slash.name],
      isInitialOption: true,
    },
    {
      name: 'Defend',
      options: [block.name],
      isInitialOption: true,
    },
    {
      name: 'Manipulation',
      options: [annoy.name],
      isInitialOption: true,
    },
  ],
  status: Status.NORMAL,
  emotionalState: [
    { emotion: anger, count: 1 },
    { emotion: confusion, count: 3 },
  ],
};

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise],
};
