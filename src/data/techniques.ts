
import { OptionType } from '../model/option';
import { TargetType } from '../model/targetType';
import { Technique } from '../model/technique';
import * as Actions from './actions';

export const basicEji: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Basic Techniques',
  actionPointsCost: 1,
  castTimeInMs: 1500,

  imageSrc: '/reaper/ui/ally/Eji-NEUTRAL.png',
  windowLayout: {
    x: 150,
    y: 400,
    height: 106,
    width: 106,
  },
  description: 'Basic Eji Reaper Actions',
  
  targetType: TargetType.SELF,
  soundKeyName: 'smirk',

  options: [ Actions.attack, Actions.stanch, Actions.magic ],
};

export const basicJin: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Basic Techniques',
  actionPointsCost: 1,
  castTimeInMs: 1500,

  imageSrc: '/reaper/ui/ally/Jin-NEUTRAL.png',
  windowLayout: {
    x: 150,
    y: 400,
    height: 106,
    width: 106,
  },
  description: 'Basic Jin Reaper Actions',
  
  targetType: TargetType.SELF,
  soundKeyName: 'smirk',

  options: [ Actions.attack, Actions.stanch, Actions.magic ],
};

export const basicPhia: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Basic Techniques',
  actionPointsCost: 1,
  castTimeInMs: 1500,

  imageSrc: '/reaper/ui/ally/Phia-NEUTRAL.png',
  windowLayout: {
    x: 150,
    y: 400,
    height: 106,
    width: 106,
  },
  description: 'Basic Phia Reaper Actions',
  
  targetType: TargetType.SELF,
  soundKeyName: 'smirk',

  options: [ Actions.attack, Actions.stanch, Actions.magic ],
};

// export const haste: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Haste',
//   actionPointsCost: 1,
//   castTimeInMs: 1500,
//   description: 'Increase Speed',
//   targetType: TargetType.SELF,
//   soundKeyName: 'smirk',
//   options: [],
// };

// export const buff: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Buff',
//   actionPointsCost: 1,
//   castTimeInMs: 1500,

//   imageSrc: '/reaper/ui/ally/eji.png',
//   description: 'Increase Strength',
  
//   targetType: TargetType.SELF,
//   soundKeyName: 'smirk',
//   iconSrc: '/reaper/ui/icons/magic.png',

//   options: [ Actions.attack, Actions.stanch, Actions.magic ],
// };


// export const counter: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Counter',
//   actionPointsCost: 1,
//   castTimeInMs: 500,
//   description: 'ATTACK enemies who deal damage to you',
//   targetType: TargetType.SELF,
//   soundKeyName: 'smirk',

//   options: [],
// };

// export const shadow: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Shadow', 
//   actionPointsCost: 1, 
//   castTimeInMs: 500,
//   description: 'Duplicate attacks at half damage',
//   targetType: TargetType.SELF,
//   soundKeyName: 'smirk',

//   options: [],
// }

// export const infuse: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Infuse', 
//   actionPointsCost: 2,
//   castTimeInMs: 500,
//   description: 'Infuses attacks with MAGIC (shatters a random enemy technique)',
//   targetType: TargetType.SELF,
//   soundKeyName: 'smirk',

//   options: [],
// }

// export const coagulate: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Coagulate', 
//   actionPointsCost: 1, 
//   castTimeInMs: 500,
//   description: 'Slows bleed (consider making this adds delay to bleed, confusing ux tho)',
//   targetType: TargetType.SELF,
//   soundKeyName: 'smirk',

//   options: [],
// }

// export const charged: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Charged',
//   actionPointsCost: 1,
//   castTimeInMs: 500,
//   description: 'Single Use. Doubles next attack.',
//   targetType: TargetType.SELF,
//   soundKeyName: 'smirk',
  
//   options: [],
// }

// export const reciprocity: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Reciprocity',
//   actionPointsCost: 1,
//   castTimeInMs: 500,
//   description: 'Attacks on allies heal instead of damaging.',
//   targetType: TargetType.SELF,
//   soundKeyName: 'smirk',

//   options: [],
// }

// export const adrenaline: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Adrenaline',
//   actionPointsCost: 1, 
//   castTimeInMs: 500, 
//   description: 'Halves cast time on attacks',
//   targetType: TargetType.SELF,
//   soundKeyName: 'smirk',

//   options: [],
// }

// export const nerf: Technique = {
//   type: OptionType.TECHNIQUE,
//   name: 'Nerf',
//   actionPointsCost: 1, 
//   castTimeInMs: 500, 
//   description: 'Weakens attacks',
//   targetType: TargetType.SINGLE_TARGET,
//   soundKeyName: 'smirk',

//   options: [],
// }



// export const basic: Folder = {
//   name: 'Basic',
//   desc: 'Basic Actions',
//   type: OptionType.FOLDER,
//   options: [ Actions.attack, Actions.stanch, Actions.magic, Techniques.buff, Actions.shatter ]
// }


// export const fencer: Folder = {
//   name: 'Fencer',
//   desc: 'Strong Conditional Actions',
//   type: OptionType.FOLDER,
//   options: [ Actions.splinter, Actions.engage, Actions.pristine, Actions.prick ]
// }

// export const hunter: Folder = {
//   name: 'Hunter',
//   desc: 'Actions surrounding manipulation AP',
//   type: OptionType.FOLDER,
//   options: [ Actions.ambush, Techniques.haste, Actions.rally ]
// }

// export const cleric: Folder = {
//   name: 'Cleric',
//   desc: 'Actions based on healing damage',
//   type: OptionType.FOLDER,
//   options: [Actions.heal, Actions.pray]
// }

// export const mage: Folder = {
//   name: 'Mage',
//   desc: 'Actions based on shattering techniques', 
//   type: OptionType.FOLDER,
//   options: [Techniques.infuse, Techniques.charged, Techniques.nerf]
// }

// export const knight: Folder = {
//   name: 'Knight',
//   desc: 'Actions based on defense',
//   type: OptionType.FOLDER,
//   options: [Techniques.coagulate, Actions.cleave]
// }

// export const fighter: Folder = {
//   name: 'Fighter',
//   desc: 'Actions based on cast time',
//   type: OptionType.FOLDER,
//   options: [ Actions.smash, Techniques.adrenaline ]
// }

// export const bandit: Folder = {
//   name: 'Bandit',
//   desc: 'Actions based on multi hit',
//   type: OptionType.FOLDER,
//   options: [ Actions.split ],
// }