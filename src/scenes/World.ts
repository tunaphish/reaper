import Player from '../sprites/Player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class World extends Phaser.Scene {
  private player: Player;
  private map: Phaser.Tilemaps.Tilemap;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.map = this.add.tilemap('testTileMap');
    const outside = this.map.addTilesetImage('iso-64x64-outside', 'outside');
    const building = this.map.addTilesetImage('iso-64x64-building', 'building');

    this.map.createLayer('Tile Layer 1', [outside, building]);
    this.map.createLayer('Tile Layer 2', [outside, building]);
    this.map.createLayer('Tile Layer 3', [outside, building]);
    this.map.createLayer('Tile Layer 4', [outside, building]);
    this.map.createLayer('Tile Layer 5', [outside, building]);

    this.player = new Player(this);

    this.cameras.main.startFollow(this.player);
  }

  public update(time: number, delta: number): void {
    this.player.update(time, delta);
  }
}
