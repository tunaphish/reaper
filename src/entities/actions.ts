import { Action, ActionTags, TargetType } from './action';
import { Combatant } from './combatant';
import { Emotion } from './emotion';
import { anger, disgusted } from './emotions';

export const slash: Action = {
  name: 'Slash',
  description: 'Basic attack',
  staminaCost: 100,
  tags: new Set([ActionTags.ATTACK]),
  execute: (battleModel, targets) => {
    targets[0].stackedDamage += 50;
  },
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
};

export const slashAll: Action = {
  name: 'Slash All',
  description: 'Attacks everyone indiscriminately',
  staminaCost: 250,
  tags: new Set([ActionTags.ATTACK]),
  execute: (battleModel, targets) => {
    targets.forEach((target) => (target.stackedDamage += 50));
  },
  targetType: TargetType.ALL,
  soundKeyName: 'attack',
};

export const finisher: Action = {
  name: 'Finisher',
  description: 'Immediately applies all stacked damage',
  staminaCost: 100,
  tags: new Set([ActionTags.ATTACK]),
  execute: (battleModel, targets) => {
    const target = targets[0];
    if (target) {
      target.health = Math.max(0, target.health - target.stackedDamage);
      target.stackedDamage = 0;
    }
  },
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
};

export const ankleSlice: Action = {
  name: 'Ankle Slice',
  description: 'Deals damage and reduces stamina for target',
  staminaCost: 100,
  tags: new Set([ActionTags.ATTACK]),
  execute: (battleModel, targets) => {
    const target = targets[0];
    target.stackedDamage += 50;
    target.stamina = Math.max(0, target.stamina -= 50);
  },
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',
};


export const block: Action = {
  name: 'Block',
  description:
    'Stops stamina regeneration, converts all additional to reduce stamina, stops stacked damage from applying',
  staminaCost: 50,
  tags: new Set([ActionTags.DEFEND]),
  execute: (battleModel) => {},
  targetType: TargetType.SELF,
};

export const idle: Action = {
  name: 'Idle',
  description: 'Does Nothing',
  staminaCost: 0,
  tags: new Set([ActionTags.DEFEND]),
  execute: () => {},
  targetType: TargetType.SELF,
};

export const heal: Action = {
  name: 'Heal',
  description: 'Restores health to target',
  staminaCost: 100,
  tags: new Set([ActionTags.HEAL]),
  execute: (battleModel, targets) => {
    const HEALTH = 50;
    targets[0].health = Math.min(targets[0].maxHealth, (targets[0].health += HEALTH));
  },
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',
  imageKeyName: 'heal',
};

export const annoy: Action = {
  name: 'Annoy',
  description: 'Makes target angry',
  staminaCost: 200,
  tags: new Set([ActionTags.DEBUFF]),
  execute: (battleModel, targets) => {
    updateEmotionalState(targets, anger, 1);
  },
  targetType: TargetType.SINGLE_TARGET,
};

export const flirt: Action = {
  name: 'Flirt',
  description: 'Makes target disgusted (usually)',
  staminaCost: 200,
  tags: new Set([ActionTags.DEBUFF]),
  execute: (battleModel, targets) => {
    updateEmotionalState(targets, disgusted, 1);
  },
  targetType: TargetType.SINGLE_TARGET,
};

export const stifle: Action = {
  name: 'Stifle',
  description: 'Calms emotional state',
  staminaCost: 50,
  tags: new Set([ActionTags.DEBUFF]),
  execute: (battleModel, targets) => {
    for (const [emotion, count] of targets[0].emotionalState) {
      updateEmotionalState(targets, emotion, -1);
    }
  },
  targetType: TargetType.SELF,
};



const updateHealth = () => {};

const updateEmotionalState = (targets: Combatant[], emotion: Emotion, change: number): void => {
  targets.forEach((target) => {
    const count = target.emotionalState.get(emotion) || 0;
    const update = count + change > 0 ? count + change : 0;
    target.emotionalState.set(emotion, update);
  });
};
