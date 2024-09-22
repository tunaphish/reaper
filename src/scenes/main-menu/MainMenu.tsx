import * as React from 'react';
import styles from './mainmenu.module.css';
import UiOverlayPlugin from '../../features/ui-plugin/UiOverlayPlugin';

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
  private menuMusic: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');
    this.add.image(0, 0, 'main-menu').setOrigin(0, 0);
    this.menuMusic = this.sound.add('main-menu-music', { loop: true });
    this.menuMusic.play();

    const Ui = () => {
      const onClickStart = () => {
        this.menuMusic.stop();
        this.choiceSelectSound.play();
        this.scene.start('World');
      };

      const onClickDialogueList = () => {
        this.menuMusic.stop();
        this.choiceSelectSound.play();
        this.scene.start('DialogueList');
      };

      return (
        <div>
          <div className={styles.mainMenuButton} onClick={onClickStart}>
            start game
          </div>
          <div className={styles.mainMenuButton} onClick={onClickDialogueList}>
            show dialogue list
          </div>
        </div>
      )
    }

    this.ui.create(<Ui/>, this);
  }
}
