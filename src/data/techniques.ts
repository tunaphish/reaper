
import { OptionType } from '../model/option';
import { Technique } from '../model/technique';

export const haste: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Haste',
  actionPointsCost: 1,
  castTimeInMs: 1500,
  description: 'Increase Speed',

  soundKeyName: 'smirk',
};

export const buff: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Buff',
  actionPointsCost: 1,
  castTimeInMs: 1500,
  description: 'Increase Strength',

  soundKeyName: 'smirk',
  iconSrc: '/reaper/ui/icons/magic.png',
};


export const counter: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Counter',
  actionPointsCost: 1,
  castTimeInMs: 500,
  description: 'ATTACK enemies who deal damage to you',

  soundKeyName: 'smirk',
};

export const shadow: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Shadow', 
  actionPointsCost: 1, 
  castTimeInMs: 500,
  description: 'Duplicate attacks at half damage',
  soundKeyName: 'smirk'
}

export const infuse: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Infuse', 
  actionPointsCost: 2,
  castTimeInMs: 500,
  description: 'Infuses attacks with MAGIC (shatters a random enemy technique)',
  soundKeyName: 'smirk'
}

export const coagulate: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Coagulate', 
  actionPointsCost: 1, 
  castTimeInMs: 500,
  description: 'Slows bleed (consider making this adds delay to bleed, confusing ux tho)',
  soundKeyName: 'smirk',
}

export const charged: Technique = {
  type: OptionType.TECHNIQUE,
  name: 'Charged',
  actionPointsCost: 1,
  castTimeInMs: 500,
  description: 'Single Use. Doubles next attack.',
  soundKeyName: 'smirk',
}