import * as React from 'react';
import * as THREE from 'three';
import ReactOverlay from '../../plugins/ReactOverlay';
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping } from 'three';
import { create } from 'zustand';
import { Stats } from '@react-three/drei';
import { DynamicJoystick } from './DynamicJoystick';
import { Player } from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'R3FTest',
};

interface R3FState {
  targetPosition: THREE.Vector3; 
  setTargetPosition: (position: THREE.Vector3) => void;
  direction?: number;
  setDirection: (direction: number) => void;
}

export const useGameStore = create<R3FState>((set) => ({
  targetPosition: new THREE.Vector3(0,0,0),
  setTargetPosition: (targetPosition) => set({ targetPosition }),
  direction: null,
  setDirection: (direction) => set({ direction }),
}));

const CAMERA_OFFSET = new THREE.Vector3(0, 5, 10);
const Camera = () => {
  const targetPosition = useGameStore((state) => state.targetPosition);
  const { camera } = useThree();
  
  useFrame(() => {
    const desiredPosition = targetPosition.clone().add(CAMERA_OFFSET);
    camera.position.lerp(desiredPosition, 0.1); 
  });

  return null;
}

const Plane = () => {
  const checkerTexture = useLoader(TextureLoader, '/reaper/assets/textures/checker.svg')
  checkerTexture.wrapS = checkerTexture.wrapT = RepeatWrapping;
  checkerTexture.repeat.set(10, 10); // Adjust the repeat for more tiles

  return (
    <RigidBody type="fixed" >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100]} /> 
        <meshStandardMaterial map={checkerTexture} />
      </mesh>
      <CuboidCollider args={[10, 0.1, 10]} friction={0} restitution={0} />
    </RigidBody>
  )
}

export class R3FTest extends Phaser.Scene {
  private reactOverlay: ReactOverlay;

  constructor() {
    super(sceneConfig);
  }

  preload(): void {
    this.load.json('shizuka-sprite-data', '/reaper/assets/sprites/shizuka-full.json');
  }

  create(): void {
    const R3F = () => {
      return (
        <div style={{ aspectRatio: 0.5625, height: '100%' }}>
          <Canvas>
            <Stats />
            <Camera />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} castShadow />
            <Physics>
              <Player scene={this}/>              
              <Plane/>
            </Physics>
          </Canvas>
          <DynamicJoystick />
        </div>
      )
    }

    this.reactOverlay.create(<R3F/>, this);
  }
}
