import { Combatant } from "./combatant";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export type Item = Option & {
    type: OptionType.ITEM;
    description: string;
    execute: (target: Combatant, source: Combatant) => void;
    targetType: TargetType;
    soundKeyName: string;
    charges: number;
    maxCharges: number;
    castTimeInMs: number;
    canUseOutsideBattle: boolean;
}