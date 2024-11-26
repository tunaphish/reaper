import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import { Canvas, useLoader } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { OrbitControls } from '@react-three/drei';
import { TextureLoader, RepeatWrapping } from 'three';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'R3FTest',
};

const Player = (props: { playerPosition: number[] }) => {
  return (
    <RigidBody position={props.playerPosition}>
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
    const clickhi = () => {
      this.scene.start('R3FTest2');
    }

    const R3F = () => {
      const [playerPosition, setPlayerPosition] = React.useState<number[]>([0,10,0]);
      return (
        <>
          <Canvas>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} castShadow />
            <Physics>
              <Player playerPosition={playerPosition}/>              
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


