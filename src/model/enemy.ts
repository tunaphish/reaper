import { Action } from './action';
import { Combatant } from './combatant';


export type Strategy = {
    actions: Action[];
    timeTilExecute: number;
}

export type Enemy = Combatant & {
    strategies: Strategy[];

    timeSinceLastStrategy: number;
    selectedStrategy: Strategy;
};
