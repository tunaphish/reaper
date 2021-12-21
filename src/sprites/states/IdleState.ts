import Player from "../Player";
import State from "./State";

export default class IdleState implements State {
    enter(player: Player) {
        player.setVelocity(0, 0);
        player.anims.play({ key: 'idle-' + player.direction, repeat: -1 }, true);
    }

    update(player: Player) {
        const pointer = player.scene.input.activePointer;
        if (pointer.isDown && pointer.getDistance() > Player.DEAD_ZONE) {
            player.transition(player.possibleBehaviorStates.runState);
        }
    }
}