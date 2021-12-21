import Player from '../Player';
import State from './State';

export class IdleState implements State {
  enter(player: Player): void {
    player.anims.play({ key: 'idle-' + player.direction, repeat: -1 }, true);
  }

  update(time: number, delta: number, player: Player): void {
    const pointer = player.scene.input.activePointer;

    if (pointer.isDown && pointer.getDistance() > Player.DEAD_ZONE) {
      player.transition(player.possibleBehaviorStates.runState);
      return;
    }
  }
}
