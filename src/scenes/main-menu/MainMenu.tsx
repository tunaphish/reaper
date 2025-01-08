import * as React from 'react';
import { motion } from 'framer-motion';
import styles from './mainmenu.module.css';
import ReactOverlay from '../../plugins/ReactOverlay';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MainMenu',
};

export class MainMenu extends Phaser.Scene {
  private reactOverlay: ReactOverlay;
  private choiceSelectSound: Phaser.Sound.BaseSound;
  private menuMusic: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');

    this.menuMusic = this.sound.add('main-menu-music', { loop: true });
    this.menuMusic.play();

    const Ui = () => {
      const [opacity, setOpacity] = React.useState(1);

      const onClickStart = () => {
        this.tweens.add({
          targets:  this.menuMusic,
          volume:   0,
          duration: 500
        });
        setOpacity(0);
        this.choiceSelectSound.play();
      };

      const onAnimationComplete = ((definition: { opacity }) => {
        if (definition.opacity === 0) {
          this.menuMusic.stop();
          this.scene.start('World');
        }
      })

      const onClickDialogueList = () => {
        this.menuMusic.stop();
        this.choiceSelectSound.play();
        this.scene.start('DialogueList');
      };

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity }}     
          transition={{ duration: 1 }} 
          onAnimationComplete={onAnimationComplete}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
          }}
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

    this.reactOverlay.create(<Ui/>, this);
  }

}


