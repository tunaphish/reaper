/* eslint-disable react/jsx-key */
import * as React from 'react';
import { makeAutoObservable, toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import ReactOverlay from '../../plugins/ReactOverlay';
import classNames from './encounter.module.css';
import { TextSpeed, TypewriterText } from '../ui/TypewriterText';

// #region UI
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

function anchorToTransform(anchor: WindowLayout['anchor']) {
  switch (anchor) {
    case 'top-left': return 'translate(0, 0)'
    case 'top-right': return 'translate(-100%, 0)'
    case 'bottom-left': return 'translate(0, -100%)'
    case 'bottom-right': return 'translate(-100%, -100%)'
    case 'center':
    default:
      return 'translate(-50%, -50%)'
  }
}

const InteractableWindow = (props: { encounter: Encounter, window: Window }) => {
    // TODO: probably spin out to other types..
    // ASSUMES TEXT WINDOW
    const {layout, text, speed} = props.window;
    const style: React.CSSProperties = {
      position: 'absolute',
      width: layout?.width ?? 380,
      height: layout?.height ?? 140,
      left: layout?.x ?? 225,
      top: layout?.y ?? 620,
      transform: anchorToTransform(layout?.anchor ?? 'center'),
    }

    const TextWindow = <TypewriterText text={text} textSpeed={speed || TextSpeed.NORMAL} />

    return (
      <div style={style}>
        <motion.div 
          className={classNames.window} 
          onClick={() => props.encounter.advanceThread()} 
          variants={expandFromCenterTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {TextWindow}
        </motion.div>
      </div>
    )
}

const Ui = observer(({encounter}: {encounter: Encounter}) => {
  return (
    <div className={classNames.encounterContainer}>
      {
        encounter.encounterStore.displayedWindows.map(window => <InteractableWindow encounter={encounter} window={window} key={window.text}/>)
      }
    </div>
  )
});

export class EncounterStore {
  displayedWindows: Window[] = [];

  constructor() {
    makeAutoObservable(this);
  }

   pushWindow(window: Window): void {
    this.displayedWindows.push(window);
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

  thread: Thread = CONTENT_THREAD;
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
    this.encounterStore.pushWindow(this.thread[this.threadIndex]);
  }
}

// #endregion

// #region content
type WindowLayout = {
  x?: number // center
  y?: number // bottom
  width?: number // px, default: 480
  height?: number // px, default: auto
  anchor?: 'center' | 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
};
type TextWindow = {
  text: string
  speed?: TextSpeed
  layout?: WindowLayout
};
type Window = TextWindow;
type Thread = Window[];

const CONTENT_THREAD: Thread = [
  {
    text: 'Hi, I am an arbitrarily long string meant to showcase the wordwrap feature in text.'
  },
  {
    text: 'I love you senpai. (Slow speed test)',
    speed: TextSpeed.SLOW
  },
  {
    text: 'Random dialogue to test sound. (Fast speed test)',
    speed: TextSpeed.FAST
  },
  {
    text: 'Hello, how are you?'
  }
]

// #endregion