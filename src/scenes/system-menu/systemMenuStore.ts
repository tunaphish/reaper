import { makeAutoObservable } from "mobx";

import { Window } from "../../model/encounter";
import { Enemy } from "../../model/enemy";

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

export class SystemMenuStore {
  playerSave: PlayerSave;

  // Navigation Related
  windows: Window[] = [];
  menus: Menu[] = [];

  // TODO: potentially make these generic
  enemyJournalContent?: Enemy;


  constructor(playerSave: PlayerSave) {
    this.playerSave = playerSave;
    makeAutoObservable(this);
  }

  pushWindow(window: Window): void {
    this.windows.push(window);
  }

  setWindows(windows: Window[]): void {
    this.windows = windows;
  }

  closeWindows(): void {
    this.windows = [];
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

  resetSelections(): void {
    this.closeMenus();

  }
}
