import { createElement } from '../../ui/jsxFactory';
import styles from './mainmenu.module.css';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MainMenu',
};

/**
 * The initial scene that starts, shows the splash screens, and loads the necessary assets.
 */
export class MainMenu extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private choiceSelectSound: Phaser.Sound.BaseSound;
  private choiceHoverSound: Phaser.Sound.BaseSound;
  private menuMusic: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');
    this.choiceHoverSound = this.sound.add('choice-hover');
    this.add.image(0, 0, 'main-menu').setOrigin(0, 0);
    this.menuMusic = this.sound.add('main-menu-music', { loop: true });
    this.menuMusic.play();

    const onClickStart = () => {
      this.menuMusic.stop();
      this.choiceSelectSound.play();
      this.scene.start('World');
    };

    const onMouseOverStart = () => {
      this.choiceHoverSound.play();
    };

    const menuItems = (
      <div>
        <div className={styles.mainMenuButton} onclick={onClickStart} onmouseover={onMouseOverStart}>
          start game
        </div>
      </div>
    );

    this.ui.create(menuItems, this);
  }
}
