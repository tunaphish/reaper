import { makeAutoObservable } from "mobx";
import { ContextAction, Window } from "../../model/encounter";
import { Allies, Ally } from "../../model/ally";
import { Enemy } from "../../model/enemy";
import { Combatant, Status } from "../../model/combatant";
import * as Techniques from '../../data/techniques';


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

  // Combat
  enemies: Enemy[] = [];
  allies: Allies;

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

  setEnemyJournalContent(enemy?: Enemy): void {
    this.enemyJournalContent = enemy;
  }

  setSystemsMenuOpen(systemsMenuOpen: boolean): void {
    this.systemsMenuOpen = systemsMenuOpen;
  }

  setContextAction(contextAction?: ContextAction): void {
    this.contextAction = contextAction;
  }

  // combat
    tickStats(delta: number): void {
      this.getCombatants().forEach((combatant) => {
  
        if (combatant.status === Status.DEAD) return;
        if (combatant.bleed > 0) {
          const DAMAGE_TICK_RATE = (delta / 1000) * 5;
          combatant.bleed -= DAMAGE_TICK_RATE;
          combatant.health = Math.max(0, combatant.health - DAMAGE_TICK_RATE);
        }
        
          const regenPerTick = combatant.actionPointsRegenRatePerSecond * 
            (combatant.activeTechniques.has(Techniques.haste) ? 2 : 1) *
            (delta / 1000) ;
  
          combatant.actionPoints = Math.min(combatant.maxActionPoints, combatant.actionPoints + regenPerTick);
      
  
      });
    }
  
    updateCombatantsState(): void {
      [...this.allies, ...this.enemies].forEach((combatant) => {
        if (combatant.health <= 0) {
          combatant.status = Status.DEAD;
        } else if (combatant.actionPoints <= 0) {
          combatant.status = Status.EXHAUSTED;
        } else {
          combatant.status = Status.NORMAL;
        }
      });
    }
  
    getCombatants(): Combatant[] {
      return [...this.enemies, ...this.allies];
    }
  
}
