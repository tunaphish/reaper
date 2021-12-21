import player from '../../Player';
import BehaviorStateMachine from '../BehaviorStateMachine';
import State from './State';

export class IdleState implements State {
  enter(stateMachine: BehaviorStateMachine, player: player): void {
    player.setVelocity(0, 0);
    player.anims.play({ key: 'idle-' + player.direction, repeat: -1 }, true);
  }
  update(stateMachine: BehaviorStateMachine, player: player): void {
    // intentionally empty
  }
}
