import { Option, OptionType } from './option';
import { clamp } from './math';
import { Technique } from './technique';
import { Executable } from './Executable';

export enum Status {
  NEUTRAL = 'NEUTRAL',
  EXHAUSTED = 'EXHAUSTED',
  DEAD = 'DEAD',
}

export type CastingExecutable = {
  targets: Combatant[];
  executable: Executable;
  castedTimeInMs: number;
  appliedTechniques: Technique[];
  violated: boolean;
}


export type Combatant = Option & {
  type: OptionType;

  health: number;
  maxHealth: number;
  bleed: number;

  actionPoints: number;
  maxActionPoints: number;
  actionPointsRegenRatePerSecond: number; 

  techniques: Technique[];
  castingExecutable?: CastingExecutable
}

export const getStatus = (combatant: Combatant): Status => {
  if (combatant.health <= 0) {
    return Status.DEAD;
  } else if (combatant.actionPoints <= 0) {
    return Status.EXHAUSTED;
  } 
  return Status.NEUTRAL;
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
  if (getStatus(target) === Status.EXHAUSTED) {
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

export const techniqueIsActive = (combatant: Combatant, technique: Technique): boolean => combatant.techniques.some(activeTechnique => activeTechnique.technique.name === technique.name);

export const getActiveTechnique = (combatant: Combatant, technique: Technique): ActiveTechnique => combatant.techniques.find(activeTechnique => activeTechnique.technique.name === technique.name);

export const techniqueIsViolated = (combatant: Combatant, technique: Technique): boolean => !!getActiveTechnique(combatant, technique)?.violated;

export const techniqueIsApplied = (combatant: Combatant, technique: Technique): boolean => {
  if (!combatant.castingExecutable) return false;
  return combatant.castingExecutable.appliedTechniques.some(t => t.name === technique.name);
}

export const removeTechnique = (combatant: Combatant, technique: Technique): void => {
  const techniqueIdx = combatant.techniques.findIndex(activeTechnique => activeTechnique.technique.name === technique.name);
  if (techniqueIdx === -1) return;
  combatant.techniques.splice(techniqueIdx,1);
}

export const useApResources = (caster: Combatant, cost: number): void => updateActionPoints(caster, -cost);

