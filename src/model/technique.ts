import { Option, OptionType } from "./option";

export type Technique = Option & {
  type: OptionType.TECHNIQUE;
  actionPointsCost: number;
  description: string;
  
  soundKeyName: string;
}
