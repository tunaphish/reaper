import { Battle } from "../scenes/battle/Battle";
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
    execute: (target: Combatant, source: Combatant, potency: number) => void;
    isRestricted: (target: Combatant, source: Combatant, scene: Battle) => boolean;
    targetType: TargetType;
    soundKeyName?: string;
    imageKeyName?: string;
    castTimeInMs: number;
    potency: number;
}
