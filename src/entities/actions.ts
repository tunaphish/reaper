import { Action, ActionTags, TargetType } from './action';
import { Combatant } from './combatant';
import { Emotion } from './emotion';
import { anger } from './emotions';

export const slash: Action = {
  name: 'Slash',
  staminaCost: 100,
  tags: new Set([ActionTags.ATTACK]),
  execute: (battleModel, target) => {
    target.stackedDamage += 50;
  },
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'attack'
};

export const block: Action = {
  name: 'Block',
  staminaCost: 50,
  tags: new Set([ActionTags.DEFEND]),
  execute: (battleModel) => {},
  targetType: TargetType.SELF,
};

export const idle: Action = {
  name: 'Idle',
  staminaCost: 0,
  tags: new Set([ActionTags.DEFEND]),
  execute: () => {},
  targetType: TargetType.SELF,
};

export const heal: Action = {
  name: 'Heal',
  staminaCost: 100,
  tags: new Set([ActionTags.HEAL]),
  execute: (battleModel, target) => {
    const HEALTH = 50;
    target.health = Math.min(target.maxHealth, (target.health += HEALTH));
  },
  targetType: TargetType.SINGLE_TARGET,
  soundKeyName: 'heal',
  imageKeyName: 'heal',
};

export const annoy: Action = {
  name: 'Annoy',
  staminaCost: 200,
  tags: new Set([ActionTags.DEBUFF]),
  execute: (battleModel, target) => {
    updateEmotionalState(target, anger, 1);
  },
  targetType: TargetType.SINGLE_TARGET,
}

export const stifle: Action = {
  name: 'Stifle',
  staminaCost: 50,
  tags: new Set([ActionTags.DEBUFF]),
  execute: (battleModel, target) => {
    for (let state of target.emotionalState) {
      updateEmotionalState(target, state.emotion, -1);
    }
  },
  targetType: TargetType.SELF,
}


const updateHealth = () => {};

const updateEmotionalState = (target: Combatant, emotion: Emotion, change: number): void => {
  for (let state of target.emotionalState) {
    if (state.emotion === emotion) {
      if (state.count+change >= 0) state.count += change;
      return;
    }
  }
  target.emotionalState.push({ emotion, count: change });
}
// get emotion

// Potential Planned Abilities
// - Flirt: Usually inflicts disgust
// 	- Lesbian Spirit, flirting with [[Ava]] will make her charmed
// - Compliment: buffs target
// 	- eventually you learn positive enforcement on enemies, while making them strong can pacify them.
// - Wager: Bet you'll avoid every attack.
// - Empathise: mirror target's state (eji thief skill, reflects his ability to act through others)
// - Cheer: positively influence's side's emotional state
// - Stifle: lowers all emotions
// - Ankle Slice: Deals damage. Lowers stamina.
// - Finisher: Immediately drains stacked damage
// - Defend: Reduce effectiveness of next attack
// - Intel: Gather's information on target (reveals HP, outside of battle can get more info on target)
