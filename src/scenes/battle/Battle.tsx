import { createElement } from '../../ui/jsxFactory';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';
import styles from './battle.module.css';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export class Battle extends Phaser.Scene {
  private ui: UiOverlayPlugin;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const runButton = <div>Run</div>;

    const battleBar = (
      <div className={styles.container}>
        <div className={styles.battleBar}>
          <div>Fight</div>
          <div>Talk</div>
          <div>Item</div>
          {runButton}
        </div>
      </div>
    );

    this.ui.create(battleBar, this);

    runButton.addEventListener('click', () => {
      this.scene.start('World');
    });
  }
}
