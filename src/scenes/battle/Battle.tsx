import * as React from 'react';

import { Enemy } from '../../model/enemy';
import { OptionType } from '../../model/option';
import { Allies, Ally } from '../../model/ally';
import { Folder } from '../../model/folder';
import { Action, } from '../../model/action';
import { resetCombatantBattleState, Status, updateMagic } from '../../model/combatant';
import { Combatant } from '../../model/combatant';
import { Item } from '../../model/item';
import { MenuOption } from '../../model/menuOption';

import * as Actions from '../../data/actions';

import ReactOverlay from '../../plugins/ReactOverlay';
import { BattleView } from './BattleView';
import { BattleStore } from './BattleStore';
import { thief } from '../../data/enemies';
import { TargetType } from '../../model/targetType';
import { Reaction } from '../../model/reaction';
import { Effect } from '../../model/effect';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Battle',
};

export interface DialogueTrigger {
  trigger: (enemies: Enemy[], allies: Allies) => boolean;
  scriptKeyName: string;
}

export type Executable = Action | Item | Folder;

export class Battle extends Phaser.Scene {
  private reactOverlay: ReactOverlay; // initialized by plugin manager
  private music: Phaser.Sound.BaseSound;
  backgroundImageUrl: string;

  battleStore: BattleStore;

  // restriction vars
  firstActionTaken = false;
  splinterUsed = false;

  private enemyReactionTimer = 0;

  constructor() {
    super(sceneConfig);
  }

  init(data: { enemies: Enemy[] }): void {
    this.battleStore = new BattleStore(data.enemies || [thief], this.registry.get('allies'), 'hihi');
    this.backgroundImageUrl = '/reaper/backgrounds/pikrepo.jpg';
    this.music = this.sound.add('knight', {
      loop: true,  
      volume: 0.5  
    });
    this.reactOverlay.create(<BattleView scene={this}/>, this);
    // this.music.play();
  }

  // #region Time Based Updates

  update(time: number, delta: number): void {
    this.battleStore.tickStats(delta);
    this.battleStore.updateCombatantsState();
    
    this.checkBattleEndConditions();
    this.resetDeadAllyCasterMenu();
    
    this.selectEnemyBehavior(delta);
    this.checkEnemyReactions(delta);

    this.castActions();    
    this.reactToActions();

    this.executeActions();    
    this.resolveDeferredActions(delta);
  }

  checkEnemyReactions(delta: number): void {
    this.enemyReactionTimer += delta;
    if (this.enemyReactionTimer < 300) return;
    this.enemyReactionTimer = 0;

    this.battleStore.enemies.forEach((enemy) => {
      if (enemy.status !== Status.NORMAL) return;
      const selectedReaction = enemy.reactions.find(reaction => reaction.valid(enemy, this));
      if (!selectedReaction) return;

      this.sound.play('slime-noise'); 
      enemy.dialogue = selectedReaction.text;

      selectedReaction.options.forEach(option => {
        const reaction =  option as Reaction;
        enemy.stamina -= reaction.staminaCost;

        const actionsTargetingTarget = this.battleStore.deferredActions.filter(deferredAction => deferredAction.target.name === enemy.name);
        actionsTargetingTarget.forEach(action => {
          if (reaction.restriction && reaction.restriction.isRestricted(action, enemy)) {
            this.sound.play('stamina-depleted');
          } else {
            this.sound.play(reaction.soundKeyName);
            action.reactions.push(reaction);
          }
        })
      }) 
    });
  }


