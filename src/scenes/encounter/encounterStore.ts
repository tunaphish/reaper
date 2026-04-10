import { makeAutoObservable } from "mobx";

import { ChoiceAction, Encounter, Window } from "../../model/encounter";
import { Allies, Ally } from "../../model/ally";
import { Enemy } from "../../model/enemy";
import { Combatant } from "../../model/combatant";
import { Executable } from "../../model/Executable";

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

export type ActiveEncounter = {
  encounter: Encounter;
  eventIdx: number;
  timeSinceLastEventInMs: number;
}

export class EncounterStore {
  playerSave: PlayerSave;

  // Navigation Related
  windows: Window[] = [];
  menus: Menu[] = [];
  choiceAction?: ChoiceAction;
  
  battleInitiated = false;
  enemies: Enemy[] = [];
  allies: Allies;

  activeAlly?: Ally;
  executable?: Executable;
  targets: Combatant[] = [];

  activeEncounter?: ActiveEncounter;

  constructor(playerSave: PlayerSave, allies: Allies) {
    this.playerSave = playerSave;
    this.allies = allies;
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
  
  setChoiceAction(choiceAction?: ChoiceAction): void {
    this.choiceAction = choiceAction;
  }

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }

  setTargets(targets: Combatant[]): void {
    this.targets = targets;
  }

  setExecutable(executable?: Executable): void {
    this.executable = executable;
  }

  resetSelections(): void {
    this.closeMenus();
    this.setActiveAlly(null);
    this.setExecutable(null);
    this.setTargets([]);
  }

  pushEnemies(enemies: Enemy[]): void {
    this.enemies.push(...enemies);
  }

  setBattleInitiated(battleInitiated: boolean): void {
    this.battleInitiated = battleInitiated;
  }

  setActiveEncounter(activeEncounter?: ActiveEncounter): void {
    this.activeEncounter = activeEncounter;
  }
}
