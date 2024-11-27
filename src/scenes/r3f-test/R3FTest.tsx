import * as React from 'react';
import * as THREE from 'three';
import ReactOverlay from '../../plugins/ReactOverlay';
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping } from 'three';
import { create } from 'zustand';
import { useDrag } from '@use-gesture/react';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'R3FTest',
};

interface R3FState {
  targetPosition: THREE.Vector3; 
  setTargetPosition: (position: THREE.Vector3) => void;
}

export const useGameStore = create<R3FState>((set) => ({
  targetPosition: new THREE.Vector3(0,0,0),
  setTargetPosition: (position) => set({ targetPosition: position }),
}));

const CAMERA_OFFSET = new THREE.Vector3(0, 5, 10);
const Camera = () => {
  const targetPosition = useGameStore((state) => state.targetPosition);
  const { camera } = useThree();
  
  useFrame(() => {
    const desiredPosition = targetPosition.clone().add(CAMERA_OFFSET);
    camera.position.lerp(desiredPosition, 0.1); 
    camera.lookAt(targetPosition); 
  });

  return null;
}

const Player = () => {
  const playerRef = React.useRef<RapierRigidBody>(null);
  const setTargetPosition = useGameStore((state) => state.setTargetPosition);

  useDrag(({ offset: [x, y], delta: [dx, dy] }) => {
    if (!playerRef.current) return;

    const velocity = {
      x: dx * 5, 
      y: 0,      
      z: dy * 5,
    };

    playerRef.current.setLinvel(velocity, true);
  }, { target: window });

  useFrame(() => {
    if (!playerRef.current) return;
    const { x, y, z } = playerRef.current.translation();
    setTargetPosition(new THREE.Vector3(x, y, z)); 
  });

  return (
    <RigidBody ref={playerRef} position={[0,10,0]} type="dynamic">
      <mesh>
        <boxGeometry />
        <meshStandardMaterial  />
      </mesh>
    </RigidBody>
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
    </RigidBody>
  )
}

export class R3FTest extends Phaser.Scene {
  private reactOverlay: ReactOverlay;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const R3F = () => {

      return (
        <>
          <Canvas>
            <Camera />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} castShadow />
            <Physics>
              <Player/>              
              <Plane/>
            </Physics>
          </Canvas>
          {/* <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none", 
            }}
          >
            <div style={{ pointerEvents: "auto", color: 'black' }} onClick={clickhi}>
              hi
            </div>
          </div> */}
        </>

      )
    }

    this.reactOverlay.create(<R3F/>, this);
  }
  

}


