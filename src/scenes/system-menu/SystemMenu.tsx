
import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';

import { Menu, MenuOption, SystemMenuStore, } from './systemMenuStore';
import { enemies } from '../../data/enemies';
import { Enemy } from '../../model/enemy';
import { SystemMenuView } from './SystemMenuView';



const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'SystemMenu',
};

export class SystemMenu extends Phaser.Scene {
  reactOverlay: ReactOverlay;
  
  systemMenuStore: SystemMenuStore;

  choiceSelectSound: Phaser.Sound.BaseSound;
  choiceDisabledSound: Phaser.Sound.BaseSound;

  locationName: string;
  musicKey: string;

  constructor() {
    super(sceneConfig);
  }


  init(data: { locationName, musicKey }): void {
    const playerSave: PlayerSave = this.registry.get('playerSave');    
    this.systemMenuStore = new SystemMenuStore(playerSave);
    this.choiceSelectSound = this.sound.add('choice-select');
    this.choiceDisabledSound = this.sound.add('stamina-depleted');

    this.locationName = data.locationName;
    this.musicKey = data.musicKey;
  }

  create(): void {
    this.reactOverlay.create(<SystemMenuView systemMenu={this}/>, this);
    this.systemMenuStore.pushMenu(this.getSystemMenu());
  }

  playChoiceSelectSound(): void {
    this.choiceSelectSound.play();
  }

  playChoiceDisabledSound(): void {
    this.choiceDisabledSound.play();
  }


  getSystemMenu(): Menu {
    const getDisplayedEnemies = (enemies: Enemy[], seenEnemies: SeenEnemy[]): Enemy[] => {
      const seenMap = new Map(seenEnemies.map(se => [se.enemyName, se.seenAt]));

      return enemies
        .filter(enemy => seenMap.has(enemy.name))
        .sort((a, b) => seenMap.get(b.name) - seenMap.get(a.name));
    }
    const enemyJournalMenuOptions: MenuOption[] = getDisplayedEnemies(enemies, this.systemMenuStore.playerSave.seenEnemies)
      .map(enemy => {
        return {
          display: () => <span>{enemy.name}</span>,
          execute: () => {
            this.systemMenuStore.setEnemyJournalContent(enemy);
          }
        }
      });
    const enemyJournalMenu: Menu = {
      onClose: () => this.systemMenuStore.setEnemyJournalContent(null),
      menuOptions: enemyJournalMenuOptions,
      isCursor: true,
      title: "Enemies"
    }
    

    const journalMenu: Menu = {
      menuOptions: [
        {
          display: () => <span>Enemies</span>,
          execute: () => {  
            this.systemMenuStore.pushMenu(enemyJournalMenu);
          }
        },
        {
          display: () => <span>Techniques</span>,
          execute: () => {  
            //
          }
        },
      ],
      title: "Journal",
    };

    const systemMenu: Menu = {
      menuOptions: [
        {
          display: () => <span>Journal</span>,
          execute: () => {  
            this.systemMenuStore.pushMenu(journalMenu);
          }
        },
        {
          display: () => <span>Exit</span>,
          execute: () => {  
            this.scene.stop('SystemMenu');
            this.scene.resume('World');
          }
        },
      ],
    }  

    return systemMenu;
  }

  popMenu = (): void => {
    this.playChoiceDisabledSound();
    this.systemMenuStore.popMenu();
  }
}
