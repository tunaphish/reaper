import { Enemy } from '../model/enemy';
import { Status } from '../model/combatant';
import { randomEnemy, randomParty, self } from '../model/targetPriorities';

import { slash, idle, heal } from './actions';
import { selfPreservation } from './traits';

export const healieBoi: Enemy = {
  name: 'Healie Boi',
  health: 200,
  maxHealth: 200,
  stackedDamage: 0,
  stamina: 0,
  maxStamina: 800,
  magic: 100,
  maxMagic: 100,
  staminaRegenRate: 100,
  traits: new Set([selfPreservation]),
  behaviors: [
    { action: slash, weight: 100, targetPriority: randomParty, dialoguePool: ['Suffer as I have', 'Eat shit'] },
    { action: heal, weight: 100, targetPriority: randomEnemy },
    { action: idle, weight: 100, targetPriority: self },
  ],
  status: Status.NORMAL,
};
