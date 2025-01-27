export enum MediaEffectType {
    PARTICLE = 'particle'
}

export type MediaEffect = {
    type: MediaEffectType;
}

export type ParticleEffect = {
    type: MediaEffectType.PARTICLE;
    jsonPath: string;
}