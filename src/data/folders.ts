import { Folder } from '../model/folder';
import { OptionType } from '../model/option';
import * as Actions from './actions';
import * as Techniques from './techniques';


export const basic: Folder = {
  name: 'Basic',
  desc: 'Basic Actions',
  type: OptionType.FOLDER,
  options: [ Actions.attack, Actions.stanch, Actions.magic, Techniques.buff, Actions.shatter ]
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
  options: [ Actions.ambush, Techniques.haste, Actions.rally ]
}

export const cleric: Folder = {
  name: 'Cleric',
  desc: 'Actions based on healing damage',
  type: OptionType.FOLDER,
  options: [Actions.heal, Actions.pray]
}

export const mage: Folder = {
  name: 'Mage',
  desc: 'Actions based on shattering techniques', 
  type: OptionType.FOLDER,
  options: [Techniques.infuse, Techniques.charged]
}

export const knight: Folder = {
  name: 'Knight',
  desc: 'Actions based on defense',
  type: OptionType.FOLDER,
  options: [Techniques.coagulate, Actions.cleave]
}

export const fighter: Folder = {
  name: 'Fighter',
  desc: 'Actions based on cast time',
  type: OptionType.FOLDER,
  options: [ Actions.smash, Techniques.adrenaline ]
}

export const bandit: Folder = {
  name: 'Bandit',
  desc: 'Actions based on multi hit',
  type: OptionType.FOLDER,
  options: [ Actions.split ],
}