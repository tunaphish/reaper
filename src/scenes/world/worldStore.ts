import { makeAutoObservable } from "mobx";
import { Window } from "../../model/encounter";

export enum MenuState {
    NONE = 'none',
    NEUTRAL = 'neutral',
    INVENTORY = 'inventory',
    JOURNAL = 'journal',
}

export class WorldStore {
  menuState: MenuState = MenuState.NONE;
  windows: Window[] = [];
  playerSave: PlayerSave;

  constructor(playerSave: PlayerSave) {
    this.playerSave = playerSave;
    makeAutoObservable(this);
  }

  setMenuState(menuState: MenuState): void{
    this.menuState = menuState;
  }

  pushWindow(window: Window): void {
    this.windows.push(window);
  }

  setWindows(windows: []): void {
    this.windows = windows;
  }
}