  selectEnemyBehavior(delta: number): void {
    // TODO: update for spells and items

    this.battleStore.enemies.forEach((enemy) => {
        enemy.timeSinceLastAction += delta 
        if (enemy.status !== Status.NORMAL) return;
        if (enemy.optionQueue.length > 0) {
          if (enemy.timeSinceLastAction < 500) return;
          enemy.timeSinceLastAction = 0;

           // Handle Actions
           const action =  enemy.optionQueue.pop() as Action;
           enemy.stamina -= action.staminaCost;
       
           const newDeferredAction = {
             id: generateID(),
             timeTilExecute: action.animTimeInMs,
             caster: enemy,
             action,
             target: enemy.targetFn(this, enemy), 
             reactions: [],
             isEnemyCaster: true
           };
           this.battleStore.deferredActions.push(newDeferredAction);
        } else {
          if (enemy.timeSinceLastAction < enemy.cadence) return;
          enemy.timeSinceLastAction = 0;
          const selectedBehavior = enemy.behaviors.find(behavior => behavior.valid(enemy, this));
          if (!selectedBehavior) return;
          this.sound.play('slime-noise'); // TODO: have event system instead
          enemy.dialogue = selectedBehavior.text;
          enemy.optionQueue = [...selectedBehavior.options];
          enemy.targetFn = selectedBehavior.getTarget;

        }
      });
  }

