import { makeAutoObservable } from "mobx";
import { Ally } from "../../model/ally";
import { Combatant, Status } from "../../model/combatant";
import { Enemy } from "../../model/enemy";
import { Menu } from "./menu";
import { Action } from "../../model/action";

export type QueueAction = {
  caster: Ally,
  action: Action,
}

export class BattleStore {
  enemies: Enemy[];
  allies: Ally[];

  caster?: Ally = null;
  menu?: Menu = null;

  queue?: QueueAction[] = [];

  constructor(enemies: Enemy[], allies: Ally[]) {
    this.enemies = enemies;
    this.allies = allies;
    makeAutoObservable(this);
  }

  tickStamina(delta: number): void {
    this.allies.forEach((ally) => {
      if (ally.status === Status.DEAD) return;
      const regenPerTick = ally.staminaRegenRatePerSecond * (delta / 1000);
      ally.stamina = Math.min(ally.maxStamina, ally.stamina + regenPerTick);
    });
  }

  setCaster(caster?: Ally): void {
    this.caster = caster;
  }

  setMenu(menu?: Menu): void {
    this.menu = menu;
  }

  setQueue(queue: QueueAction[]): void {
    this.queue = queue;
  }

  pushAction(action: Action): void {
    this.queue.push({
      action,
      caster: this.caster
    })
  }

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }
}

