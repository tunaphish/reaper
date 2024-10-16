import { Combatant, JankenbowThrow } from "../model/combatant"

export const random = (_combatant: Combatant): JankenbowThrow => {
    return getRandomEnumValue(JankenbowThrow);
}

export const alwaysRock = (_combatant: Combatant): JankenbowThrow => {
    return JankenbowThrow.ROCK
}

export const cycle = (combatant: Combatant): JankenbowThrow => {
    if (!combatant.previousJankenboThrow) {
        return getRandomEnumValue(JankenbowThrow);
    }
    switch (combatant.previousJankenboThrow) {
        case JankenbowThrow.ROCK:
            return JankenbowThrow.PAPER;
        case JankenbowThrow.PAPER:
            return JankenbowThrow.SCISSORS;
        case JankenbowThrow.SCISSORS:
            return JankenbowThrow.ROCK;
    }
}

function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
    const enumValues = Object.keys(enumObj)
        .filter(key => isNaN(Number(key))) 
        .map(key => enumObj[key as keyof T]);
    
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
}