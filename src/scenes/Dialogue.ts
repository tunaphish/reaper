import { getGameWidth, getGameHeight } from '../helpers';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Dialogue',
};

const DIALOGUE_NAME = 'Rise Kujikawa';
const DIALOGUE_TEXT = 'I AM AWESOME!!';
const IMAGE_HEIGHT = 254;

export class Dialogue extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  create(): void {
    console.log('hi I am create');

    const dialogueBoxHeight = 250;
    const padding = 10;
    const borderWidth = 3;
    this.add
      .rectangle(
        0 + padding - borderWidth,
        getGameHeight(this) - dialogueBoxHeight + padding - borderWidth,
        getGameWidth(this) - padding * 2 + borderWidth * 2,
        dialogueBoxHeight - padding * 2 + borderWidth * 2,
        0xffffff,
      )
      .setDisplayOrigin(0, 0);

    this.add
      .rectangle(
        0 + padding,
        getGameHeight(this) - dialogueBoxHeight + padding,
        getGameWidth(this) - padding * 2,
        dialogueBoxHeight - padding * 2,
        0xdedede,
      )
      .setDisplayOrigin(0, 0);

    //400 magic number, setting pixel perfect locations sucks lmao
    this.add.image(25, 400, 'rise').setDisplayOrigin(0).setScale(0.66).setDepth(-1);
  }
}
