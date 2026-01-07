import { makeAutoObservable } from "mobx";
import { Window } from "../../model/spread";

export class EncounterStore {
  displayedWindows: Window[] = [];

  constructor() {
    makeAutoObservable(this);
  }

   pushWindow(window: Window): void {
    this.displayedWindows.push(window);
  }
}
