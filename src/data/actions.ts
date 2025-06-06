import { Action, ActionType } from "../model/action";

export const attack: Action = {
    name: 'Attack',
    staminaCost: 50,
    actionType: ActionType.ATTACK,

    soundKeyName: 'attack',  
    description: 'Deals damage',
    effect: (battle, caster, target) => {
        target.bleed = Math.max(0, target.bleed+50);    
    }
};

export const block: Action = {
    name: 'Block',
    staminaCost: 50,
    actionType: ActionType.DEFENSE,

    soundKeyName: 'block',  
    description: 'Blocks incoming damage',
    effect: (battle, caster, target) => {
        // caster.bleed = Math.max(0, caster.bleed-50);    
    }
};

export const stanch: Action = {
    name: 'Stanch',
    staminaCost: 70,
    actionType: ActionType.DEFENSE,

    soundKeyName: 'heal',  
    description: 'Heals bleed',
    effect: (battle, caster, target) => {
        target.bleed = Math.max(0, target.bleed-50);    
    }
};
