import * as React from 'react';

import { Enemy } from '../../model/enemy';
import { isSameOption, Option, OptionType } from '../../model/option';
import { Allies, Ally } from '../../model/ally';
import { Folder } from '../../model/folder';
import { Action, } from '../../model/action';
import { TargetType } from '../../model/targetType';
import { JankenboThrow, resetCombatantBattleState, Status, toggleActiveSpell } from '../../model/combatant';
import { Combatant } from '../../model/combatant';
import { Item } from '../../model/item';
import { Spell } from '../../model/spell';
import { MenuOption } from '../../model/menuOption';

import * as Actions from '../../data/actions';
import * as Spells from '../../data/spells';

import UiOverlayPlugin from '../UiOverlayPlugin';
import { BattleView } from './BattleView';
import { BattleStore, MenuSelections } from './BattleStore';
import { healieBoi } from '../../data/enemies';
import { getRandomItem } from '../../model/random';
import { MenuContent } from '../../model/menuContent';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export interface DialogueTrigger {
  trigger: (enemies: Enemy[], allies: Allies) => boolean;
  scriptKeyName: string;
}

export type Executable = Action | Item | Spell;

const ATTACK_WINDOW_TIME_IN_MS = 500;

type DeferredAction = { executeAction: () => void, timeTilExecute: number }
export class Battle extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private music: Phaser.Sound.BaseSound;
  backgroundImageUrl: string;

  battleStore: BattleStore;

  private lastCalculation = 0;
  private battleStarted = false;

  // enemy menu navigation vars
  private timeSinceLastNavigation = 0;
  enemyNavigationQueue = [];

  // restriction vars
  firstActionTaken = false;
  splinterUsed = false;


  deferredActions: DeferredAction[] = [];

  constructor() {
    super(sceneConfig);
  }

  init(data: { enemies: Enemy[] }): void {
    this.battleStore = new BattleStore(data.enemies || [healieBoi], this.registry.get('allies'));
    this.backgroundImageUrl = '/reaper/assets/backgrounds/pikrepo.jpg';
    this.music = this.sound.add('knight', {
      loop: true,  
      volume: 0.5  
    });
    this.ui.create(<BattleView scene={this}/>, this);
    // this.music.play();
  }

  update(time: number, delta: number): void {
    if (!this.battleStarted) return;

    if (this.battleStore.allies.every((member) => member.status === Status.DEAD)) {
      this.music.stop();
      this.scene.manager.getScenes(false).forEach(scene => {
        this.scene.stop(scene.scene.key);  
      });
      this.scene.start('GameOver');
    }
    if (this.battleStore.enemies.every((enemy) => enemy.status === Status.DEAD)) {
      this.music.stop();
      this.scene.stop();
      this.registry.set('allies', this.battleStore.allies);
      this.scene.resume('World', { allies: this.battleStore.allies });
    }

    if (this.battleStore.allyMenuSelections.caster && 
      this.battleStore.allyMenuSelections.executable && 
      this.battleStore.allyMenuSelections.target &&
      this.battleStore.allyMenuSelections.spells === null
    ) {
      this.queueAction(this.battleStore.allyMenuSelections); 
    }

    this.battleStore.getCombatants().forEach(combatant => {
      if (combatant.status === Status.ATTACKING && combatant.timeInStateInMs > ATTACK_WINDOW_TIME_IN_MS) {
        combatant.status = Status.EXECUTING;
        this.execute(combatant);
      }
    })

    this.battleStore.tickStats(delta);
    this.battleStore.updateCombatantsState();
    if (this.battleStore.allyMenuSelections.caster && this.battleStore?.allyMenuSelections.caster.status === Status.DEAD) {
        this.battleStore.allyMenuSelections.setCaster(null);
        this.battleStore.allyMenuSelections.emptyMenu();
    }

    const CHARGE_MULTIPLIER_GAIN_PERSECOND_WHILE_CHARGING = 1;
    if (this.battleStore.allyMenuSelections.caster && this.battleStore.allyMenuSelections.caster.status === Status.CHARGING) {
      this.battleStore.allyMenuSelections.setChargeMultipler(this.battleStore.allyMenuSelections.chargeMultiplier + CHARGE_MULTIPLIER_GAIN_PERSECOND_WHILE_CHARGING * (delta/1000));
    }
    const ZANTETSUKEN_MULTIPLIER_LOSS_PERSECOND_WHILE_CHARGING = 1;
    if (this.battleStore.allyMenuSelections.caster && this.battleStore.allyMenuSelections.caster.activeSpells.find(isSameOption(Spells.ZANTETSUKEN))) {
      const zantetsukenMultiplier = Math.max(.5, this.battleStore.allyMenuSelections.zantetsukenMultiplier - (ZANTETSUKEN_MULTIPLIER_LOSS_PERSECOND_WHILE_CHARGING*(delta/1000)))
      this.battleStore.allyMenuSelections.setZantetsukenMultiplier(zantetsukenMultiplier);
    }

    this.deferredActions = this.deferredActions.map(({executeAction, timeTilExecute}) => {
      if (timeTilExecute - delta <= 0) {
        executeAction()
      }

      return {
        executeAction,
        timeTilExecute: timeTilExecute - delta,
      }
    }).filter(deferredAction => (deferredAction.timeTilExecute > 0));

    // enemy AI
    this.lastCalculation += delta;
    if (this.lastCalculation > 1000 && !this.battleStore.enemyMenuSelections.caster) {
      this.lastCalculation = 0;
      for (const enemy of this.battleStore.enemies.filter((enemy) => enemy.status === Status.NORMAL)) {
        for (const behavior of enemy.behaviors) {
          const probability = behavior.getProbability(enemy, this);
          if (Math.random() > probability) {
            this.battleStore.enemyMenuSelections.setCaster(enemy);
            this.battleStore.enemyMenuSelections.menus.push(enemy.folder);
            this.sound.play('choice-select');
            this.battleStore.enemyMenuSelections.setText(getRandomItem<string>(behavior.dialoguePool));
            this.enemyNavigationQueue = [...behavior.option, behavior.getTarget(this)];
          }
        }
      }
    }

    if (this.battleStore.enemyMenuSelections.caster) {
      if (this.enemyNavigationQueue.length === 0) {
        this.queueAction(this.battleStore.enemyMenuSelections);
        this.timeSinceLastNavigation = 0;
        this.battleStore.enemyCursorIdx = 0;
      } else if (this.timeSinceLastNavigation > 750) {
        const currentMenu: MenuContent = this.battleStore.enemyMenuSelections.menus[this.battleStore.enemyMenuSelections.menus.length - 1];
        const currentMenuOption: Option = (currentMenu as Folder).options[this.battleStore.enemyCursorIdx];
        if (this.enemyNavigationQueue[0].name === currentMenuOption.name) {
          this.selectOption((currentMenuOption as MenuOption), this.battleStore.enemyMenuSelections);
          this.battleStore.enemyCursorIdx = 0;
          this.enemyNavigationQueue.shift();
        } else {
          this.battleStore.setEnemyCursorIdx(this.battleStore.enemyCursorIdx+1);
          this.sound.play('choice-hover');
        }
        
        this.timeSinceLastNavigation = 0;
      } else {
        this.timeSinceLastNavigation += delta
      }
    }
  }

  queueAction(menuSelection: MenuSelections): void{
    // for (const member of this.battleStore.allies) {
    //   if (member.status === Status.ATTACKING) {
    //     this.battleStore.allyMenuSelections.caster.flow = Math.min(this.battleStore.allyMenuSelections.caster.maxMagic, this.battleStore.allyMenuSelections.caster.flow+25);
    //     member.flow = Math.min(member.maxMagic, member.flow+25);
    //     this.sound.play("smirk");
    //   }
    // }
    menuSelection.caster.status = Status.CASTING;
    menuSelection.caster.queuedOption = menuSelection.executable;
    menuSelection.caster.queuedTarget = menuSelection.target;
    menuSelection.caster.timeInStateInMs = 0;

    menuSelection.resetSelections();
  }

  setCasterCharging(): void {
    this.battleStore.allyMenuSelections.caster.status = Status.CHARGING;
  }

  setCasterNormal(): void {
    this.battleStore.allyMenuSelections.caster.status = Status.NORMAL;
  }

  execute(combatant: Combatant): void {
    if (combatant.queuedOption.type === OptionType.ITEM) {
      combatant.queuedOption.charges -= 1;
      combatant.queuedOption.execute(combatant.queuedTarget, combatant);
      this.sound.play(combatant.queuedOption.soundKeyName);
    }
    
    if (combatant.queuedOption.type === OptionType.ACTION) {
      combatant.stamina -= combatant.queuedOption.staminaCost;
      
      if (combatant.queuedOption.isRestricted(combatant.queuedTarget, combatant, this)) {
        resetCombatantBattleState(combatant);
        this.sound.play('stamina-depleted');
        return;
      }

      const actionModifier = combatant.activeSpells.reduce(
        (accumulatedActionModifier, spell) => { return spell.modifyAction(accumulatedActionModifier, this, combatant) },
        {
          targets: [combatant.queuedTarget],
          potency: combatant.queuedOption.potency,
          multiplier: 1,
        }
      )

      // Restrictions
      if (!this.firstActionTaken) this.firstActionTaken = true;
      if (combatant.queuedOption.name === Actions.splinter.name && !this.splinterUsed) this.splinterUsed = true;
      
      const potency = actionModifier.potency * actionModifier.multiplier;
      this.deferredActions = this.deferredActions.concat( 
        actionModifier.targets.map((target, index) => {
        const action = (combatant.queuedOption as Action)
        const executeAction = () => {
          action.execute(target, combatant, potency, this);
          this.sound.play(action.soundKeyName);
        }
        return {
          executeAction,
          timeTilExecute: index*100,
        }
      }));
    }
    
    if (combatant.queuedOption.type === OptionType.SPELL) {
      toggleActiveSpell(combatant, combatant.queuedOption);
      this.sound.play(combatant.queuedOption.soundKeyName);
    }
    
    resetCombatantBattleState(combatant);
  }

  setExecutable(executable: Executable): void {
    this.battleStore.allyMenuSelections.executable = executable;
  }

  setTarget(combatant: Enemy | Ally): void {
    this.battleStore.allyMenuSelections.setTarget(combatant);    
  }

  playSong(songKey: string): void {
    this.music = this.sound.add(songKey, { loop: true });
    this.music.play();
  }

  openInitialMenu(ally: Ally): void {
    const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED, Status.CASTING, Status.ATTACKING]
    if (CANNOT_OPEN_STATUS.includes(ally.status)) {
      this.sound.play('stamina-depleted');
      return;
    }

    if (ally.status === Status.BLOCKING) {
      ally.status = Status.NORMAL;
    }

    // reset spells
    this.battleStore.allyMenuSelections.zantetsukenMultiplier = 3.5;
    this.battleStore.allyMenuSelections.jankenboThrow = null;
    this.battleStore.allyMenuSelections.setChargeMultipler(1);
    this.battleStore.allyMenuSelections.setSpells(null);

    this.sound.play('choice-select');
    this.battleStore.allyMenuSelections.setCaster(ally);
    this.battleStore.allyMenuSelections.menus.push(ally.folder);
  }

  closeMenu(): void {
    const menuContent = this.battleStore.allyMenuSelections.menus.pop();
    if (menuContent && menuContent.name === Spells.CHARGE.name) {
      this.battleStore.allyMenuSelections.setChargeMultipler(1);
    }

    if (menuContent && menuContent.type !== OptionType.SPELL) {
      this.battleStore.allyMenuSelections.setExecutable(null); // hacky way of resetting action 
    }
    if (this.battleStore.allyMenuSelections.menus.length === 0) {
      this.battleStore.allyMenuSelections.setCaster(null); // hacky way of resetting selection if user clicks out
    }
    this.sound.play('dialogue-advance');
  }

  selectOption(option: MenuOption, menuSelection: MenuSelections): void {
    this.sound.play('choice-select');
    switch(option.type) {
      case OptionType.ITEM:
      case OptionType.ACTION:
      case OptionType.SPELL:
        const executable = option as Executable;
        menuSelection.setExecutable(executable);
        if (executable.targetType === TargetType.SELF) {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name + " Target", desc: 'Targets...', options: [menuSelection.caster]};
          menuSelection.menus.push(targetFolder);
        } else {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name + " Target", desc: 'Targets...', options: [...this.battleStore.allies, ...this.battleStore.enemies]};
          menuSelection.menus.push(targetFolder);
        }
        menuSelection.setText(executable.description);
        break;
      case OptionType.ENEMY:
      case OptionType.ALLY:
        const combatant = option;
        menuSelection.setTarget(combatant);
        menuSelection.setSpells(menuSelection.caster.activeSpells.filter(activeSpell => activeSpell.isMenuSpell)); 
        if (menuSelection.spells.length > 0) {
          menuSelection.menus.push(menuSelection.spells.shift());
        } else {
          menuSelection.setSpells(null);
        }
        break;
      case OptionType.FOLDER:
        const folder = option as Folder;
        menuSelection.menus.push(folder);
        break;
    }
  }

  startBattle(): void {
    this.battleStarted = true;
  }

  advanceSpell(): void {
    this.sound.play('choice-select');
    if (this.battleStore.allyMenuSelections.spells.length === 0) {
      this.battleStore.allyMenuSelections.spells = null;
      return;
    }
    this.battleStore.allyMenuSelections.menus.push(this.battleStore.allyMenuSelections.spells.shift());
  }

  setJankenboThrow(jankenboThrow: JankenboThrow): void {
    this.battleStore.allyMenuSelections.jankenboThrow = jankenboThrow;
  }
}
