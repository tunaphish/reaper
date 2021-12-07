import Player from '../sprites/player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  private player: Player;

  public create(): void {
    this.player = new Player(this);
  }

  public update(): void {
    this.player.update();
  }
}
