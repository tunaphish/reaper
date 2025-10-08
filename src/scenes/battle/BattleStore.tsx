import { makeAutoObservable } from "mobx";
import { Allies } from "../../model/ally";
import { Combatant, Status } from "../../model/combatant";
import { Enemy } from "../../model/enemy";
import { Executable } from "./Battle";
import { Folder } from "../../model/folder";


export class BattleStore {
  // battle vars
  enemies: Enemy[];
  allies: Allies;

  caster?: Combatant;
  executable?: Executable;
  target?: Combatant;


  menus: Folder[] = [];

  resonance = 0;


  constructor(enemies: Enemy[], allies: Allies) {
    this.enemies = enemies;
    this.allies = allies;
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

  pushMenu(folder: Folder): void {
    this.menus.push(folder);
  }

  popMenu(): Folder {
    return this.menus.pop();
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


  tickStats(delta: number): void {
    [...this.allies, ...this.enemies].forEach((combatant) => {

      if (combatant.status === Status.DEAD) return;
      if (combatant.bleed > 0) {
        const DAMAGE_TICK_RATE = (delta / 1000) * 5;
        combatant.bleed -= DAMAGE_TICK_RATE;
        combatant.health = Math.max(0, combatant.health - DAMAGE_TICK_RATE);
      }
      
        const regenPerTick = combatant.actionPointsRegenRatePerSecond * (delta / 1000);
        combatant.actionPoints = Math.min(combatant.maxActionPoints, combatant.actionPoints + regenPerTick);
    

    });
  }

  updateCombatantsState(): void {
    [...this.allies, ...this.enemies].forEach((combatant) => {
      if (combatant.health <= 0) {
        combatant.status = Status.DEAD;
      } else if (combatant.actionPoints <= 0) {
        combatant.status = Status.EXHAUSTED;
      } else {
        combatant.status = Status.NORMAL;
      }
    });
  }

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }

}

