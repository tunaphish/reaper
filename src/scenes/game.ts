import Player from '../sprites/player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  private pointer: Phaser.Input.Pointer;

  constructor() {
    super(sceneConfig);
  }

  private player: Player;

  public create(): void {
    this.player = new Player(this);

    this.pointer = this.input.activePointer;
  }

  public update(): void {
    if (this.pointer.isDown) {
      console.log(this.pointer.x);
      console.log(this.pointer.y);
    }

    this.player.update();
  }

  private pointToRadians(firstPointX: number, firstPointY: number, secondPointX: number, secondPointY: number): number {
    return Math.atan2(secondPointY - firstPointY, secondPointX - firstPointX);
  }
}
