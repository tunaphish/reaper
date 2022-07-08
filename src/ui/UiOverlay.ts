// could be singleton?
// factory method clears container first...
export default class UiOverlay {
  private container: Element; 

  constructor(child) {
    this.container = document.querySelector('#game > div');
    this.container.appendChild(child);
  }

  clearUi() {
    this.container.replaceChildren();
  }
}