import * as React from 'react';

import { Enemy } from '../../model/enemy';
import { isSameOption, Option, OptionType } from '../../model/option';
import { Allies, Ally } from '../../model/ally';
import { Folder } from '../../model/folder';
import { Action, } from '../../model/action';
import { TargetType } from '../../model/targetType';
import { JankenboThrow, resetCombatantBattleState, Status, toggleActiveSpell, updateDamage } from '../../model/combatant';
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
import { Soul } from '../../model/soul';
import { ALL_SOULS } from '../../data/souls';
import * as Souls from '../../data/souls';
import { toJS } from 'mobx';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export interface DialogueTrigger {
  trigger: (enemies: Enemy[], allies: Allies) => boolean;
  scriptKeyName: string;
}

export type Executable = Action | Item | Spell | Soul;

type DeferredAction = { timeTilExecute: number, action: Action, target: Combatant, caster: Combatant, potency: number }
export class Battle extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private music: Phaser.Sound.BaseSound;
  backgroundImageUrl: string;

  battleStore: BattleStore;
  souls: Soul[];

  private lastCalculation = 0;
  private battleStarted = false;

  // enemy menu navigation vars
  private timeSinceLastNavigation = 0;
  enemyNavigationQueue = [];

  // restriction vars
  firstActionTaken = false;
  splinterUsed = false;
  saintResurrectionUsed = false;


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
    this.souls = ALL_SOULS;
    this.ui.create(<BattleView scene={this}/>, this);
  }

  update(time: number, delta: number): void {
    if (!this.battleStarted) return;
    this.battleStore.tickStats(delta);
    this.battleStore.updateCombatantsState();
    this.checkBattleEndConditions();
    this.queueAllyActions();    

    // this.selectEnemyBehaviorAndSetEnemyCaster(delta);
    // this.navigateEnemyMenu(delta);
    this.executeCombatantActions();
    this.resetDeadAllyCasterMenu();
    this.resurrectSaintOncePerBattle();
    
    this.modifyCasterMultiplier(delta);
    this.executeDeferredActions(delta);
  }

  resurrectSaintOncePerBattle(): void {
    if (this.saintResurrectionUsed || !Souls.cleric.owner) return;
    const clericSoulOwner = this.battleStore.allies.find(ally => ally.name === Souls.cleric.owner.name);
    if (clericSoulOwner.status !== Status.DEAD) return;
    clericSoulOwner.health = clericSoulOwner.maxHealth;
    this.sound.play('saint-resurrect');
    this.saintResurrectionUsed = true;  
  }

  modifyCasterMultiplier(delta: number): void {
    const CHARGE_MULTIPLIER_GAIN_PERSECOND_WHILE_CHARGING = 1;
    if (this.battleStore.allyMenuSelections.caster && this.battleStore.allyMenuSelections.caster.status === Status.CHARGING) {
      this.battleStore.allyMenuSelections.setChargeMultipler(this.battleStore.allyMenuSelections.chargeMultiplier + CHARGE_MULTIPLIER_GAIN_PERSECOND_WHILE_CHARGING * (delta/1000));
    }
    const ZANTETSUKEN_MULTIPLIER_LOSS_PERSECOND_WHILE_CHARGING = 1;
    if (this.battleStore.allyMenuSelections.caster && this.battleStore.allyMenuSelections.caster.activeSpells.find(isSameOption(Spells.ZANTETSUKEN))) {
      const zantetsukenMultiplier = Math.max(.5, this.battleStore.allyMenuSelections.zantetsukenMultiplier - (ZANTETSUKEN_MULTIPLIER_LOSS_PERSECOND_WHILE_CHARGING*(delta/1000)))
      this.battleStore.allyMenuSelections.setZantetsukenMultiplier(zantetsukenMultiplier);
    }
  }

  resetDeadAllyCasterMenu(): void {
    if (this.battleStore.allyMenuSelections.caster && this.battleStore?.allyMenuSelections.caster.status === Status.DEAD) {
      this.battleStore.allyMenuSelections.setCaster(null);
      this.battleStore.allyMenuSelections.emptyMenu();
    }
  }

  checkBattleEndConditions(): void {
    if (this.battleStore.allies.every((member) => member.status === Status.DEAD)) {
      this.music.stop();
      this.scene.manager.getScenes(false).forEach(scene => this.scene.stop(scene.scene.key));
      this.scene.start('GameOver');
      return;
    }
    if (this.battleStore.enemies.every((enemy) => enemy.status === Status.DEAD)) {
      this.music.stop();
      this.scene.stop();
      this.battleStore.allies.forEach((ally) => ally.health = Math.ceil(ally.health));
      this.registry.set('allies', this.battleStore.allies);
      this.scene.resume('World', { allies: this.battleStore.allies });
    }
  }

  queueAllyActions(): void {
    if (this.battleStore.allyMenuSelections.caster && 
      this.battleStore.allyMenuSelections.executable && 
      this.battleStore.allyMenuSelections.target &&
      this.battleStore.allyMenuSelections.spells === null
    ) {
      this.queueAction(this.battleStore.allyMenuSelections); 
    }
  }

  executeCombatantActions(): void {
    this.battleStore.getCombatants()
                    .filter(combatant => combatant.status === Status.CASTING && combatant.timeInStateInMs > combatant.queuedOption.castTimeInMs) 
                    .forEach(combatant => this.execute(combatant));
  }

  selectEnemyBehaviorAndSetEnemyCaster(delta: number): void {
    this.lastCalculation += delta;
    if (this.lastCalculation < 1000 || this.battleStore.enemyMenuSelections.caster) {
      return;
    }

    this.lastCalculation = 0;
    this.battleStore.enemies
      .filter((enemy) => enemy.status === Status.NORMAL)
      .forEach(enemy => {
        const selectedBehavior = enemy.behaviors.find(behavior => Math.random() > behavior.getProbability(enemy, this));
        // bug with multiple enemies
        if (!selectedBehavior) return;
        this.battleStore.enemyMenuSelections.setCaster(enemy);
        this.battleStore.enemyMenuSelections.menus.push(enemy.folder);
        this.sound.play('choice-select');
        this.battleStore.enemyMenuSelections.setText(getRandomItem<string>(selectedBehavior.dialoguePool));
        this.enemyNavigationQueue = [...selectedBehavior.option, selectedBehavior.getTarget(this)];
        return;
      });
  }

  navigateEnemyMenu(delta: number): void {
    if (!this.battleStore.enemyMenuSelections.caster) return;

    if (this.enemyNavigationQueue.length === 0) {
      this.queueAction(this.battleStore.enemyMenuSelections);
      this.timeSinceLastNavigation = 0;
      this.battleStore.enemyCursorIdx = 0;
      return;
    } 

    this.timeSinceLastNavigation += delta;
    if (this.timeSinceLastNavigation < 750) {
      return;
    } 

    this.timeSinceLastNavigation = 0;
    const currentMenu: MenuContent = this.battleStore.enemyMenuSelections.menus[this.battleStore.enemyMenuSelections.menus.length - 1];
    const currentMenuOption: Option = (currentMenu as Folder).options[this.battleStore.enemyCursorIdx];
    if (this.enemyNavigationQueue[0].name === currentMenuOption.name) {
      this.selectOption((currentMenuOption as MenuOption), this.battleStore.enemyMenuSelections);
      this.battleStore.enemyCursorIdx = 0;
      this.enemyNavigationQueue.shift();
      return;
    } 

    this.battleStore.setEnemyCursorIdx(this.battleStore.enemyCursorIdx+1);
    this.sound.play('choice-hover');
  }

  executeDeferredActions(delta: number): void {
    this.deferredActions = this.deferredActions.map(({timeTilExecute, action, target, caster, potency}) => {
      if (timeTilExecute - delta <= 0) {
        action.execute(target, caster, potency, this);
        this.sound.play(action.soundKeyName);
      }

      return {
        timeTilExecute: timeTilExecute - delta,
        target,
        action, 
        caster,
        potency
      }
    }).filter(deferredAction => deferredAction.timeTilExecute > 0);
  }

  queueAction(menuSelection: MenuSelections): void{
    menuSelection.caster.status = Status.CASTING;
    menuSelection.caster.queuedOption = menuSelection.executable;
    menuSelection.caster.queuedTarget = menuSelection.target;
    menuSelection.caster.timeInStateInMs = 0;

    menuSelection.resetSelections();
  }

  setCasterStatus(status: Status): void {
    this.battleStore.allyMenuSelections.caster.status = status;
  }

  execute(combatant: Combatant): void {
    if (combatant.queuedOption.type === OptionType.ITEM) {
      combatant.queuedOption.charges -= 1;
      combatant.queuedOption.execute(combatant.queuedTarget, combatant);
      this.sound.play(combatant.queuedOption.soundKeyName);
    }

    // Ally Only
    else if (combatant.queuedOption.type === OptionType.SOUL) {
      this.souls.forEach(curSoul => {
        if (curSoul.name === combatant.queuedOption.name) {
          if (curSoul.owner && curSoul.owner.name === combatant.name) {
            curSoul.owner = null;
            this.sound.play('unequip-soul');
          } else {
            curSoul.owner = (combatant as Ally);
            this.sound.play('equip-soul');
          }
        }
      })
    }

    else if (combatant.queuedOption.type === OptionType.SPELL) {
      toggleActiveSpell(combatant, combatant.queuedOption);
      this.sound.play(combatant.queuedOption.soundKeyName);
    }
    
    else if (combatant.queuedOption.type === OptionType.ACTION) {
      if (Souls.berserker.owner && Souls.berserker.owner.name === combatant.name) {
        updateDamage(combatant, combatant.queuedOption.staminaCost);
      } else {
        combatant.stamina -= combatant.queuedOption.staminaCost;
      }
      
      
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

      // bug with spells if we continue down this path
      if (combatant.queuedOption.targetResolver) {
        actionModifier.targets = combatant.queuedOption.targetResolver(this);
        if (actionModifier.targets.length === 0) {
          this.sound.play('stamina-depleted');
          return;
        }
      }

      // Restrictions
      if (!this.firstActionTaken) this.firstActionTaken = true;
      if (combatant.queuedOption.name === Actions.splinter.name && !this.splinterUsed) this.splinterUsed = true;
      
      const potency = actionModifier.potency * actionModifier.multiplier;
      const newDeferredActions: DeferredAction[] =  actionModifier.targets.map((target, index) => {
        const action = (combatant.queuedOption as Action);
        return {
          timeTilExecute: index*100 + (action.animTimeInMs || 0),
          caster: combatant,
          action,
          target,
          potency, 
        }
      });

      this.deferredActions = this.deferredActions.concat(newDeferredActions);
    }
    
    resetCombatantBattleState(combatant);
  }

  openInitialMenu(ally: Ally): void {
    const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED, Status.CASTING]
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

    const allySouls = this.souls.filter(soul => soul.owner && soul.owner.name === ally.name);
    const actionsFolder: Folder = { 
      type: OptionType.FOLDER,
      name: 'Actions',
      options: [Actions.attack, Actions.breathe, ...allySouls.map(soul => soul.options).flat()],
    }

    const equippedFolder: Folder = {
      type: OptionType.FOLDER,
      name: 'Equipped',
      options: [...allySouls],
    }

    const soulsFolder: Folder = {
      type: OptionType.FOLDER,
      name: 'Souls',
      options: this.souls.filter(soul => !soul.owner),
    }

    const initialFolder: Folder = { 
      type: OptionType.FOLDER,
      name: 'ACT',
      options: [actionsFolder, equippedFolder, soulsFolder],
    }
    this.battleStore.allyMenuSelections.menus.push(initialFolder);
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
      case OptionType.SOUL:
      case OptionType.SPELL:
        const executable = option as Executable;
        menuSelection.setExecutable(executable);
        if (executable.type === OptionType.SOUL || executable.targetType === TargetType.SELF || executable.targetType === TargetType.ALL) {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name + " Target", options: [menuSelection.caster]};
          menuSelection.menus.push(targetFolder);
        } else if (executable.targetType === TargetType.SINGLE_TARGET) {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name + " Target", options: [...this.battleStore.allies, ...this.battleStore.enemies]};
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
