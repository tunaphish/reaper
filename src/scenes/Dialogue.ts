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
  private dialogue: HTMLParagraphElement;

  constructor() {
    super(sceneConfig);
  }

  create(): void {
    const overlay = document.querySelector('#game > div');

    const container = document.createElement('div');
    container.id = 'dialogue-container';
    overlay.appendChild(container);

    const dialogueBox = document.createElement('div');
    dialogueBox.id = 'dialogue-box';
    container.appendChild(dialogueBox);

    const dialogueNameElement = document.createElement('p');
    dialogueNameElement.id = 'dialogue-name';
    dialogueNameElement.textContent = DIALOGUE_NAME;
    dialogueBox.appendChild(dialogueNameElement);

    this.dialogue = document.createElement('p');
    this.dialogue.id = 'dialogue';
    this.dialogue.textContent = DIALOGUE_TEXT_ARRAY[0];
    dialogueBox.appendChild(this.dialogue);

    dialogueBox.addEventListener('click', this.advanceDialogue.bind(this));
  }

  advanceDialogue() {
    this.dialogueTextIndex++;
    if (this.dialogueTextIndex >= DIALOGUE_TEXT_ARRAY.length) {
      console.log('close dialogue screen');
      return;
    }
    this.dialogue.innerText = DIALOGUE_TEXT_ARRAY[this.dialogueTextIndex];
  }
}
