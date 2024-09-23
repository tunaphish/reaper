import * as React from 'react';
import { motion } from 'framer-motion';
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
  private backgroundImage;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');
    this.backgroundImage = this.add.image(0, 0, 'main-menu').setOrigin(0, 0).setAlpha(0);

    this.menuMusic = this.sound.add('main-menu-music', { loop: true });
    this.menuMusic.play();

    const Ui = () => {
      const [opacity, setOpacity] = React.useState(0);

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

      React.useEffect(() => {
        this.fadeInImage(() => setOpacity(1));
      })

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity }}     
          transition={{ duration: 1 }} 
        >
          <h1 className={styles.title}>
            r e a p e r
          </h1>
          <div className={styles.mainMenuButton} onClick={onClickStart}>
            start game
          </div>
          <div className={styles.mainMenuButton} onClick={onClickDialogueList}>
            show dialogue list
          </div>
        </motion.div>
      )
    }

    this.ui.create(<Ui/>, this);
  }
  
  fadeInImage(onCompleteCallback: () => void): void {
    this.tweens.add({
      targets: this.backgroundImage,   
      alpha: 1,         
      duration: 1000,   
      ease: 'Linear',   
      onComplete: () => {
        onCompleteCallback();
      }
    });
  }
}


