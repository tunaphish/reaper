import { PartyMember, Party } from './party';
import { Status } from './combatant';
import { slash, block, heal, annoy, stifle, slashAll, finisher, flirt, ankleSlice, boast, excite, depress } from './actions';
import { anger, excited, confusion, depressed, disgusted, envious } from './emotions';

export const Eji: PartyMember = {
  name: 'Eji',
  health: 100,
  maxHealth: 100,
  stackedDamage: 0,
  stamina: 0,
  maxStamina: 400,
  traits: [],
  actions: [slash, slashAll, finisher, block, heal, stifle, ankleSlice],
  staminaRegenRate: 13,
  options: [
    {
      name: 'Attack',
      options: [slash.name, slashAll.name, ankleSlice.name, finisher.name],
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
    },
  ],
  status: Status.NORMAL,
  emotionalState: new Map([
    [anger, 0],
    [confusion, 0],
    [disgusted, 0],
    [envious, 0],
    [depressed, 0],
  ]),
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
  emotionalState: new Map([
    [anger, 1],
    [confusion, 0],
    [disgusted, 0],
    [envious, 0],
    [excited, 0],
  ]),
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
  actions: [slash, block, heal, annoy, flirt, boast, excite, depress],
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
      options: [annoy.name, flirt.name, boast.name, excite.name, depress.name],
      isInitialOption: true,
    },
  ],
  status: Status.NORMAL,
  emotionalState: new Map([
    [anger, 0],
    [confusion, 0],
    [disgusted, 0],
    [envious, 0],
  ]),
};

export const DefaultParty: Party = {
  members: [Eji, Keshi, Elise],
};
