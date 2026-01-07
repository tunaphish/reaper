/* eslint-disable react/jsx-key */
import * as React from 'react';

import ReactOverlay from '../../plugins/ReactOverlay';
import { EncounterStore } from './EncounterStore';
import { Ui } from './EncounterView'; 
import { Spread, EventType, SoundEvent } from '../../model/spread';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Encounter',
};

export class Encounter extends Phaser.Scene {
  private spreadAdvanceSound: Phaser.Sound.BaseSound;
  private reactOverlay: ReactOverlay;
  private music: Phaser.Sound.BaseSound;

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
    this.reactOverlay.create(<Ui encounter={this}/>, this);
    this.advanceSpread();
  }

  advanceSpread(): void {
    this.spreadIndex++;

    if (this.spreadIndex >= this.spread.events.length) {
      this.music?.stop();
      this.scene.start('EncounterList');
      return;
    }

    this.spreadAdvanceSound.play();
    const event = this.spread.events[this.spreadIndex];
    switch(event.type) {
      case EventType.IMAGE:
      case EventType.TEXT: 
        this.encounterStore.pushWindow(event);
        break;
      case EventType.SOUND:
        const soundEvent = (event as SoundEvent);
        this.music = this.sound.add(soundEvent.key, {
          loop: soundEvent?.loop || false,  
          volume: 0.5  
        });
        this.music.play();
        this.advanceSpread();
        break;
    }
  }
}

