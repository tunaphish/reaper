import * as React from 'react';
import { Canvas, useLoader } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping, DoubleSide } from 'three';
import { CameraControls, Stats } from '@react-three/drei';
import { Battle } from './Battle';
import { Html } from '@react-three/drei';
import { Enemy } from '../../model/enemy';
import { Combatant } from '../../model/combatant';
import { ResourceDisplay } from './ResourceDisplay';

const Enemy = (props: {combatant: Combatant, battleScene: Battle }) => {
  const { combatant, battleScene } = props;

  return (
    <mesh>
      <Html 
        transform
        occlude
        castShadow
        receiveShadow
      >
        <ResourceDisplay combatant={combatant} battleScene={battleScene}/>
      </Html>
    </mesh>

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

export const Stage = (props: { scene: Battle }) => {
    const { scene } = props;
    return (
    <Canvas>
        <Stats />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} castShadow />
        <Physics>
          {scene.battleStore.enemies.map((enemy) => <Enemy key={enemy.name} combatant={enemy} battleScene={scene} />)}
          <Plane/>
        </Physics>
        {/* <CameraControls /> */}
    </Canvas>
    )
  }