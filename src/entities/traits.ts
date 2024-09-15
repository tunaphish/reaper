import { Trait } from '../entities/trait';
import { ActionTags } from '../entities/action';
import { Behavior } from '../entities/enemy';
import { updateEmotionalState } from './combatant';

import { self } from './targetPriorities';
import { BattleModel } from '../scenes/battle/battleModel';
import { Combatant } from './combatant';
import { anger, excited } from './emotions';

// likely need to split enemy traits from party traits

export const edgelord: Trait = {
  name: 'Edgelord',
  description: 'Becomes angry when inflicted by an emotion',
  onStart: (model: BattleModel, combantant: Combatant) => {},
  onUpdate: (enemies, party, behaviors) => behaviors,
};

export const romantic: Trait = {
  name: 'Romantic',
  description: 'Receives a surge of stamina whenever inflicted by an emotion',
  onUpdate: (enemy, party, behaviors) => behaviors,
};

export const empath: Trait = {
  name: 'Empath',
  description: 'It is both a blessing and a curse to feel things so deeply',
  onUpdate: (enemy, party, behaviors) => behaviors,
};

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

export const stoic: Trait = {
  name: 'Stoic',
  description: 'Emotional status is less effected',
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
  onStart: () => {},
  onUpdate: (enemies, party, behaviors) => behaviors,
};

// burn the ships - anger cannot be lowered
