import { Combatant, JankenboThrow } from "../model/combatant"

export const random = (_combatant: Combatant): JankenboThrow => {
    return getRandomEnumValue(JankenboThrow);
}

export const alwaysRock = (_combatant: Combatant): JankenboThrow => {
    return JankenboThrow.ROCK
}

export const cycle = (combatant: Combatant): JankenboThrow => {
    if (!combatant.previousJankenboThrow) {
        return getRandomEnumValue(JankenboThrow);
    }
    switch (combatant.previousJankenboThrow) {
        case JankenboThrow.ROCK:
            return JankenboThrow.PAPER;
        case JankenboThrow.PAPER:
            return JankenboThrow.SCISSORS;
        case JankenboThrow.SCISSORS:
            return JankenboThrow.ROCK;
    }
}

function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
    const enumValues = Object.keys(enumObj)
        .filter(key => isNaN(Number(key))) 
        .map(key => enumObj[key as keyof T]);
    
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
}