import { Soul } from "../model/soul";
import { OptionType } from "../model/option";
import * as Actions from './actions';
import * as Allies from "../data/allies"

export const hunter: Soul = {
    type: OptionType.SOUL,
    name: 'Hunter',
    desc: 'Soul focused on stamina',
    passive: 'Doubles stamina regen rate, halves max stamina',
    options: [Actions.ambush, Actions.debilitate],
}

export const berserker: Soul = {
    type: OptionType.SOUL,
    name: 'Berserker',
    desc: 'Soul focused on bleed',
    passive: 'Actions cost bleed instead of stamina',
    options: [Actions.bloodlust, Actions.revenge],
    owner: Allies.Keshi,
}

export const cleric: Soul = {
    type: OptionType.SOUL,
    name: 'Cleric',
    desc: 'Soul focused on healing',
    passive: 'Revive once per battle',
    options: [Actions.salve, Actions.resurrect, Actions.bandage],
    owner: Allies.Elise,
}

export const fencer: Soul = {
    type: OptionType.SOUL,
    name: 'Fencer',
    desc: 'Soul focused on elegant attacks',
    passive: 'Actions used for the first time will have boosted potency',
    options: [Actions.engage, Actions.flourish, Actions.splinter, Actions.prick],
    owner: Allies.Eji
}

export const ALL_SOULS = [hunter, berserker, cleric, fencer];

// pirate