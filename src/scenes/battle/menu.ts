import { Enemy } from "../../model/enemy";
import { Action } from "../../model/action";

export type MenuOption = Enemy | Action;

export type Menu = {
    name: string,
    actions: Action[],
}