import { Enemy } from "../../model/enemy";
import { Action } from "../../model/action";

export enum MenuType {
    ACTION = 'ACTION',
    TARGET = 'target',
}

export type BaseMenu = {
    type: MenuType,
    name: string,
}

export type ActionMenu = BaseMenu & {
    type: MenuType.ACTION,
    actions: Action[]
}

export type TargetMenu = BaseMenu & {
    type: MenuType.TARGET,
    targets: Enemy[],
}

export type Menu = ActionMenu | TargetMenu;