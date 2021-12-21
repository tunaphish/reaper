import BehaviorStateMachine from '../BehaviorStateMachine';
import Player from '../../Player';

export default interface State {
  enter(stateMachine: BehaviorStateMachine, player: Player): void;
  update(stateMachine: BehaviorStateMachine, player: Player): void;
}
