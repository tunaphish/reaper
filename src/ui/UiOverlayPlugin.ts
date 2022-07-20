// could be singleton?
// factory method clears container first...
export default class UiOverlayPlugin extends Phaser.Plugins.BasePlugin {
  private container: Element; 

  /**
   *
   */
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
  }

  create(child, scene: Phaser.Scene) {
    this.container = document.querySelector('#game > div');
    this.container.appendChild(child);

    var eventEmitter = scene.events;
    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroy, this);
  }

  //  Called when a Scene shuts down, it may then come back again later
  // (which will invoke the 'start' event) but should be considered dormant.
  shutdown() { 
    this.clearUi();
  }

  // called when a Scene is destroyed by the Scene Manager
  destroy() {
    this.shutdown();
  }

  clearUi() {
    this.container.replaceChildren();
  }
}