import { makeAutoObservable } from "mobx";

import { Window } from "../../model/encounter";
import { Allies, Ally } from "../../model/ally";
import { Enemy } from "../../model/enemy";
import { Combatant } from "../../model/combatant";
import { Executable } from "../../model/Executable";
import { Technique } from "../../model/technique";

export class BattleStore {
  playerSave: PlayerSave;

  // Navigation Related
  windows: Window[] = [];
  
  enemies: Enemy[] = [];
  allies: Allies;

  activeAlly?: Ally;
  activeTechnique?: Technique;
  executable?: Executable;
  targets: Combatant[] = [];

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


  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies];
  }

  setTargets(targets: Combatant[]): void {
    this.targets = targets;
  }

  setActiveTechnique(technique?: Technique): void{
    this.activeTechnique = technique;
  }

  setExecutable(executable?: Executable): void {
    this.executable = executable;
  }

  resetSelections(): void {
    this.setActiveAlly(null);
    this.setActiveTechnique(null);
    this.setExecutable(null);
    this.setTargets([]);
  }

  pushEnemies(enemies: Enemy[]): void {
    this.enemies.push(...enemies);
  }
}
