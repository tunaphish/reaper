import { createElement } from "../../ui/jsxFactory";
import  styles from "./pausemenu.module.css";
import UiOverlayPlugin from "../../ui/UiOverlayPlugin";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'PauseMenu',
};

/**
 * The initial scene that starts, shows the splash screens, and loads the necessary assets.
 */
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

    const continueButton = <div className={styles.pauseMenuButton}>continue</div>
    const exitButton = <div className={styles.pauseMenuButton}>exit to main menu</div>

    const menuItems = (
      <div>
        {continueButton}
        {exitButton}
      </div>
    )

    this.ui.create(menuItems, this);

    continueButton.addEventListener('click', () => {
      this.choiceSelectSound.play();
      this.scene.stop();
      this.scene.resume('World');
    })

    exitButton.addEventListener('click', () => {
      this.choiceSelectSound.play();
      // todo: close all scenes
    })

    continueButton.addEventListener('mouseover', () => {
      this.choiceHoverSound.play();
    })

    exitButton.addEventListener('mouseover', () => {
      this.choiceHoverSound.play();
    })
  }
}
