import { makeAutoObservable } from "mobx";

export enum MenuState {
    NONE = 'none',
    NEUTRAL = 'neutral',
    INVENTORY = 'inventory',

}

export class WorldStore {
  menuState: MenuState = MenuState.NONE;

  constructor() {
    makeAutoObservable(this);
  }

  setMenuState(menuState: MenuState): void{
    this.menuState = menuState;
  }
}
