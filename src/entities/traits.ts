import { Trait } from '../entities/trait';
import { ActionTags } from '../entities/action';
import { Behavior } from '../entities/enemy';

import { self } from './enemies';

export const bloodlust: Trait = {
  name: 'Bloodlust',
  description: 'Start each battle excited',
  onStart: () => {},
  onUpdate: (enemies, party, behaviors) => behaviors,
}

export const headstrong: Trait = {
  name: 'Headstrong',
  description: 'Easily angered',
  onStart: () => {},
  onUpdate: (enemies, party, behaviors) => behaviors,
}

export const stoic: Trait = {
  name: 'Stoic',
  description: 'Emotional status is less effected',
  onStart: () => {},
  onUpdate: (enemies, party, behaviors) => behaviors,
}

export const misogynist: Trait = {
  name: 'Misogynist',
  description: 'Targets women with Higher Priority',
  onStart: () => {},
  onUpdate: (enemies, party, behaviors) => behaviors,
}

export const selfPreservation: Trait = {
  name: 'Self Preservation',
  description: 'Prioritizes Healing when Low on Health',
  onStart: () => {},
  onUpdate: (enemies, party, behaviors) => {
    return behaviors.map((behavior: Behavior) => {
      if (behavior.action.tags.has(ActionTags.HEAL)) {
        behavior.weight = 1000;
        behavior.targetPriority = self;
      }
      return behavior;
    })
  },
}

export const motherlyInstinct: Trait = {
  name: 'Motherly Instinct',
  description: 'Prioritizes Healing Children',
  onStart: () => {},
  onUpdate: (enemies, party, behaviors) => behaviors,
}

export const vindictive: Trait = {
  name: 'Motherly Instinct',
  description: 'Prioritizes Enemy who Attacked them Last',
  onStart: () => {},
  onUpdate: (enemies, party, behaviors) => behaviors,
}