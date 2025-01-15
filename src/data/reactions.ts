import { Combatant, updateStamina } from "../model/combatant";
import { Effect } from "../model/effect";
import { OptionType } from "../model/option"
import { DeferredAction } from "../scenes/battle/BattleStore";
import { Reaction, ReactionRestriction } from "../model/reaction";
import * as Effects from './effects';
import { TargetType } from "../model/targetType";

// #region ReactionRestriction
const closeToExecution: ReactionRestriction = {
    desc: 'Action must close to executing',
    isRestricted: (deferredAction: DeferredAction, caster: Combatant) => { 
      return deferredAction.timeTilExecute > 500;
    },
}



// #endregion

export const block: Reaction = {
    type: OptionType.REACTION,
    name: 'Block',
    targetType: TargetType.SELF,
    staminaCost: 10,
    soundKeyName: 'block',
    description: 'Blocks damage to stamina',
    modifyEffects: (effects: Effect[]) => {
        return effects.map((effect) => {
            if (effect.execute.toString() != Effects.dealDamage.toString()) return effect;
            return {
                execute: Effects.healStamina,
                potency: (effect.potency - 10) * -1,
            }
        });
    },
}

export const evade: Reaction = {
    type: OptionType.REACTION,
    name: 'Evade',
    targetType: TargetType.SELF,
    staminaCost: 25,
    soundKeyName: 'block',
    description: 'Evade all effects',
    restriction: closeToExecution,
    modifyEffects: (effects: Effect[]) => [],
}

export const parry: Reaction = {
    type: OptionType.REACTION,
    name: 'Parry',
    targetType: TargetType.SELF,
    staminaCost: 25,
    soundKeyName: 'block',
    description: 'Evade all Effects and Damage Caster Stamina',
    restriction: closeToExecution,
    modifyEffects: (effects: Effect[]) => {
        return [
            {
                execute: (target, source, potency, scene) => {
                    updateStamina(source, -potency);
                },
                potency: 25,
            }
        ];
    },
}