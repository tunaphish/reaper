import { Combatant } from "./combatant";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export enum ActionTags {
  HEAL,
  ATTACK,
  DEFEND,
  DEBUFF,
  BUFF,
}

export type Action = Option & {
    type: OptionType.ACTION;
    staminaCost: number;
    tags: Set<ActionTags>;
    description: string;
    execute: (target: Combatant, source: Combatant) => void;
    targetType: TargetType;
    soundKeyName?: string;
    imageKeyName?: string;
    castTimeInMs: number;
    potency: number;
}
