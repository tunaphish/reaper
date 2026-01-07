/* eslint-disable react/jsx-key */
import * as React from 'react';

import ReactOverlay from '../../plugins/ReactOverlay';
import { EncounterStore } from './EncounterStore';
import { Ui } from './EncounterView'; 
import { Spread } from '../../model/spread';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Encounter',
};

export class Encounter extends Phaser.Scene {
  private spreadAdvanceSound: Phaser.Sound.BaseSound;
  private reactOverlay: ReactOverlay;

  spread: Spread;
  spreadIndex; 

  encounterStore: EncounterStore;

  constructor() {
    super(sceneConfig);
  }

  init(data: { spread: Spread }): void {
    this.encounterStore = new EncounterStore();
    this.spread = data.spread;
    this.spreadIndex = -1;
  }

  create(): void {
    this.spreadAdvanceSound = this.sound.add('window-advance');
    console.log(this)
    this.reactOverlay.create(<Ui encounter={this}/>, this);
    this.advanceSpread();
  }

  advanceSpread(): void {
    this.spreadIndex++;

    if (this.spreadIndex >= this.spread.windows.length) {
      this.scene.start('EncounterList');
      return;
    }

    this.spreadAdvanceSound.play();
    this.encounterStore.pushWindow(this.spread.windows[this.spreadIndex]);
  }
}

