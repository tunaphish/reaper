import * as React from 'react';
import { makeAutoObservable, toJS } from 'mobx';

import { Behavior, Enemy } from '../../model/enemy';
import { isSameOption, OptionType } from '../../model/option';
import { Allies, Ally } from '../../model/ally';
import { Folder } from '../../model/folder';
import { Action, ActionTags } from '../../model/action';
import { TargetType } from '../../model/targetType';
import { JankenboThrow, Status, toggleActiveSpell } from '../../model/combatant';
import { self } from '../../model/targetPriorities';
import { Combatant } from '../../model/combatant';
import { Item } from '../../model/item';
import { Spell } from '../../model/spell';
import { MenuContent } from '../../model/menuContent';
import { MenuOption } from '../../model/menuOption';

import { DefaultAllies } from '../../data/allies';
import { healieBoi } from '../../data/enemies';
import { idle } from '../../data/actions';
import * as Actions from '../../data/actions';
import * as Spells from '../../data/spells';

import { getRandomInt } from '../../util/random';
import UiOverlayPlugin from '../../features/ui-plugin/UiOverlayPlugin';
import { BattleView } from './BattleView';


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export interface DialogueTrigger {
  trigger: (enemies: Enemy[], allies: Allies) => boolean;
  scriptKeyName: string;
}

type Executable = Action | Item | Spell;

type ActionModifier = {
  targets: Combatant[];
  potency: number;
  multiplier: number;
}

export class BattleStore {
  // battle vars
  enemies: Enemy[];
  allies: Allies;

  // menu vars
  caster?: Ally;
  executable?: Executable;
  target?: Enemy | Ally;
  menus: MenuContent[] = [];
  spells?: Spell[] = null;
  
  // spell vars
  chargeMultiplier = 1;
  zantetsukenMultiplier = 3.5;
  jankenboThrow?: JankenboThrow = null;

  stageText = "*the wind is howling*"

  constructor(enemies: Enemy[], allies: Allies) {
    this.enemies = enemies;
    this.allies = allies;
    makeAutoObservable(this);
  }

  setSpells(spells?: Spell[]): void {
    this.spells = spells;
  }

  setCaster(member?: Ally): void {
    this.caster = member;
  }

  setTarget(target?: Enemy | Ally): void {
    this.target = target;
  }

  setExecutable(executable?: Executable): void {
    this.executable = executable;
  }

  setChargeMultipler(chargeMultiplier: number): void {
    this.chargeMultiplier = chargeMultiplier;
  }

  setZantetsukenMultiplier(zantetsukenMultiplier: number): void {
    this.zantetsukenMultiplier = zantetsukenMultiplier;
  }

  setStageText(stageText: string): void {
    this.stageText = stageText;
  }


  tickStats(updateFunc: (combatant: Combatant, delta: number) => void, delta: number): void {
    [...this.allies, ...this.enemies].forEach((combatant) => {
      updateFunc(combatant, delta);
    });
  }

  updateCombatantsState(): void {
    [...this.allies, ...this.enemies].forEach((combatant) => {
      if (combatant.health <= 0) {
        combatant.status = Status.DEAD;
      } else if (combatant.stamina <= 0) {
        combatant.status = Status.EXHAUSTED;
      } else if (combatant.status === Status.BLOCKING) {
        // do nothing
      } else if (combatant.status !== Status.CHARGING && combatant.status !== Status.CASTING && combatant.status !== Status.ATTACKING) {
        combatant.status = Status.NORMAL;
      }
    });
  }

  emptyMenu(): void {
    this.menus.splice(0, this.menus.length);
  }

  resetSelections(): void {
    this.emptyMenu();
    this.setCaster(null);
    this.setExecutable(null);
    this.setTarget(null);
  }

