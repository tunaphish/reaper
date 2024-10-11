import * as React from 'react';
import { makeAutoObservable, toJS } from 'mobx';

import { Behavior, Enemy } from '../../model/enemy';
import { OptionType } from '../../model/option';
import { Party, PartyMember, Folder } from '../../model/party';
import { Action, ActionTags } from '../../model/action';
import { TargetType } from '../../model/targetType';
import { Status } from '../../model/combatant';
import { self } from '../../model/targetPriorities';
import { Combatant } from '../../model/combatant';
import { Item } from '../../model/item';
import { Spell } from '../../model/spell';
import { MenuContent } from '../../model/menuContent';
import { MenuOption } from '../../model/menuOption';

import { DefaultParty } from '../../data/parties';
import { healieBoi } from '../../data/enemies';
import { idle } from '../../data/actions';
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
  trigger: (enemies: Enemy[], party: Party) => boolean;
  scriptKeyName: string;
}

type Executable = Action | Item | Spell;

type ActionModifier = {
  targets: Combatant[];
  potency: number;
  multiplier: number;
}

export class BattleStore {
  enemies: Enemy[];
  party: Party;

  caster?: PartyMember;
  executable?: Executable;
  target?: Enemy | PartyMember;
  menus: MenuContent[] = [];
  spells?: Spell[] = null;
  // actionModifier?: ActionModifier;

  constructor(enemies: Enemy[], party: Party) {
    this.enemies = enemies;
    this.party = party;
    makeAutoObservable(this);
  }

  setSpells(spells?: Spell[]): void {
    this.spells = spells;
  }

  setCaster(member?: PartyMember): void {
    this.caster = member;
  }

  setTarget(target?: Enemy | PartyMember): void {
    this.target = target;
  }

  setExecutable(executable?: Executable): void {
    this.executable = executable;
  }

  tickStats(updateFunc: (combatant: Combatant, delta: number) => void, delta: number): void {
    [...this.party.members, ...this.enemies].forEach((combatant) => {
      updateFunc(combatant, delta);
    });
  }

