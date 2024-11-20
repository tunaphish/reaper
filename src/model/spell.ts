import { Battle } from '../scenes/battle/Battle';
import { ActionModifier } from './actionModifier';
import { Combatant } from './combatant';
import { Option, OptionType } from './option';
import { TargetType } from './targetType';

export type Spell = Option & {
  description: string;
  targetType: TargetType;
  soundKeyName: string;
  imageKeyName?: string;

  type: OptionType.SPELL;
  magicCost: number;
  castTimeInMs: number;
  isMenuSpell: boolean;

  modifyAction: (actionModifier: ActionModifier, scene: Battle, caster: Combatant) => ActionModifier;
};
