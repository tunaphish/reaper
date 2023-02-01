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
    this.cache.text.entries.each((scriptFileKey) => {

      const scriptHeader: Element = <h1>{scriptFileKey}</h1>;
      menuItems.appendChild(scriptHeader);

      const data = this.cache.text.entries.get(scriptFileKey);
      const parsedData = load(data);
      const scriptKeys = Object.keys(parsedData);

      scriptKeys.forEach((scriptKey) => {
        const sceneListItem: Element = <div className={styles.scriptButton}>- {scriptKey}</div>;
        scriptHeader.appendChild(sceneListItem);

        sceneListItem.addEventListener('click', () => {
          this.choiceSelectSound.play();
          console.log('lettuce start the settings');
          this.scene.start('Battle', { scriptFileKey, scriptKey });
        });

        sceneListItem.addEventListener('mouseover', () => {
          this.choiceHoverSound.play();
        });
      });
    });
  }
}