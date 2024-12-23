import { Option } from './option';
import { OptionType } from './option';

export type Folder = Option & {
    desc: string;
    type: OptionType.FOLDER;
    options: Option[];
};