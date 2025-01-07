import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { CuboidCollider , RapierRigidBody, RigidBody } from "@react-three/rapier";
import { AsepriteJson, useAseprite } from './use-spritesheet';
import { World } from './World';
import { observer } from 'mobx-react-lite';

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

const ShizukaSprite = observer((props: { world: World, player?: RapierRigidBody }) => {
  const { world } = props;
  const {x,y,z} = world.worldStore.targetPosition;
  const direction = world.worldStore.direction;
  const animation = getState(props.player) + '-' + getVerticalDirection(direction) + '-' +  getHorizontalDirection(direction);

  const [texture] = useAseprite(
    '/reaper/sprites/shizuka-full.png',
    props.world.cache.json.get('shizuka-sprite-data') as AsepriteJson,
    animation,
    false,
  );
  return (
    <sprite position={[x,y,z]} >
      <spriteMaterial map={texture} />
    </sprite>
  );
});

export const Player = observer((props: { world: World }): JSX.Element => {
  const { world } = props;

  const playerRef = React.useRef<RapierRigidBody>(null);
  const {direction, isMoving } = world.worldStore;

  useFrame(() => {
    if (!playerRef.current) return;
    const { x, y, z } = playerRef.current.translation();
    world.worldStore.setTargetPosition(new THREE.Vector3(x, y, z)); 
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
        world={props.world} 
        player={playerRef.current}
      />
    </>
  )
});