import { makeAutoObservable } from "mobx";
import { Ally } from "../../model/ally";
import { Combatant, Status } from "../../model/combatant";
import { Enemy } from "../../model/enemy";
import { Menu } from "./menu";
import { Action } from "../../model/action";
import { getRandomItem } from "../../model/random";

export type QueueAction = {
  caster: Ally,
  action: Action,
}

export class BattleStore {
  enemies: Enemy[];
  allies: Ally[];

  caster?: Ally = null;
  target?: Enemy = null;
  menu?: Menu = null;

  queue?: QueueAction[] = [];

  constructor(enemies: Enemy[], allies: Ally[]) {
    this.enemies = enemies;
    this.allies = allies;
    makeAutoObservable(this);
  }

  tickBattle(delta: number): void {
    this.allies.forEach((ally) => {
      if (ally.status === Status.DEAD) return;
      const regenPerTick = ally.staminaRegenRatePerSecond * (delta / 1000);
      ally.stamina = Math.min(ally.maxStamina, ally.stamina + regenPerTick);
    });

    this.updateAllyStatus();


    this.enemies.forEach((enemy) => {
      if (enemy.status === Status.DEAD) return;
      enemy.timeSinceLastStrategy += delta;

      if (enemy.timeSinceLastStrategy > enemy.selectedStrategy.timeTilExecute) {
        // todo: if not exhausted execute strat

        enemy.selectedStrategy = getRandomItem(enemy.strategies);
        enemy.timeSinceLastStrategy = 0;
        enemy.status = Status.NORMAL;
      }
    });
  }

  getStaminaUsed(ally: Ally): number {
    return this.queue
      .filter((queueAction) => ally.name === queueAction.caster.name)
      .reduce((total, queueAction) => {
        return total + queueAction.action.staminaCost;
      }, 0)
  }

  getAllyStatus(ally: Ally): Status {
    if (ally.health === 0) return Status.DEAD;
    if (this.getStaminaUsed(ally) >= ally.maxStamina || ally.stamina < 0) return Status.EXHAUSTED;
    return Status.NORMAL;
  } 

  updateAllyStatus(): void {
    this.allies.forEach(ally => {
      ally.status = this.getAllyStatus(ally);
    })
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

  setTarget(target: Enemy) {
    this.target = target;
  }

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }
}

