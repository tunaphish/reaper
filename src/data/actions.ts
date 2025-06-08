import { clamp } from "three/src/math/MathUtils";
import { Action, ActionType } from "../model/action";
import { Combatant, Status } from "../model/combatant";

export const attack: Action = {
    name: 'Attack',
    staminaCost: 50,
    actionType: ActionType.ATTACK,

    soundKeyName: 'attack',  
    description: 'Deals damage',
    effect: (battle, caster, target) => {
        updateDamage(target, 50);
    }
};

export const block: Action = {
    name: 'Block',
    staminaCost: 50,
    actionType: ActionType.DEFENSE,

    soundKeyName: 'block',  
    description: 'Blocks incoming damage',
    effect: (battle, caster, target) => {
        // caster.bleed = Math.max(0, caster.bleed-50);    
    }
};

export const stanch: Action = {
    name: 'Stanch',
    staminaCost: 70,
    actionType: ActionType.DEFENSE,

    soundKeyName: 'heal',  
    description: 'Heals bleed',
    effect: (battle, caster, target) => {
        target.bleed = Math.max(0, target.bleed-50);    
    }
};

export const updateBleed = (target: Combatant, change: number): void => {
    const newBleed = target.bleed + change;
    target.bleed = clamp(0, newBleed, target.health);
  };
  
  
  export const updateDamage = (target: Combatant, change: number): void => {
    // if exhausted deal direct damage?
    
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