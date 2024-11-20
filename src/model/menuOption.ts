import { Folder } from "./folder";
import { Spell } from "./spell";
import { Enemy } from "./enemy";
import { Ally } from "./ally";
import { Action } from "./action";
import { Item } from "./item";
import { Soul } from "./soul";

export type MenuOption = Folder | Enemy | Ally | Action | Item | Spell | Soul;
