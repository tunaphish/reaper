import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 300;

  direction = 'down-neutral';
  private inputVector = new Phaser.Math.Vector2();

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'shizuka');

    scene.physics.world.enable(this);
    scene.add.existing(this);
    scene.anims.createFromAseprite('shizuka');

    this.setDebug(true, true, 0xffffff);
  }

  setInput(vectorX: number, vectorY: number): void {
    this.inputVector.set(vectorX, vectorY);
  }

  update(): void {
    const velocityX = this.inputVector.x;
    const velocityY = this.inputVector.y;

    if (velocityX !== 0 || velocityY !== 0) {
      this.setVelocity(
        velocityX * Player.SPEED,
        velocityY * Player.SPEED
      );

      const angleInDegrees =
        (Math.atan2(velocityY, velocityX) * 180) / Math.PI;
      const normalizedDegrees = (angleInDegrees + 360) % 360;

      const verticalDirection =
        normalizedDegrees > 22 && normalizedDegrees < 157
          ? 'down'
          : normalizedDegrees > 202 && normalizedDegrees < 337
          ? 'up'
          : 'neutral';

      const horizontalDirection =
        (normalizedDegrees > 67 && normalizedDegrees < 112) ||
        (normalizedDegrees > 247 && normalizedDegrees < 292)
          ? 'neutral'
          : 'right';

      this.direction = `${verticalDirection}-${horizontalDirection}`;
      this.setFlipX(normalizedDegrees > 90 && normalizedDegrees < 270);

      this.anims.play(`run-${this.direction}`, true);
    } else {
      this.setVelocity(0, 0);
      this.anims.play(`idle-${this.direction}`, true);
    }
  }
}