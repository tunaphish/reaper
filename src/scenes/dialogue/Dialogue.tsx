import { createElement } from "../../ui/jsxFactory";
import  styles from "./dialogue.module.css";
import UiOverlay from "../../ui/UiOverlay";

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
  private dialogueTextIndex;
  private dialogueTextElement;
  private dialogueAdvanceSound: Phaser.Sound.BaseSound;
  private overlay;

  constructor() {
    super(sceneConfig);

  }

  create(): void {
    this.dialogueAdvanceSound = this.sound.add('dialogue-advance');
    this.dialogueAdvanceSound.play();
    this.dialogueTextIndex = 0;

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
    this.overlay = new UiOverlay(dialogueUi);

    dialogueUi.addEventListener('click', this.advanceDialogue.bind(this));
  }

  advanceDialogue() {
    this.dialogueTextIndex++;
    if (this.dialogueTextIndex >= DIALOGUE_TEXT_ARRAY.length) {
      this.overlay.clearUi();
      this.scene.stop();
      this.scene.run('World');
      return;
    }
    this.dialogueAdvanceSound.play();
    this.dialogueTextElement.innerText = DIALOGUE_TEXT_ARRAY[this.dialogueTextIndex];
  }
}
