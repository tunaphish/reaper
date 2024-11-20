import { ActionModifier } from "../model/actionModifier";
import { Combatant, JankenboThrow } from "../model/combatant";
import { OptionType } from "../model/option";
import { Spell } from "../model/spell";
import { TargetType } from "../model/targetType";
import { Battle } from "../scenes/battle/Battle";

export const SADIST: Spell = {
    type: OptionType.SPELL,
    name: 'SADIST',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions that hurt target now heal bleed',
    castTimeInMs: 250,
    isMenuSpell: false,
    modifyAction: (initActionModifier: ActionModifier, scene: Battle, caster: Combatant) => {
        const actionModifier = Object.assign({}, initActionModifier);
        actionModifier.potency *= -1;
        return actionModifier;
    }
};

export const ZANTETSUKEN: Spell = {
    type: OptionType.SPELL,
    name: 'ZANTETSUKEN',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions scale in potency the faster they are selected one menu is opened',
    castTimeInMs: 250,
    isMenuSpell: false,
    modifyAction: (initActionModifier: ActionModifier, scene: Battle, caster: Combatant) => {
        const actionModifier = Object.assign({}, initActionModifier);
        actionModifier.multiplier *= scene.battleStore.allyMenuSelections.zantetsukenMultiplier;
        return actionModifier;
    }
};

// Post Selection Menus
export const DUAL: Spell = {
    type: OptionType.SPELL,
    name: 'DUAL',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions strike twice at 0.5X potency',
    castTimeInMs: 250,
    isMenuSpell: false,
    modifyAction: (initActionModifier: ActionModifier, scene: Battle, caster: Combatant) => {
        const actionModifier = Object.assign({}, initActionModifier);
        actionModifier.targets = actionModifier.targets.concat(actionModifier.targets);
        actionModifier.multiplier *= 0.5;
        return actionModifier;
    }
};

export const CLEAVE: Spell = {
    type: OptionType.SPELL,
    name: 'CLEAVE',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions strike everyone on targets side at 0.5X potency',
    castTimeInMs: 250,
    isMenuSpell: true,
    modifyAction: (initActionModifier: ActionModifier, scene: Battle, caster: Combatant) => {
        const actionModifier = Object.assign({}, initActionModifier);
        // @ts-ignore
        if ((caster.queuedTarget.type as OptionType) === OptionType.ALLY) {
            actionModifier.targets = scene.battleStore.allies;
          } else {
            actionModifier.targets = scene.battleStore.enemies;
          }
          actionModifier.multiplier *= 0.5;
        return actionModifier;
    }
};

export const CHARGE: Spell = {
    type: OptionType.SPELL,
    name: 'CHARGE',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Actions can use stamina to multiply potency',
    castTimeInMs: 250,
    isMenuSpell: true,
    modifyAction: (initActionModifier: ActionModifier, scene: Battle, caster: Combatant) => {
        const actionModifier = Object.assign({}, initActionModifier);
        actionModifier.multiplier *= scene.battleStore.allyMenuSelections.chargeMultiplier;
        return actionModifier;
    }
};

export const JANKENBO: Spell = {
    type: OptionType.SPELL,
    name: 'JANKENBO',
    magicCost: 25,
    targetType: TargetType.SELF,
    soundKeyName: 'charged',
    imageKeyName: 'attack.gif',
    description: 'Can play JANKENBO with target to double or nullify potency',
    castTimeInMs: 250,
    isMenuSpell: true,
    modifyAction: (initActionModifier: ActionModifier, scene: Battle, caster: Combatant) => {
        const actionModifier = Object.assign({}, initActionModifier);
        const jankenboThrow = caster.queuedTarget.jankenboThrow(caster.queuedTarget);
        caster.queuedTarget.previousJankenboThrow = jankenboThrow;

        if (scene.battleStore.allyMenuSelections.jankenboThrow) {
          if (scene.battleStore.allyMenuSelections.jankenboThrow === caster.queuedTarget.previousJankenboThrow) {
            scene.battleStore.allyMenuSelections.setText(caster.queuedTarget.name + " threw " + caster.queuedTarget.previousJankenboThrow + ", YOU TIE");
          } else if (
            scene.battleStore.allyMenuSelections.jankenboThrow === JankenboThrow.ROCK && caster.queuedTarget.previousJankenboThrow === JankenboThrow.SCISSORS ||
            scene.battleStore.allyMenuSelections.jankenboThrow === JankenboThrow.SCISSORS && caster.queuedTarget.previousJankenboThrow === JankenboThrow.PAPER ||
            scene.battleStore.allyMenuSelections.jankenboThrow === JankenboThrow.PAPER && caster.queuedTarget.previousJankenboThrow === JankenboThrow.ROCK
          ) {
            actionModifier.potency *= 2;
            scene.battleStore.allyMenuSelections.setText(caster.queuedTarget.name + " threw " + caster.queuedTarget.previousJankenboThrow + ", YOU WIN");
          } else {
            actionModifier.potency = 0;
            scene.battleStore.allyMenuSelections.setText(caster.queuedTarget.name + " threw " + caster.queuedTarget.previousJankenboThrow + ", YOU LOSE");
          }
        }
        return actionModifier;
    }
};