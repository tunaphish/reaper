import * as React from 'react';
import UiOverlayPlugin from '../../features/ui-plugin/UiOverlayPlugin';
import styles from './dialogue.module.css';

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

const TEXT_SPEED = 25;
export class Dialogue extends Phaser.Scene {
  private dialogueTextIndex;
  private dialogueAdvanceSound: Phaser.Sound.BaseSound;

  private ui: UiOverlayPlugin;

  constructor() {
    super(sceneConfig);
  }

  create(): void {
    this.dialogueAdvanceSound = this.sound.add('dialogue-advance');
    this.dialogueAdvanceSound.play();
    this.dialogueTextIndex = 0;

    const Ui = () => {
      const [dialogueText, setDialogueText] = React.useState<string>(DIALOGUE_TEXT_ARRAY[0])
      const [displayedText, setDisplayedText] = React.useState('');
      const [displayIndex, setDisplayIndex] = React.useState(0);
      const [isTyping, setIsTyping] = React.useState(true);

      React.useEffect(() => {
        if (!isTyping) {
          setDisplayedText(dialogueText);
          return;
        }
        if (displayIndex < dialogueText.length) {
          const timeout = setTimeout(() => {
            setDisplayedText((prev) => prev + dialogueText[displayIndex]);
            setDisplayIndex((prev) => prev + 1);
          }, TEXT_SPEED);
    
          return () => clearTimeout(timeout); 
        } 
        setIsTyping(false);
      }, [displayIndex, dialogueText]);

      const onClick = () => {
        if (isTyping) {
          setIsTyping(false);
        } else {
          this.dialogueTextIndex++;
          if (this.dialogueTextIndex >= DIALOGUE_TEXT_ARRAY.length) {
            this.scene.start('World');
            return;
          }
          this.dialogueAdvanceSound.play();
          setIsTyping(true);
          setDisplayedText('');
          setDisplayIndex(0);
          setDialogueText(DIALOGUE_TEXT_ARRAY[this.dialogueTextIndex]);
        }
      }

      return (
        <div className={styles.dialogueContainer}>
          <div className={styles.dialogueBox}>
            <div className={styles.dialogueBackground} />
            <div className={styles.dialoguePortrait}>
              <img src={'/reaper/assets/characters/rise.png'}></img>
            </div>
            <div className={styles.dialogueName}>{DIALOGUE_NAME}</div>
            <div onClick={onClick} className={styles.dialogueText}>
              <div>{displayedText}</div>
            </div>
          </div>
        </div>
      )
    }

    this.ui.create(<Ui/>, this);
  }
}
