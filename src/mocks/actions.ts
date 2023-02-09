import { Action, ActionTags } from "../entities/action";

export const slash: Action = {
  name: 'Slash',
  staminaCost: 50,
  tags: new Set([ActionTags.ATTACK]),
  execute: (enemies, party, target) => {
    const DAMAGE = 50;
    target.health -= DAMAGE;
  }
}

export const block: Action = {
  name: 'Block', 
  staminaCost: 50,
  tags: new Set([ActionTags.DEFEND]),
  execute: (enemies, party) => {
  }
}

export const idle: Action = {
  name: 'Idle', 
  staminaCost: 0,
  tags: new Set([ActionTags.ATTACK]),
  execute: () => {
  }
}

export const heal: Action = {
  name: 'Heal',
  staminaCost: 50,
  tags: new Set([ActionTags.HEAL]),
  execute: (enemies) => {
    const HEALTH = 50;
    const enemy = enemies[0];
    enemy.health = Math.min(enemy.maxHealth, enemy.health += HEALTH);
  }
}

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
// - Eji Attack: Basic damage on target. Using this move in a row
// - Keshi Basic: Heal's target. Using this move in a row increases stam regen 
// - Intel: Gather's information on target (reveals HP, outside of battle can get more info on target) 