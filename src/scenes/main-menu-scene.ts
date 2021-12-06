import { MenuButton } from '../ui/menu-button';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MainMenu',
};

/**
 * The initial scene that starts, shows the splash screens, and loads the necessary assets.
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    new MenuButton(this, 0, 150, 'Start Game', () => {
      this.scene.start('Game');
    });

    new MenuButton(this, 0, 250, 'Settings', () => console.log('settings button clicked'));

    new MenuButton(this, 0, 350, 'Help', () => console.log('help button clicked'));
  }
}
