export enum OptionType {
    FOLDER = "folder",
    ENEMY = "enemy",
    MEMBER = "member",
    ITEM = "item",
    ACTION = "action",
    SPELL = "spell",
}

export interface Option {
    name: string;
}