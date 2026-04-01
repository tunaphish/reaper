import Phaser from 'phaser';

export default class FieldEnemy extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 300;
  inBattle = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'slime');


    scene.physics.world.enable(this);
    scene.add.existing(this);
  }
  


  update(delta: number): void {
    //
  }
}