import { makeAutoObservable } from "mobx";
import { Allies } from "../../model/ally";
import { Combatant, Status } from "../../model/combatant";
import { Enemy } from "../../model/enemy";
import { Executable } from "./Battle";
import { Folder } from "../../model/folder";

export class MenuSelections {
  caster?: Combatant;
  executable?: Executable;
  target?: Combatant;
  menus: Folder[] = [];
  text: string;

  constructor(text: string) {
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
  }
}

export class BattleStore {
  // battle vars
  enemies: Enemy[];
  allies: Allies;

  // menu vars
  allyMenuSelections: MenuSelections = new MenuSelections("*the wind is howling*");
  enemyMenuSelections: MenuSelections  = new MenuSelections("woof");

  enemyCursorIdx = 0;

  constructor(enemies: Enemy[], allies: Allies) {
    this.enemies = enemies;
    this.allies = allies;
    makeAutoObservable(this);
  }

  setEnemyCursorIdx(enemyCursorIdx: number): void {
    this.enemyCursorIdx = enemyCursorIdx;
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
      
      const STAMINA_LOSS_PER_SECOND_WHILE_CHARGING = 100;
      if (combatant.status === Status.CHARGING) {
        combatant.stamina = combatant.stamina -= STAMINA_LOSS_PER_SECOND_WHILE_CHARGING*(delta/1000);
      }
      else if (combatant.status !== Status.BLOCKING && combatant.status !== Status.CASTING) {
          const regenPerTick = combatant.staminaRegenRatePerSecond * (delta / 1000);
          combatant.stamina = Math.min(combatant.maxStamina, combatant.stamina + regenPerTick);
      }
    
      const decayPerTick = combatant.flowDecayRatePerSecond * (delta/1000);
      combatant.flow = Math.max(0, combatant.flow-decayPerTick);
    });
  }

  updateCombatantsState(): void {
    [...this.allies, ...this.enemies].forEach((combatant) => {
      const prevStatus = combatant.status;
      if (combatant.health <= 0) {
        combatant.status = Status.DEAD;
      } else if (combatant.stamina <= 0) {
        combatant.status = Status.EXHAUSTED;
      } else if (combatant.status === Status.BLOCKING) {
        // do nothing
      } else if (combatant.status !== Status.CHARGING && combatant.status !== Status.CASTING) {
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
