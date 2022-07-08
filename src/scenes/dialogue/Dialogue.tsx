import { createElement } from "../../ui/jsxFactory";
import  styles from "./dialogue.module.css";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Dialogue',
};

const DIALOGUE_NAME = 'Rise Kujikawa';
const DIALOGUE_TEXT_ARRAY = [
  'Hi, I am an arbitrarilly long string meant to showcase the wordwrap feature in text.',
  'I love you senpai',
  'Random dialogue to test sound',
  'Hello, how are you?',
];


export class Dialogue extends Phaser.Scene {
  private dialogueTextIndex = 0;
  private dialogueTextElement;
  private dialogueAdvanceSound: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);

  }

  create(): void {
    this.dialogueAdvanceSound = this.sound.add('dialogue-advance');

    this.dialogueTextElement = <div className={styles.dialogueText}>{DIALOGUE_TEXT_ARRAY[0]}</div>
    let dialogueUi = (
      <div className={styles.dialogueContainer}>
        <div className={styles.dialogueBox}>
          <div className={styles.dialogueBackground}/>
          <div className={styles.dialoguePortrait}>
            <img src={"/assets/characters/rise.png"}></img>
          </div>
          <div className={styles.dialogueName}>{DIALOGUE_NAME}</div>
          {this.dialogueTextElement}
        </div>
      </div>
    )
    const overlay = document.querySelector('#game > div');
    overlay.appendChild(dialogueUi);

    dialogueUi.addEventListener('click', this.advanceDialogue.bind(this));
  }

  advanceDialogue() {
    this.dialogueTextIndex++;
    if (this.dialogueTextIndex >= DIALOGUE_TEXT_ARRAY.length) {
      console.log('close dialogue screen');
      return;
    }
    this.dialogueAdvanceSound.play();
    this.dialogueTextElement.innerText = DIALOGUE_TEXT_ARRAY[this.dialogueTextIndex];
  }
}
