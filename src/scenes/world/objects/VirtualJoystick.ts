import Phaser from 'phaser';

export default class VirtualJoystick {
  static DEAD_ZONE = 20;
  static RADIUS = 60;

  vector = new Phaser.Math.Vector2();
  circle: Phaser.GameObjects.Arc;

  private touch: {
    id: number;
    origin: Phaser.Math.Vector2;
    current: Phaser.Math.Vector2;
  } | null = null;

  constructor(private scene: Phaser.Scene) {
    this.circle = scene.add.circle(0, 0, VirtualJoystick.RADIUS, 0xffffff, .2);  
    this.circle.setScrollFactor(0).setVisible(false);
    this.registerTouch();
  }

  private registerTouch() {
    const input = this.scene.input;

    input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      if (this.touch) return;
      this.touch = {
        id: pointer.id,
        origin: new Phaser.Math.Vector2(pointer.x, pointer.y),
        current: new Phaser.Math.Vector2(pointer.x, pointer.y),
      };
      this.circle.setVisible(true);
    });

    input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
      if (!this.touch || pointer.id !== this.touch.id) return;

      const touch = this.touch;
      touch.current.set(pointer.x, pointer.y);

      const deltaX = touch.current.x - touch.origin.x;
      const deltaY = touch.current.y - touch.origin.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > VirtualJoystick.RADIUS) {
        const overflowScale = (distance - VirtualJoystick.RADIUS) / distance;
        touch.origin.x += deltaX * overflowScale;
        touch.origin.y += deltaY * overflowScale;
        this.circle.setPosition(touch.origin.x, touch.origin.y);
      }

      if (distance > VirtualJoystick.DEAD_ZONE) {
        const magnitude = Phaser.Math.Clamp(
          (distance - VirtualJoystick.DEAD_ZONE) / (VirtualJoystick.RADIUS - VirtualJoystick.DEAD_ZONE),
          0,
          1
        );

        this.vector.set(deltaX / distance, deltaY / distance).scale(magnitude);

        return;
      }

      this.vector.set(0, 0);
    });

    const clearTouch = (pointer: Phaser.Input.Pointer) => {
      if (!this.touch || pointer.id !== this.touch.id) return;

      this.touch = null;
      this.vector.set(0, 0);
      this.circle.setVisible(false);
    };

    input.on(Phaser.Input.Events.POINTER_UP, clearTouch);
    input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, clearTouch);
  }


}