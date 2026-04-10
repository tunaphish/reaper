import { Plugins } from "phaser";
import * as React from 'react';
import { createRoot, Root } from "react-dom/client";

export default class ReactOverlay extends Plugins.BasePlugin {
  private root: Root;
  private uiMap: Map<string, React.ReactElement> = new Map();

  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);
  }

  init(): void {
    const container = this.game.domContainer;

    if (!container) {
      return console.error(
        "this plugins requires you have `dom: { createContainer: true }` in your game config",
      );
    }

    this.root = createRoot(container);
    this.root.render(<></>);
  }

  create(child: React.ReactElement, scene: Phaser.Scene): void {
    console.log('create: ' + scene.scene.key);
    this.uiMap.set(scene.scene.key, child);
    this.root.render(child);
    const eventEmitter = scene.events;
    eventEmitter.on('pause', this.pause, this);
    eventEmitter.on('resume', this.resume, this);
    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroyScene, this);
  }

  pause(): void {
    // this.uiMap.set(system.scenePlugin.key, child);
  }

  resume(system: Phaser.Scenes.Systems): void {
    console.log('resume: ' + system.scenePlugin.key);

    const element = this.uiMap.get(system.scenePlugin.key);

    this.root.render(element);
  }

  shutdown(system: Phaser.Scenes.Systems): void {
    console.log('shutdown: ' + system.scenePlugin.key);
    // shutdown is run during pause... do NOT clear UI
    // this.clearUi(system.scenePlugin.key);
  }

  destroyScene(system: Phaser.Scenes.Systems): void {
    console.log('destroy: ' + system.scenePlugin.key);
    this.clearUi(system.scenePlugin.key);
  }

  private clearUi(key: string) {
    this.uiMap.delete(key);
    this.root.render(<></>);
  }
}