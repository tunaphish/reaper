import { Effect } from "../model/effect";
import { OptionType } from "../model/option"
import { Reaction } from "../model/reaction"

export const block: Reaction = {
    type: OptionType.REACTION,
    name: 'Block',
    staminaCost: 10,
    soundKeyName: 'block',
  
    description: 'Modify damage effects to damage stamina',
    modifyEffects: (effects: Effect[]) => {
        return effects;
    },
}