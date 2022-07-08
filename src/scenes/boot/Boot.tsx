import { createElement } from "../../ui/jsxFactory";
import  styles from "./dialogue.module.css";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

/**
 * The initial scene that loads all necessary assets to the game and displays a loading bar.
 */
export class Boot extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    const percentText = <div>0% Loaded</div>
    const assetText = <div></div>
    const container = (
      <div>
        {percentText}
        {assetText}
      </div>
    )

    const overlay = document.querySelector('#game > div');
    overlay.appendChild(container);

    this.load.on('progress', (value) => percentText.innerText = `${value * 100}%`);
    this.load.on('fileprogress', (file) => assetText.innerText = file.key);

    this.load.on('complete', () => {
      container.replaceChildren();
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

    this.load.image('crosshair', 'assets/ui/crosshair.png');
    this.load.image('pointer', 'assets/ui/pointer.png');

    this.load.audio('choice-select', 'assets/sounds/choice-select.wav');
    this.load.audio('dialogue-advance', 'assets/sounds/dialogue-advance.wav');
  }
}
