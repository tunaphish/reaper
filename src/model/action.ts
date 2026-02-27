import { Event } from "./encounter";
import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";

export type Action = Option & {
  type: OptionType.ACTION;
  description: string;
  targetType: TargetType;


  actionPointsCost: number;

  events: Event[];
}
