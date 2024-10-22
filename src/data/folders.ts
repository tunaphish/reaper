import { Folder } from "../model/folder";
import { OptionType } from "../model/option";
import * as Actions from './actions';
import * as Spells from './spells'
export const hunter: Folder = {
    type: OptionType.FOLDER,
    name: 'Hunter',
    desc: 'Soul focused on stamina',
    options: [Spells.CHARGE, Actions.ambush, Actions.debilitate],
}

export const thief: Folder = {
    type: OptionType.FOLDER,
    name: 'Bandit',
    desc: 'Soul focused on targeting',
    options: [Spells.DUAL, Actions.flank, Actions.gangup],
}

export const berserker: Folder = {
    type: OptionType.FOLDER,
    name: 'Berserker',
    desc: 'Soul focused on bleed',
    options: [Spells.CLEAVE, Actions.bloodlust, Actions.revenge],
}

export const cleric: Folder = {
    type: OptionType.FOLDER,
    name: 'Cleric',
    desc: 'Soul focused on healing',
    options: [Actions.salve, Actions.resurrect, Actions.bandage],
}

export const fencer: Folder = {
    type: OptionType.FOLDER,
    name: 'Fencer',
    desc: 'Soul focused on delicate but powerful attacks',
    options: [Spells.ZANTETSUKEN, Actions.engage, Actions.flourish, Actions.splinter, Actions.prick],
}