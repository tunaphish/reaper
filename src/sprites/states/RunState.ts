import Player from '../Player';
import State from './State';

export class RunState implements State {
  static MAX_ACCELERATION = 30;

  enter(player: Player) {
    console.log('entering run state');
  }

  update(time: number, delta: number, player: Player) {
    const pointer = player.scene.input.activePointer;

    if (!pointer.isDown) {
      //Transition to Skid State instead
      player.transition(player.possibleBehaviorStates.idleState);
      return;
    }

    //Implement Deadzone 
    const acceleration: Phaser.Math.Vector2 = pointer.velocity.normalize().scale(RunState.MAX_ACCELERATION);
    let newVelocity: Phaser.Math.Vector2 = player.body.velocity.add(acceleration);
    const maxVelocity: Phaser.Math.Vector2 = newVelocity.normalize().scale(Player.SPEED);

    newVelocity = newVelocity.length < maxVelocity.length ? newVelocity : maxVelocity;
    
    player.setVelocity(newVelocity.x, newVelocity.y);

    player.changeDirection(player.body.velocity.angle());
    player.anims.play({ key: 'run-' + player.direction, repeat: -1 }, true);
  }
}
