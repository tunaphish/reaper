import { Ally } from './ally';
import { Option } from './option';
import { OptionType } from './option';

export type Soul = Option & {
    description: string;
    passive: string;
    type: OptionType.SOUL;
    options: Option[];
    owner?: Ally;
    castTimeInMs: number;
};