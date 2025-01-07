import * as React from 'react';
import { motion } from 'framer-motion';

import styles from './boot.module.css';
import ReactOverlay from '../../plugins/ReactOverlay';
import { DefaultAllies } from '../../data/allies';
import { DEFAULT_INVENTORY } from '../../data/items';

const SCENE_TO_START = 'Battle';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

export class Boot extends Phaser.Scene {
  reactOverlay: ReactOverlay

  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    this.registry.set('allies', DefaultAllies);
    this.registry.set('inventory', DEFAULT_INVENTORY)

    const Ui = () => {
      const [percent, setPercent] = React.useState<number>(0);
      const [fileKey, setFileKey] = React.useState<string>('');
      const [opacity, setOpacity]  = React.useState<number>(1);

      React.useEffect(() => {    
        this.load.on('progress', (value) => (setPercent(Math.trunc(value * 100))));
        this.load.on('fileprogress', (file) => (setFileKey(file.key)));
        this.load.on('complete', () => setOpacity(0));
      });

      return (
          <motion.div 
            animate={{opacity}} 
            transition={{ duration: .2 }} 
            className={styles.loadingContainer} 
            onAnimationComplete={(definition: { opacity: number }) => {  
              if (definition.opacity === 0) this.scene.start(SCENE_TO_START);
            }}
          >
            <div className={styles.spinner}>
              <div className={styles.cube1}></div>
              <div className={styles.cube2}></div>
            </div>
            <div className={styles.loadingText}>{percent}%</div>
            <div className={styles.loadingText}>Loading: {fileKey}</div>
        </motion.div>
      );
    }
    this.reactOverlay.create(<Ui/>, this);

    this.loadAssets();
  }

  private loadAssets() {
    this.load.aseprite('shizuka', '/sprites/shizuka-full.png', '/sprites/shizuka-full.json');

    this.load.image('rise', '/characters/rise.png');
    this.load.image('eji', '/characters/eji.png');

    this.load.image('slime', '/sprites/slime.png');

    this.load.image('main-menu', '/backgrounds/main-menu.png');

    this.load.image('crosshair', '/ui/crosshair.png');
    this.load.image('pointer', '/ui/pointer.png');

    this.load.audio('choice-hover', '/sounds/choice-hover.wav');
    this.load.audio('choice-select', '/sounds/choice-select.wav');
    this.load.audio('dialogue-advance', '/sounds/dialogue-advance.wav');
    this.load.audio('battle-start', '/sounds/battle-start-2.mp3');

    this.load.audio('heal', '/sounds/heal.mp3');
    this.load.audio('block', '/sounds/block.wav');
    this.load.audio('attack', '/sounds/attack.wav');
    this.load.audio('debuff', '/sounds/debuff.wav');
    this.load.audio('smirk', '/sounds/smirk.mp3');
    this.load.audio('charged', '/sounds/charged.mp3');

    this.load.audio('slime-noise', '/sounds/slime-noise.mp3');

    this.load.audio('stamina-depleted', '/sounds/stamina-depleted.wav');

    // #region effects
    this.load.image('heal', '/effects/heal.gif');

    this.load.audio('main-menu-music', '/music/isolate.exe.mp3');
    this.load.audio('knight', '/music/knight.mp3');

    this.load.text('mission-4', '/scripts/mission-4.yaml');
    this.load.text('mission-6', '/scripts/mission-6.yaml');
    this.load.text('mission-7', '/scripts/mission-7.yaml');
    this.load.text('random-scripts', '/scripts/random-scripts.yaml');
  }
}
