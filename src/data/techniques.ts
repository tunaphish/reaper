
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