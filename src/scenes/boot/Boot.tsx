import { createElement } from '../../ui/jsxFactory';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

export class Boot extends Phaser.Scene {
  ui: UiOverlayPlugin;

  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    const percentText = <div>0%</div>;
    const assetText = <div></div>;
    const container = (
      <div>
        {percentText}
        {assetText}
      </div>
    );

    this.ui.create(container, this);

    this.load.on('progress', (value) => (percentText.innerText = `${value * 100}%`));
    this.load.on('fileprogress', (file) => (assetText.innerText = file.key));

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

    this.load.audio('main-menu-music', '/reaper/assets/music/corner-of-memories.mp3');
    this.load.audio('knight', '/reaper/assets/music/knight.mp3');

    this.load.text('final-battle', '/reaper/assets/scripts/final-battle.yaml');
    this.load.text('temp-scripts', '/reaper/assets/scripts/temp-scripts.yaml');
  }
}
