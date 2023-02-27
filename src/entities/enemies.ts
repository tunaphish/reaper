import { Enemy } from '../entities/enemy';
import { Status } from '../entities/combatant';
import { randomEnemy, randomParty, self } from './targetPriorities';

import { slash, idle, heal } from './actions';
import { selfPreservation } from './traits';

import { anger, disgusted, envious, confusion } from './emotions';


export const healieBoi: Enemy = {
  name: 'Healie Boi',
  health: 200,
  maxHealth: 200,
  stackedDamage: 0,
  stamina: 20,
  maxStamina: 800,
  staminaRegenRate: 1,
  traits: new Set([selfPreservation]),
  behaviors: [
    { action: slash, weight: 100, targetPriority: randomParty },
    { action: heal, weight: 100, targetPriority: randomEnemy },
    { action: idle, weight: 100, targetPriority: self },
  ],
  emotionalState: new Map([
    [anger, 0],
    [confusion, 0],
    [disgusted, 0],
    [envious, 0],
  ]),
  status: Status.NORMAL,
};
