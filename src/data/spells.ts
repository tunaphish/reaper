import { OptionType } from "../model/option";
import { Spell } from "../model/spell";
import { TargetType } from "../model/targetType";

export const sadist: Spell = {
    type: OptionType.SPELL,
    name: 'SADIST',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'attack',
    imageKeyName: 'attack.gif',
    description: 'Actions that hurt target now heal bleed',
    castTimeInMs: 250,
};