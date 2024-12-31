import { DeferredAction } from "../scenes/battle/BattleStore";
import { Combatant } from "./combatant";
import { Effect } from "./effect";
import { Option, OptionType } from "./option";

export type ReactionRestriction = {
  desc: string;
  isRestricted: (deferredAction: DeferredAction, caster: Combatant) => boolean;
}

export type Reaction = Option & {
  type: OptionType.REACTION;
  staminaCost: number;
  description: string;
  soundKeyName: string;
  restriction: ReactionRestriction;
  modifyEffects: (effects: Effect[]) => Effect[];
}
