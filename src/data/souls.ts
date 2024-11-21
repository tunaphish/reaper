import { Soul } from "../model/soul";
import { OptionType } from "../model/option";
import * as Actions from './actions';
import * as Allies from "../data/allies"

export const hunter: Soul = {
    type: OptionType.SOUL,
    name: 'Hunter',
    description: 'Soul focused on stamina',
    passive: '(NOT IMPLEMENTED) Doubles stamina regen rate, halves max stamina',
    options: [Actions.ambush, Actions.debilitate],
    castTimeInMs: 1000,
}

export const berserker: Soul = {
    type: OptionType.SOUL,
    name: 'Berserker',
    description: 'Soul focused on bleed',
    passive: 'Actions cost bleed instead of stamina',
    options: [Actions.bloodlust, Actions.cull, Actions.revenge],
    owner: Allies.Keshi,
    castTimeInMs: 1000,
}

export const cleric: Soul = {
    type: OptionType.SOUL,
    name: 'Cleric',
    description: 'Soul focused on healing',
    passive: 'Revive once per battle',
    options: [Actions.salve, Actions.resurrect, Actions.bandage, Actions.succor],
    owner: Allies.Elise,
    castTimeInMs: 1000,
}

export const fencer: Soul = {
    type: OptionType.SOUL,
    name: 'Fencer',
    description: 'Soul focused on elegant attacks',
    passive: '(NOT IMPLEMENTED) Actions used for the first time will have boosted potency',
    options: [Actions.engage, Actions.flourish, Actions.splinter, Actions.prick],
    owner: Allies.Eji,
    castTimeInMs: 1000,
}

export const pirate: Soul = {
    type: OptionType.SOUL,
    name: 'Pirate',
    description: 'Soul focused on heavy attacks',
    passive: '(NOT IMPLEMENTED) Actions have doubled stamina cost, potency, and cast time',
    options: [Actions.expend],
    owner: Allies.Eji,
    castTimeInMs: 2000,
}

export const ALL_SOULS = [hunter, berserker, cleric, fencer, pirate];
