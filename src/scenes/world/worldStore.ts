import { makeAutoObservable } from "mobx";

export enum MenuState {
    NONE = 'none',
    NEUTRAL = 'neutral',
    INVENTORY = 'inventory',
    GLOSSARY = 'glossary',

}

export class WorldStore {
  menuState: MenuState = MenuState.NONE;
  spirits = 0;

  constructor(spirits: number) {
    this.spirits = spirits;
    makeAutoObservable(this);
  }

  setMenuState(menuState: MenuState): void{
    this.menuState = menuState;
  }
}
