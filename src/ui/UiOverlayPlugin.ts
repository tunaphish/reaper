// Plugin is a singleton (when applied globally?)
export default class UiOverlayPlugin extends Phaser.Plugins.BasePlugin {
  private container: Element;
  private uiMap: Map<string, Element> = new Map();
  /**
   *
   */
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
  }

  create(child, scene: Phaser.Scene) {
    this.container = document.querySelector('#game > div');
    this.container.appendChild(child);

    this.uiMap.set(scene.scene.key, child);

    const eventEmitter = scene.events;
    eventEmitter.on('pause', this.pause, this);
    eventEmitter.on('resume', this.resume, this);
    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroyScene, this);
  }

  pause(system: Phaser.Scenes.Systems) {
    console.log('pause: ' + system.scenePlugin.key);
    const element = this.uiMap.get(system.scenePlugin.key);
    if (element) {
      element['style'].display = 'none';
    }
  }

  resume(system: Phaser.Scenes.Systems) {
    console.log('resume: ' + system.scenePlugin.key);
    const element = this.uiMap.get(system.scenePlugin.key);
    if (element) {
      element['style'].display = 'block';
    }
  }

  shutdown(system: Phaser.Scenes.Systems) {
    console.log('shutdown: ' + system.scenePlugin.key);
    this.clearUi(system.scenePlugin.key);
  }

  destroyScene(system: Phaser.Scenes.Systems) {
    console.log('destroy: ' + system.scenePlugin.key);
    this.clearUi(system.scenePlugin.key);
  }

  private clearUi(key: string) {
    const element = this.uiMap.get(key);
    if (!element) return;
    try {
      this.container.removeChild(element);
    } catch (error) {
      console.log(error);
    }
    this.uiMap.delete(key);
  }
}
