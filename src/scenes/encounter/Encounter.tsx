/* eslint-disable react/jsx-key */
import * as React from 'react';

import ReactOverlay from '../../plugins/ReactOverlay';
import { EncounterStore } from './EncounterStore';
import { Ui } from './EncounterView'; 
import { Spread } from '../../model/spread';
import { EXAMPLE_SPREAD, BUNNY_MASK_SPREAD } from '../../data/spreads/example';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Encounter',
};

export class Encounter extends Phaser.Scene {
  private spreadAdvanceSound: Phaser.Sound.BaseSound;
  private reactOverlay: ReactOverlay;

  spread: Spread = BUNNY_MASK_SPREAD;
  spreadIndex = -1; 

  encounterStore: EncounterStore;

  constructor() {
    super(sceneConfig);
  }

  init(): void {
    this.encounterStore = new EncounterStore();
  }

  create(): void {
    this.spreadAdvanceSound = this.sound.add('dialogue-advance');
    this.reactOverlay.create(<Ui encounter={this}/>, this);
    this.advanceSpread();
  }

  advanceSpread(): void {
    this.spreadIndex++;

    if (this.spreadIndex >= this.spread.length) {
      this.scene.start('World');
      return;
    }

    this.spreadAdvanceSound.play();
    this.encounterStore.pushWindow(this.spread[this.spreadIndex]);
  }
}

