import { OptionType } from "../model/option";
import { Spell } from "../model/spell";
import { TargetType } from "../model/targetType";

export const SADIST: Spell = {
    type: OptionType.SPELL,
    name: 'SADIST',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions that hurt target now heal bleed',
    castTimeInMs: 250,
};

export const ZANTETSUKEN: Spell = {
    type: OptionType.SPELL,
    name: 'ZANTETSUKEN',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions scale in potency the faster they are selected one menu is opened',
    castTimeInMs: 250,
};

// Post Selection Menus
export const DUAL: Spell = {
    type: OptionType.SPELL,
    name: 'DUAL',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions strike twice at 0.5X potency',
    castTimeInMs: 250,
};

export const CLEAVE: Spell = {
    type: OptionType.SPELL,
    name: 'CLEAVE',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions strike everyone on targets side at 0.5X potency',
    castTimeInMs: 250,
};

export const CHARGE: Spell = {
    type: OptionType.SPELL,
    name: 'CHARGE',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions can use stamina to multiply potency',
    castTimeInMs: 250,
};

export const JANKENBO: Spell = {
    type: OptionType.SPELL,
    name: 'JANKENBO',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Can play JANKENBO with target to double or nullify potency',
    castTimeInMs: 250,
};