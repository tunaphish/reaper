import { Folder } from "./party";
import { Spell } from "./spell";
import { Enemy } from "./enemy";
import { PartyMember } from "./party";
import { Action } from "./action";
import { Item } from "./item";

export type MenuOption = Folder | Enemy | PartyMember | Action | Item | Spell;
