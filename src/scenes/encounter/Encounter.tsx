/* eslint-disable react/jsx-key */
import * as React from 'react';
import { makeAutoObservable } from "mobx";
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import ReactOverlay from '../../plugins/ReactOverlay';
import classNames from './encounter.module.css';
import { TextSpeed, TypewriterText } from '../ui/TypewriterText';

// #region UI
const Ui = observer(({encounter}: {encounter: Encounter}) => {
  return (
    <div className={classNames.encounterContainer}>
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
const expandFromCenterTransition = {
  initial: {
    scaleX: 0,
    transformOrigin: "center",
    
  },
  animate: {
    scaleX: 1,
    
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  exit: {
    scaleX: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

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
    const InteractableWindow = (
      <motion.div 
        className={classNames.window} 
        onClick={() => this.advanceThread()} key={this.threadIndex}
        variants={expandFromCenterTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {this.thread[this.threadIndex]}
      </motion.div>
    )
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