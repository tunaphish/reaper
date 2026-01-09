import { makeAutoObservable } from "mobx";
import { Spread } from "../../model/spread";

export type ActiveSpread = {
  spread: Spread;
  spreadIndex: number; 
}

export class EncounterStore {
  activeSpreads: ActiveSpread[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  pushActiveSpread(activeSpread: ActiveSpread): void {
    this.activeSpreads.push(activeSpread);
  }

  iterateSpreadIndex(activeSpreadsIndex: number): void {
    this.activeSpreads[activeSpreadsIndex].spreadIndex++;
  }
}
