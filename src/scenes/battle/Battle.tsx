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

  private animeText: any;
  private parallax: any;

  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    if (!data.scriptFileKey) return;
    const scriptFile = this.cache.text.get(data.scriptFileKey);
    const parsedYaml = load(scriptFile);
    this.script = parsedYaml[data.scriptKey];
    this.lineIndex = -1;
    console.log(this.script);
  }

  public create(): void {
    this.dialogueAdvanceSound = this.sound.add('dialogue-advance');
    this.animeText = <p className={styles.animeText}>any</p>
    this.parallax = (
      <div className={styles.parallax} id="parallax">
        {this.animeText}
      </div>
    );

    const dialogAdvancer: Element = <div>Advance Dialogue</div>;

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
        <div className={styles.menu}>{dialogAdvancer}</div>
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

    dialogAdvancer.addEventListener('click', () => {
      this.advanceLine();
    })

    this.advanceLine();
  }

  advanceLine(): void {
    // if animation is playing then jump to the end

    this.lineIndex++;
    if (this.lineIndex >= this.script.length) return;
    const line = this.script[this.lineIndex];
    const [keys, value] = line.split('|');
    const [action, actor] = keys.split(' ');

    switch (action) {
      case 'show':
        this.advanceLine();
        break;
      case 'says':
        this.dialogueAdvanceSound.play();
        this.animeText.innerText = value;
        //work around to trigger CSS animation
        this.animeText.classList.remove(styles.typeAnimation);
        this.animeText.offsetWidth;
        this.animeText.classList.add(styles.typeAnimation);
        console.log(this.animeText.classList);
        break;
      case 'play':
        this.playSong(actor);
        this.advanceLine();
        break;
      default:
        this.advanceLine();
    }
  }

  playSong(songKey) {
    this.sound.add(songKey, { loop: true }).play();
  }
}
