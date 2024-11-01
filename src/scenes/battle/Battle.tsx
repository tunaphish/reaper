import * as React from 'react';

import { Enemy, selectBehavior } from '../../model/enemy';
import { isSameOption, OptionType } from '../../model/option';
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
import { BattleStore } from './BattleStore';
import { healieBoi } from '../../data/enemies';


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
      this.scene.stop();
      this.scene.start('MainMenu');
    }
    if (this.battleStore.enemies.every((enemy) => enemy.status === Status.DEAD)) {
      this.music.stop();
      this.scene.stop();
      this.registry.set('allies', this.battleStore.allies);
      this.scene.resume('World', { allies: this.battleStore.allies });
    }

    if (this.battleStore.caster && 
      this.battleStore.executable && 
      this.battleStore.target &&
      this.battleStore.spells === null
    ) {
      this.queueAction(); 
    }

    this.battleStore.getCombatants().forEach(combatant => {
      if (combatant.status === Status.ATTACKING && combatant.timeInStateInMs > ATTACK_WINDOW_TIME_IN_MS) {
        combatant.status = Status.EXECUTING;
        this.execute(combatant);
      }
    })

    this.battleStore.tickStats(delta);
    this.battleStore.updateCombatantsState();
    if (this.battleStore.caster && this.battleStore?.caster.status === Status.DEAD) {
        this.battleStore.setCaster(null);
        this.battleStore.emptyMenu();
    }

    const CHARGE_MULTIPLIER_GAIN_PERSECOND_WHILE_CHARGING = 1;
    if (this.battleStore.caster && this.battleStore.caster.status === Status.CHARGING) {
      this.battleStore.setChargeMultipler(this.battleStore.chargeMultiplier + CHARGE_MULTIPLIER_GAIN_PERSECOND_WHILE_CHARGING * (delta/1000));
    }
    const ZANTETSUKEN_MULTIPLIER_LOSS_PERSECOND_WHILE_CHARGING = 1;
    if (this.battleStore.caster && this.battleStore.caster.activeSpells.find(isSameOption(Spells.ZANTETSUKEN))) {
      const zantetsukenMultiplier = Math.max(.5, this.battleStore.zantetsukenMultiplier - (ZANTETSUKEN_MULTIPLIER_LOSS_PERSECOND_WHILE_CHARGING*(delta/1000)))
      this.battleStore.setZantetsukenMultiplier(zantetsukenMultiplier);
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
    // if (this.lastCalculation > 2000) {
    //   this.lastCalculation = 0;
    //   this.updateEnemies(); 
    // }

  }

  queueAction(): void{
    for (const member of this.battleStore.allies) {
      if (member.status === Status.ATTACKING) {
        this.battleStore.caster.flow = Math.min(this.battleStore.caster.maxMagic, this.battleStore.caster.flow+25);
        member.flow = Math.min(member.maxMagic, member.flow+25);
        this.sound.play("smirk");
      }
    }
    this.battleStore.caster.status = Status.CASTING;
    this.battleStore.caster.queuedOption = this.battleStore.executable;
    this.battleStore.caster.queuedTarget = this.battleStore.target;
    this.battleStore.caster.timeInStateInMs = 0;

    this.battleStore.resetSelections();
  }

  setCasterCharging(): void {
    this.battleStore.caster.status = Status.CHARGING;
  }

  setCasterNormal(): void {
    this.battleStore.caster.status = Status.NORMAL;
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

  updateEnemies(): void {
    this.battleStore.enemies.forEach((enemy) => {
      const selectedBehavior = selectBehavior(enemy);
      const target = selectedBehavior.targetPriority(this.battleStore.enemies, this.battleStore.allies, enemy);

      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(target, enemy, selectedBehavior.action.potency, this);
      if (selectedBehavior.action.soundKeyName) this.sound.play(selectedBehavior.action.soundKeyName);
    });
  }



  setExecutable(executable: Executable): void {
    this.battleStore.executable = executable;
  }

  setTarget(combatant: Enemy | Ally): void {
    this.battleStore.setTarget(combatant);    
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
    this.battleStore.zantetsukenMultiplier = 3.5;
    this.battleStore.jankenboThrow = null;
    this.battleStore.setChargeMultipler(1);
    this.battleStore.setSpells(null);

    this.sound.play('choice-select');
    this.battleStore.setCaster(ally);
    this.battleStore.menus.push(ally.folder);
  }

  closeMenu(): void {
    const menuContent = this.battleStore.menus.pop();
    if (menuContent && menuContent.name === Spells.CHARGE.name) {
      this.battleStore.setChargeMultipler(1);
    }

    if (menuContent && menuContent.type !== OptionType.SPELL) {
      this.battleStore.setExecutable(null); // hacky way of resetting action 
    }
    if (this.battleStore.menus.length === 0) {
      this.battleStore.setCaster(null); // hacky way of resetting selection if user clicks out
    }
    this.sound.play('dialogue-advance');
  }

  selectOption(option: MenuOption): void {
    this.sound.play('choice-select');
    switch(option.type) {
      case OptionType.ITEM:
      case OptionType.ACTION:
      case OptionType.SPELL:
        const executable = option as Executable;
        this.battleStore.setExecutable(executable);
        if (executable.targetType === TargetType.SELF) {
          this.battleStore.setTarget(this.battleStore.caster);
        } else {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: 'Target', desc: 'Targets...', options: [...this.battleStore.allies, ...this.battleStore.enemies]};
          this.battleStore.menus.push(targetFolder);
        }
        break;
      case OptionType.ENEMY:
      case OptionType.ALLY:
        const combatant = option;
        this.battleStore.setTarget(combatant);
        this.battleStore.setSpells(this.battleStore.caster.activeSpells.filter(activeSpell => activeSpell.isMenuSpell)); 
        if (this.battleStore.spells.length > 0) {
          this.battleStore.menus.push(this.battleStore.spells.shift());
        } else {
          this.battleStore.setSpells(null);
        }
        break;
      case OptionType.FOLDER:
        const folder = option as Folder;
        this.battleStore.menus.push(folder);
        break;
    }
  }

  startBattle(): void {
    this.battleStarted = true;
  }

  advanceSpell(): void {
    this.sound.play('choice-select');
    if (this.battleStore.spells.length === 0) {
      this.battleStore.spells = null;
      return;
    }
    this.battleStore.menus.push(this.battleStore.spells.shift());
  }

  setJankenboThrow(jankenboThrow: JankenboThrow): void {
    this.battleStore.jankenboThrow = jankenboThrow;
  }
}
