import { createElement } from "../../ui/jsxFactory";
import UiOverlayPlugin from "../../ui/UiOverlayPlugin";

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
    const percentText = <div>0%</div>
    const assetText = <div></div>
    const container = (
      <div>
        {percentText}
        {assetText}
      </div>
    )

    this.ui.create(container, this);

    this.load.on('progress', (value) => percentText.innerText = `${value * 100}%`);
    this.load.on('fileprogress', (file) => assetText.innerText = file.key);

    this.load.on('complete', () => {
      this.scene.start('MainMenu');
    });

    this.loadAssets();
  }

  private loadAssets() {
    this.load.image('tiles', '../assets/tilesets/tuxmon-sample-32px-extruded.png');
    this.load.tilemapTiledJSON('map', '../assets/tilemaps/tuxemon-town.json');

    this.load.aseprite('shizuka', 'assets/sprites/shizuka.png', 'assets/sprites/shizuka.json');

    this.load.image('rise', 'assets/characters/rise.png');

    this.load.image('slime', 'assets/sprites/slime.png');

    this.load.image('main-menu', 'assets/backgrounds/main-menu.png');

    this.load.image('crosshair', 'assets/ui/crosshair.png');
    this.load.image('pointer', 'assets/ui/pointer.png');

    this.load.audio('choice-hover', 'assets/sounds/choice-hover.wav');
    this.load.audio('choice-select', 'assets/sounds/choice-select.wav');
    this.load.audio('dialogue-advance', 'assets/sounds/dialogue-advance.wav');

    this.load.audio('main-menu-music', 'assets/music/corner-of-memories.mp3');
  }
}
