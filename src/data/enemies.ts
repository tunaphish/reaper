import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { Combatant } from '../model/combatant';
import { OptionType } from '../model/option';
import { getRandomInt } from '../model/math';

import * as Actions from './actions';
import * as Reactions from './reactions';

import { Battle } from '../scenes/battle/Battle';


// #region Target
const isAlive = (unit: Combatant) => unit.health !== 0;

const randomEnemy = (scene: Battle, caster: Combatant) => {
  const aliveEnemies = scene.battleStore.enemies.filter(isAlive);
  return aliveEnemies.at(getRandomInt(aliveEnemies.length));
};
const highestBleedEnemy = (scene: Battle, caster: Combatant) => {
  const aliveEnemies = scene.battleStore.enemies.filter(isAlive);
  return aliveEnemies.reduce((highest, enemy) => {
    return enemy.bleed > highest.bleed ? enemy : highest;
  });
};

export const randomAlly = (scene: Battle, caster: Combatant) => {
  const aliveAlly = scene.battleStore.allies.filter(isAlive);
  return aliveAlly.at(getRandomInt(aliveAlly.length));
};

export const randomFullHealthAlly = (scene: Battle, caster: Combatant) => {
  const fullHealthAlly = scene.battleStore.allies
    .filter(isAlive)
    .filter(combatant => combatant.health === combatant.maxHealth);
  return fullHealthAlly.length === 0 ? null : fullHealthAlly.at(getRandomInt(fullHealthAlly.length));
};

export const self = (scene: Battle, caster: Combatant) => caster;

const selfBeingAttacked = (scene: Battle, caster: Combatant): Combatant | null => {
  const actionsAtEnemyCloseToExecution = scene.battleStore.deferredActions.filter(
    deferredAction => deferredAction.target.name === caster.name &&
    deferredAction.reactions.length === 0
  );
  return actionsAtEnemyCloseToExecution.length > 0 ? caster : null;
};

const selfCloseToBeingAttacked = (scene: Battle, caster: Combatant): Combatant | null => {
  const actionsAtEnemyCloseToExecution = scene.battleStore.deferredActions.filter(
    deferredAction => deferredAction.target.name === caster.name &&
    deferredAction.timeTilExecute < 500 &&
    deferredAction.reactions.length === 0
  );
  return actionsAtEnemyCloseToExecution.length > 0 ? caster : null;
};

// #endregion


// #region Enemies
export const fencer: Enemy = {
  type: OptionType.ENEMY,
  name: 'Fencer',
  health: 100,
  maxHealth: 200,
  bleed: 0,
  stamina: 0,
  maxStamina: 125,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 8,
  
  strategies: [
    {
      potentialOptions: [
        { option: Actions.engage, getTarget: randomFullHealthAlly, cadence: 50, singleUse: true },
        { option: Actions.attack, getTarget: randomAlly, cadence: 500, singleUse: false }
      ],
      potentialReactions: [],
      notification: 'Fencer attacks!',
      toExit: (enemy, battle): boolean => enemy.stamina < 25,
      toEnter: (enemy): boolean => enemy.stamina > 100,
    },
    {
      potentialOptions: [],
      potentialReactions: [{ reaction: Reactions.evade, getTarget: selfCloseToBeingAttacked }],
      notification: 'Fencer takes an evasive stance...',
      toExit: (enemy, battle): boolean => enemy.stamina > 100,
      toEnter: (enemy): boolean => enemy.stamina > 50,
    },
    {
      potentialOptions: [],
      potentialReactions: [],
      notification: 'Fencer is conserving aura...',
      toExit: (enemy, battle): boolean => enemy.stamina > 50,
      toEnter: (): boolean => true,
    }
  ],

  spritePath: '/reaper/sprites/enemies/ninetails.png',

  // temp props
  timeTilNextAction: 0,
  status: Status.NORMAL,
  timeInStateInMs: 0,
  juggleDuration: 0,  
  position: [-1, 0, -10],
};

export const cleric: Enemy = {
  type: OptionType.ENEMY,
  name: 'Cleric',
  health: 200,
  maxHealth: 200,
  bleed: 0,
  stamina: 0,
  maxStamina: 125,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 5,

  strategies: [
    {
      potentialOptions: [
        { option: Actions.bandage, getTarget: highestBleedEnemy, cadence: 500, singleUse: true },
      ],
      potentialReactions: [],
      notification: 'Cleric is healing enemies...',
      toExit: (enemy, battle): boolean => {
        if (enemy.stamina < 25) return true;
        const bleedingEnemy = battle.battleStore.enemies.find(enemy => enemy.bleed > 15);
        return bleedingEnemy === undefined;
      },
      toEnter: (enemy, battle): boolean => {
        if (enemy.stamina < 25) return false;
        const bleedingEnemy = battle.battleStore.enemies.find(enemy => enemy.bleed > 15);
        return bleedingEnemy !== undefined;
      },
    },
    {
      potentialOptions: [
        { option: Actions.attack, getTarget: randomAlly, cadence: 500, singleUse: false  }
      ],
      potentialReactions: [],
      notification: 'Cleric attacks!',
      toExit: (enemy, battle): boolean => enemy.stamina < 50,
      toEnter: (enemy): boolean => enemy.stamina > 100,
    },
    {
      potentialOptions: [],
      potentialReactions: [],
      notification: 'Cleric is conserving aura...',
      toExit: (enemy, battle): boolean => enemy.stamina > 100,
      toEnter: (): boolean => true,
    }
  ],

  spritePath: '/reaper/sprites/enemies/chansey.png',

  // temp props
  timeTilNextAction: 0,

  status: Status.NORMAL,
  timeInStateInMs: 0,
  juggleDuration: 0,  
  position: [3, 0, -10],
};

export const knight: Enemy = {
  type: OptionType.ENEMY,
  name: 'Knight',
  health: 200,
  maxHealth: 200,
  bleed: 0,
  stamina: 0,
  maxStamina: 125,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 5,

  strategies: [
    {
      potentialOptions: [
        { option: Actions.attack, getTarget: randomAlly, cadence: 500, singleUse: false  }
      ],
      potentialReactions: [
        // cover
        { reaction: Reactions.block, getTarget: selfBeingAttacked }
      ],
      notification: 'Knight takes a defensive stance!',
      toExit: (enemy, battle): boolean => enemy.stamina < 25,
      toEnter: (enemy): boolean => enemy.stamina > 75,
    },
    {
      potentialOptions: [],
      potentialReactions: [],
      notification: 'Knight is conserving aura...',
      toExit: (enemy, battle): boolean => enemy.stamina > 75,
      toEnter: (): boolean => true,
    }
  ],

  spritePath: '/reaper/sprites/enemies/golem.png',

  // temp props
  timeTilNextAction: 0,

  status: Status.NORMAL,
  timeInStateInMs: 0,
  juggleDuration: 0,  
  position: [1, 0, -10],
};

// #endregion