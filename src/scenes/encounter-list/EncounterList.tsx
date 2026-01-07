import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import classNames from './encounterlist.module.css';
import * as spreads from '../../data/spreads/example'

const ALL_SPREADS = Object.values(spreads)

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'EncounterList',
};

const Ui = (props: { encounterList: EncounterList }): React.ReactElement => {
  const encounterLinks = ALL_SPREADS.map((spread) => {
    const onClickSceneListItem = () => {
      props.encounterList.choiceSelectSound.play();
      props.encounterList.scene.start('Encounter', { spread });
    };
    return <div key={spread.id} className={classNames.scriptButton} onClick={() => onClickSceneListItem()}>- {spread.id}</div>;
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
