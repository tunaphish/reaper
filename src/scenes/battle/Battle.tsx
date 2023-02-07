import { load } from 'js-yaml';
import { createElement } from '../../ui/jsxFactory';
import UiOverlayPlugin from '../../ui/UiOverlayPlugin';
import styles from './battle.module.css';
import { Enemy, Eji } from '../../entities/enemy';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export class Battle extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private lineIndex;

  private scripts: any;
  private script: string[];
  private dialogueAdvanceSound: Phaser.Sound.BaseSound;
  private music: Phaser.Sound.BaseSound;

  private animeText: any;
  private parallax: any;

  private menu: Element

  private actorMessage: any;
  private actorName: any;
  private actorDialogue: any;

  private choices: any;

  private foreground: string = 'url(https://raw.githubusercontent.com/oscicen/oscicen.github.io/master/img/depth-3.png)';
  private middleground: string = 'url("/reaper/assets/characters/eji.png")';
  private background: string = 'url("/reaper/assets/backgrounds/pikrepo.jpg")'

  private isAnimatingText: boolean = false;


  // new things related to battle
  private isBattle: boolean = false;
  private lastCalculation = 0;
  private enemy: Enemy;
  private enemyHealth: any;
  private enemyStamina: any;


  constructor() {
    super(sceneConfig);
  }

  public init(data): void {
    if (!data.scriptFileKey) {
      data = {
        scriptFileKey: 'mission-7',
        scriptKey: 'start',
      }
    }
    const scriptFile = this.cache.text.get(data.scriptFileKey);
  
    this.scripts = load(scriptFile);
    this.script = this.scripts[data.scriptKey];
    this.lineIndex = -1;

    // load enemy
    this.enemy = Eji;
  }

  public create(): void {
    this.dialogueAdvanceSound = this.sound.add('dialogue-advance');

    this.enemyHealth = <div>❤️ {this.enemy.health}/{this.enemy.maxHealth}</div>;
    this.enemyStamina = <div>☀️ {this.enemy.stamina}/{this.enemy.maxStamina}</div>;
    this.animeText = <p className={styles.animeText}>Test Text</p>
    
    this.parallax = (
      <div className={styles.parallax} id="parallax">
          <div className={styles.tvContainer}>
          <div className={styles.staticEffect}>
            <div className={styles.oldTvContent}>
              <div className={styles.enemyUi}>
                  { this.enemyHealth }
                  { this.enemyStamina }
              </div>
              {this.animeText}
            </div>
          </div>
        </div>
      </div>
    );


    this.actorName = <div></div>
    this.actorDialogue = <p className={styles.actorDialogue}></p>
    this.actorMessage = (
      <div className={styles.actorMessage}>
        {this.actorName}
        {this.actorDialogue}
      </div>
    )
    this.choices = <div></div>;

    const attackButton: Element = <div className={styles.menuButton}>Attack</div>;
    const magicButton: Element = <div className={styles.menuButton}>Magic</div>;
    const itemButton: Element = <div className={styles.menuButton}>Item</div>;
    const runButton: Element = <div className={styles.menuButton}>Run</div>;

    const battleMenu = (
      <div className={styles.battleOptions}>
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


    this.menu = <div className={styles.menu}>{battleMenu}</div>;

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
          Elise
          <div>❤️ 100/100</div>
          <div>☀️ 100/200</div>
        </div>
      </div>
    );

    const container: Element = (
      <div className={styles.container}>
        {this.parallax}
        {this.menu}
        {partyBar}
      </div>
    );

    this.ui.create(container, this);
    
    const _w = window.innerWidth / 2;
    const _h = window.innerHeight / 2;
    this.parallax.addEventListener('mousemove', (e: MouseEvent) => {
      const _mouseX = e.clientX;
      const _mouseY = e.clientY;
      const _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`; // background
      const _depth2 = `${50 - (_mouseX - _w) * 0.03}% ${50 - (_mouseY - _h) * 0.03}%`; // portrait
      const _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`; // foreground

      const x = `${_depth3}, ${_depth2}, ${_depth1}`;
      this.parallax.style.backgroundPosition = x;
    });

    // parallax effect using accelerometer
    if (window.DeviceMotionEvent !== undefined) {
      console.log("accelerometer found");
      window.addEventListener('deviceorientation', (e) => {
        const gamma = Math.min(30, Math.max(-30, e.gamma));
        const beta = Math.min(120, Math.max(60, e.beta));

        const _depth1 = `${50 - (gamma - 0) * 0.1}% ${50 - (beta - 90) * 0.1}%`; // background
        const _depth2 = `${50 - (gamma - 0) * 0.3}% ${50 - (beta - 90) * 0.3}%`; // portrait
        const _depth3 = `${50 - (gamma - 0) * 0.6}% ${50 - (beta - 90) * 0.6}%`; // foreground
        
        const x = `${_depth3}, ${_depth2}, ${_depth1}`;
    
        this.parallax.style.backgroundPosition = x;
      });
    }

    // battle event listners
    attackButton.addEventListener('click', () => {
      // decrement stamina
      this.enemy.health -= 25;
      this.enemyHealth.innerText = `❤️ ${this.enemy.health}/${this.enemy.maxHealth}`;
    })


    this.actorDialogue.addEventListener('animationend', () => {
      this.isAnimatingText = false;
    });

    this.animeText.addEventListener('animationend', () => {
      this.isAnimatingText = false;
    })

    this.updateParallax();
    // this.actorMessage.addEventListener('click', () => {
    //   this.advanceLine();
    // })

    //this.advanceLine();
    this.parallax.style.backgroundPosition = '50% 50%, 50% 50%, 50% 50%';
  }

  update(time, delta): void {
    // check if battle is over
    // all hero health is gone
    // all enemy health is gone
    if (this.enemy.health < 0) {
      console.log('weiner');
    }

    this.lastCalculation += delta;
    
    if (this.lastCalculation > 2000) {
      this.lastCalculation = 0;
      console.log('we calculating')

      // update health
      // update stamina
      this.enemy.stamina = Math.min(this.enemy.maxStamina, this.enemy.stamina + 25);
      this.enemyStamina.innerText = `☀️ ${this.enemy.stamina}/${this.enemy.maxStamina}`;
      this.selectAction(this.enemy);
    }
  }

  selectAction(enemy: Enemy): void {
    const filteredBehaviors = enemy.behaviors.filter(behavior => {
      if (enemy.stamina === enemy.maxStamina && behavior.action.name === 'Idle') return false;
      if (enemy.stamina < behavior.action.staminaCost) return false;
      return true;
    });

    const summedWeights = filteredBehaviors.reduce((runningSum, behavior) => runningSum + behavior.weight, 0);
    const getRandomInt = (max: number) => Math.floor(Math.random() * max);
    const randomInt = getRandomInt(summedWeights);

    let runningSum = 0;
    const selectedBehavior = filteredBehaviors.find(behavior => {
      runningSum += behavior.weight;
      return runningSum > randomInt;
    })
    if (!selectedBehavior) return;

    //side effects
    this.enemy.stamina -= selectedBehavior.action.staminaCost;
    selectedBehavior.action.executeAbility();
    console.table(this.enemy);
  }

  advanceLine(): void {
    if (this.isAnimatingText) {
      this.animeText.classList?.remove(styles.typeAnimation);
      this.actorDialogue.classList?.remove(styles.typeAnimation);
      this.isAnimatingText = false;
      return;
    }

    this.lineIndex++;
    if (this.lineIndex >= this.script.length) {
      this.music?.stop();
      this.scene.start('DialogueList');
      return;
    }

    const line = this.script[this.lineIndex];
    const [keys, value] = line.split(' | ');
    const [action, actor, adjective] = keys.split(' ');

    switch (action) {
      case 'show':
        this.background = `url("/reaper/assets/backgrounds/${actor}.jpg")`;
        this.parallax.style.backgroundPosition = '50% 50%, 50% 50%, 50% 50%';
        this.updateParallax();
        this.advanceLine();
        break;
      case 'enter':
        const emotion = adjective ? `-${adjective}` : '';
        this.middleground = `url("/reaper/assets/characters/${actor}${emotion}.png")`;
        this.updateParallax();
        this.advanceLine();
        break;
      case 'says': 
        this.menu.replaceChildren(this.actorMessage);
        this.dialogueAdvanceSound.play();
        this.actorName.innerText = actor;
        this.actorDialogue.innerText = value;
        //work around to trigger CSS animation
        this.isAnimatingText = true;
        this.actorDialogue.classList.remove(styles.typeAnimation);
        this.actorDialogue.offsetWidth;
        this.actorDialogue.classList.add(styles.typeAnimation);
        break;
      case 'announce': 
        this.dialogueAdvanceSound.play();
        this.actorName.innerText = '';
        this.actorDialogue.innerText = value;
        //work around to trigger CSS animation
        this.isAnimatingText = true;
        this.actorDialogue.classList.remove(styles.typeAnimation);
        this.actorDialogue.offsetWidth;
        this.actorDialogue.classList.add(styles.typeAnimation);
        break;
      case 'display':
        this.dialogueAdvanceSound.play();
        this.animeText.innerText = value;
        //work around to trigger CSS animation
        this.isAnimatingText = true;
        this.animeText.classList.remove(styles.typeAnimation);
        this.animeText.offsetWidth;
        this.animeText.classList.add(styles.typeAnimation);
        break;
      case 'play':
        this.playSong(actor);
        this.advanceLine();
        break;
      case 'choose':
        this.menu.replaceChildren(this.choices);
        let options = value.split(' ~ ').map(pairs => {
          const [newScriptKey, displayText] = pairs.split(' * ');
          return { newScriptKey, displayText };
        });
        options.forEach((option) => {
          const optionDiv = <div className={styles.optionDiv}>{option.displayText}</div>;
          this.choices.appendChild(optionDiv);
          optionDiv.addEventListener('click', () => {
            this.dialogueAdvanceSound.play();
            this.script = this.scripts[option.newScriptKey];
            this.lineIndex = -1;
            this.actorDialogue.innerText = ''
            this.actorName.innerText = ''
            this.menu.replaceChildren(this.actorMessage);
            this.advanceLine();
          });
        });
        
        break;
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

// update display
// just console log enemy and party status