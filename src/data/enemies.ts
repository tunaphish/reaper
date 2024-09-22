import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { randomEnemy, randomParty, self } from '../model/targetPriorities';

import { slash, idle, heal } from './actions';
import { selfPreservation } from './traits';

export const healieBoi: Enemy = {
  name: 'Healie Boi',
  health: 10,
  maxHealth: 200,
  bleed: 10,
  stamina: 0,
  maxStamina: 800,
  magic: 100,
  maxMagic: 100,
  staminaRegenRatePerSecond: 10,
  traits: new Set([selfPreservation]),
  behaviors: [
    { action: slash, weight: 100, targetPriority: randomParty, dialoguePool: ['Suffer as I have', 'Eat shit'] },
    { action: heal, weight: 100, targetPriority: randomEnemy },
    { action: idle, weight: 100, targetPriority: self },
  ],
  status: Status.NORMAL,
  imageUrl: '/reaper/assets/characters/eji.png',
  takingDamage: false,
};
