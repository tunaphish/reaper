import State from './states/State';
import * as States from './states';
import Player from '../Player';

export default class BehaviorStateMachine {
  state: State;
  possibleStates = {
    idleState: new States.IdleState(),
    runState: new States.RunState(),
  };
  player: Player;

  constructor(initialState: State, player: Player) {
    this.state = initialState;
    this.player = player;
  }

  update(): void {
    this.state.update(this, this.player);
  }

  transition(newState: State): void {
    this.state = newState;
    this.state.enter(this, this.player);
  }
}
