import { Action } from './action';
import { Combatant } from './combatant';



export type Strategy = {
    actions: Action[];
    timeTilExecute: number;
    name: string;
    selectTarget: (Battle, Combatant) => Combatant;
}

export type Enemy = Combatant & {
    strategies: Strategy[];

    timeSinceLastAction: number;
    actionIdx: number;
    selectedStrategy: Strategy;
};
