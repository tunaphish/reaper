import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import classNames from './encounterlist.module.css';
import { TOP_LEVEL_SPREADS } from '../../data/encounters/example';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'EncounterList',
};

const Ui = (props: { encounterList: EncounterList }): React.ReactElement => {
  const encounterLinks = TOP_LEVEL_SPREADS.map((encounter) => {
    const onClickSceneListItem = () => {
      props.encounterList.scene.pause();
      props.encounterList.scene.start('Encounter', { encounter, callingSceneKey: sceneConfig.key });
    };
    return <div key={encounter.id} className={classNames.scriptButton} onClick={() => onClickSceneListItem()}>- {encounter.id}</div>;
  });

  return <div className={classNames.container}>{encounterLinks}</div>

};

export class EncounterList extends Phaser.Scene {
  private reactOverlay: ReactOverlay;
  choiceSelectSound: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.choiceSelectSound = this.sound.add('choice-select');
    this.reactOverlay.create(<Ui encounterList={this}/>, this);
  }
}
