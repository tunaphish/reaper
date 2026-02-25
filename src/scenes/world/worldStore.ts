import { makeAutoObservable } from "mobx";
import { ContextAction, Window } from "../../model/encounter";
import { Ally } from "../../model/ally";
import { Enemy } from "../../model/enemy";


export type MenuOption = {
  display: string;
  execute: () => void;
}
export type Menu =  {
  onClose?: () => void;
  menuOptions: MenuOption[];
  isCursor?: boolean;
};


export class WorldStore {
  playerSave: PlayerSave;

  // Navigation Related
  windows: Window[] = [];
  activeAlly?: Ally;
  menus: Menu[] = [];
  contextAction?: ContextAction;

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
}
