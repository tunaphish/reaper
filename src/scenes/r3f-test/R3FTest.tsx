import * as React from 'react';
import * as THREE from 'three';
import ReactOverlay from '../../plugins/ReactOverlay';
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping } from 'three';
import { create } from 'zustand';
import { Stats } from '@react-three/drei';
import { DynamicJoystick } from './DynamicJoystick';
import { AsepriteJson, useAseprite } from './use-spritesheet';

function angleToDirection3D(angleInRadians: number): THREE.Vector3 {
  const x = Math.cos(angleInRadians); 
  const z = Math.sin(angleInRadians); 
  return new THREE.Vector3(x, 0, z).normalize(); 
}

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

const ShizukaSprite = (props: { animation: string, paused: boolean, scene: R3FTest }) => {
  const spriteRef = React.useRef<THREE.Sprite>(null); // Sprite reference
  const {x,y,z} = useGameStore((store) => store.targetPosition);
  const shizukaSpriteData = props.scene.cache.json.get('shizuka-sprite-data');
  const [texture] = useAseprite(
    '/reaper/assets/sprites/shizuka.png',
    shizukaSpriteData as AsepriteJson,
    props.animation,
    props.paused,
  );
  useFrame(() => {
    if (!spriteRef) return;
    spriteRef.current.position.set(x,y,z);
  })

  return (
    <sprite position={[0,0,0]} ref={spriteRef}>
      <spriteMaterial map={texture} />
    </sprite>
  );
};

const Player = (props: { scene: R3FTest }) => {
  const playerRef = React.useRef<RapierRigidBody>(null);
  const direction = useGameStore((state) => state.direction);
  const setTargetPosition = useGameStore((state) => state.setTargetPosition);

  useFrame(() => {
    if (!playerRef.current) return;
    const { x, y, z } = playerRef.current.translation();
    setTargetPosition(new THREE.Vector3(x, y, z)); 

    if (!direction) return;
    const direction3d = angleToDirection3D(direction);    
    const SPEED = 7;
    const velocity = direction3d.multiplyScalar(SPEED);
    playerRef.current?.setLinvel(velocity, true);
  });

  return (
    <>
      <RigidBody ref={playerRef} type="dynamic">
        <mesh visible={false}>
          <boxGeometry />
          <meshStandardMaterial  />
        </mesh>
        <CuboidCollider args={[0.5, 0.5, 0.5]} friction={0} restitution={0} />
      </RigidBody>
      <ShizukaSprite
        scene={props.scene} 
        paused={false}
        animation={'run-up-neutral'}
      />
    </>
  )
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
    this.load.json('shizuka-sprite-data', '/reaper/assets/sprites/shizuka.json');
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


