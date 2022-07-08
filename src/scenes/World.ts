import Player from '../sprites/Player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'World',
};

export class World extends Phaser.Scene {
  private player: Player;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');

    const belowLayer = map.createLayer('Below Player', tileset, 0, 0);
    const worldLayer = map.createLayer('World', tileset, 0, 0).setCollisionByProperty({ collides: true });
    const aboveLayer = map.createLayer('Above Player', tileset, 0, 0).setDepth(10);

    const spawnPoint = map.findObject('Objects', (obj) => obj.name === 'Spawn Point');
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    this.physics.add.collider(this.player, worldLayer);
    this.cameras.main.startFollow(this.player);

    // event start dialogue 
    this.input.keyboard.on('keydown-W', function startDialogueScene() {
      console.log('sleepy boi');
      this.scene.pause();
      this.scene.run('Dialogue');
    }, this);
  }

  public update(time: number, delta: number): void {
    this.player.update(time, delta);
  }
}
