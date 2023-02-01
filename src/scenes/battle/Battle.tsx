import { load } from 'js-yaml';
import { createElement } from '../../ui/jsxFactory';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';
import { MenuButton } from '../../util/MenuButton';
import styles from './battle.module.css';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export class Battle extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private lineIndex;
  private script: string[];
  private dialogueAdvanceSound: Phaser.Sound.BaseSound;
  private music: Phaser.Sound.BaseSound;

  private animeText: any;
  private parallax: any;

  private actorMessage: any;
  private actorName: any;
  private actorDialogue: any;

  private foreground: string = 'url(https://raw.githubusercontent.com/oscicen/oscicen.github.io/master/img/depth-3.png)';
  private middleground: string = 'url("/assets/characters/eji.png")';
  private background: string = 'url("/assets/backgrounds/pikrepo.jpg")'

  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    if (!data.scriptFileKey) {
      data = {
        scriptFileKey: 'final-battle',
        scriptKey: 'start',
      }
    }
    const scriptFile = this.cache.text.get(data.scriptFileKey);
  
    const parsedYaml = load(scriptFile);
    this.script = parsedYaml[data.scriptKey];
    this.lineIndex = -1;
  }

  public create(): void {
    this.dialogueAdvanceSound = this.sound.add('dialogue-advance');
    this.animeText = <p className={styles.animeText}></p>
    this.parallax = (
      <div className={styles.parallax} id="parallax">
        {this.animeText}
      </div>
    );

    this.actorName = <div></div>
    this.actorDialogue = <p className={styles.actorDialogue}></p>
    const actorMessage: Element = (
      <div className={styles.actorMessage}>
        {this.actorName}
        {this.actorDialogue}
      </div>
    )

    const menu: Element = <div className={styles.menu}>{actorMessage}</div>;

    const partyBar: Element = (
      <div className={styles.partyBar}>
        <div className={styles.characterCell}>
          Eji
          <div>❤️ 100/100</div>
          <div>☀️ 100/100</div>
        </div>
        <div className={styles.characterCell}>
          Keshi
          <div>❤️ 100/100</div>
          <div>☀️ 100/100</div>
        </div>
        <div className={styles.characterCell}>
          Girl
          <div>❤️ 100/100</div>
          <div>☀️ 100/100</div>
        </div>
      </div>
    );

    const container: Element = (
      <div className={styles.container}>
        {this.parallax}
        {menu}
        {partyBar}
      </div>
    );

    this.ui.create(container, this);

    this.parallax.addEventListener('mousemove', (e: MouseEvent) => {
      const _w = window.innerWidth / 2;
      const _h = window.innerHeight / 2;
      const _mouseX = e.clientX;
      const _mouseY = e.clientY;
      const _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`; // background
      const _depth2 = `${50 - (_mouseX - _w) * 0.03}% ${50 - (_mouseY - _h) * 0.03}%`; // portrait
      const _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`; // foreground
      const x = `${_depth3}, ${_depth2}, ${_depth1}`;
      this.parallax.style.backgroundPosition = x;
    });

    this.updateParallax();
 

    menu.addEventListener('click', () => {
      this.advanceLine();
    })

    this.advanceLine();
  }

  advanceLine(): void {
    this.lineIndex++;
    if (this.lineIndex >= this.script.length) {
      this.music.stop();
      this.scene.start('DialogueList');
      return;
    }

    this.actorDialogue.classList.remove(styles.typeAnimation);
    this.animeText.classList.remove(styles.typeAnimation);

    const line = this.script[this.lineIndex];
    const [keys, value] = line.split('|');
    const [action, actor, adjective] = keys.split(' ');

    switch (action) {
      case 'show':
        this.background = `url("/assets/backgrounds/${actor}.jpg")`;;
        this.updateParallax();
        this.advanceLine();
        break;
      case 'enter':
        console.log(adjective)
        const emotion = adjective ? `-${adjective}` : '';
        this.middleground = `url("/assets/characters/${actor}${emotion}.png")`;
        this.updateParallax();
        this.advanceLine();
        break;
      case 'says': 
        this.dialogueAdvanceSound.play();
        this.actorName.innerText = actor;
        this.actorDialogue.innerText = value;
        //work around to trigger CSS animation
        // this.actorDialogue.classList.remove(styles.typeAnimation);
        // this.actorDialogue.offsetWidth;
        // this.actorDialogue.classList.add(styles.typeAnimation);
        break;
      case 'announce': 
        this.dialogueAdvanceSound.play();
        this.actorName.innerText = '';
        this.actorDialogue.innerText = value;
        break;
      case 'display':
        this.dialogueAdvanceSound.play();
        this.animeText.innerText = value;
        //work around to trigger CSS animation
        // this.animeText.classList.remove(styles.typeAnimation);
        // this.animeText.offsetWidth;
        // this.animeText.classList.add(styles.typeAnimation);
        break;
      case 'play':
        this.playSong(actor);
        this.advanceLine();
        break;
      case 'choose':
        //new script 
      default:
        this.advanceLine();
    }
  }

  playSong(songKey): void {
    this.music = this.sound.add(songKey, { loop: true })
    this.music.play();
  }

  updateParallax(): void {
    const newBackgroundImage = `${this.foreground}, ${this.middleground}, ${this.background}`;
    this.parallax.style.backgroundImage = newBackgroundImage;
  }
}
