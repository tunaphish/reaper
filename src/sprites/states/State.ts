import Player from "../Player";

export default interface State {
    enter(player: Player);
    update(player: Player);
}