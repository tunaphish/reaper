import { makeAutoObservable } from "mobx";

export enum MenuState {
    NONE = 'none',
    NEUTRAL = 'neutral',
    INVENTORY = 'inventory',
    JOURNAL = 'journal',

}

export class WorldStore {
  menuState: MenuState = MenuState.NONE;
  playerSave: PlayerSave

  constructor(playerSave: PlayerSave) {
    this.playerSave = playerSave;
    makeAutoObservable(this);
  }

  setMenuState(menuState: MenuState): void{
    this.menuState = menuState;
  }
}
