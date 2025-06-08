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

export enum BattleState {
  NEUTRAL = 'Neutral',
  ATTACK = 'Attack',
  DEFEND = 'Defend',
  RESOLUTION = 'Resolution',
}

export class BattleStore {
  enemies: Enemy[];
  allies: Ally[];

  caster?: Ally = null;
  target?: Combatant = null;
  menu?: Menu = null;

  state: BattleState = BattleState.NEUTRAL;

  queue?: QueueAction[] = [];

  constructor(enemies: Enemy[], allies: Ally[]) {
    this.enemies = enemies;
    this.allies = allies;
    makeAutoObservable(this);
  }

  tickBattle(delta: number): void {
    if (this.state === BattleState.RESOLUTION) return;
    
    this.allies.forEach((ally) => {
      if (ally.status === Status.DEAD) return;
      const regenPerTick = ally.staminaRegenRatePerSecond * (delta / 1000);
      ally.stamina = Math.min(ally.maxStamina, ally.stamina + regenPerTick);

      if (ally.bleed > 0) {
        const DAMAGE_TICK_RATE = (delta / 1000) * 5;
        ally.bleed -= DAMAGE_TICK_RATE;
        ally.health = Math.max(0, ally.health - DAMAGE_TICK_RATE);
      }
    });

    this.updateAllyStatus();
    
    this.enemies.forEach((enemy) => {
      if (enemy.health === 0) enemy.status === Status.DEAD;
      if (enemy.status === Status.DEAD) return;
      enemy.timeSinceLastAction += delta;
    });
  }

  getAllyStatus(ally: Ally): Status {
    if (ally.health === 0) return Status.DEAD;
    if (ally.stamina < 0) return Status.EXHAUSTED;
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

  pushAction(action: Action, caster: Ally): void {
    this.queue.push({
      action,
      caster
    })
  }

  dequeueAction(): void {
    this.queue.shift();
  }

  setTarget(target: Combatant): void {
    this.target = target;
  }

  setState(state: BattleState): void {
    this.state = state;
  }

  applyBleed(): void {
    this.enemies.forEach(combatant => {
      combatant.health = Math.max(0, combatant.health - combatant.bleed);
      combatant.bleed = 0;
    });
  }

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }

}

