import Player from "../Player";
import State from "./State";

export default class DashState implements State {
    static DASH_SPEED = 600;
    static DASH_TIME = 200;
    elapsedTime = 0;

    enter(player: Player) {
        console.log('enter dash state')
        this.elapsedTime = 0;
    }

    update(time: number, delta: number, player: Player) {
        const pointer = player.scene.input.activePointer;
        this.elapsedTime += delta;

        if (this.elapsedTime > DashState.DASH_TIME) {
            player.transition(player.possibleBehaviorStates.idleState);
            return;
        }

        const velocity = pointer.velocity;
        const normalizedVelocity = velocity.normalize();
        player.setVelocity(normalizedVelocity.x * DashState.DASH_SPEED, normalizedVelocity.y * DashState.DASH_SPEED);
    
        player.changeDirection(pointer.angle);
        player.anims.play({ key: 'run-' + player.direction, repeat: -1 }, true);    }
}