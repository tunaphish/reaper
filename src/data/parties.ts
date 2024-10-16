import { PartyMember, Party, Folder } from '../model/party';
import { Status } from '../model/combatant';

import * as JankenboBehaviors from './jankenboBehaviors';
import * as Actions from './actions';
import * as Spells from './spells';
import { bomb, potion } from './items';
import { OptionType } from '../model/option';

const ejiThiefFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Thief',
  options: [Actions.drain],
};

const ejiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Eji',
  options: [ejiThiefFolder, Actions.slash, bomb, potion, Spells.CLEAVE],
}

export const Eji: PartyMember = {
  type: OptionType.MEMBER,
  activeSpells: [Spells.CLEAVE],
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
  flowDecayRatePerSecond: 3,
  staminaRegenRatePerSecond: 13,
  folder: ejiFolder,
  status: Status.NORMAL,
  takingDamage: false,
  jankenboThrow: JankenboBehaviors.cycle,
};


const keshiBerserkerFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Berserker',
  options: [Actions.assault, Actions.ankleSlice, Actions.finisher],
};

const keshiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Keshi',
  options: [keshiBerserkerFolder, Actions.slash, Spells.DUAL, Spells.ZANTETSUKEN],
}

export const Keshi: PartyMember = {
  type: OptionType.MEMBER,
  activeSpells: [Spells.JANKENBO],
  name: 'Keshi',
  health: 100,
  maxHealth: 100,
  bleed: 50,
  stamina: 100,
  maxStamina: 300,
  magic: 100,
  maxMagic: 100,
  flow: 0,
  flowDecayRatePerSecond: 5,
  staminaRegenRatePerSecond: 15,
  traits: new Set([]),
  folder: keshiFolder,
  status: Status.NORMAL,
  takingDamage: false,
  jankenboThrow: JankenboBehaviors.random,
};

const eliseRestorationFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Restoration',
  options: [Actions.heal],
};

const eliseFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Attack',
  options: [Actions.slash, eliseRestorationFolder, Spells.SADIST, Spells.CHARGE],
};

export const Elise: PartyMember = {
  type: OptionType.MEMBER,
  activeSpells: [Spells.CHARGE],
  name: 'Elise',
  health: 100,
  bleed: 0,
  maxHealth: 100,
  stamina: 500,
  maxStamina: 500,
  magic: 10,
  maxMagic: 100,
  flow: 15,
  flowDecayRatePerSecond: 7,
  staminaRegenRatePerSecond: 10,
  traits: new Set([]),
  folder: eliseFolder,
  status: Status.NORMAL,
  takingDamage: false,
  jankenboThrow: JankenboBehaviors.alwaysRock,
};

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise],
};
