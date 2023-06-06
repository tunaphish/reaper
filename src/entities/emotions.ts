import { Emotion } from '../entities/emotion';
import { shuffle } from '../util';
import { ActionTags } from './action';

export const anger: Emotion = {
  name: 'Anger',
  display: '😡',
  description: 'Increases likelyhood to attack',
  styleKeyName: 'anger',
  onUpdate: (enemies, party, behaviors, count) => {
    if (count === 0) return behaviors;
    const newBehaviors = behaviors.map((behavior) => {
      return {
        action: behavior.action,
        weight: Math.trunc(behavior.weight / 2),
        targetPriority: behavior.targetPriority,
      };
    });
    return newBehaviors;
  },

  onClick: (model, options, count) => {
    if (count === 0) return options;
    const newOptions = ['Attack', ...options];
    return newOptions;
  },
};

export const confusion: Emotion = {
  name: 'Confusion',
  display: '🤔',
  description: 'Increases likelyhood to perform illogical actions',
  styleKeyName: 'confusion',
  onUpdate: (enemies, party, behaviors, count) => {
    if (count === 0) return behaviors;
    // mix targets
    return behaviors;
  },

  onClick: (model, options, count) => {
    if (count === 0) return options;
    const newOptions = shuffle(options);
    return newOptions;
  },

  onOpenTargets: (targets, count: number) => {
    if (count < 2) return targets;
    return shuffle(targets);
  },
};

export const envious: Emotion = {
  name: 'Envious',
  display: '😒',
  description: 'Applies damage over time to target',
};

export const disgusted: Emotion = {
  name: 'Disgusted',
  display: '🤢',
  description: 'Doubles stacked damage applied every tick',
};

export const excited: Emotion = {
  name: 'Excited',
  display: '🤪',
  description: 'Will automatically attack random enemy if stamina reaches max',
};

export const depressed: Emotion = {
  name: 'Depressed',
  display: '😶',
  description: 'Slows stamina regen rate',
};

export const emptyEmotionalStateMap = (): Map<Emotion, number> => {
  return new Map([
    [anger, 0],
    [confusion, 0],
    [envious, 0],
    [disgusted, 0],
    [excited, 0],
    [depressed, 0],
  ]);
};
