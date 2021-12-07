import { getGameWidth, getGameHeight } from '../helpers';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public speed = 200;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private image: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene) {
    super(scene, getGameWidth(scene) / 2, getGameHeight(scene) / 2, 'man');
    this.image = this.scene.physics.add.sprite(getGameWidth(this.scene) / 2, getGameHeight(this.scene) / 2, 'man');
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
  }

  public update(): void {
    const velocity = new Phaser.Math.Vector2(0, 0);

    if (this.cursorKeys.left.isDown) {
      velocity.x -= 1;
    }
    if (this.cursorKeys.right.isDown) {
      velocity.x += 1;
    }
    if (this.cursorKeys.up.isDown) {
      velocity.y -= 1;
    }
    if (this.cursorKeys.down.isDown) {
      velocity.y += 1;
    }

    const normalizedVelocity = velocity.normalize();
    this.image.setVelocity(normalizedVelocity.x * this.speed, normalizedVelocity.y * this.speed);
  }
}
