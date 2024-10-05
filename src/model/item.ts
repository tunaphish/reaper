import { Combatant } from "./combatant";
import { Option } from "./option";
import { TargetType } from "./targetType";

export type Item = Option & {
    description: string;
    execute: (target: Combatant, source: Combatant) => void;
    targetType: TargetType;
    soundKeyName?: string;
    imageKeyName?: string;
    charges: number;
    maxCharges: number;
}