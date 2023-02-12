import * as Phaser from 'phaser';

export const getGameWidth = (scene: Phaser.Scene): number => {
  return scene.game.scale.width;
};

export const getGameHeight = (scene: Phaser.Scene): number => {
  return scene.game.scale.height;
};

export const getRandomInt = (max: number) => Math.floor(Math.random() * max);
