import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import { CutsceneView } from './CutsceneView';
import { ExamplePage } from './ExamplePage';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Cutscene',
};

export class Cutscene extends Phaser.Scene {
  private reactOverlay: ReactOverlay;
  choiceSelectSound: Phaser.Sound.BaseSound;
  callingSceneKey: string;

  constructor() {
    super(sceneConfig);
  }

  init(data: { callingSceneKey: string }): void {  
    this.callingSceneKey = data.callingSceneKey;
  }

  create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');
    this.reactOverlay.create(<CutsceneView cutscene={this}><ExamplePage /></CutsceneView>, this);
  }

   endScene(): void {
    this.scene.resume(this.callingSceneKey);
    this.scene.stop();
  }
}
