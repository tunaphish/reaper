import { Option } from './option';
import { OptionType } from './option';

export type Criteria = {
    fulfilled: boolean;
    magicCost: number;
}

export type Folder = Option & {
    desc: string;
    type: OptionType.FOLDER;
    options: Option[];
    criteria?: Criteria;
    castTimeInMs?: number;
};