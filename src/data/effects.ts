import { updateDamage, updateStamina, updateBleed, updateHealth } from "../model/combatant";

export const dealDamage = (target, source, potency) => {
  updateDamage(target, potency);
  if (target.juggleDuration > 0) {
    target.juggleDuration += 500;
  }
};

// these are potentially confusing lol
export const healStamina = (target, source, potency) => {
  updateStamina(target, potency);
};
export const healBleed = (target, source, potency) => {
  updateBleed(target, -potency);
};
export const healHealth = (target, source, potency) => {
  updateHealth(target, potency);
};
export const launch = (target, source, potency) => {
  target.juggleDuration += potency;
};

// consider converting to getPotency functions
export const scaleDamageOnBleedCombatants = (target, source, potency, scene) => {
  const damagedCombatants = scene.battleStore.getCombatants().filter(combatant => combatant.bleed > 0).length;
  const newPotency = damagedCombatants * potency;
  updateDamage(target, newPotency);
};
export const scaleDamageOnCombatantsTargetingTarget = (target, source, potency, scene) => {
  const damagedCombatants = scene.battleStore.getCombatants().filter(combatant => combatant.queuedTarget.name === target.name).length;
  const newPotency = damagedCombatants * potency;
  updateDamage(target, newPotency);
};
export const scaleDamageOnCasterBleed = (target, source, potency) => {
  updateDamage(target, source.bleed);
};

