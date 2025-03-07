import { TimelineAction } from "../scenes/battle/BattleStore";
import { Combatant } from "./combatant";
import { Effect } from "./effect";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export type ReactionRestriction = {
  desc: string;
  isRestricted: (timelineAction: TimelineAction, caster: Combatant) => boolean;
}

export type Reaction = Option & {
  type: OptionType.REACTION;
  targetType: TargetType;
  staminaCost: number;
  description: string;
  soundKeyName: string;
  restriction?: ReactionRestriction;
  modifyEffects: (effects: Effect[]) => Effect[];
}