  updateCombatantsState(): void {
    [...this.party.members, ...this.enemies].forEach((combatant) => {
      if (combatant.health <= 0) {
        combatant.status = Status.DEAD;
      } else if (combatant.stamina <= 0) {
        combatant.status = Status.EXHAUSTED;
      } else if (combatant.status === Status.BLOCKING) {
        // do nothing
      } else if (combatant.status !== Status.CASTING && combatant.status !== Status.ATTACKING) {
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
}

export class Battle extends Phaser.Scene {
  private ui: UiOverlayPlugin;
  private music: Phaser.Sound.BaseSound;
  backgroundImageUrl: string;

  battleStore: BattleStore;

  private lastCalculation = 0;
  private battleStarted = false;

  constructor() {
    super(sceneConfig);
  }

  public init(): void {
    this.battleStore = new BattleStore([healieBoi], DefaultParty);
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

    if (this.battleStore.party.members.every((member) => member.status === Status.DEAD)) {
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

    // enemy AI
    this.lastCalculation += delta;
    // if (this.lastCalculation > 2000) {
    //   this.lastCalculation = 0;
    //   this.updateEnemies(); 
    // }

  }

  queueAction(): void{
    for (const member of this.battleStore.party.members) {
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

  async execute(combatant: Combatant): Promise<void> {
    if (combatant.queuedOption.type === OptionType.ITEM) {
      combatant.queuedOption.charges -= 1;
      combatant.queuedOption.execute(combatant.queuedTarget, combatant);
      this.sound.play(combatant.queuedOption.soundKeyName);
    }
    
    if (combatant.queuedOption.type === OptionType.ACTION) {
      combatant.stamina -= combatant.queuedOption.staminaCost;
      
      const actionModifier: ActionModifier = {
        targets: [combatant.queuedTarget],
        potency: combatant.queuedOption.potency,
        multiplier: 1,
      }
      const spells = combatant.activeSpells.filter(activeSpell => activeSpell.isMenuSpell);

      // Apply Effects
      if (spells.find(containsSpell(Spells.CLEAVE))) {
        if (combatant.queuedTarget.type === OptionType.MEMBER) {
          actionModifier.targets = this.battleStore.party.members;
        } else {
          actionModifier.targets = this.battleStore.enemies;
        }
      }
      
      // dual strike
      // dual strike potency, cleave potency, charge multi, jankenbo multi, zantetsuken, 

      for (const target of actionModifier.targets) {
        combatant.queuedOption.execute(target, combatant);
      
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
      const selectedBehavior = this.selectBehavior(this.battleStore.enemies, this.battleStore.party, enemy);
      const target = selectedBehavior.targetPriority(this.battleStore.enemies, this.battleStore.party, enemy);

      //Side Effects
      enemy.stamina -= selectedBehavior.action.staminaCost;
      selectedBehavior.action.execute(target, enemy);
      if (selectedBehavior.action.soundKeyName) this.sound.play(selectedBehavior.action.soundKeyName);
    });
  }

  selectBehavior(enemies: Enemy[], party: Party, enemy: Enemy): Behavior {
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
      if (trait.onUpdate) traitedBehaviors = trait.onUpdate(enemies, party, traitedBehaviors);
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

  setTarget(combatant: Enemy | PartyMember): void {
    this.battleStore.setTarget(combatant);    
  }

  updateStats(combatant: Combatant, delta: number): void {
    if (combatant.status === Status.DEAD) return;
    if (combatant.bleed > 0) {
      const DAMAGE_TICK_RATE = (delta / 1000) * 10;
      combatant.bleed -= DAMAGE_TICK_RATE;
      combatant.health = Math.max(0, combatant.health - DAMAGE_TICK_RATE);
    }
    
    if (combatant.status !== Status.CASTING && combatant.status !== Status.ATTACKING) {
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

  openInitialMenu(member: PartyMember): void {
    const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED, Status.CASTING, Status.ATTACKING]
    if (CANNOT_OPEN_STATUS.includes(member.status)) {
      this.sound.play('stamina-depleted');
      return;
    }
    this.sound.play('choice-select');
    this.battleStore.setCaster(member);
    this.battleStore.menus.push(member.folder);
  }

  closeMenu(): void {
    this.battleStore.menus.pop();
    this.battleStore.setExecutable(null); // hacky way of resetting action 
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
          const targetFolder: Folder = { type: OptionType.FOLDER, name: 'Target', options: [...this.battleStore.party.members, ...this.battleStore.enemies]};
          this.battleStore.menus.push(targetFolder);
        }
        break;
      case OptionType.ENEMY:
      case OptionType.MEMBER:
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
}

export const updateHealth = (target: Combatant, change: number): void => {
  if (target.health + change > target.maxHealth) {
    target.bleed -= (target.health + change) -  target.maxHealth;
  }
  target.health = Math.min(target.maxHealth, target.health + change);  
};

export const updateBleed = (target: Combatant, change: number): void => {
  target.bleed = Math.max(0, target.bleed - change);  
};

export const updateStamina = (target: Combatant, change: number): void => {
  target.stamina = Math.min(target.maxStamina, target.stamina + change);
};

export const updateDamage = (target: Combatant, change: number, source: Combatant): void => {
  if (change > 0) {
    target.takingDamage = true;
  }
  if (target.status === Status.EXHAUSTED) {
    change *= 2;
  }

  if (source.activeSpells.find(containsSpell(Spells.SADIST))) {
    const newBleed = target.bleed-change;
    target.bleed = clamp(0, newBleed, target.health);
    return;
  }

  const newBleed = target.bleed+change;
  const newHealth = target.health - (target.bleed+change - target.health);
  target.bleed = clamp(0, newBleed, target.health);
  target.health = clamp(0, newHealth, target.maxHealth);

};

export const toggleActiveSpell = (target: Combatant, spell: Spell): void => {
  const foundSpell: Spell = target.activeSpells.find(containsSpell(spell));
  if (!!foundSpell) {
    const idx = target.activeSpells.indexOf(foundSpell);
    target.activeSpells.splice(idx,1);
    return;
  }

  const flowCost = Math.min(spell.magicCost, target.flow);
  const magicCost = clamp(0, spell.magicCost - target.flow, target.magic);
  const healthCost = clamp(0, spell.magicCost - (target.flow + target.magic), target.health)
  target.flow -= flowCost;
  target.magic -= magicCost;
  target.health -= healthCost;
  
  target.activeSpells.push(spell);
}


const clamp = (min: number, val: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
}

const containsSpell = (spell: Spell) => (activeSpell: Spell) => activeSpell.name === spell.name;

const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}