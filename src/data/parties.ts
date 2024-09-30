import { PartyMember, Party, Folder } from '../model/party';
import { Status } from '../model/combatant';
import * as Actions from './actions';


const ejiThiefFolder: Folder = {
  name: 'Thief',
  options: [Actions.drain],
};

const ejiFolder: Folder = {
  name: 'Eji',
  options: [ejiThiefFolder, Actions.slash],
}

export const Eji: PartyMember = {
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  stamina: 0,
  maxStamina: 400,
  magic: 100,
  maxMagic: 100,
  flow: 0,
  traits: new Set([]),
  staminaRegenRatePerSecond: 13,
  folder: ejiFolder,
  status: Status.NORMAL,
  takingDamage: false,
};


const keshiBerserkerFolder: Folder = {
  name: 'Berserker',
  options: [Actions.assault, Actions.ankleSlice, Actions.finisher],
};

const keshiFolder: Folder = {
  name: 'Keshi',
  options: [keshiBerserkerFolder, Actions.slash],
}

export const Keshi: PartyMember = {
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  stamina: 100,
  maxStamina: 300,
  magic: 100,
  maxMagic: 100,
  flow: 0,
  staminaRegenRatePerSecond: 15,
  traits: new Set([]),
  folder: keshiFolder,
  status: Status.NORMAL,
  takingDamage: false,
};

const eliseRestorationFolder: Folder = {
  name: 'Restoration',
  options: [Actions.heal],
};

const eliseFolder: Folder = {
  name: 'Attack',
  options: [Actions.slash, eliseRestorationFolder],
};

export const Elise: PartyMember = {
  name: 'Elise',
  health: 100,
  bleed: 0,
  maxHealth: 100,
  stamina: 0,
  maxStamina: 500,
  magic: 100,
  maxMagic: 100,
  flow: 0,
  staminaRegenRatePerSecond: 10,
  traits: new Set([]),
  folder: eliseFolder,
  status: Status.NORMAL,
  takingDamage: false,
};

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise],
};
