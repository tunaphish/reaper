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
    this.uiMap.set(scene.scene.key, child);
    this.root.render(child);
    const eventEmitter = scene.events;
    eventEmitter.on('pause', this.pause, this);
    eventEmitter.on('resume', this.resume, this);
    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroyScene, this);
  }

  pause(system: Phaser.Scenes.Systems, data): void {
    // this.uiMap.set(system.scenePlugin.key, child);
  }

  resume(system: Phaser.Scenes.Systems): void {
    const element = this.uiMap.get(system.scenePlugin.key);
    this.root.render(element);
  }

  shutdown(system: Phaser.Scenes.Systems): void {
    this.clearUi(system.scenePlugin.key);
  }

  destroyScene(system: Phaser.Scenes.Systems): void {
    this.clearUi(system.scenePlugin.key);
  }

  private clearUi(key: string) {
    this.uiMap.delete(key);
    this.root.render(<></>);
  }
}