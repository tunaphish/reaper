import { Scene } from 'phaser';
import { createElement } from '../../ui/jsxFactory';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';
import styles from './battle.module.css';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

class MenuButton {

  ui: Element;
  /**
   * Returns Dom Element with Sound
   */
  constructor(scene: Scene, element: Element) {
    const selectSound = scene.sound.add('choice-select');
    const hoverSound = scene.sound.add('choice-hover');

    element.addEventListener('click', () => {
      selectSound.play();
      console.log('lettuce start the settings');
    });

    element.addEventListener('mouseover', () => {
      hoverSound.play();
    });

    element.addEventListener('mouseover', () => {
      hoverSound.play();
    });

    this.ui = element;
  }
}

export class Battle extends Phaser.Scene {
  private ui: UiOverlayPlugin;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const attackButton: Element = new MenuButton(this, <div>Attack</div>).ui;
    const magicButton: Element = new MenuButton(this, <div>Magic</div>).ui;
    const itemButton: Element = new MenuButton(this, <div>Item</div>).ui;
    const runButton: Element = new MenuButton(this, <div>Run</div>).ui;

    const battleBar: Element = (
      <div className={styles.container}>
        <div className={styles.battleBar}>
          {attackButton}
          {magicButton}
          {itemButton}
          {runButton}
        </div>
      </div>
    );

    this.ui.create(battleBar, this);
  }
}
