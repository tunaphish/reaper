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
    execute: (target: Combatant, source: Combatant, potency: number, scene: Battle) => void;
    isRestricted: (target: Combatant, source: Combatant, scene: Battle) => boolean;
    targetResolver?: (scene: Battle) => Combatant[];
    targetType: TargetType;
    soundKeyName: string;
    castTimeInMs: number;
    animTimeInMs?: number;
    potency: number;
}
