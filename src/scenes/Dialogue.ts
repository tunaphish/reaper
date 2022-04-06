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
  private dialogueText: HTMLDivElement;

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

    const dialogueBackground = document.createElement('div');
    dialogueBackground.id = 'dialogue-background';
    dialogueBox.appendChild(dialogueBackground);

    const dialoguePortrait = document.createElement('div');
    dialoguePortrait.id = 'dialogue-portrait';
    dialogueBox.appendChild(dialoguePortrait);
    const dialogueImage = document.createElement('img');
    dialogueImage.src = '/assets/characters/rise.png';
    dialoguePortrait.appendChild(dialogueImage);

    const dialogueNameElement = document.createElement('div');
    dialogueNameElement.id = 'dialogue-name';
    dialogueNameElement.textContent = DIALOGUE_NAME;
    dialogueBox.appendChild(dialogueNameElement);

    this.dialogueText = document.createElement('div');
    this.dialogueText.id = 'dialogue-text';
    this.dialogueText.textContent = DIALOGUE_TEXT_ARRAY[0];
    dialogueBox.appendChild(this.dialogueText);

    dialogueBox.addEventListener('click', this.advanceDialogue.bind(this));
  }

  advanceDialogue() {
    this.dialogueTextIndex++;
    if (this.dialogueTextIndex >= DIALOGUE_TEXT_ARRAY.length) {
      console.log('close dialogue screen');
      return;
    }
    this.dialogueText.innerText = DIALOGUE_TEXT_ARRAY[this.dialogueTextIndex];
  }
}
