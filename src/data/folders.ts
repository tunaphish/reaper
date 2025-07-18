import { Folder } from "../model/folder";
import { OptionType } from "../model/option";
import * as Actions from './actions';
import * as Effects from './effects';

export const fighter: Folder = {
    type: OptionType.FOLDER,
    name: 'Fighter',
    desc: 'Soul focused on fighting',
    options: [Actions.attack, Effects.strengthen],
}

