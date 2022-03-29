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
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');
    const belowLayer = map.createLayer('Below Player', tileset, 0, 0);
    const worldLayer = map.createLayer('World', tileset, 0, 0);
    const aboveLayer = map.createLayer('Above Player', tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });
    aboveLayer.setDepth(10);
    const spawnPoint = map.findObject('Objects', (obj) => obj.name === 'Spawn Point');

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    this.physics.add.collider(this.player, worldLayer);
    this.cameras.main.startFollow(this.player);
  }

  public update(time: number, delta: number): void {
    this.player.update(time, delta);
  }
}
