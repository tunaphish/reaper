import { Ally } from '../model/ally';
import { Status } from '../model/combatant';
import * as Actions from './actions';



export const Eji: Ally = {
  name: 'Cloud',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  stamina: 0,
  maxStamina: 150,

  staminaRegenRatePerSecond: 5,

  actions: [Actions.attack, Actions.stanch],
  
  status: Status.NORMAL,
  position: [-2, 0, 2],
  
  spritePath: '/reaper/sprites/allies/charizard.png',
  menuPortraitPath: '/reaper/characters/menu/cloud.png',
};




export const Keshi: Ally = {
  name: 'Barret',
  health: 100,
  maxHealth: 100,
  bleed: 0,
  stamina: 0,
  maxStamina: 100,

  staminaRegenRatePerSecond: 7,
  
  actions: [Actions.attack, Actions.stanch],

  status: Status.NORMAL,

  position: [0, 0, 2],
  
  spritePath: '/reaper/sprites/allies/gengar.png',
  menuPortraitPath: '/reaper/characters/menu/barret.png',
};

export const Elise: Ally = {
  name: 'Tifa',
  health: 100,
  bleed: 0,
  maxHealth: 100,
  stamina: 0,
  maxStamina: 200,

  staminaRegenRatePerSecond: 4,

  status: Status.NORMAL,

  actions: [Actions.attack, Actions.stanch],

  position: [2, 0, 2],

  spritePath: '/reaper/sprites/allies/snorlax.png',
  menuPortraitPath: '/reaper/characters/menu/tifa.png',
};

export const DefaultAllies: Ally[] = [Eji, Keshi, Elise];
