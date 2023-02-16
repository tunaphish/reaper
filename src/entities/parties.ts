import { PartyMember, Party } from './party';
import { slash, block, heal } from './actions';
import { anger, confusion } from './emotions';

export const Eji: PartyMember = {
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  stamina: 25,
  maxStamina: 100,
  traits: [],
  actions: [ slash, block, heal ],
  options: [
    {
      name: 'ATTACK',
      options: [slash.name],
      isInitialOption: true,
    },
    {
      name: 'DEFEND',
      options: [block.name, 'UHH'],
      isInitialOption: true,
    },
    {
      name: 'UHH',
      options: [heal.name]
    }
  ],
  emotionalState: [
    { emotion: confusion, count: 1}
  ],
};

export const Keshi: PartyMember = {
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  stamina: 25,
  maxStamina: 100,
  traits: [],
  actions: [ slash, block, heal ],
  options: [
    {
      name: 'ATTACK',
      options: [slash.name],
      isInitialOption: true,
    },
    {
      name: 'DEFEND',
      options: [block.name, 'UHH'],
      isInitialOption: true,
    },
    {
      name: 'UHH',
      options: [heal.name]
    }
  ],
  emotionalState: [{ emotion: anger, count: 1}],
};

export const Elise: PartyMember = {
  name: 'Elise',
  health: 100,
  maxHealth: 100,
  stamina: 25,
  maxStamina: 100,
  traits: [],
  actions: [ slash, block, heal ],
  options: [
    {
      name: 'ATTACK',
      options: [slash.name],
      isInitialOption: true,
    },
    {
      name: 'DEFEND',
      options: [block.name, 'UHH'],
      isInitialOption: true,
    },
    {
      name: 'UHH',
      options: [heal.name]
    }
  ],
  emotionalState: [
    { emotion: anger, count: 1},
    { emotion: confusion, count: 1}
  ],
};

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise],
};
