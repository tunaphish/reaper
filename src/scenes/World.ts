import Player from '../sprites/Player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class World extends Phaser.Scene {
  static DEAD_ZONE = 20;

  static SWIPE_DURATION_THRESHOLD = 500;
  static SWIPE_DISTANCE_THRESHOLD = 200;

  private pointer: Phaser.Input.Pointer;
  private player: Player;
  private map: Phaser.Tilemaps.Tilemap;

  private crosshairUi: Phaser.GameObjects.Image;
  private pointerUi: Phaser.GameObjects.Image;

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
    this.crosshairUi = this.add.image(0, 0, 'crosshair').setScale(0.1).setScrollFactor(0);
    this.pointerUi = this.add.image(0, 0, 'pointer').setScale(0.03).setScrollFactor(0);

    this.pointer = this.input.activePointer;

    this.cameras.main.startFollow(this.player);
  }

  public update(): void {
    if (this.pointer.isDown && this.pointer.getDistance() > World.DEAD_ZONE) {
      this.crosshairUi.setVisible(true);
      this.crosshairUi.setPosition(this.pointer.downX, this.pointer.downY);
      this.pointerUi.setVisible(true);
      this.pointerUi.setPosition(this.pointer.x, this.pointer.y);
      this.pointerUi.setRotation(this.pointer.getAngle() + 2.5);
      this.player.update(this.pointer.velocity, radiansToDegrees(this.pointer.getAngle()));
    } else {
      this.player.idle();
      this.crosshairUi.setVisible(false);
      this.pointerUi.setVisible(false);
    }
  }
}

function radiansToDegrees(radians: number): number {
  return Math.floor(radians * (180 / Math.PI));
}
