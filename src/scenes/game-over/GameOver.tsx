import * as React from 'react';
import { motion } from 'framer-motion';
import styles from './gameover.module.css';
import ReactOverlay from '../../plugins/ReactOverlay';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'GameOver',
};


export class GameOver extends Phaser.Scene {
  private reactOverlay: ReactOverlay;
  private choiceSelectSound: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');

    const Ui = () => {
      const [opacity, setOpacity] = React.useState(1);

      const onAnimationComplete = ((definition: { opacity }) => {
        if (definition.opacity === 0) {
          this.scene.start('MainMenu');
        }
      })

      const onClickMainMenu = () => {
        this.choiceSelectSound.play();
        setOpacity(0);
      };

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity }}     
          transition={{ duration: 1 }} 
          onAnimationComplete={onAnimationComplete}
        >
          <h1 className={styles.title}>
            g a m e o v e r
          </h1>
          <div className={styles.mainMenuButton} onClick={onClickMainMenu}>
            main menu
          </div>
        </motion.div>
      )
    }

    this.reactOverlay.create(<Ui/>, this);
  }
  

}


