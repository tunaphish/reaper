import { Folder } from '../model/folder';
import { OptionType } from '../model/option';
import * as Actions from './actions';
import * as Techniques from './techniques';


export const basic: Folder = {
  name: 'Basic',
  desc: 'Basic Actions',
  type: OptionType.FOLDER,
  options: [ Actions.attack, Actions.smash, Actions.stanch, Actions.magic, Techniques.buff, Actions.shatter ]
}

export const fencer: Folder = {
  name: 'Fencer',
  desc: 'Strong Conditional Actions',
  type: OptionType.FOLDER,
  options: [ Actions.splinter, Actions.engage, Actions.pristine, Actions.prick ]
}

export const hunter: Folder = {
  name: 'Hunter',
  desc: 'Actions surrounding manipulation AP',
  type: OptionType.FOLDER,
  options: [ Actions.ambush, Techniques.haste ]
}
