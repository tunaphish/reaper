import { createElement } from '../../ui/jsxFactory';
import styles from './dialoguelist.module.css';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';

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
  private choiceHoverSound: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');
    this.choiceHoverSound = this.sound.add('choice-hover');

    const menuItems: Element = <div></div>;
    this.ui.create(menuItems, this);

    //append script list
    //then attach event listenrs
    this.cache.text.entries.each((scriptKey) => {

      const scriptHeader: Element = <h1>{scriptKey}</h1>;
      menuItems.appendChild(scriptHeader);

      const data = this.cache.text.entries.get(scriptKey);
      const parsedData = load(data);
      const sceneKeys = Object.keys(parsedData);

      sceneKeys.forEach((sceneKey) => {
        const sceneListItem: Element = <div className={styles.scriptButton}>- {sceneKey}</div>;
        scriptHeader.appendChild(sceneListItem);

        sceneListItem.addEventListener('click', () => {
          this.choiceSelectSound.play();
          console.log('lettuce start the settings');
          this.scene.start('Battle', { scriptKey, sceneKey });
        });

        sceneListItem.addEventListener('mouseover', () => {
          this.choiceHoverSound.play();
        });
      });
    });
  }
}
