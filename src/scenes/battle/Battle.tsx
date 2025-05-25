import * as React from 'react';

import { Enemy } from '../../model/enemy';
import { Ally } from '../../model/ally';

import { Status } from '../../model/combatant';

import ReactOverlay from '../../plugins/ReactOverlay';
import { BattleView } from './BattleView';
import { BattleStore } from './BattleStore';
import { cleric } from '../../data/enemies';
import { MenuOption } from './menu';
import { Action } from '../../model/action';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export interface DialogueTrigger {
  trigger: (enemies: Enemy[], allies: Ally[]) => boolean;
  scriptKeyName: string;
}

export class Battle extends Phaser.Scene {
  private reactOverlay: ReactOverlay; // initialized by plugin manager
  private music: Phaser.Sound.BaseSound;
  backgroundImageUrl: string;

  battleStore: BattleStore;

  // restriction vars
  firstActionTaken = false;
  splinterUsed = false;

  private enemyReactionTimer = 0;

  constructor() {
    super(sceneConfig);
  }

  init(data: { enemies: Enemy[] }): void {
    this.battleStore = new BattleStore(data.enemies || [cleric], this.registry.get('allies'));
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
    this.battleStore.tickStamina(delta);
  }

  // #endregion

  // #region Input Based Updates

  setCaster(caster: Ally): void {
    const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED]
    if (CANNOT_OPEN_STATUS.includes(caster.status)) {
      this.sound.play('stamina-depleted');
      return;
    }

    if (caster.name === this.battleStore.caster?.name) return;

    this.sound.play('choice-select');
    this.events.emit('caster-set', caster);

    this.battleStore.setCaster(caster);
    this.battleStore.setMenu({
      name: caster.name,
      actions: caster.actions,
    })
  }

  setTarget(combatant: Enemy | Ally): void {
    //
  }

  playSong(songKey: string): void {
    this.music = this.sound.add(songKey, { loop: true });
    this.music.play();
  }


  closeMenu(): void {
    this.battleStore.setCaster(null);
    this.battleStore.setMenu(null);
    this.battleStore.setQueue([]);
    this.sound.play('dialogue-advance');
  }

  selectOption(option: MenuOption): void {
    this.sound.play('choice-select');

  }

  selectAction(action: Action): void {
    this.battleStore.pushAction(action);
    this.sound.play('choice-select');
  }

  confirmQueue(): void {
    this.closeMenu();
  }

  cancelQueue(): void {
    this.closeMenu();
  }
  

  // #endregion
}

// const generateID = () => {
//   return Date.now().toString(36); 
// }