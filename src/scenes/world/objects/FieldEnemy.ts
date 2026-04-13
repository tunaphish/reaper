import Phaser from 'phaser';
import { Enemy } from '../../../model/enemy';
import { enemies } from '../../../data/enemies';

export default class FieldEnemy extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 50;
  inBattle = false;
  enemies: Enemy[];

  private movementTimer = 0;
  private movementInterval = 0;
  private vx = 0;
  private vy = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'slime');
    this.enemies = [enemies[0]];

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.pickNewDirection();
  }

  private pickNewDirection(): void {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const shouldIdle = Phaser.Math.Between(0, 2) === 0; 

    this.vx = shouldIdle ? 0 : Math.cos(angle) * FieldEnemy.SPEED;
    this.vy = shouldIdle ? 0 : Math.sin(angle) * FieldEnemy.SPEED;
    this.movementInterval = Phaser.Math.Between(800, 2500);
    this.movementTimer = 0;
  }

  update(delta: number): void {
    if (this.inBattle) {
      this.setVelocity(0, 0);
      return;
    }

    this.movementTimer += delta;
    if (this.movementTimer >= this.movementInterval) {
      this.pickNewDirection();
    }

    this.setVelocity(this.vx, this.vy);
  }
}