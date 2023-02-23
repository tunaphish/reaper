import { Emotion } from '../entities/emotion';
import { shuffle } from '../util';
import { ActionTags } from './action';

export const anger: Emotion = {
  name: 'Anger',
  display: '😡',
  description: 'Increases likelyhood to attack',
  onUpdate: (enemies, party, behaviors, count) => {
    if (count === 0) return behaviors;
    const newBehaviors = behaviors.map((behavior) => {
      return {
        action: behavior.action,
        weight: Math.trunc(behavior.weight/2),
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
  }
}; 

export const envious: Emotion = {
  name: 'Envious',
  display: '😒',
  description: 'Applies damage over time to target',
}

export const disgusted: Emotion = {
  name: '🤢',
  display: 'Disgusted',
  description: 'Doubles stacked damage applied every tick',
}

export const emptyEmotionalStateMap = (): Map<Emotion, number> => {
  return new Map([
    [anger, 0],
    [confusion, 0],
    [envious, 0],
    [disgusted, 0],
  ]);
}

// Potential Future Emotions
// - disgust: increase dodge rate
// 	- repulsed: poison
// - afraid: lowers attack
// 	- terrified: menus open slower?
// 	- petrified: paralyzed
// - confused: (unique trigger, lvl 2 positive and negative emotions)
// 	- menu items are mixed around
// - charm -> menu items replaced with 'lovelove'
// - Anger: increases damage taken and damage dealth
// 	- furious: causes menu to auto open and start triggering moves
// 	- anger initially only increases dmg dealt and received. effects become more complicated and intrusive as it increases
// 	- bloodlust: unlocks ultimate attack in ava, recklessly attack
// - confusion: moves menu options to unexpected places, glitch effect on UI
// - charmed:
// 	- seduced: obscure's menu options with hearts, reduces effectiveness?
// - excited: increase atk and stamina usage, increases stamina refill rate

// - doubt: Whenever you go to strike someone there's a pop up that says 'Are you Sure?'
// - acceptance: Lower's stamina regeneration?