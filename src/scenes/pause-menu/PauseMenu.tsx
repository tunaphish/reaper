import { createElement } from '../../ui/jsxFactory';
import styles from './pausemenu.module.css';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'PauseMenu',
};

export class PauseMenu extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private choiceSelectSound: Phaser.Sound.BaseSound;
  private choiceHoverSound: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');
    this.choiceHoverSound = this.sound.add('choice-hover');

    const onClickContinue = () => {
      this.choiceSelectSound.play();
      this.scene.stop();
      this.scene.resume('World');
    };

    const onMouseOverContinue = () => {
      this.choiceHoverSound.play();
    };

    const menuItems = (
      <div>
        <div className={styles.pauseMenuButton} onclick={onClickContinue} onmouseover={onMouseOverContinue}>
          continue
        </div>
        <div className={styles.pauseMenuButton} onmouseover={onMouseOverContinue}>
          exit to main menu
        </div>
      </div>
    );

    this.ui.create(menuItems, this);
  }
}
