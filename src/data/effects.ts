import { Effect } from "../model/effect";
import { OptionType } from "../model/option";


export const strengthen: Effect = {
  type: OptionType.EFFECT,
  name: "Strengthen",
  description: "Boosts Potency",
}

export const weaken: Effect = {
  type: OptionType.EFFECT,
  name: "Strengthen",
  description: "Lowers Potency",
}