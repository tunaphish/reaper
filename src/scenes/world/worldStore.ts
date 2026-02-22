import { makeAutoObservable } from "mobx";
import { Window } from "../../model/encounter";
import { Ally } from "../../model/ally";
import { Enemy } from "../../model/enemy";



export type MenuOption = {
  display: string;
  execute: () => void;
}

export type Menu =  {
  onClose?: () => void;
  menuOptions: MenuOption[];
};


export class WorldStore {
  windows: Window[] = [];
  playerSave: PlayerSave;
  activeAlly?: Ally;
  menus: Menu[] = [];

  // TODO: potentially make these generic
  enemyJournalContent?: Enemy;
  systemsMenuOpen = false;


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
}
