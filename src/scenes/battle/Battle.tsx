import { createElement } from "../../ui/jsxFactory";
import UiOverlay from "../../ui/UiOverlay";
import styles from './battle.module.css';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};


export class Battle extends Phaser.Scene {
  private overlay;


  constructor() {
    super(sceneConfig);
  }

  public create(): void {

    const runButton = <div>Run</div>

    const battleBar = (
      <div className={styles.container}>
        <div className={styles.battleBar}>
          <div>Fight</div>
          <div>Talk</div>
          <div>Item</div>
          {runButton}
        </div>
      </div>  
    )
    
    this.overlay = new UiOverlay(battleBar)
    

    runButton.addEventListener('click', () => {
      this.overlay.clearUi();
      this.scene.stop();
      this.scene.run('World');
    });
  }
}
