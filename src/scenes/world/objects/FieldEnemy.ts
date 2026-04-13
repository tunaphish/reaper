import Phaser from 'phaser';
import { Enemy } from '../../../model/enemy';
import { enemies } from '../../../data/enemies';

export default class FieldEnemy extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 300;
  inBattle = false;
  enemies: Enemy[];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'slime');
    this.enemies = [enemies[0]];

    scene.physics.world.enable(this);
    scene.add.existing(this);
  }

  update(delta: number): void {
    //
  }
}