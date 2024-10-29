import * as React from 'react';
import UiOverlayPlugin from '../UiOverlayPlugin';
import styles from './pausemenu.module.css';
import { Ally } from '../../model/ally';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'PauseMenu',
};

export class PauseMenu extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private choiceSelectSound: Phaser.Sound.BaseSound;
  private allies: Ally[];

  constructor() {
    super(sceneConfig);
  }

  public init(): void {
    this.allies = this.registry.get('allies');
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');

    const onClickContinue = () => {
      this.choiceSelectSound.play();
      this.scene.stop();
      this.scene.resume('World');
    };

    const onClickExit = () => {
      this.choiceSelectSound.play();
      this.scene.manager.getScenes(false).forEach(scene => {
        this.scene.stop(scene.scene.key);  
      });
      this.scene.start('MainMenu');
    };

    const Party = () => {
      return (
        <>
          {this.allies.map((ally) => {
            return (
              <div className={styles.allyView} key={ally.name}>
                <div>{ally.name}</div>
                <div>HP {ally.health}/{ally.maxHealth}</div>
                <div>SP {ally.stamina}/{ally.maxStamina}</div>
                <div>MP {ally.magic}/{ally.maxMagic}</div>
              </div>
            )
          })}
        </>
       )
    }

    const Items = () => {
      return (
        <>
          To be implemented
        </>
      )
    }

    const Misc = () => {
      return (
        <>
          <div className={styles.pauseMenuButton} onClick={onClickContinue}>
            continue
          </div>
          <div className={styles.pauseMenuButton} onClick={onClickExit}>
            exit to main menu
          </div>
        </>
      )
    }

    const Ui = () => {
      const [content, setContent] = React.useState(<Party/>)
      const onClickTab = (newContent: JSX.Element) => {
        this.choiceSelectSound.play();
        setContent(newContent);
      }

      return (
        <div className={styles.container}>
          <div className={styles.content}>
            {content}
          </div>
          <div className={styles.navigation}>
            <div className={styles.navigationButton} onClick={() => onClickTab(<Party/>)}>Party</div>
            <div className={styles.navigationButton} onClick={() => onClickTab(<Items/>)}>Items</div>
            <div className={styles.navigationButton} onClick={() => onClickTab(<Misc/>)}>Misc</div>
          </div>
        </div>
      )
    };

    this.ui.create(<Ui/>, this);
  }
}
