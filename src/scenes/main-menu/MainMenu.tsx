import { createElement } from "../../ui/jsxFactory";
import  styles from "./mainmenu.module.css";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MainMenu',
};

/**
 * The initial scene that starts, shows the splash screens, and loads the necessary assets.
 */
export class MainMenu extends Phaser.Scene {
  private overlay;
  private choiceSelectSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');

    const startGameButton = <div>Start Game</div>
    const settingsButton = <div>Settings</div>

    const menuItems = (
      <div>
        {startGameButton}
        {settingsButton}
      </div>
    )

    this.overlay = document.querySelector('#game > div');
    this.overlay.appendChild(menuItems);

    //put on overlay 
    startGameButton.addEventListener('click', () => {
      this.overlay.replaceChildren();
      this.choiceSelectSound.play();
      this.scene.start('World');
      console.log('lettuce start the game');
    })

    settingsButton.addEventListener('click', () => {
      this.choiceSelectSound.play();
      console.log('lettuce start the settings');
    })

  }
}
