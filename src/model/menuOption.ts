import { Folder } from "./folder";
import { Spell } from "./spell";
import { Enemy } from "./enemy";
import { Ally } from "./ally";
import { Action } from "./action";
import { Item } from "./item";

export type MenuOption = Folder | Enemy | Ally | Action | Item | Spell;
