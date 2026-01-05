import * as States from './states';
import State from './states/State';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 300;
  static DEAD_ZONE = 20;
  static SWIPE_DURATION_THRESHOLD = 500;
  static SWIPE_DISTANCE_THRESHOLD = 100;

  direction = 'down-neutral';
  behaviorState: State;
  possibleBehaviorStates = {
    idleState: new States.IdleState(),
    runState: new States.RunState(),
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'shizuka');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.scene.anims.createFromAseprite('shizuka');
    this.behaviorState = this.possibleBehaviorStates.idleState;
    this.setDamping(true);
    this.setDrag(0.05);
    this.setDebug(true, true, 0xffffff);
  }

  update(time: number, delta: number): void {
    this.behaviorState.update(time, delta, this);
  }

  transition(newState: State): void {
    this.behaviorState = newState;
    this.behaviorState.enter(this);
  }

  changeDirection(radians: number): void {
    const degrees = Math.floor(radians * (180 / Math.PI));
    const verticalDirection = this.getVerticalDirection(degrees);
    const horizontalDirection = this.getHorizontalDirection(degrees);
    this.direction = verticalDirection + '-' + horizontalDirection;
    this.setFlipX(degrees > 90 && degrees < 270);
  }

  getVerticalDirection(degrees: number): string {
    if (degrees > 22 && degrees < 157) {
      return 'down';
    } else if (degrees > 202 && degrees < 337) {
      return 'up';
    }

    return 'neutral';
  }

  getHorizontalDirection(degrees: number): string {
    if ((degrees > 67 && degrees < 112) || (degrees > 247 && degrees < 292)) {
      return 'neutral';
    }
    return 'right';
  }
}