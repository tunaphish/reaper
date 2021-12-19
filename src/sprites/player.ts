import { getGameWidth, getGameHeight } from '../helpers';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public speed = 200;

  constructor(scene: Phaser.Scene) {
    super(scene, getGameWidth(scene) / 2, getGameHeight(scene) / 2, 'man');

    this.scene.physics.world.enable(this);
    this.setCollideWorldBounds(true);

    this.scene.add.existing(this);

    const shizukaAnimationKeys = this.scene.anims.createFromAseprite('shizuka'); //.map(anim => anim.key);
    console.log(shizukaAnimationKeys);
  }

  public move(velocity: Phaser.Math.Vector2, degrees: number): void {
    const normalizedVelocity = velocity.normalize();
    this.setVelocity(normalizedVelocity.x * this.speed, normalizedVelocity.y * this.speed);
    console.log(degrees);

    this.changeAnimationDirection(degrees);
  }

  private changeAnimationDirection(degrees: number) {
    let absoluteDegrees = Math.abs(degrees);
    let flipX: boolean = absoluteDegrees > 90;
    let horizontalDirection: string = absoluteDegrees < 112 && absoluteDegrees > 67 ? 'neutral' : 'right';
    let verticalDirection: string = degrees < 0 ? 'up' : 'down';
    if (absoluteDegrees < 22 || absoluteDegrees > 157) {
      verticalDirection = 'neutral'
    } 

    this.setFlipX(flipX);
    this.anims.play({key: 'run-' + verticalDirection + '-' + horizontalDirection, repeat: -1}, true);
  }

}
