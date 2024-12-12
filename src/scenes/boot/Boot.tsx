import * as React from 'react';
import { motion } from 'framer-motion';

import styles from './boot.module.css';
import ReactOverlay from '../../plugins/ReactOverlay';
import { DefaultAllies } from '../../data/allies';
import { DEFAULT_INVENTORY } from '../../data/items';

const SCENE_TO_START = 'R3FTest';

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
    this.load.image('tiles', '../reaper/assets/tilesets/tuxmon-sample-32px-extruded.png');
    this.load.tilemapTiledJSON('map', '../reaper/assets/tilemaps/tuxemon-town.json');

    this.load.aseprite('shizuka', '/reaper/assets/sprites/shizuka-full.png', '/reaper/assets/sprites/shizuka-full.json');

    this.load.image('rise', '/reaper/assets/characters/rise.png');
    this.load.image('eji', '/reaper/assets/characters/eji.png');

    this.load.image('slime', '/reaper/assets/sprites/slime.png');

    this.load.image('main-menu', '/reaper/assets/backgrounds/main-menu.png');

    this.load.image('crosshair', '/reaper/assets/ui/crosshair.png');
    this.load.image('pointer', '/reaper/assets/ui/pointer.png');

    this.load.audio('choice-hover', '/reaper/assets/sounds/choice-hover.wav');
    this.load.audio('choice-select', '/reaper/assets/sounds/choice-select.wav');
    this.load.audio('dialogue-advance', '/reaper/assets/sounds/dialogue-advance.wav');
    this.load.audio('battle-start', '/reaper/assets/sounds/battle-start-2.mp3');

    this.load.audio('heal', '/reaper/assets/sounds/heal.mp3');
    this.load.audio('block', '/reaper/assets/sounds/block.wav');
    this.load.audio('attack', '/reaper/assets/sounds/attack.wav');
    this.load.audio('debuff', '/reaper/assets/sounds/debuff.wav');
    this.load.audio('smirk', '/reaper/assets/sounds/smirk.mp3');
    this.load.audio('charged', '/reaper/assets/sounds/charged.mp3');
    this.load.audio('equip-soul', '/reaper/assets/sounds/equip-soul.mp3');
    this.load.audio('unequip-soul', '/reaper/assets/sounds/unequip-soul.mp3');
    this.load.audio('saint-resurrect', '/reaper/assets/sounds/vow-made.mp3');

    this.load.audio('stamina-depleted', '/reaper/assets/sounds/stamina-depleted.wav');

    // #region effects
    this.load.image('heal', '/reaper/assets/effects/heal.gif');

    this.load.audio('main-menu-music', '/reaper/assets/music/isolate.exe.mp3');
    this.load.audio('knight', '/reaper/assets/music/knight.mp3');

    this.load.text('mission-4', '/reaper/assets/scripts/mission-4.yaml');
    this.load.text('mission-6', '/reaper/assets/scripts/mission-6.yaml');
    this.load.text('mission-7', '/reaper/assets/scripts/mission-7.yaml');
    this.load.text('random-scripts', '/reaper/assets/scripts/random-scripts.yaml');
  }
}
