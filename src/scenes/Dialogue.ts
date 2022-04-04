import { getGameWidth, getGameHeight } from '../helpers';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Dialogue',
};

const DIALOGUE_NAME = 'Rise Kujikawa';
const DIALOGUE_TEXT_ARRAY = [
  'Hi, I am an arbitrarilly long string meant to showcase the wordwrap feature in text.',
  'I love you senpai',
];

export class Dialogue extends Phaser.Scene {
  private dialogueTextIndex = 0;
  private dialogueText: Phaser.GameObjects.Text;

  constructor() {
    super(sceneConfig);
  }

  create(): void {
    console.log('hi I am create');

    const dialogueBoxHeight = 200;
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

    const dialogueBox = this.add
      .rectangle(
        0 + padding,
        getGameHeight(this) - dialogueBoxHeight + padding,
        getGameWidth(this) - padding * 2,
        dialogueBoxHeight - padding * 2,
        0x000000,
      )
      .setDisplayOrigin(0, 0)
      .setInteractive()
      .on('pointerup', this.advanceDialogue);

    const portrait = this.add.image(25, 450, 'rise').setDisplayOrigin(0).setScale(0.66).setDepth(-1);

    const nameTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'rainyhearts',
      fontSize: '22px',
    };
    const nameText = this.add.text(15, 615, DIALOGUE_NAME, nameTextStyle);

    const dialogueTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'rainyhearts',
      fontSize: '26px',
      wordWrap: {
        width: 400,
      },
    };
    this.dialogueText = this.add.text(30, 650, DIALOGUE_TEXT_ARRAY[this.dialogueTextIndex], dialogueTextStyle);
  }

  advanceDialogue(): void {
    if (this.dialogueTextIndex >= DIALOGUE_TEXT_ARRAY.length) {
      console.log('dialoge ended');
      return;
    }
    this.dialogueTextIndex++;
    this.dialogueText.setText(DIALOGUE_TEXT_ARRAY[this.dialogueTextIndex]);
  }
}
