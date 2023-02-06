import { Scene } from "phaser";
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
