import { ActionTags } from "./action";
import { Enemy, Behavior } from "./enemy";
import { Party } from "./party";

export interface Trait {
  name: string;
  description: string;
  onStart: (enemy: Enemy, party: Party) => void;
  onUpdate: (enemy: Enemy, party: Party, behaviors: Behavior[]) => Behavior[]; 
}

export const bloodlust: Trait = {
  name: 'Bloodlust',
  description: 'Start each battle excited',
  onStart: () => console.log('nothing'),
  onUpdate: (enemy, party, behaviors) => behaviors,
}

export const headstrong: Trait = {
  name: 'Headstrong',
  description: 'Easily angered',
  onStart: () => console.log('nothing'),
  onUpdate: (enemy, party, behaviors) => behaviors,
}

export const stoic: Trait = {
  name: 'Stoic',
  description: 'Emotional status is less effected',
  onStart: () => console.log('nothing'),
  onUpdate: (enemy, party, behaviors) => behaviors,
}

export const misogynist: Trait = {
  name: 'Misogynist',
  description: 'Targets women with Higher Priority',
  onStart: () => console.log('nothing'),
  onUpdate: (enemy, party, behaviors) => behaviors,
}

export const selfPreservation: Trait = {
  name: 'Self Preservation',
  description: 'Prioritizes Healing when Low on Health',
  onStart: () => console.log('nothing'),
  onUpdate: (enemy, party, behaviors) => {
    return behaviors.map(behavior => {
      if (behavior.action.tags.has(ActionTags.HEAL)) behavior.weight = 1000;
      return behavior;
    })
  },
}

export const motherlyInstinct: Trait = {
  name: 'Motherly Instinct',
  description: 'Prioritizes Healing Children',
  onStart: () => console.log('nothing'),
  onUpdate: (enemy, party, behaviors) => behaviors,
}

export const vindictive: Trait = {
  name: 'Motherly Instinct',
  description: 'Prioritizes Enemy who Attacked them Last',
  onStart: () => console.log('nothing'),
  onUpdate: (enemy, party, behaviors) => behaviors,
}