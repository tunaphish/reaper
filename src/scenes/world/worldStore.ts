import { makeAutoObservable } from "mobx";

import { ContextAction, Window } from "../../model/encounter";
import { Allies, Ally } from "../../model/ally";
import { Enemy } from "../../model/enemy";
import { Combatant } from "../../model/combatant";
import { Action, } from '../../model/action';
import { Item } from '../../model/item';
import { Technique } from '../../model/technique';

export type MenuOption = {
  display: () => JSX.Element;
  execute: () => void;
}
export type Menu =  {
  onClose?: () => void;
  menuOptions: MenuOption[];
  isCursor?: boolean;
  title?: string;
};

export type Executable = Action | Item | Technique;

export class WorldStore {
  playerSave: PlayerSave;

  // Navigation Related
  windows: Window[] = [];
  menus: Menu[] = [];
  contextAction?: ContextAction;

  // TODO: potentially make these generic
  enemyJournalContent?: Enemy;
  systemsMenuOpen = false;

  // Combat
  enemies: Enemy[] = [];
  allies: Allies;

  activeAlly?: Ally;
  executable?: Executable;
  targets: Combatant[] = [];

  constructor(playerSave: PlayerSave, allies: Allies) {
    this.playerSave = playerSave;
    this.allies = allies;
    makeAutoObservable(this);
  }

  pushWindow(window: Window): void {
    this.windows.push(window);
  }

  setWindows(windows: Window[]): void {
    this.windows = windows;
  }

  // TODO: figure out how to actually handle exit conditions for windows.... LATAH
  closeWindows(): void {
    this.windows = [];
  }

  setActiveAlly(ally: Ally): void {
    this.activeAlly = ally;
  }

  popMenu(): Menu {
    const menu = this.menus.pop();
    menu.onClose?.();
    return menu;
  }

  closeMenus(): void {
    while (this.menus.length > 0) {
      this.popMenu();
    }
  }

  pushMenu(menu: Menu): void {
    this.menus.push(menu);
  }

  setEnemyJournalContent(enemy?: Enemy): void {
    this.enemyJournalContent = enemy;
  }

  setSystemsMenuOpen(systemsMenuOpen: boolean): void {
    this.systemsMenuOpen = systemsMenuOpen;
  }

  setContextAction(contextAction?: ContextAction): void {
    this.contextAction = contextAction;
  }

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }

  setTargets(targets: Combatant[]): void {
    this.targets = targets;
  }

  setExecutable(executable?: Executable): void {
    this.executable = executable;
  }

  resetSelections(): void {
    this.closeMenus();
    this.setActiveAlly(null);
    this.setExecutable(null);
    this.setTargets([]);
  }

  pushEnemies(enemies: Enemy[]): void {
    this.enemies.push(...enemies);
  }
}
