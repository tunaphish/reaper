import { getGameWidth, getGameHeight } from '../helpers';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public speed = 200;

  constructor(scene: Phaser.Scene) {
    super(scene, getGameWidth(scene) / 2, getGameHeight(scene) / 2, 'man');

    this.scene.physics.world.enable(this);
    this.setCollideWorldBounds(true);

    this.scene.add.existing(this);
  }

  public move(velocity: Phaser.Math.Vector2): void {
    const normalizedVelocity = velocity.normalize();
    this.setVelocity(normalizedVelocity.x * this.speed, normalizedVelocity.y * this.speed);
  }
}
