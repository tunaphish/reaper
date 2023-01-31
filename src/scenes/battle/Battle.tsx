import { Scene } from 'phaser';
import { createElement } from '../../ui/jsxFactory';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';
import styles from './battle.module.css';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

class MenuButton {
  ui: Element;
  /**
   * Returns Dom Element with Sound
   */
  constructor(scene: Scene, element: Element) {
    const selectSound = scene.sound.add('choice-select');
    const hoverSound = scene.sound.add('choice-hover');

    element.addEventListener('click', () => {
      selectSound.play();
      console.log('lettuce start the settings');
    });

    // element.addEventListener('mouseover', () => {
    //   hoverSound.play();
    // });

    this.ui = element;
  }
}

export class Battle extends Phaser.Scene {
  private ui: UiOverlayPlugin;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const attackButton: Element = new MenuButton(this, <div className={styles.menuButton}>Attack</div>).ui;
    const magicButton: Element = new MenuButton(this, <div className={styles.menuButton}>Magic</div>).ui;
    const itemButton: Element = new MenuButton(this, <div className={styles.menuButton}>Item</div>).ui;
    const runButton: Element = new MenuButton(this, <div className={styles.menuButton}>Run</div>).ui;
    const animeText: Element = <p className={styles.animeText}>Senpai, I love you!</p>;
    const parallax: any = (
      <div className={styles.parallax} id="parallax">
        {animeText}
      </div>
    );

    const battleOptions: Element = (
      <div className="battleOptions">
        <div className={styles.menuRow}>
          {attackButton}
          {magicButton}
        </div>
        <div className={styles.menuRow}>
          {itemButton}
          {runButton}
        </div>
      </div>
    );

    const container: Element = (
      <div className={styles.container}>
        {parallax}
        <div className={styles.menu}>
          {battleOptions}
        </div>
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
      </div>
    );

    this.ui.create(container, this);

    parallax.addEventListener('mousemove', (e: MouseEvent) => {
      console.log(e);
      const _w = window.innerWidth / 2;
      const _h = window.innerHeight / 2;
      const _mouseX = e.clientX;
      const _mouseY = e.clientY;
      const _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`;
      const _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`;
      const _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`;
      const x = `${_depth3}, ${_depth2}, ${_depth1}`;
      console.log(x);
      parallax.style.backgroundPosition = x;
    });
  }
}
