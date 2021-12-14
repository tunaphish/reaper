import Player from '../sprites/player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  private pointer: Phaser.Input.Pointer;
  private player: Player;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.player = new Player(this);
    this.pointer = this.input.activePointer;
    this.pointer.motionFactor = 0.1;
  }

  public update(): void {
    if (this.pointer.isDown) {
      console.log('distance' + this.pointer.distance);
      console.log('velocity' + this.pointer.velocity.x + ' and ' + this.pointer.velocity.y);
      this.player.move(this.pointer.velocity);
    }

    if (!this.pointer.isDown) {
      this.player.move(new Phaser.Math.Vector2(0, 0));
    }
  }

  private pointToRadians(firstPointX: number, firstPointY: number, secondPointX: number, secondPointY: number): number {
    return Math.atan2(secondPointY - firstPointY, secondPointX - firstPointX);
  }
}
