import Player from '../sprites/player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  private pointer: Phaser.Input.Pointer;
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
    this.pointer = this.input.activePointer;
    this.pointer.motionFactor = 0.1;

    this.cameras.main.startFollow(this.player);
  }

  public update(): void {

    if (this.pointer.isDown) {

      this.player.move(this.pointer.velocity, this.radiansToDegrees(this.pointer.getAngle()));
    }

    if (!this.pointer.isDown) {
      let downwardDegrees: number = 90;
      this.player.move(new Phaser.Math.Vector2(0, 0), downwardDegrees);
    }
  }

  private radiansToDegrees(radians: number): number {
    return Math.floor(radians * (180 / Math.PI));
  }
}
