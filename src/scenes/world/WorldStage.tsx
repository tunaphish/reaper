import * as React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { BatchedRenderer, QuarksLoader, QuarksUtil } from 'three.quarks'
import { OrbitControls, Stats } from '@react-three/drei';
import { Player } from './player';
import { observer } from 'mobx-react-lite';
import { World } from './World';

const Thing = (props: { world: World }) =>{
  // how does it know what position?
  // why is state necessary
  const { world } = props;
  const [batchRenderer] = React.useState(new BatchedRenderer())

  const { scene } = useThree()
  React.useEffect(() => {
    const loader = new QuarksLoader();

    world.events.on('play-particle', () => {
      loader.load(
        '/reaper/effects/ps.json',
        (obj) => {
          QuarksUtil.addToBatchRenderer(obj, batchRenderer);
          QuarksUtil.setAutoDestroy(obj, true);
          obj.scale.set(0.1, 0.1, 0.1);
          QuarksUtil.play(obj);
          scene.add(obj);
        },
      )
      scene.add(batchRenderer);
    });

  }, [])

  useFrame((state, delta) => {
    batchRenderer.update(delta)
  })

  return null;
}

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
  const checkerTexture = useLoader(THREE.TextureLoader, '/reaper/textures/checker.svg')
  checkerTexture.wrapS = checkerTexture.wrapT = THREE.RepeatWrapping;
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

export const WorldStage = (props: { world: World }): JSX.Element => {
  const { world } = props;
  const [frameloop, setFrameloop] = React.useState<"always" | "demand" | "never">("always");
  React.useEffect(() => {
    props.world.events.on('pause', () => {
      setFrameloop("never");
    });
    props.world.events.on('resume', () => {
      setFrameloop("always");
    });
  })

  return (
      <Canvas frameloop={frameloop}>
        <Stats />
        {/* <Camera world={world}/> */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} castShadow />
        <Thing world={world}/>
        <Physics>
          <Player world={world}/>              
          <Plane/>
        </Physics>

        <OrbitControls />
      </Canvas>
  )
};