import Player from '../Player';
import State from './State';

export default class IdleState implements State {
  enter(player: Player): void {
    console.log('entering idle state');
    player.setVelocity(0, 0);
    player.anims.play({ key: 'idle-' + player.direction, repeat: -1 }, true);
  }

  update(time: number, delta: number, player: Player): void {
    const pointer = player.scene.input.activePointer;

    if (false /* figure out swipe */) {
      player.transition(player.possibleBehaviorStates.dashState);
      return;
    }

    if (pointer.isDown && pointer.getDistance() > Player.DEAD_ZONE) {
      player.transition(player.possibleBehaviorStates.runState);
      return;
    }
  }
}
