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

    const startGameButton = <div className={styles.mainMenuButton}>start game</div>;
    const settingsButton = <div className={styles.mainMenuButton}>settings</div>;

    const menuItems = (
      <div>
        {startGameButton}
        {settingsButton}
      </div>
    );

    this.ui.create(menuItems, this);

    startGameButton.addEventListener('click', () => {
      this.menuMusic.stop();
      this.choiceSelectSound.play();
      this.scene.start('World');
    });

    settingsButton.addEventListener('click', () => {
      this.choiceSelectSound.play();
    });

    startGameButton.addEventListener('mouseover', () => {
      this.choiceHoverSound.play();
    });

    settingsButton.addEventListener('mouseover', () => {
      this.choiceHoverSound.play();
    });
  }
}
