import * as React from 'react';
import { motion } from 'framer-motion';

import styles from './boot.module.css';
import ReactOverlay from '../../plugins/ReactOverlay';
import { DefaultAllies } from '../../data/allies';
import { DEFAULT_INVENTORY } from '../../data/items';

const SCENE_TO_START = 'World';

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
    this.load.image('tiles', '../reaper/tilesets/tuxmon-sample-32px-extruded.png');
    this.load.tilemapTiledJSON('map', '../reaper/tilemaps/tuxemon-town.json');
    
    this.load.aseprite('shizuka', '/reaper/sprites/shizuka.png', '/reaper/sprites/shizuka.json');
    // this.load.aseprite('shizuka', '/reaper/sprites/shizuka-full.png', '/reaper/sprites/shizuka-full.json');

    this.load.image('slime', '/reaper/sprites/slime.png');

    this.load.image('main-menu', '/reaper/backgrounds/main-menu.png');

    this.load.image('crosshair', '/reaper/ui/crosshair.png');
    this.load.image('pointer', '/reaper/ui/pointer.png');

    this.load.audio('choice-hover', '/reaper/sounds/choice-hover.wav');
    this.load.audio('choice-select', '/reaper/sounds/choice-select.wav');
    this.load.audio('window-advance', '/reaper/sounds/window-advance.wav');
    this.load.audio('battle-start', '/reaper/sounds/battle-start-2.mp3');

    this.load.audio('heal', '/reaper/sounds/heal.mp3');
    this.load.audio('block', '/reaper/sounds/block.wav');
    this.load.audio('attack', '/reaper/sounds/attack.wav');
    this.load.audio('debuff', '/reaper/sounds/debuff.wav');
    this.load.audio('smirk', '/reaper/sounds/smirk.mp3');
    this.load.audio('charged', '/reaper/sounds/charged.mp3');

    this.load.audio('slime-noise', '/reaper/sounds/slime-noise.mp3');

    this.load.audio('stamina-depleted', '/reaper/sounds/stamina-depleted.wav');

    // #region effects
    this.load.audio('main-menu-music', '/reaper/music/isolate.exe.mp3');
    this.load.audio('knight', '/reaper/music/knight.mp3');
  }
}
