/* eslint-disable react/jsx-key */
import * as React from 'react';

import ReactOverlay from '../../plugins/ReactOverlay';
import { ActiveSpread, EncounterStore } from './EncounterStore';
import { Ui } from './EncounterView'; 
import { Encounter as EncounterModel, EventType, SoundEvent } from '../../model/encounter';

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

  init(data: { spread: EncounterModel }): void {
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

    this.endEncounter();
  }

  advanceSpread(activeSpreadsIndex: number): void {
    this.encounterStore.iterateSpreadIndex(activeSpreadsIndex);
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
      case EventType.END_ENCOUNTER:
        this.endEncounter();
        break;
    }
  }

  addSpread(spread: EncounterModel): void {
    this.encounterStore.pushActiveSpread({ spread, spreadIndex: -1 });
    this.advanceSpread(this.encounterStore.activeSpreads.length-1);
  }

  endEncounter(): void {
    this.music?.stop(); // TODO: consider not stopping music or when to do so.. maybe event
    this.scene.start('EncounterList');
  }
}
