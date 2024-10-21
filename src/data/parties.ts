import { PartyMember, Party, Folder } from '../model/party';
import { Status } from '../model/combatant';

import * as JankenboBehaviors from './jankenboBehaviors';
import * as Actions from './actions';
import * as Spells from './spells';
import { bomb, potion } from './items';
import { OptionType } from '../model/option';



const ejiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Eji',
  options: [Actions.attack, bomb, potion, Spells.CLEAVE, Actions.ambush],
}

export const Eji: PartyMember = {
  type: OptionType.MEMBER,
  activeSpells: [],
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  bleed: 75,
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


const keshiFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Keshi',
  options: [Actions.attack, Spells.DUAL, Spells.ZANTETSUKEN, Actions.bloodlust, Actions.debilitate, Actions.engage, Actions.flank],
}

export const Keshi: PartyMember = {
  type: OptionType.MEMBER,
  activeSpells: [],
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

const eliseFolder: Folder = {
  type: OptionType.FOLDER,
  name: 'Attack',
  options: [Actions.attack, Spells.SADIST, Spells.CHARGE, Actions.bandage],
};

export const Elise: PartyMember = {
  type: OptionType.MEMBER,
  activeSpells: [],
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
