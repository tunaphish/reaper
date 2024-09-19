import { Trait } from '../model/trait';
import { ActionTags } from '../model/action';
import { Behavior } from '../model/enemy';

import { self } from '../model/targetPriorities';

export const selfPreservation: Trait = {
  name: 'Self Preservation',
  description: 'Prioritizes Healing when Low on Health',
  onUpdate: (enemies, party, behaviors) => {
    const newBehaviors = behaviors.map((behavior: Behavior) => {
      if (!behavior.action.tags.has(ActionTags.HEAL)) return behavior;
      return {
        action: behavior.action,
        weight: behavior.weight * 2,
        targetPriority: self,
      };
    });
    return newBehaviors;
  },
};

export const headstrong: Trait = {
  name: 'Headstrong',
  description: 'Easily angered',
  onUpdate: (enemies, party, behaviors) => behaviors,
};

export const misogynist: Trait = {
  name: 'Misogynist',
  description: 'Targets women with Higher Priority',
  onUpdate: (enemies, party, behaviors) => behaviors,
};

export const motherlyInstinct: Trait = {
  name: 'Motherly Instinct',
  description: 'Prioritizes Healing Children',
  onUpdate: (enemies, party, behaviors) => behaviors,
};

export const vindictive: Trait = {
  name: 'Motherly Instinct',
  description: 'Prioritizes Enemy who Attacked them Last',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onStart: () => {},
  onUpdate: (enemies, party, behaviors) => behaviors,
};

// burn the ships - anger cannot be lowered
