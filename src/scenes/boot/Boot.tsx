import * as React from 'react';
import UiOverlayPlugin from '../../features/ui-plugin/UiOverlayPlugin';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

export class Boot extends Phaser.Scene {
  ui: UiOverlayPlugin

  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    const Ui = () => {
      const [percent, setPercent] = React.useState<number>(0);
      const [fileKey, setFileKey] = React.useState<string>('');

      React.useEffect(() => {    
        this.load.on('progress', (value) => (setPercent(value * 100)));
        this.load.on('fileprogress', (file) => (setFileKey(file.key)));
      });

      return (
          <div>
            <div>{percent}%</div>
            <div>{fileKey}</div>
        </div>
      );
    }
    this.ui.create(<Ui/>, this);

    this.load.on('complete', () => {
      this.scene.start('Battle');
    });

    this.loadAssets();
  }

  private loadAssets() {
    this.load.image('tiles', '../reaper/assets/tilesets/tuxmon-sample-32px-extruded.png');
    this.load.tilemapTiledJSON('map', '../reaper/assets/tilemaps/tuxemon-town.json');

    this.load.aseprite('shizuka', '/reaper/assets/sprites/shizuka.png', '/reaper/assets/sprites/shizuka.json');

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
    this.load.audio('attack', '/reaper/assets/sounds/attack.wav');
    this.load.audio('debuff', '/reaper/assets/sounds/debuff.wav');

    this.load.audio('stamina-depleted', '/reaper/assets/sounds/stamina-depleted.wav');

    // #region effects
    this.load.image('heal', '/reaper/assets/effects/heal.gif');

    this.load.audio('main-menu-music', '/reaper/assets/music/corner-of-memories.mp3');
    this.load.audio('knight', '/reaper/assets/music/knight.mp3');
    // this.load.audio('palace', '/reaper/assets/music/palace.mp3');
    // this.load.audio('apathy', '/reaper/assets/music/apathy.mp3');
    // this.load.audio('apathy', '/reaper/assets/music/apathy.mp3');
    // this.load.audio('airchair', '/reaper/assets/music/airchair.mp3');
    // this.load.audio('heartbeats', '/reaper/assets/music/heartbeats.mp3');
    // this.load.audio('memory', '/reaper/assets/music/memory.mp3');
    // this.load.audio('resonance', '/reaper/assets/music/resonance.mp3');
    // this.load.audio('soundlessly', '/reaper/assets/music/soundlessly.mp3');
    // this.load.audio('twilight', '/reaper/assets/music/twilight.mp3');
    this.load.audio('upgrade', '/reaper/assets/music/upgrade.mp3');

    this.load.text('mission-4', '/reaper/assets/scripts/mission-4.yaml');
    this.load.text('mission-6', '/reaper/assets/scripts/mission-6.yaml');
    this.load.text('mission-7', '/reaper/assets/scripts/mission-7.yaml');
    this.load.text('random-scripts', '/reaper/assets/scripts/random-scripts.yaml');
  }
}
