import * as React from 'react';
import UiOverlayPlugin from '../UiOverlayPlugin';
import styles from './dialoguelist.module.css';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'DialogueList',
};

import { load } from 'js-yaml';

/**
 * List of Dialogue Scenes in the Game
 */
export class DialogueList extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private choiceSelectSound: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');

    const Ui = (): React.ReactElement => {
      const FileHeaders = this.cache.text.entries.keys().map((scriptFileKey) => {
        const data = this.cache.text.entries.get(scriptFileKey);
        const parsedData = load(data);
        const scriptKeys = Object.keys(parsedData);
        const filter = ['briefing', 'seis_age', 'temporary_beauty', 'animal_souls', 'start'];
        const scripts = scriptKeys
          .filter((scriptKey) => {
            return filter.includes(scriptKey);
          })
          .map((scriptKey) => {
            const onClickSceneListItem = () => {
              this.choiceSelectSound.play();
              this.scene.start('Dialogue', { scriptFileKey, scriptKey });
            };
            return <div key={scriptKey} className={styles.scriptButton} onClick={onClickSceneListItem}>- {scriptKey}</div>;
          });

        return (
          <div key={scriptFileKey as string}>
            <h1>{scriptFileKey}</h1>
            {scripts}  
          </div>
        )
      });

      return (
        <div className={styles.container}>{FileHeaders}</div>
      );
    };
    this.ui.create(<Ui/>, this);
  }
}
