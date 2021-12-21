import { getGameWidth, getGameHeight } from '../helpers';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  speed = 300;
  direction = 'down-neutral';

  constructor(scene: Phaser.Scene) {
    super(scene, getGameWidth(scene) / 2, getGameHeight(scene) / 2, 'shizuka');

    this.scene.physics.world.enable(this);
    //this.setCollideWorldBounds(true);

    this.scene.add.existing(this);
    
    this.scene.anims.createFromAseprite('shizuka');
  }

  public update(velocity: Phaser.Math.Vector2, degrees: number): void {
    const normalizedVelocity = velocity.normalize();
    this.setVelocity(normalizedVelocity.x * this.speed, normalizedVelocity.y * this.speed);

    this.changeAnimationDirection(degrees);
    this.anims.play({ key: 'run-' + this.direction, repeat: -1 }, true);
  }

  public idle(): void {
    this.setVelocity(0, 0);
    this.anims.play({ key: 'idle-' + this.direction, repeat: -1 }, true);
  }

  private changeAnimationDirection(degrees: number) {
    const absoluteDegrees = Math.abs(degrees);
    const flipX: boolean = absoluteDegrees > 90;
    const horizontalDirection: string = absoluteDegrees < 112 && absoluteDegrees > 67 ? 'neutral' : 'right';
    let verticalDirection: string = degrees < 0 ? 'up' : 'down';
    if (absoluteDegrees < 22 || absoluteDegrees > 157) {
      verticalDirection = 'neutral';
    }

    this.direction = verticalDirection + '-' + horizontalDirection;
    this.setFlipX(flipX);
  }
}
