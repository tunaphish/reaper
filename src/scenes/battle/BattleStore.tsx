import { makeAutoObservable } from "mobx";
import { Allies } from "../../model/ally";
import { Combatant, Status } from "../../model/combatant";
import { Enemy } from "../../model/enemy";
import { Executable } from "./Battle";
import { Folder } from "../../model/folder";
import { Reaction } from "../../model/reaction";
import { Action } from "../../model/action";

export type DeferredAction = { 
  id: string; 
  timeTilExecute: number; 
  action: Action; 
  target: Combatant; 
  caster: Combatant; 
  reactions: Reaction[];
};

export class BattleStore {
  // battle vars
  enemies: Enemy[];
  allies: Allies;

  caster?: Combatant;
  executable?: Executable;
  target?: Combatant;

  reaction?: Reaction;
  actionTarget?: DeferredAction;
  deferredActions: DeferredAction[] = [];

  menus: Folder[] = [];
  text: string;

  resonance = 0;

  constructor(enemies: Enemy[], allies: Allies, text: string) {
    this.enemies = enemies;
    this.allies = allies;
    this.text = text;
    makeAutoObservable(this);
  }

  setCaster(member?: Combatant): void {
    this.caster = member;
  }

  setTarget(target?: Combatant): void {
    this.target = target;
  }

  setExecutable(executable?: Executable): void {
    this.executable = executable;
  }

  setReaction(reaction?: Reaction): void {
    this.reaction = reaction;
  }

  setActionTarget(actionTarget?: DeferredAction): void {
    this.actionTarget = actionTarget;
  }

  setText(text: string): void {
    this.text = text;
  }

  emptyMenu(): void {
    this.menus.splice(0, this.menus.length);
  }

  resetSelections(): void {
    this.emptyMenu();
    this.setCaster(null);
    this.setExecutable(null);
    this.setTarget(null);
    this.setActionTarget(null);
  }


  tickStats(delta: number): void {
    [...this.allies, ...this.enemies].forEach((combatant) => {
      combatant.timeInStateInMs = Math.min(combatant.timeInStateInMs+delta, 1000000);

      if (combatant.status === Status.DEAD) return;
      if (combatant.bleed > 0) {
        const DAMAGE_TICK_RATE = (delta / 1000) * 5;
        combatant.bleed -= DAMAGE_TICK_RATE;
        combatant.health = Math.max(0, combatant.health - DAMAGE_TICK_RATE);
      }
      
      if (combatant.status !== Status.CASTING) {
          const regenPerTick = combatant.staminaRegenRatePerSecond * (delta / 1000);
          combatant.stamina = Math.min(combatant.maxStamina, combatant.stamina + regenPerTick);
      }

      combatant.juggleDuration = Math.max(0, combatant.juggleDuration -= delta);
    });
  }

  updateCombatantsState(): void {
    [...this.allies, ...this.enemies].forEach((combatant) => {
      const prevStatus = combatant.status;
      if (combatant.health <= 0) {
        combatant.status = Status.DEAD;
      } else if (combatant.stamina <= 0) {
        combatant.status = Status.EXHAUSTED;
      } else if (combatant.status !== Status.CASTING) {
        combatant.status = Status.NORMAL;
      }

      if (prevStatus !== combatant.status) {
        combatant.timeInStateInMs = 0;
      }
    });
  }

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }
}

