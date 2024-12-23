import { Option } from './option';
import { OptionType } from './option';

export type Soul = Option & {
    desc: string;
    passive: string;
    type: OptionType.SOUL;
    options: Option[];
};