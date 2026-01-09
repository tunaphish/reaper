/* eslint-disable react/jsx-key */
import * as React from 'react';

import ReactOverlay from '../../plugins/ReactOverlay';
import { ActiveSpread, EncounterStore } from './EncounterStore';
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

  encounterStore: EncounterStore;

  constructor() {
    super(sceneConfig);
  }

  init(data: { spread: Spread }): void {
    this.encounterStore = new EncounterStore();
    const activeSpread: ActiveSpread = { spread: data.spread, spreadIndex: -1}
    this.encounterStore.pushActiveSpread(activeSpread)
  }

  create(): void {
    this.spreadAdvanceSound = this.sound.add('window-advance');
    this.reactOverlay.create(<Ui encounter={this}/>, this);
    this.advanceSpread(0);
  }

  update(): void {
    for (const activeSpread of this.encounterStore.activeSpreads) {
      if (activeSpread.spreadIndex < activeSpread.spread.events.length) return;
    }

    this.music?.stop();
    this.scene.start('EncounterList');
  }

  advanceSpread(activeSpreadsIndex: number): void {
    this.encounterStore.advanceSpread(activeSpreadsIndex);
    const activeSpread = this.encounterStore.activeSpreads[activeSpreadsIndex];
    if (activeSpread.spreadIndex >= activeSpread.spread.events.length) return;

    this.spreadAdvanceSound.play();
    const event = activeSpread.spread.events[activeSpread.spreadIndex];
    switch(event.type) {
      case EventType.SOUND:
        const soundEvent = (event as SoundEvent);
        this.music = this.sound.add(soundEvent.key, {
          loop: soundEvent?.loop || false,  
          volume: 0.5  
        });
        this.music.play();
        this.advanceSpread(activeSpreadsIndex);
        break;
    }
  }
}
