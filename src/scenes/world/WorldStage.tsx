import * as React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping } from 'three';
import { Stats } from '@react-three/drei';
import { Player } from './player';
import { observer } from 'mobx-react-lite';
import { World } from './World';


const CAMERA_OFFSET = new THREE.Vector3(0, 5, 10);
const Camera = observer((props: { world: World }) => {
  const { world } = props;
  const { camera } = useThree();
  
  useFrame(() => {
    const desiredPosition = world.worldStore.targetPosition.clone().add(CAMERA_OFFSET);
    camera.position.lerp(desiredPosition, 0.1); 
  });

  return null;
});

const Plane = () => {
  const checkerTexture = useLoader(TextureLoader, '/reaper/textures/checker.svg')
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

export const WorldStage = (props: { world: World }) => {
  return (
      <Canvas>
        <Stats />
        <Camera world={props.world}/>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} castShadow />
        <Physics>
          <Player world={props.world}/>              
          <Plane/>
        </Physics>
      </Canvas>
  )
};