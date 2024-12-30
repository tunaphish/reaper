import { Folder } from "./folder";
import { Enemy } from "./enemy";
import { Ally } from "./ally";
import { Action } from "./action";
import { Item } from "./item";
import { Reaction } from "./reaction";
import { DeferredAction } from '../scenes/battle/BattleStore';

export type MenuOption = Folder | Enemy | Ally | Action | Item | Reaction ;
