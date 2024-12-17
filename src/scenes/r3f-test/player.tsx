import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { CuboidCollider , RapierRigidBody, RigidBody } from "@react-three/rapier";
import { AsepriteJson, useAseprite } from './use-spritesheet';
import { R3FTest, useGameStore } from './R3FTest';

const angleToDirection3D = (angleInRadians: number): THREE.Vector3 => {
    const x = Math.cos(angleInRadians); 
    const z = Math.sin(angleInRadians); 
    return new THREE.Vector3(x, 0, z).normalize(); 
}

const getVerticalDirection = (radians: number): string => {
  if ((radians > 0.383972 && radians < 2.740167) || (radians < -3.525565 && radians > -5.881758)) {
    return 'down';
  } else if ((radians > 3.525565 && radians < 5.881758) || (radians < -0.383972 && radians > -2.740167)) {
    return 'up';
  }
  return 'neutral';
}

const getHorizontalDirection = (radians?: number): string =>{
  const absRadians = Math.abs(radians);
  if (absRadians > 2.094) return 'left';
  if (absRadians > 1.047) return 'neutral';
  return 'right';
}

const getState = (player?: RapierRigidBody): string => {
  if (!player) return 'idle';
  const linvel = player.linvel();
  const speed = Math.sqrt(linvel.x ** 2 + linvel.y ** 2 + linvel.z ** 2); 
  if (speed > 1) return 'run';
  return 'idle';
}

const ShizukaSprite = (props: { scene: R3FTest, player?: RapierRigidBody }) => {
  const spriteRef = React.useRef<THREE.Sprite>(null); // Sprite reference
  const {x,y,z} = useGameStore((store) => store.targetPosition);
  const direction = useGameStore((state) => state.direction);
  const animation = getState(props.player) + '-' + getVerticalDirection(direction) + '-' +  getHorizontalDirection(direction);

  const [texture] = useAseprite(
    '/reaper/assets/sprites/shizuka-full.png',
    props.scene.cache.json.get('shizuka-sprite-data') as AsepriteJson,
    animation,
    false,
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

export const Player = (props: { scene: R3FTest }): JSX.Element => {
  const playerRef = React.useRef<RapierRigidBody>(null);
  const direction = useGameStore((state) => state.direction);
  const isMoving = useGameStore((state) => state.isMoving);
  const setTargetPosition = useGameStore((state) => state.setTargetPosition);

  useFrame(() => {
    if (!playerRef.current) return;
    const { x, y, z } = playerRef.current.translation();
    setTargetPosition(new THREE.Vector3(x, y, z)); 
    if (!isMoving) return;
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
        player={playerRef.current}
      />
    </>
  )
}