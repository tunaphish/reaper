import * as React from 'react';

import { Enemy } from '../../model/enemy';
import { Ally } from '../../model/ally';

import { Status } from '../../model/combatant';

import ReactOverlay from '../../plugins/ReactOverlay';
import { BattleView } from './BattleView';
import { BattleState, BattleStore } from './BattleStore';
import { cleric } from '../../data/enemies';
import { MenuType } from './menu';
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
    this.battleStore.tickBattle(delta);
    this.initiateRound();
  }

  initiateRound() {
    if (this.battleStore.state !== BattleState.RESOLUTION) return;

    // handle resolution
    for (let i=0; i<this.battleStore.queue.length || i<this.battleStore.target.selectedStrategy.actions.length; i++) {
      if (i<this.battleStore.queue.length) {
        const queueAction = this.battleStore.queue[i];
        this.sound.play(queueAction.action.soundKeyName);
        queueAction.caster.stamina -= queueAction.action.staminaCost;
        // wait a second
      }
      if (i<this.battleStore.target.selectedStrategy.actions.length) {
        // enemy target is either caster for current action or whoever the fuck they want... 
        // todo: enemy target strategy
      }
    }

    // clean up
    // apply bleed
    // select a strategy

    // reset selections
    this.battleStore.setState(BattleState.SELECTION);
    this.battleStore.target.status = Status.EXHAUSTED;
    this.battleStore.setTarget(null);
    this.battleStore.setQueue([]);
  }

  // #endregion

  // #region Input Based Updates

  setCaster(caster: Ally): void {
    if (this.battleStore.state !== BattleState.SELECTION) return;
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
      type: MenuType.ACTION,
      name: caster.name,
      actions: caster.actions,
    })
  }

  closeMenu(): void {
    this.battleStore.setCaster(null);
    this.battleStore.setMenu(null);
    this.sound.play('dialogue-advance');
  }

  selectAction(action: Action): void {
    if (this.battleStore.state !== BattleState.SELECTION) return;
    this.battleStore.pushAction(action);
    this.sound.play('choice-select');
    if (this.battleStore.caster.status === Status.EXHAUSTED) this.closeMenu();
  }


  confirmQueue(): void {
    if (this.battleStore.state !== BattleState.SELECTION) return;
    this.closeMenu();
    this.battleStore.setMenu({
      type: MenuType.TARGET,
      targets: this.battleStore.enemies,
      name: 'Targets',
    })
  }

  cancelQueue(): void {
    if (this.battleStore.state !== BattleState.SELECTION) return;
    this.closeMenu();
    this.battleStore.setQueue([]);
  }
  
  selectTarget(target: Enemy): void {
    if (this.battleStore.state !== BattleState.SELECTION) return;
    this.battleStore.setTarget(target);
    this.closeMenu();
    this.battleStore.setState(BattleState.RESOLUTION);
  }

  // #endregion

  playSong(songKey: string): void {
    this.music = this.sound.add(songKey, { loop: true });
    this.music.play();
  }
}

// const generateID = () => {
//   return Date.now().toString(36); 
// }