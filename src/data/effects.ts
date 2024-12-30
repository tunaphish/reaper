import { updateDamage, updateStamina, updateBleed, updateHealth } from "../model/combatant";

export const dealDamage = (target, source, potency) => {
  updateDamage(target, potency);
};
export const healStamina = (target, source, potency) => {
  updateStamina(source, potency);
};
export const healBleed = (target, source, potency) => {
  updateBleed(target, -potency);
};
export const healHealth = (target, source, potency) => {
  updateHealth(target, potency);
};
