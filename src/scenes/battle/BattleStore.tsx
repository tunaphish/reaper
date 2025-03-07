import { makeAutoObservable } from "mobx";
import { Allies } from "../../model/ally";
import { Combatant, Status } from "../../model/combatant";
import { Enemy } from "../../model/enemy";
import { Executable } from "./Battle";
import { Folder } from "../../model/folder";
import { Reaction } from "../../model/reaction";
import { Action } from "../../model/action";

export type TimelineAction = { 
  id: string; 
  timeTilExecute: number; 
  action: Action; 
  target: Combatant; 
  caster: Combatant; 
  reactions: Reaction[];
  isEnemyCaster: boolean;
};

export type Notification = {
  id: string;
  text: string;
  source: string;
  timeSinceAdded: number;
  isEnemy: boolean;
}

export class BattleStore {
  time = 0;

  enemies: Enemy[];
  allies: Allies;

  caster?: Combatant;
  executable?: Executable;
  target?: Combatant;

  reaction?: Reaction;
  timelineActions: TimelineAction[] = [];

  menus: Folder[] = [];


  notifications: Notification[] = [];

  constructor(enemies: Enemy[], allies: Allies) {
    this.enemies = enemies;
    this.allies = allies;
    makeAutoObservable(this);
  }

  setTime(time: number): void {
    this.time = time;
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

  setDeferredActions(timelineActions: TimelineAction[]) {
    this.timelineActions = timelineActions;
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
    this.setReaction(null);
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
      
        const regenPerTick = combatant.staminaRegenRatePerSecond * (delta / 1000);
        combatant.stamina = Math.min(combatant.maxStamina, combatant.stamina + regenPerTick);


      combatant.juggleDuration = Math.max(0, combatant.juggleDuration -= delta);
    });
  }

  updateCombatantsState(): void {
    [...this.allies, ...this.enemies].forEach((combatant) => {
      if (combatant.health <= 0) {
        combatant.status = Status.DEAD;
      } else if (combatant.stamina <= 0) {
        combatant.status = Status.EXHAUSTED;
      } 
      
      combatant.status = Status.NORMAL;
    });
  }

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }

  addNotification(notification: Notification): void {
    this.notifications.push(notification);
  }

  updateNotifications(delta: number) {
    this.notifications = this.notifications
      .map((notification: Notification) => {
        notification.timeSinceAdded += delta;
        return notification;
      })
      .filter((notification) => notification.timeSinceAdded < 5000);
  }
}

