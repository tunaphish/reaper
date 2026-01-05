import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export type Action = Option & {
  type: OptionType.ACTION;
  actionPointsCost: number;
  description: string;
  
  targetType: TargetType;
  resolve: (target, source, potency) => void;
  potency: number;

  soundKeyName: string;
}
