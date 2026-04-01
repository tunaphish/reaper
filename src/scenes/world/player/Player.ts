import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 300;
  static DEAD_ZONE = 20;
  static JOYSTICK_RADIUS = 60;

  direction = 'down-neutral';
  joystickVector = new Phaser.Math.Vector2();
  private touch: {
    id: number;
    origin: Phaser.Math.Vector2;
    current: Phaser.Math.Vector2;
  } | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'shizuka');
    scene.physics.world.enable(this);
    scene.add.existing(this);
    scene.anims.createFromAseprite('shizuka');
    this.setDebug(true, true, 0xffffff);
    this.registerTouch();
  }

  private registerTouch() {
    const input = this.scene.input;

    input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      if (!this.touch) {
        this.touch = {
          id: pointer.id,
          origin: new Phaser.Math.Vector2(pointer.x, pointer.y),
          current: new Phaser.Math.Vector2(pointer.x, pointer.y),
        };
      }
    });

    input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
      if (!this.touch || pointer.id !== this.touch.id) return;

      const touch = this.touch;
      touch.current.set(pointer.x, pointer.y);

      const deltaX = touch.current.x - touch.origin.x;
      const deltaY = touch.current.y - touch.origin.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > Player.JOYSTICK_RADIUS) {
        const overflowScale = (distance - Player.JOYSTICK_RADIUS) / distance;
        touch.origin.x += deltaX * overflowScale;
        touch.origin.y += deltaY * overflowScale;
      }

      if (distance < Player.DEAD_ZONE) {
        this.joystickVector.set(0, 0);
      } else {
        const magnitude = Phaser.Math.Clamp(
          (distance - Player.DEAD_ZONE) /
            (Player.JOYSTICK_RADIUS - Player.DEAD_ZONE),
          0,
          1
        );

        this.joystickVector
          .set(deltaX / distance, deltaY / distance)
          .scale(magnitude);
      }
    });

    const clearTouch = (pointer: Phaser.Input.Pointer) => {
      if (this.touch && pointer.id === this.touch.id) {
        this.touch = null;
        this.joystickVector.set(0, 0);
      }
    };

    input.on(Phaser.Input.Events.POINTER_UP, clearTouch);
    input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, clearTouch);
  }

  update(): void {
    const velocityX = this.joystickVector.x;
    const velocityY = this.joystickVector.y;

    if (this.touch && (velocityX !== 0 || velocityY !== 0)) {
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