import { Folder } from "../../model/folder";
import { Enemy } from "../../model/enemy";
import { Ally } from "../../model/ally";
import { Action } from "../../model/action";
import { Item } from "../../model/item";
import { Technique } from "../../model/technique";

export type MenuOption = Folder | Enemy | Ally | Action | Item | Technique;
