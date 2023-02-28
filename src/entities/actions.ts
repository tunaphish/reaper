import { Action, ActionTags, TargetType } from './action';
import { updateEmotionalState, updateDamage, updateStamina } from './combatant';
import { anger, depressed, disgusted, envious, excited } from './emotions';


export const slash: Action = {
  name: 'Slash',
  staminaCost: 100,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage to target',
  execute: (battleModel, targets) => {
    updateDamage(targets[0], -50);
  },
};

export const slashAll: Action = {
  name: 'Slash All',
  staminaCost: 250,
  tags: new Set([ActionTags.ATTACK]),

  targetType: TargetType.ALL,
  soundKeyName: 'attack',

  description: 'Attacks everyone indiscriminately',
  execute: (battleModel, targets) => {
    targets.forEach((target) => updateDamage(targets[0], -50));
  },
};

export const finisher: Action = {
  name: 'Finisher',
  staminaCost: 100,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Immediately applies all stacked damage',
  execute: (battleModel, targets) => {
    const target = targets[0];
    if (target) {
      target.health = Math.max(0, target.health - target.stackedDamage);
      target.stackedDamage = 0;
    }
  },
};

export const ankleSlice: Action = {
  name: 'Ankle Slice',
  staminaCost: 125,
  tags: new Set([ActionTags.ATTACK]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack',

  description: 'Deals damage and reduces stamina for target',
  execute: (battleModel, targets) => {
    const target = targets[0];
    updateDamage(target, -50);
    updateStamina(target, -50);
  },
};


export const block: Action = {
  name: 'Block',
  staminaCost: 50,
  tags: new Set([ActionTags.DEFEND]),
  targetType: TargetType.SELF,

  description:  'Stops stamina regeneration, converts all additional to reduce stamina, stops stacked damage from applying',
  execute: (battleModel) => {},
};

export const idle: Action = {
  name: 'Idle',
  staminaCost: 0,
  tags: new Set([ActionTags.DEFEND]),
  targetType: TargetType.SELF,

  description: 'Does Nothing',
  execute: () => {},
};

export const heal: Action = {
  name: 'Heal',
  staminaCost: 100,
  tags: new Set([ActionTags.HEAL]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',
  imageKeyName: 'heal',

  description: 'Restores health to target',
  execute: (battleModel, targets) => {
    const HEALTH = 50;
    targets[0].health = Math.min(targets[0].maxHealth, (targets[0].health += HEALTH));
  },
};

export const annoy: Action = {
  name: 'Annoy',
  staminaCost: 200,
  tags: new Set([ActionTags.DEBUFF]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'debuff',

  description: 'Makes target angry',
  execute: (battleModel, targets) => {
    updateEmotionalState(targets, anger, 1);
  },
};

export const flirt: Action = {
  name: 'Flirt',
  staminaCost: 200,
  tags: new Set([ActionTags.DEBUFF]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'debuff',

  description: 'Makes target disgusted (usually)',
  execute: (battleModel, targets) => {
    updateEmotionalState(targets, disgusted, 1);
  },
};

export const boast: Action = {
  name: 'Boast',
  staminaCost: 200,
  tags: new Set([ActionTags.DEBUFF]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'debuff',

  description: 'Makes target envious (chance to make target angry?)',
  execute: (battleModel, targets) => {
    updateEmotionalState(targets, envious, 1);
  },
};

export const excite: Action = {
  name: 'Excite',
  staminaCost: 200,
  tags: new Set([ActionTags.DEBUFF]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'debuff',

  description: 'Makes target excited',
  execute: (battleModel, targets) => {
    updateEmotionalState(targets, excited, 1);
  },
};

export const depress: Action = {
  name: 'Depress',
  staminaCost: 200,
  tags: new Set([ActionTags.DEBUFF]),
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'debuff',

  description: 'Makes target depressed',
  execute: (battleModel, targets) => {
    updateEmotionalState(targets, depressed, 1);
  },
};

export const stifle: Action = {
  name: 'Stifle',
  staminaCost: 50,
  tags: new Set([ActionTags.DEBUFF]),
  targetType: TargetType.SELF,
  soundKeyName: 'debuff',

  description: 'Calms emotional state',
  execute: (battleModel, targets) => {
    for (const [emotion, count] of targets[0].emotionalState) {
      updateEmotionalState(targets, emotion, -1);
    }
  },
};


const updateHealth = () => {};

export const ACTION_SET: Set<Action> = new Set([
  slash,
  slashAll,
  finisher,
  ankleSlice,
  block,
  idle,
  heal,
  annoy,
  flirt,
  boast,
  excite,
  depress,
])
