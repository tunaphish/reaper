import * as React from 'react';
import UiOverlayPlugin from '../../features/ui-plugin/UiOverlayPlugin';
import styles from './pausemenu.module.css';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'PauseMenu',
};

export class PauseMenu extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private choiceSelectSound: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');

    const onClickContinue = () => {
      this.choiceSelectSound.play();
      this.scene.stop();
      this.scene.resume('World');
    };

    const Ui = () => {
      return (
        <div>
          <div className={styles.pauseMenuButton} onClick={onClickContinue}>
            continue
          </div>
          <div className={styles.pauseMenuButton}>
            exit to main menu
          </div>
        </div>
      )
    };

    this.ui.create(<Ui/>, this);
  }
}
