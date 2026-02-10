import { makeAutoObservable } from "mobx";
import { Encounter } from "../../model/encounter";

export type ActiveSpread = {
  spread: Encounter;
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
