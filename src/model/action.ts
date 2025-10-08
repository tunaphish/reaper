import { Option, OptionType } from "./option";
import { TargetType } from "./targetType";
import { ParticleEffect } from "./mediaEffect";


export type Action = Option & {
  type: OptionType.ACTION;
  actionPointsCost: number;
  description: string;
  
  targetType: TargetType;
  resolve: (target, source, potency) => void;
  potency: number;

  soundKeyName: string;
  mediaEffects: (ParticleEffect)[];
}
