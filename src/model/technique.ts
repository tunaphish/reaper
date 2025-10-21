import { Option, OptionType } from "./option";
import { ParticleEffect } from "./mediaEffect";


export type Technique = Option & {
  type: OptionType.TECHNIQUE;
  actionPointsCost: number;
  description: string;
  
  soundKeyName: string;
  mediaEffects: (ParticleEffect)[];
}
