import { PartyMember, Party, Folder } from '../model/party';
import { Status } from '../model/combatant';
import * as Actions from './actions';
import { anger, excited, confusion, depressed, disgusted, envious } from './emotions';
import { edgelord, empath, romantic } from './traits';

const ejiAttackFolder: Folder = {
  name: 'Attack',
  options: [Actions.slash],
  isInitialOption: true,
};
const ejiThiefFolder: Folder = {
  name: 'Thief',
  options: [Actions.stifle, Actions.drain, Actions.empathize],
  isInitialOption: true,
};
const ejiDefendFolder: Folder = {
  name: 'Defend',
  options: [Actions.block, Actions.stifle],
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
  traits: new Set([empath]),
  staminaRegenRate: 13,
  options: [ejiAttackFolder, ejiThiefFolder],
  status: Status.NORMAL,
  emotionalState: new Map([
    [anger, 0],
    [confusion, 2],
    [disgusted, 0],
    [envious, 0],
    [depressed, 0],
  ]),
};

const keshiAttackFolder: Folder = {
  name: 'Attack',
  options: [Actions.slash],
  isInitialOption: true,
};
const keshiBerserkerFolder: Folder = {
  name: 'Berserker',
  options: [Actions.channel, Actions.assault, Actions.slashAll, Actions.ankleSlice, Actions.finisher],
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
  traits: new Set([edgelord]),
  options: [keshiAttackFolder, keshiBerserkerFolder],
  status: Status.NORMAL,
  emotionalState: new Map([
    [anger, 0],
    [confusion, 1],
    [disgusted, 0],
    [envious, 0],
    [excited, 0],
  ]),
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
  options: [Actions.heal, Actions.gratitude],
  isInitialOption: true,
};
const eliseManipulationFolder: Folder = {
  name: 'Manipulation',
  options: [Actions.annoy, Actions.flirt, Actions.boast, Actions.excite, Actions.depress],
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
  traits: new Set([romantic]),
  options: [eliseAttackFolder, eliseRestorationFolder, eliseManipulationFolder],
  status: Status.NORMAL,
  emotionalState: new Map([
    [anger, 1],
    [confusion, 3],
    [disgusted, 0],
    [envious, 0],
  ]),
};

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise],
};
