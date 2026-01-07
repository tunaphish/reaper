import * as React from 'react';

import { Enemy } from '../../model/enemy';
import { OptionType } from '../../model/option';
import { Allies, Ally } from '../../model/ally';
import { Folder } from '../../model/folder';
import { Action, } from '../../model/action';
import { Status, updateActionPoints } from '../../model/combatant';
import { Item } from '../../model/item';
import { MenuOption } from './menuOption';


import ReactOverlay from '../../plugins/ReactOverlay';
import { BattleView } from './BattleView';
import { BattleStore } from './BattleStore';
import { knight } from '../../data/enemies';
import { TargetType } from '../../model/targetType';
import * as Techniques from '../../data/techniques';
import { Technique } from '../../model/technique';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export type Executable = Action | Item | Technique;

export class Battle extends Phaser.Scene {
  private reactOverlay: ReactOverlay; // initialized by plugin manager
  private music: Phaser.Sound.BaseSound;
  backgroundImageUrl: string;

  battleStore: BattleStore;


  constructor() {
    super(sceneConfig);
  }

  init(data: { enemies: Enemy[] }): void {
    this.battleStore = new BattleStore(data.enemies || [knight], this.registry.get('allies'));
    this.backgroundImageUrl = '/reaper/backgrounds/pikrepo.jpg';
    this.music = this.sound.add('knight', {
      loop: true,  
      volume: 0.5  
    });
    this.reactOverlay.create(<BattleView scene={this}/>, this);
    // this.music.play();
  }

  // #region Time Based Updates

  update(time: number, delta: number): void {
    this.battleStore.tickStats(delta);
    this.battleStore.updateCombatantsState();
    
    this.checkBattleEndConditions();
    this.resetDeadAllyCasterMenu();

    this.executeSelectedOption();    
  }


  resetDeadAllyCasterMenu(): void {
    if (this.battleStore.caster && this.battleStore?.caster.status === Status.DEAD) {
      this.battleStore.setCaster(null);
      this.battleStore.emptyMenu();
    }
  }

  checkBattleEndConditions(): void {
    if (this.battleStore.allies.every((member) => member.status === Status.DEAD)) {
      this.music.stop();
      this.scene.manager.getScenes(false).forEach(scene => this.scene.stop(scene.scene.key));
      this.scene.start('GameOver');
      return;
    }
    if (this.battleStore.enemies.every((enemy) => enemy.status === Status.DEAD)) {
      this.music.stop();
      this.scene.stop();
      this.battleStore.allies.forEach((ally) => ally.health = Math.ceil(ally.health));
      this.registry.set('allies', this.battleStore.allies);
      this.scene.resume('World', { allies: this.battleStore.allies });
    }
  }




  executeSelectedOption(): void {
    if (
      !this.battleStore.caster || 
      !this.battleStore.executable || 
      !this.battleStore.target
    ) return; 
    

    // if (combatant.queuedOption.type === OptionType.ITEM) {
    //   combatant.queuedOption.charges -= 1;
    //   combatant.queuedOption.execute(combatant.queuedTarget, combatant);
    //   this.sound.play(combatant.queuedOption.soundKeyName);
    // } else

    if (this.battleStore.executable.type === OptionType.TECHNIQUE) {
      const technique = (this.battleStore.executable as Technique);

      if (this.battleStore.caster.activeTechniques.has(this.battleStore.executable)) {
        updateActionPoints(this.battleStore.caster, technique.actionPointsCost);
        this.battleStore.caster.activeTechniques.delete(this.battleStore.executable);
      } else {
        updateActionPoints(this.battleStore.caster, -technique.actionPointsCost);
        this.battleStore.caster.activeTechniques.add(this.battleStore.executable);
      }
    
      
      this.sound.play(technique.soundKeyName);
      this.battleStore.resetSelections();
      return;
    }

    const action = (this.battleStore.executable as Action);
    updateActionPoints(this.battleStore.caster, -action.actionPointsCost);

    const potency = action.potency * (this.battleStore.caster.activeTechniques.has(Techniques.buff) ? 2 : 1);
    action.resolve(this.battleStore.target, this.battleStore.caster, potency);
    
    this.sound.play(action.soundKeyName);
    
    this.battleStore.resetSelections();
    
  }

  // #endregion

  // #region Input Based Updates

  setCasterStatus(status: Status): void {
    this.battleStore.caster.status = status;
  }

  setExecutable(executable: Executable): void {
    this.battleStore.executable = executable;
  }

  setTarget(combatant: Enemy | Ally): void {
    this.battleStore.setTarget(combatant);    
  }

  playSong(songKey: string): void {
    this.music = this.sound.add(songKey, { loop: true });
    this.music.play();
  }

  openInitialMenu(ally: Ally): void {
    const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED]
    if (CANNOT_OPEN_STATUS.includes(ally.status)) {
      this.sound.play('stamina-depleted');
      return;
    }

    this.sound.play('choice-select');
    this.battleStore.setCaster(ally);
    this.events.emit('caster-set', ally);
    this.battleStore.pushMenu(ally.folder);
  }

  closeMenu(): void {
    this.battleStore.popMenu();

    if (this.battleStore.menus.length === 0) {
      this.battleStore.setCaster(null); // hacky way of resetting selection if user clicks out
    }
    else if (this.battleStore.menus.length === 1) {
      this.battleStore.setExecutable(null);
    }
    this.sound.play('window-advance');
  }

  selectOption(option: MenuOption): void {
    this.sound.play('choice-select');
    switch(option.type) {
      // case OptionType.ITEM:
      //   const item = option as Item;
      //   this.battleStore.setExecutable(item);
      //   if (item.targetType === TargetType.SELF) {
      //     const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [this.battleStore.caster]};
      //     this.battleStore.pushMenu(targetFolder);
      //   } else {
      //     const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [...this.battleStore.allies, ...this.battleStore.enemies]};
      //     this.battleStore.pushMenu(targetFolder);
      //   }
      //   this.battleStore.setText(item.description);
      //   break;
      case OptionType.ACTION:
        const action = option as Action;
        this.battleStore.setExecutable(action);
        switch (action.targetType) {
          case TargetType.SELF:
            const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [this.battleStore.caster]};
            this.battleStore.pushMenu(targetFolder);
            break;
          case TargetType.ENEMIES:
            const enemiesFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [...this.battleStore.enemies]};
            this.battleStore.pushMenu(enemiesFolder);
            break;
          case TargetType.ALLIES:
            const alliesFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [...this.battleStore.allies]};
            this.battleStore.pushMenu(alliesFolder);
            break;
          case TargetType.SINGLE_TARGET:
            const singleTargetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options:[...this.battleStore.allies, ...this.battleStore.enemies]};
            this.battleStore.pushMenu(singleTargetFolder);
            break;
        }
        break;
      case OptionType.TECHNIQUE:
        const technique = option as Technique;
        this.battleStore.setExecutable(technique);
        if (this.battleStore.caster.activeTechniques.has(technique)) {
          const shatterFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Shatter', options: [this.battleStore.caster]};
          this.battleStore.pushMenu(shatterFolder);
        } else {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [this.battleStore.caster]};
          this.battleStore.pushMenu(targetFolder);
        }
       
        break;

      case OptionType.ENEMY:
      case OptionType.ALLY:
        const combatant = option;
        this.battleStore.setTarget(combatant);
        break;
      case OptionType.FOLDER:
        const folder = option as Folder;
        this.battleStore.pushMenu(folder);
        break;
    }
  }

  // #endregion
}