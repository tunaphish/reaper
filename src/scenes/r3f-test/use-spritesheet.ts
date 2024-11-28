// Copied from https://github.com/bfollington/use-spritesheet/tree/main/use-spritesheet/src
// There was a dependency error with r3f that I did not feel like resolving with OG package
// so I just copied the source

import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";

//#region asesprite
export type AsepriteFrame = {
    frame: {
      x: number
      y: number
      w: number
      h: number
    }
    rotated: boolean
    trimmed: boolean
    spriteSourceSize: {
      x: number
      y: number
      w: number
      h: number
    }
    sourceSize: {
      w: number
      h: number
    }
    duration: number
  }
  
  export type AsepriteLayer = {
    name: string
    opacity: number
    blendMode: string
  }
  
  export type AsepriteFrameTag = {
    name: string
    from: number
    to: number
    direction: 'forward' | 'backward'
  }
  
  export type AsepriteJson = {
    frames: { [name: string]: AsepriteFrame }
    meta: {
      app: string
      version: string
      image: string
      format: string
      size: {
        w: number
        h: number
      }
      frameTags: AsepriteFrameTag[]
      layers: AsepriteLayer[]
      slices: unknown[]
    }
  }
  
  export function frameList(json: AsepriteJson): AsepriteFrame[] {
    return Object.values(json.frames)
  }
  
  export function getAnimationFrames(json: AsepriteJson, name: string): AsepriteFrame[] {
    const tag = json.meta.frameTags.find((t) => t.name === name)
    if (!tag) return []
  
    const allFrames = frameList(json)
    return allFrames.slice(tag.from, tag.to)
  }
//#endregion

/**
 * Allow control of speed
 * Callback when animation finishes
 *
 * usePixelTexture -> nearest neighbour
 * useSpritesheet -> slice up image, allow indexing
 * useSpritesheetAnimation -> play back animation using speed param
 * useAseprite -> slice and play animations using aseprite data
 */

export function usePixelTexture(src: string, wrap = false): THREE.Texture {
  const tex: THREE.Texture = useLoader(THREE.TextureLoader, src);

  if (wrap) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  }

  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;

  return tex;
}

export function useSpritesheet(
  src: string,
  rows: number,
  columns: number,
  currentFrameIndex: number
): THREE.Texture {
  console.assert(Number.isInteger(rows));
  console.assert(Number.isInteger(columns));
  console.assert(Number.isInteger(currentFrameIndex));
  console.assert(rows >= 1);
  console.assert(columns >= 1);
  console.assert(currentFrameIndex >= 0);

  const texture = useLoader(THREE.TextureLoader, src);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.repeat.set(1 / columns, 1 / rows);

  const totalFrames = rows * columns; // TODO: or override?

  useFrame(() => {
    const index = currentFrameIndex % totalFrames;
    texture.offset.x = (index % columns) / columns;
    texture.offset.y = Math.floor(index / columns) / rows;
  });

  return texture;
}

export function useSpritesheetAnimation(
  src: string,
  frameDuration: number,
  rows: number,
  columns: number,
  paused = false
): [THREE.Texture, MutableRefObject<number>, MutableRefObject<number>] {
  console.assert(Number.isInteger(rows));
  console.assert(Number.isInteger(columns));
  console.assert(rows >= 1);
  console.assert(columns >= 1);

  const texture = useLoader(THREE.TextureLoader, src);

  const tex = useMemo(() => {
    // We'll be animating this texture independently to all other instances, so clone it
    const tex = texture.clone();
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.repeat.set(1 / columns, 1 / rows);
    tex.needsUpdate = true;

    return tex;
  }, [texture, columns, rows]);

  const t = useRef(0);
  const index = useRef(0);
  const totalFrames = rows * columns;

  useFrame((_, delta) => {
    if (!paused) {
      t.current += delta * 1000;

      if (t.current >= frameDuration) {
        index.current += 1;
        if (index.current >= totalFrames) {
          index.current = 0;
        }

        t.current = 0;
      }
    }

    // split index into x and y components
    tex.offset.x = (index.current % columns) / columns;
    tex.offset.y = Math.floor(index.current / columns) / rows;
  });

  return [tex, index, t];
}

/**
 * Load an exported set of animations from Asesprite and contol playback
 * @param src path to spritesheet texture;
 * @param json json data exported from aseprite
 * @param currentAnimation the name of the current animation
 * @param paused
 * @returns [texture, ref internalTimer, ref currentFrameIndex]
 */
export function useAseprite(
  src: string,
  json: AsepriteJson,
  currentAnimation: string | null = null,
  paused = false
): [THREE.Texture, MutableRefObject<number>, MutableRefObject<number>] {
  const texture: THREE.Texture = useLoader(THREE.TextureLoader, src);

  const tex = useMemo(() => {
    // We'll be animating this texture independently to all other instances, so clone it
    const tex = texture.clone();

    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, [texture]);

  const frames: MutableRefObject<AsepriteFrame[]> = useRef([]);

  const w = json.meta.size.w;
  const h = json.meta.size.h;

  const t = useRef(0);
  const index = useRef(0);

  useEffect(() => {
    t.current = 0;
    index.current = 0;

    if (currentAnimation) {
      frames.current = getAnimationFrames(json, currentAnimation);
    } else {
      frames.current = frameList(json);
    }
  }, [currentAnimation, texture, json]);

  useFrame((_, delta) => {
    const f = frames.current[index.current];
    if (!f) return;

    tex.repeat.set(f.frame.w / w, f.frame.h / h);

    if (!paused) {
      t.current += delta * 1000;

      if (t.current >= f.duration) {
        index.current += 1;
        if (index.current >= frames.current.length) {
          index.current = 0;
        }

        t.current = 0;
      }
    }

    tex.offset.x = f.frame.x / w;
    tex.offset.y = f.frame.y / h;
  });

  return [tex, index, t];
}