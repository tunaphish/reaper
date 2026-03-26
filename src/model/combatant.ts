import { Option, OptionType } from './option';
import { clamp } from './math';
import { Technique } from './technique';
import { Executable } from './Executable';

export enum Status {
  NORMAL = 'NORMAL',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
}

export type CastingExecutable = {
  targets: Combatant[];
  executable: Executable;
  castedTimeInMs: number;
  appliedTechniques: Technique[];
}


export type Combatant = Option & {
  type: OptionType;

  health: number;
  maxHealth: number;
  bleed: number;

  actionPoints: number;
  maxActionPoints: number;
  actionPointsRegenRatePerSecond: number; 

  activeTechniques: Technique[];
  status: Status;

  castingExecutable?: CastingExecutable

  combatPortraitSrc: string;
}

export const updateHealth = (target: Combatant, change: number): void => {
  if (target.health + change > target.maxHealth) {
    target.bleed -= (target.health + change) - target.maxHealth;
  }
  target.health = Math.min(target.maxHealth, target.health + change);
};

export const updateBleed = (target: Combatant, change: number): void => {
  const newBleed = target.bleed + change;
  target.bleed = clamp(0, newBleed, target.health);
};

export const updateDamage = (target: Combatant, change: number): void => {
  if (target.status === Status.EXHAUSTED) {
    change *= 2;
  }  
  if (change < 0) {
    updateBleed(target, change);
    return;
  }

  if (target.bleed + change > target.health) {
    const newHealth = target.health - (target.bleed+change - target.health);
    target.health = clamp(0, newHealth, target.maxHealth);
    target.bleed = target.health;
  } else {
    const newBleed = target.bleed + change;
    target.bleed = clamp(0, newBleed, target.health);
  }
};


export const updateActionPoints = (target: Combatant, change: number): void => {
  target.actionPoints = target.actionPoints + change;
};

export const techniqueIsActive = (combatant: Combatant, technique: Technique): boolean => combatant.activeTechniques.some(t => t.name === technique.name);

export const techniqueIsApplied = (combatant: Combatant, technique: Technique): boolean => {
  if (!combatant.castingExecutable) return false;
  return combatant.castingExecutable.appliedTechniques.some(t => t.name === technique.name);
}

export const removeTechnique = (combatant: Combatant, technique: Technique): void => {
  const techniqueIdx = combatant.activeTechniques.findIndex(activeTechnique => activeTechnique.name === technique.name);
  if (techniqueIdx === -1) return;
  combatant.activeTechniques.splice(techniqueIdx,1);
}

export const useApResources = (caster: Combatant, cost: number): void => updateActionPoints(caster, -cost);

