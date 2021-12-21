import Player from '../Player';
import State from './State';

export default class RunState implements State {
  enter(player: Player) {
    console.log('entering run state');
  }

  update(time: number, delta: number, player: Player) {
    const pointer = player.scene.input.activePointer;

    if (!pointer.isDown) {
      player.transition(player.possibleBehaviorStates.idleState);
      return;
    }

    const velocity = pointer.velocity;
    const normalizedVelocity = velocity.normalize();
    player.setVelocity(normalizedVelocity.x * Player.SPEED, normalizedVelocity.y * Player.SPEED);

    player.changeDirection(pointer.angle);
    player.anims.play({ key: 'run-' + player.direction, repeat: -1 }, true);
  }
}
