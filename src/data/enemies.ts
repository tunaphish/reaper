import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { randomEnemy, randomParty, self } from '../model/targetPriorities';
import { OptionType } from '../model/option';

import * as JankenboBehaviors from './jankenboBehaviors';
import { attack, idle } from './actions';
import { selfPreservation } from './traits';


export const healieBoi: Enemy = {
  type: OptionType.ENEMY,
  name: 'Healie Boi',
  health: 200,
  maxHealth: 200,
  bleed: 0,
  stamina: 0,
  maxStamina: 800,
  magic: 100,
  maxMagic: 100,
  flow: 0,
  flowDecayRatePerSecond: 5,
  staminaRegenRatePerSecond: 10,
  traits: new Set([selfPreservation]),
  behaviors: [
    { action: attack, weight: 100, targetPriority: randomParty, dialoguePool: ['Suffer as I have', 'Eat shit'] },
    { action: idle, weight: 100, targetPriority: self },
  ],
  status: Status.NORMAL,
  imageUrl: '/reaper/assets/characters/eji.png',
  takingDamage: false,
  activeSpells: [],
  jankenboThrow: JankenboBehaviors.cycle,
};
