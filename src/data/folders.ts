import { Folder } from "../model/folder";
import { OptionType } from "../model/option";
import * as Actions from './actions';

export const hunter: Folder = {
    type: OptionType.FOLDER,
    name: 'Hunter',
    desc: 'Soul focused on stamina',
    options: [Actions.ambush, Actions.debilitate],
}

export const thief: Folder = {
    type: OptionType.FOLDER,
    name: 'Bandit',
    desc: 'Soul focused on targeting',
    options: [Actions.flank, Actions.gangup],
}

export const berserker: Folder = {
    type: OptionType.FOLDER,
    name: 'Berserker',
    desc: 'Soul focused on bleed',
    options: [Actions.bloodlust, Actions.revenge],
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
    desc: 'Soul focused on restricting attacks for power',
    options: [Actions.engage, Actions.flourish, Actions.splinter, Actions.prick],
}