  resetDeadAllyCasterMenu(): void {
    if (this.battleStore.caster && this.battleStore?.caster.status === Status.DEAD) {
      this.battleStore.setCaster(null);
      this.battleStore.emptyMenu();
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

  castActions(): void {
    if (
      this.battleStore.caster && 
      this.battleStore.executable && 
      this.battleStore.target
    ) {
      this.battleStore.caster.status = Status.CASTING;
      this.battleStore.caster.queuedOption = this.battleStore.executable;
      this.battleStore.caster.queuedTarget = this.battleStore.target;
      this.battleStore.caster.timeInStateInMs = 0;
  
      this.battleStore.resetSelections();
    }
  }

  reactToActions(): void {
    if (!this.battleStore.caster || !this.battleStore.reaction || !this.battleStore.target) return;  
  
    this.battleStore.caster.stamina -= this.battleStore.reaction.staminaCost

    const actionsTargetingTarget = this.battleStore.deferredActions.filter(deferredAction => deferredAction.target.name === this.battleStore.target.name);
    actionsTargetingTarget.forEach(action => {
      if (this.battleStore.reaction.restriction &&
          this.battleStore.reaction.restriction.isRestricted(action, this.battleStore.caster)
        ) {
        this.sound.play('stamina-depleted');
      } else {
        this.sound.play(this.battleStore.reaction.soundKeyName);
        action.reactions.push(this.battleStore.reaction);
      }
    })

    this.battleStore.resetSelections();  
  }

  executeActions(): void {
    this.battleStore.getCombatants()
                    .filter(combatant => combatant.status === Status.CASTING && combatant.timeInStateInMs > combatant.queuedOption.castTimeInMs) 
                    .forEach(combatant => this.execute(combatant));
  }

  execute(combatant: Combatant): void {
    // if (combatant.queuedOption.type === OptionType.ITEM) {
    //   combatant.queuedOption.charges -= 1;
    //   combatant.queuedOption.execute(combatant.queuedTarget, combatant);
    //   this.sound.play(combatant.queuedOption.soundKeyName);
    // } else

    if (combatant.queuedOption.type === OptionType.FOLDER) {
      combatant.queuedOption.criteria.fulfilled = true;
      this.sound.play('charged');
    } else 
    
    if (combatant.queuedOption.type === OptionType.ACTION) {
      combatant.stamina -= combatant.queuedOption.staminaCost;
      
      const newDeferredAction = {
        id: generateID(),
        timeTilExecute: combatant.queuedOption.animTimeInMs,
        caster: combatant,
        action: combatant.queuedOption,
        target: combatant.queuedTarget,
        reactions: [],
        isEnemyCaster: false
      };
      this.battleStore.deferredActions.push(newDeferredAction);
    }
    
    resetCombatantBattleState(combatant);
  }

  // potentially split function
  resolveDeferredActions(delta: number): void {
    const newDeferredActions = this.battleStore.deferredActions.map(({id, timeTilExecute, action, target, caster, reactions, isEnemyCaster}) => {
      if (timeTilExecute - delta <= 0) {
        if (action.restriction && action.restriction.isRestricted(target, caster, this)) {
          this.sound.play('stamina-depleted');
        } else {
          // Update Battle Restrictions
          if (!this.firstActionTaken) this.firstActionTaken = true;
          if (action.name === Actions.splinter.name && !this.splinterUsed) this.splinterUsed = true;

          const effects: Effect[] = reactions.reduce((previousEffects, reaction) => {
            return reaction.modifyEffects(previousEffects);
          }, action.effects);

          effects.forEach(effect => {
            effect.execute(target, caster, effect.potency, this);
            this.events.emit('combatant-effected', target);
          })
          
          this.sound.play(action.soundKeyName);
        }
      }

      // pause caster actions whilst juggled
      const timeElapsed = caster.juggleDuration === 0 ? delta : 0;
      return {
        id,
        timeTilExecute: timeTilExecute - timeElapsed,
        target,
        action, 
        caster,
        reactions,
        isEnemyCaster
      }
    }).filter(deferredAction => deferredAction.timeTilExecute > 0);
    
    this.battleStore.setDeferredActions(newDeferredActions);
  }
  // #endregion

  // #region Input Based Updates

  setCasterStatus(status: Status): void {
    this.battleStore.caster.status = status;
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
    const CANNOT_OPEN_STATUS = [Status.DEAD, Status.EXHAUSTED, Status.CASTING]
    if (CANNOT_OPEN_STATUS.includes(ally.status)) {
      this.sound.play('stamina-depleted');
      return;
    }

    this.sound.play('choice-select');
    this.battleStore.setCaster(ally);
    this.events.emit('caster-set', ally);
    this.battleStore.pushMenu(ally.folder);
  }

  closeMenu(): void {
    this.battleStore.popMenu();

    if (this.battleStore.menus.length === 0) {
      this.battleStore.setCaster(null); // hacky way of resetting selection if user clicks out
    }
    this.sound.play('dialogue-advance');
  }

  selectOption(option: MenuOption): void {
    this.sound.play('choice-select');
    switch(option.type) {
      // case OptionType.ITEM:
      //   const item = option as Item;
      //   this.battleStore.setExecutable(item);
      //   if (item.targetType === TargetType.SELF) {
      //     const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [this.battleStore.caster]};
      //     this.battleStore.pushMenu(targetFolder);
      //   } else {
      //     const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [...this.battleStore.allies, ...this.battleStore.enemies]};
      //     this.battleStore.pushMenu(targetFolder);
      //   }
      //   this.battleStore.setText(item.description);
      //   break;
      case OptionType.ACTION:
        const action = option as Action;
        this.battleStore.setExecutable(action);
        if (action.targetType === TargetType.SELF) {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [this.battleStore.caster]};
          this.battleStore.pushMenu(targetFolder);
        } else {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [...this.battleStore.allies, ...this.battleStore.enemies]};
          this.battleStore.pushMenu(targetFolder);
        }
        const restrictionText = action.restriction ? 
        'RESTRCTION: ' + action.restriction.desc + '. '
        : ''
        this.battleStore.setText(restrictionText + action.description);
        break;
      case OptionType.REACTION:
        const reaction = option as Reaction;
        this.battleStore.setReaction(reaction);
        if (reaction.targetType === TargetType.SELF) {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [this.battleStore.caster]};
          this.battleStore.pushMenu(targetFolder);
        } else {
          const targetFolder: Folder = { type: OptionType.FOLDER, name: option.name, desc: 'Targets', options: [...this.battleStore.allies, ...this.battleStore.enemies]};
          this.battleStore.pushMenu(targetFolder);
        }
        this.battleStore.setText(reaction.description);
        break;
      case OptionType.ENEMY:
      case OptionType.ALLY:
        const combatant = option;
        this.battleStore.setTarget(combatant);
        break;
      case OptionType.FOLDER:
        const folder = option as Folder;
        if (folder.criteria && !folder.criteria.fulfilled) {
          updateMagic(this.battleStore.caster, folder.criteria.magicCost);
          this.battleStore.setExecutable(folder);
          this.battleStore.setTarget(this.battleStore.caster);
        } else {
          this.battleStore.pushMenu(folder);
        }
        break;
    }
  }

  // #endregion
}

const generateID = () => {
  return Date.now().toString(36); 
}