  getCombatants(): Combatant[] {
    return [...this.enemies, ...this.allies]
  }
}

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

  constructor() {
    super(sceneConfig);
  }

  public init(): void {
    this.battleStore = new BattleStore([healieBoi], DefaultAllies);
    this.backgroundImageUrl = '/reaper/assets/backgrounds/pikrepo.jpg';
    this.music = this.sound.add('knight', {
      loop: true,  
      volume: 0.5  
    });
    this.ui.create(<BattleView scene={this}/>, this);
    //this.music.play();
  }

  update(time: number, delta: number): void {
    if (!this.battleStarted) return;

    if (this.battleStore.allies.every((member) => member.status === Status.DEAD)) {
      this.scene.start('World');
    }
    if (this.battleStore.enemies.every((enemy) => enemy.status === Status.DEAD)) {
      this.scene.start('World');
    }

    if (this.battleStore.caster && 
      this.battleStore.executable && 
      this.battleStore.target &&
      this.battleStore.spells === null
    ) {
      this.queueAction(); 
    }

    this.battleStore.tickStats(this.updateStats, delta);
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
    this.battleStore.resetSelections();
  }

  setCombatantAttacking(combatant: Combatant): void {
    combatant.status = Status.ATTACKING;
  }

  setCasterCharging(): void {
    this.battleStore.caster.status = Status.CHARGING;
  }

  setCasterNormal(): void {
    this.battleStore.caster.status = Status.NORMAL;
  }

  async execute(combatant: Combatant): Promise<void> {

    if (combatant.queuedOption.type === OptionType.ITEM) {
      combatant.queuedOption.charges -= 1;
      combatant.queuedOption.execute(combatant.queuedTarget, combatant);
      this.sound.play(combatant.queuedOption.soundKeyName);
    }
    
    if (combatant.queuedOption.type === OptionType.ACTION) {
      combatant.stamina -= combatant.queuedOption.staminaCost;
      
      if (combatant.queuedOption.isRestricted(combatant.queuedTarget, combatant, this)) {
        combatant.status = Status.NORMAL;
        combatant.queuedOption = null;
        combatant.queuedTarget = null;
        this.sound.play('stamina-depleted');
        return;
      }

      const actionModifier: ActionModifier = {
        targets: [combatant.queuedTarget],
        potency: combatant.queuedOption.potency,
        multiplier: 1,
      }
      const spells = combatant.activeSpells;

      // Apply Effects
      if (spells.find(isSameOption(Spells.CLEAVE))) {
        if (combatant.queuedTarget.type === OptionType.ALLY) {
          actionModifier.targets = this.battleStore.allies;
        } else {
          actionModifier.targets = this.battleStore.enemies;
        }
        actionModifier.multiplier *= 0.5;
      }

      if (spells.find(isSameOption(Spells.DUAL))) {
        actionModifier.targets = actionModifier.targets.concat(actionModifier.targets);
        actionModifier.multiplier *= 0.5;
      }

      if (spells.find(isSameOption(Spells.CHARGE))) {
        actionModifier.multiplier *= this.battleStore.chargeMultiplier;
      }

      if (spells.find(isSameOption(Spells.ZANTETSUKEN))) {
        actionModifier.multiplier *= this.battleStore.zantetsukenMultiplier;
      }

      if (spells.find(isSameOption(Spells.JANKENBO))) {
        const jankenboThrow = combatant.queuedTarget.jankenboThrow(combatant.queuedTarget);
        combatant.queuedTarget.previousJankenboThrow = jankenboThrow;

        if (this.battleStore.jankenboThrow) {
          if (this.battleStore.jankenboThrow === combatant.queuedTarget.previousJankenboThrow) {
            this.battleStore.setStageText(combatant.queuedTarget.name + " threw " + combatant.queuedTarget.previousJankenboThrow + ", YOU TIE");
          } else if (
            this.battleStore.jankenboThrow === JankenboThrow.ROCK && combatant.queuedTarget.previousJankenboThrow === JankenboThrow.SCISSORS ||
            this.battleStore.jankenboThrow === JankenboThrow.SCISSORS && combatant.queuedTarget.previousJankenboThrow === JankenboThrow.PAPER ||
            this.battleStore.jankenboThrow === JankenboThrow.PAPER && combatant.queuedTarget.previousJankenboThrow === JankenboThrow.ROCK
          ) {
            actionModifier.potency *= 2;
            this.battleStore.setStageText(combatant.queuedTarget.name + " threw " + combatant.queuedTarget.previousJankenboThrow + ", YOU WIN");
          } else {
            actionModifier.potency = 0;
            this.battleStore.setStageText(combatant.queuedTarget.name + " threw " + combatant.queuedTarget.previousJankenboThrow + ", YOU LOSE");
          }
        }
      }

      if (spells.find(isSameOption(Spells.SADIST))) {
        actionModifier.potency *= -1;
      }

      // Restrictions
      if (!this.firstActionTaken) this.firstActionTaken = true;
      if (combatant.queuedOption.name === Actions.splinter.name && !this.splinterUsed) this.splinterUsed = true;
      
      const potency = actionModifier.potency * actionModifier.multiplier;
      for (const target of actionModifier.targets) {
        combatant.queuedOption.execute(target, combatant, potency, this);
        

        if (combatant.queuedOption.soundKeyName) {
          this.sound.play(combatant.queuedOption.soundKeyName);
        }
        await wait(150);
      }
    }
    
    if (combatant.queuedOption.type === OptionType.SPELL) {
      toggleActiveSpell(combatant, combatant.queuedOption);
      this.sound.play(combatant.queuedOption.soundKeyName);
    }


    combatant.status = Status.NORMAL;
    combatant.queuedOption = null;
    combatant.queuedTarget = null;
  }

  updateEnemies(): void {
    this.battleStore.enemies.forEach((enemy) => {
      const selectedBehavior = this.selectBehavior(this.battleStore.enemies, this.battleStore.allies, enemy);
      const target = selectedBehavior.targetPriority(this.battleStore.enemies, this.battleStore.allies, enemy);

      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(target, enemy, selectedBehavior.action.potency, this);
      if (selectedBehavior.action.soundKeyName) this.sound.play(selectedBehavior.action.soundKeyName);
    });
  }

  selectBehavior(enemies: Enemy[], allies: Allies, enemy: Enemy): Behavior {
    // Baseline Behavior Filter
    const filteredBehaviors = enemy.behaviors.filter((behavior) => {
      if (enemy.stamina === enemy.maxStamina && behavior.action.name === 'Idle') return false;
      if (enemy.stamina < behavior.action.staminaCost) return false;
      if (enemy.health === enemy.maxHealth && behavior.action.tags.has(ActionTags.HEAL)) return false;
      return true;
    });

    // Apply Traits
    let traitedBehaviors = filteredBehaviors;
    enemy.traits.forEach((trait) => {
      if (trait.onUpdate) traitedBehaviors = trait.onUpdate(enemies, allies, traitedBehaviors);
    });

    // Randomly Select Behavior Based on Weight
    const summedWeights = filteredBehaviors.reduce((runningSum, behavior) => runningSum + behavior.weight, 0);
    const randomInt = getRandomInt(summedWeights);
    let runningSum = 0;
    const selectedBehavior = filteredBehaviors.find((behavior) => {
      runningSum += behavior.weight;
      return runningSum > randomInt;
    });
    return selectedBehavior || { action: idle, weight: 100, targetPriority: self }; // in case it doesn't pick anything
  }

  setExecutable(executable: Executable): void {
    this.battleStore.executable = executable;
  }

  setTarget(combatant: Enemy | Ally): void {
    this.battleStore.setTarget(combatant);    
  }

  updateStats(combatant: Combatant, delta: number): void {
    if (combatant.status === Status.DEAD) return;
    if (combatant.bleed > 0) {
      const DAMAGE_TICK_RATE = (delta / 1000) * 10;
      combatant.bleed -= DAMAGE_TICK_RATE;
      combatant.health = Math.max(0, combatant.health - DAMAGE_TICK_RATE);
    }
    
    const STAMINA_LOSS_PER_SECOND_WHILE_CHARGING = 100;
    if (combatant.status === Status.CHARGING) {
      combatant.stamina = combatant.stamina -= STAMINA_LOSS_PER_SECOND_WHILE_CHARGING*(delta/1000);
    }
    else if (combatant.status !== Status.CASTING && combatant.status !== Status.ATTACKING) {
        const regenPerTick = combatant.staminaRegenRatePerSecond * (delta / 1000);
        combatant.stamina = Math.min(combatant.maxStamina, combatant.stamina + regenPerTick);
    }

    const decayPerTick = combatant.flowDecayRatePerSecond * (delta/1000);
    combatant.flow = Math.max(0, combatant.flow-decayPerTick);
  }

  playSong(songKey: string): void {
    this.music = this.sound.add(songKey, { loop: true });
    this.music.play();
  }

  openInitialMenu(member: Ally): void {
    const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED, Status.CASTING, Status.ATTACKING]
    if (CANNOT_OPEN_STATUS.includes(member.status)) {
      this.sound.play('stamina-depleted');
      return;
    }

    // reset spells
    this.battleStore.zantetsukenMultiplier = 3.5;
    this.battleStore.jankenboThrow = null;
    this.battleStore.setChargeMultipler(1);
    this.battleStore.setSpells(null);

    this.sound.play('choice-select');
    this.battleStore.setCaster(member);
    this.battleStore.menus.push(member.folder);
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

const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
