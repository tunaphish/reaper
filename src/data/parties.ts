import { PartyMember, Party, Folder } from '../model/party';
import { Status } from '../model/combatant';
import * as Actions from './actions';

const ejiAttackFolder: Folder = {
  name: 'Attack',
  options: [Actions.slash],
};
const ejiThiefFolder: Folder = {
  name: 'Thief',
  options: [Actions.drain],
};

export const Eji: PartyMember = {
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  stamina: 0,
  maxStamina: 400,
  magic: 100,
  maxMagic: 100,
  traits: new Set([]),
  staminaRegenRatePerSecond: 13,
  options: [ejiAttackFolder, ejiThiefFolder],
  status: Status.NORMAL,
};

const keshiAttackFolder: Folder = {
  name: 'Attack',
  options: [Actions.slash],
};
const keshiBerserkerFolder: Folder = {
  name: 'Berserker',
  options: [Actions.assault, Actions.ankleSlice, Actions.finisher],
};

export const Keshi: PartyMember = {
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  bleed: 100,
  stamina: 5,
  maxStamina: 300,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 15,
  traits: new Set([]),
  options: [keshiAttackFolder, keshiBerserkerFolder],
  status: Status.NORMAL,
};

const eliseAttackFolder: Folder = {
  name: 'Attack',
  options: [Actions.slash],
};

const eliseRestorationFolder: Folder = {
  name: 'Restoration',
  options: [Actions.heal],
};

export const Elise: PartyMember = {
  name: 'Elise',
  health: 0,
  bleed: 0,
  maxHealth: 100,
  stamina: 0,
  maxStamina: 500,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 10,
  traits: new Set([]),
  options: [eliseAttackFolder, eliseRestorationFolder],
  status: Status.NORMAL,
};

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise],
};
