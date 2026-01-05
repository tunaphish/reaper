import Player from '../Player';

export default interface State {
  enter(player: Player);
  update(time: number, delta: number, player: Player);
}