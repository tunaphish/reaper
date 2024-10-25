import { makeAutoObservable } from "mobx";
import { Allies, Ally } from "../../model/ally";
import { JankenboThrow, Combatant, Status } from "../../model/combatant";
import { Enemy } from "../../model/enemy";
import { MenuContent } from "../../model/menuContent";
import { Spell } from "../../model/spell";
import { Executable } from "./Battle";


export class BattleStore {
  // battle vars
  enemies: Enemy[];
  allies: Allies;

  // menu vars
  caster?: Ally;
  executable?: Executable;
  target?: Enemy | Ally;
  menus: MenuContent[] = [];
  spells?: Spell[] = null;

  // spell vars
  chargeMultiplier = 1;
  zantetsukenMultiplier = 3.5;
  jankenboThrow?: JankenboThrow = null;

  stageText = "*the wind is howling*";

  constructor(enemies: Enemy[], allies: Allies) {
    this.enemies = enemies;
    this.allies = allies;
    makeAutoObservable(this);
  }

  setSpells(spells?: Spell[]): void {
    this.spells = spells;
  }

  setCaster(member?: Ally): void {
    this.caster = member;
  }

  setTarget(target?: Enemy | Ally): void {
    this.target = target;
  }

  setExecutable(executable?: Executable): void {
    this.executable = executable;
  }

  setChargeMultipler(chargeMultiplier: number): void {
    this.chargeMultiplier = chargeMultiplier;
  }

  setZantetsukenMultiplier(zantetsukenMultiplier: number): void {
    this.zantetsukenMultiplier = zantetsukenMultiplier;
  }

  setStageText(stageText: string): void {
    this.stageText = stageText;
  }


  tickStats(updateFunc: (combatant: Combatant, delta: number) => void, delta: number): void {
    [...this.allies, ...this.enemies].forEach((combatant) => {
      updateFunc(combatant, delta);
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
      } else if (combatant.status === Status.CASTING && combatant.timeInStateInMs > combatant.queuedOption.castTimeInMs) {
        combatant.status = Status.ATTACKING;
      } else if (combatant.status !== Status.CHARGING && combatant.status !== Status.CASTING && combatant.status !== Status.ATTACKING) {
        combatant.status = Status.NORMAL;
      }

      if (prevStatus !== combatant.status) {
        combatant.timeInStateInMs = 0;
      }
    });
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

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }
}
