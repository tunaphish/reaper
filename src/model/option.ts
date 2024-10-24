export enum OptionType {
    FOLDER = "folder",
    ENEMY = "enemy",
    ALLY = "ally",
    ITEM = "item",
    ACTION = "action",
    SPELL = "spell",
}

export interface Option {
    name: string;
}

export const isSameOption = (option: Option) => (otherOption: Option) => otherOption.name === option.name;
