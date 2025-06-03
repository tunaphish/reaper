import { Action } from "../../model/action";
import { Combatant } from "../../model/combatant";

export enum MenuType {
    ACTION = 'action',
    TARGET = 'target',
    CATEGORY = 'category',
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
    targets: Combatant[],
}

export type CategoryMenu = BaseMenu & {
    type: MenuType.CATEGORY,
}

export type Menu = ActionMenu | TargetMenu | CategoryMenu;