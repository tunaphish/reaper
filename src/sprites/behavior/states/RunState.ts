import player from '../../Player';
import BehaviorStateMachine from '../BehaviorStateMachine';
import State from './State';

export class RunState implements State {
  enter(stateMachine: BehaviorStateMachine, player: player): void {
    throw new Error('Method not implemented.');
  }
  update(stateMachine: BehaviorStateMachine, player: player): void {
    throw new Error('Method not implemented.');
  }

  private changeAnimationDirection(degrees: number, player: Player) {
    const absoluteDegrees = Math.abs(degrees);
    const flipX: boolean = absoluteDegrees > 90;
    const horizontalDirection: string = absoluteDegrees < 112 && absoluteDegrees > 67 ? 'neutral' : 'right';
    let verticalDirection: string = degrees < 0 ? 'up' : 'down';
    if (absoluteDegrees < 22 || absoluteDegrees > 157) {
      verticalDirection = 'neutral';
    }

    player.direction = verticalDirection + '-' + horizontalDirection;
    player.setFlipX(flipX);
  }
}
