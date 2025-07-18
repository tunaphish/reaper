export enum OptionType {
    FOLDER = "folder",
    ENEMY = "enemy",
    ALLY = "ally",
    ITEM = "item",
    ACTION = "action",
    EFFECT = "effect",
}

export interface Option {
    name: string;
}

export const isSameOption = (option: Option) => (otherOption: Option): boolean => otherOption.name === option.name;
