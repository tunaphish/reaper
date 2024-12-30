import { Effect } from "./effect";
import { Option, OptionType } from "./option";

export type Reaction = Option & {
  type: OptionType.REACTION;
  staminaCost: number;
  description: string;
  soundKeyName: string;
  modifyEffects: (effects: Effect[]) => Effect[];
}
