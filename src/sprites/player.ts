import { getGameWidth, getGameHeight } from '../helpers';
import DashState from './states/DashState';
import IdleState from './states/IdleState';
import RunState from './states/RunState';
import State from './states/State';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 300;
  static DEAD_ZONE = 20;
  static SWIPE_DURATION_THRESHOLD = 500;
  static SWIPE_DISTANCE_THRESHOLD = 100;

  direction = 'down-neutral';
  behaviorState: State;
  possibleBehaviorStates = {
    idleState: new IdleState(),
    runState: new RunState(),
    dashState: new DashState(),
  };

  constructor(scene: Phaser.Scene) {
    super(scene, getGameWidth(scene) / 2, getGameHeight(scene) / 2, 'shizuka');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.scene.anims.createFromAseprite('shizuka');
    this.behaviorState = this.possibleBehaviorStates.idleState;
  }

  update(time: number, delta: number): void {
    this.behaviorState.update(time, delta, this);
  }

  transition(newState: State) {
    this.behaviorState = newState;
    this.behaviorState.enter(this);
  }

  changeDirection(radians: number): void {
    const degrees = Math.floor(radians * (180 / Math.PI));
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
