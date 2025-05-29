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
import { getRandomItem } from '../../model/random';

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

  // round resolution 
  timeSinceLastAction = 0;
  isAllyTurn = true;

  battleStore: BattleStore;

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
    this.music.play();
  }

  // #region Time Based Updates

  update(time: number, delta: number): void {
    this.battleStore.tickBattle(delta);
    this.resolveRound(delta);
  }

  resolveRound(delta: number) {
    if (this.battleStore.state !== BattleState.RESOLUTION) return;
    // if queues are empty cleanup
    if (this.battleStore.queue.length === 0 && this.battleStore.target.selectedStrategy.actions.length === 0) {
      this.battleStore.target.selectedStrategy = getRandomItem(this.battleStore.target.strategies);
      this.battleStore.applyBleed();    
      // reset selections
      this.battleStore.setState(BattleState.SELECTION);
      this.battleStore.target.status = Status.EXHAUSTED;
      this.battleStore.setTarget(null);
      this.battleStore.setQueue([]);
      return;
    }
    
    this.timeSinceLastAction += delta;
    if (this.timeSinceLastAction < 500) return;

    if (this.isAllyTurn) {
      const queueAction = this.battleStore.queue[0];
      this.sound.play(queueAction.action.soundKeyName);
      queueAction.caster.stamina -= queueAction.action.staminaCost;
      this.battleStore.dequeueAction();
      if (this.battleStore.target.selectedStrategy.actions.length > 0) this.isAllyTurn = false;
    } else {
      const action = this.battleStore.target.selectedStrategy.actions[0];
      this.sound.play(action.soundKeyName);
      this.battleStore.target.selectedStrategy.actions.shift();
      if (this.battleStore.queue.length > 0) this.isAllyTurn = true;
    }

    this.timeSinceLastAction = 0;
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