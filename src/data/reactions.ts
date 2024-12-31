import { Combatant } from "../model/combatant";
import { Effect } from "../model/effect";
import { OptionType } from "../model/option"
import { DeferredAction } from "../scenes/battle/BattleStore";
import { Reaction, ReactionRestriction } from "../model/reaction";
import * as Effects from './effects';

// #region ReactionRestriction
export const reactionOnSelf: ReactionRestriction = {
    desc: 'Reaction must target action targeting self',
    isRestricted: (deferredAction: DeferredAction, caster: Combatant) => { 
      return deferredAction.target.name !== caster.name;
    },
}

// #endregion

export const block: Reaction = {
    type: OptionType.REACTION,
    name: 'Block',
    staminaCost: 10,
    soundKeyName: 'block',
    description: 'Modify damage effects to damage stamina',
    restriction: reactionOnSelf,
    modifyEffects: (effects: Effect[]) => {
        return effects.map((effect) => {
            if (effect.execute.toString() != Effects.dealDamage.toString()) return effect;
            return {
                execute: Effects.healStamina,
                potency: effect.potency *= -1,
            }
        });
    },
}