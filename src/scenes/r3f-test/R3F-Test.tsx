import * as React from 'react';
import ReactOverlay from '../../plugins/ReactOverlay';
import { Canvas, advance } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'R3FTest',
};

export class R3FTest extends Phaser.Scene {
  private reactOverlay: ReactOverlay;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {


    const R3F = () => {
      return (
        <Canvas>
          <Physics>
            {/* Example Physics Objects */}
            <RigidBody>
              <mesh position={[0, 5, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial  />
              </mesh>
            </RigidBody>
            <RigidBody type="fixed">
              <mesh position={[0, -1, 0]}>
                <boxGeometry args={[10, 1, 10]} />
                <meshStandardMaterial  />
              </mesh>
            </RigidBody>
          </Physics>
        </Canvas>
      )
    }

    this.reactOverlay.create(<R3F/>, this);
  }
  

}


