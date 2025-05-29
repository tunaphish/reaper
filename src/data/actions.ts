import { Action } from "../model/action";

export const attack: Action = {
    name: 'Attack',
    staminaCost: 50,

    soundKeyName: 'attack',  
    description: 'Deals damage',
    effect: (battle, caster, target) => {
        //
    }
};

// export const block: Action = {
//     name: 'Block',
//     staminaCost: 50,

//     soundKeyName: 'block',  
//     description: 'Blocks incoming damage',
// };

export const stanch: Action = {
    name: 'Stanch',
    staminaCost: 50,

    soundKeyName: 'heal',  
    description: 'Heals bleed',
    effect: (battle, caster, target) => {
        //
    }
};