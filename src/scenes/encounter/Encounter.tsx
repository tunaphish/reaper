/* eslint-disable react/jsx-key */
import * as React from 'react';
import { makeAutoObservable, toJS } from "mobx";
import { observer } from 'mobx-react-lite';

import ReactOverlay from '../../plugins/ReactOverlay';
import styles from './encounter.module.css';
import { TextSpeed, TypewriterText } from '../ui/TypewriterText';

// #region UI

const Ui = observer(({encounter}: {encounter: Encounter}) => {
  return (
    <div className={styles.encounterContainer}>
      {encounter.encounterStore.windows}
    </div>
  )
});

export class EncounterStore {
  windows: React.ReactElement[] = [];

  constructor() {
    makeAutoObservable(this);
  }

   pushWindow(window: React.ReactElement): void {
    this.windows.push(window);
  }
}

// #endregion

// #region Scene
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Encounter',
};

export class Encounter extends Phaser.Scene {
  private threadAdvanceSound: Phaser.Sound.BaseSound;
  private reactOverlay: ReactOverlay;

  thread: React.ReactElement[] = THREAD;
  threadIndex = -1; 

  encounterStore: EncounterStore;

  constructor() {
    super(sceneConfig);
  }

  init(): void {
    this.encounterStore = new EncounterStore();
  }

  create(): void {
    this.threadAdvanceSound = this.sound.add('dialogue-advance');
    this.reactOverlay.create(<Ui encounter={this}/>, this);
    this.advanceThread();
  }

  advanceThread(): void {
    this.threadIndex++;

    if (this.threadIndex >= this.thread.length) {
      this.scene.start('World');
      return;
    }

    this.threadAdvanceSound.play();
    // work around to reference advanceThread itself lmao
    this.pushInteractableWindow();
  }

  pushInteractableWindow(): void {
    const InteractableWindow = <div onClick={() => this.advanceThread()} key={this.threadIndex}>{this.thread[this.threadIndex]}</div>
    this.encounterStore.pushWindow(InteractableWindow);
  }
}

// #endregion

// #region
const THREAD: React.ReactElement[] = [
  <TypewriterText text={'Hi, I am an arbitrarilly long string meant to showcase the wordwrap feature in text.'}/>,
  <TypewriterText text={'I love you senpai. (Slow speed test)'} textSpeed={TextSpeed.SLOW}/>,
  <TypewriterText text={'Random dialogue to test sound. (Fast speed test)'} textSpeed={TextSpeed.FAST}/>,
  <TypewriterText text={'Hello, how are you?'}/>
];

// #endregion