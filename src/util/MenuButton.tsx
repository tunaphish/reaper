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
    });

    // element.addEventListener('mouseover', () => {
    //   hoverSound.play();
    // });

    this.ui = element;
  }
}

export { MenuButton };

    // const attackButton: Element = new MenuButton(this, <div className={styles.menuButton}>Attack</div>).ui;
    // const magicButton: Element = new MenuButton(this, <div className={styles.menuButton}>Magic</div>).ui;
    // const itemButton: Element = new MenuButton(this, <div className={styles.menuButton}>Item</div>).ui;
    // const runButton: Element = new MenuButton(this, <div className={styles.menuButton}>Run</div>).ui;
    // const battleOptions: Element = (
    //   <div className="battleOptions">
    //     <div className={styles.menuRow}>
    //       {attackButton}
    //       {magicButton}
    //     </div>
    //     <div className={styles.menuRow}>
    //       {itemButton}
    //       {runButton}
    //     </div>
    //   </div>
    // );