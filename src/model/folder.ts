import { Option } from './option';
import { OptionType } from './option';

export type Folder = Option & {
  type: OptionType.FOLDER;
  options: Option[];
};