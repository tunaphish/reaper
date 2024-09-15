import { PartyMember, Party, Folder } from '../model/party';
import { Status } from '../model/combatant';
import * as Actions from './actions';

const ejiAttackFolder: Folder = {
  name: 'Attack',
  options: [Actions.slash],
  isInitialOption: true,
};
const ejiThiefFolder: Folder = {
  name: 'Thief',
  options: [Actions.drain],
  isInitialOption: true,
};
const ejiDefendFolder: Folder = {
  name: 'Defend',
  options: [Actions.block],
  isInitialOption: true,
};

export const Eji: PartyMember = {
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  stackedDamage: 0,
  stamina: 0,
  maxStamina: 400,
  magic: 100,
  maxMagic: 100,
  traits: new Set([]),
  staminaRegenRate: 13,
  options: [ejiAttackFolder, ejiThiefFolder],
  status: Status.NORMAL,
};

const keshiAttackFolder: Folder = {
  name: 'Attack',
  options: [Actions.slash],
  isInitialOption: true,
};
const keshiBerserkerFolder: Folder = {
  name: 'Berserker',
  options: [Actions.assault, Actions.slashAll, Actions.ankleSlice, Actions.finisher],
  isInitialOption: true,
};
const keshiDefendFolder: Folder = {
  name: 'Defend',
  options: [Actions.block],
  isInitialOption: true,
};

export const Keshi: PartyMember = {
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  stackedDamage: 0,
  stamina: 0,
  maxStamina: 300,
  magic: 100,
  maxMagic: 100,
  staminaRegenRate: 15,
  traits: new Set([]),
  options: [keshiAttackFolder, keshiBerserkerFolder],
  status: Status.NORMAL,
};

const eliseAttackFolder: Folder = {
  name: 'Attack',
  options: [Actions.slash],
  isInitialOption: true,
};
const eliseDefendFolder: Folder = {
  name: 'Defend',
  options: [Actions.block],
  isInitialOption: true,
};
const eliseRestorationFolder: Folder = {
  name: 'Restoration',
  options: [Actions.heal],
  isInitialOption: true,
};

export const Elise: PartyMember = {
  name: 'Elise',
  health: 100,
  stackedDamage: 0,
  maxHealth: 100,
  stamina: 0,
  maxStamina: 500,
  magic: 100,
  maxMagic: 100,
  staminaRegenRate: 10,
  traits: new Set([]),
  options: [eliseAttackFolder, eliseRestorationFolder],
  status: Status.NORMAL,
};

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise],
};
