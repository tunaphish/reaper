import { Action, ActionTags } from './action';
import { Allies } from './ally';
import { Combatant } from './combatant';
import { OptionType } from './option';
import { self } from './targetPriorities';

import { idle } from '../data/actions';
import { getRandomInt } from '../features/math';

export type TargetPriority = (enemies: Enemy[], allies: Allies, enemy: Enemy) => Combatant;

export interface Behavior {
  action: Action;
  weight: number;
  targetPriority: TargetPriority;
  dialoguePool?: string[];
}

export type Enemy = Combatant & {
  type: OptionType.ENEMY
  behaviors: Behavior[];
  imageUrl: string;
};

export const selectBehavior = (enemy: Enemy): Behavior => {
  // Baseline Behavior Filter
  const filteredBehaviors = enemy.behaviors.filter((behavior) => {
    if (enemy.stamina === enemy.maxStamina && behavior.action.name === 'Idle') return false;
    if (enemy.stamina < behavior.action.staminaCost) return false;
    if (enemy.health === enemy.maxHealth && behavior.action.tags.has(ActionTags.HEAL)) return false;
    return true;
  });

  // Randomly Select Behavior Based on Weight
  const summedWeights = filteredBehaviors.reduce((runningSum, behavior) => runningSum + behavior.weight, 0);
  const randomInt = getRandomInt(summedWeights);
  let runningSum = 0;
  const selectedBehavior = filteredBehaviors.find((behavior) => {
    runningSum += behavior.weight;
    return runningSum > randomInt;
  });
  return selectedBehavior || { action: idle, weight: 100, targetPriority: self }; // in case it doesn't pick anything
}