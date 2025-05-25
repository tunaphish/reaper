import { Action } from "../model/action";

export const attack: Action = {
    name: 'Attack',
    staminaCost: 50,

    soundKeyName: 'attack',  
    description: 'Deals damage',
};

export const stanch: Action = {
    name: 'Stanch',
    staminaCost: 50,

    soundKeyName: 'heal',  
    description: 'Heals bleed',
};