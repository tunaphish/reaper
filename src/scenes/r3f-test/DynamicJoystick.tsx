import * as React from 'react';
import { R3FTest } from './R3FTest';

const getDirectionInRadians = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angleRadians = Math.atan2(dy, dx);  
    return angleRadians;
}

const getDistance = (x1, y1, x2, y2) =>  {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

const size = 100;
export const DynamicJoystick = (props: { world: R3FTest }): JSX.Element => {
  const { world } = props;
  const [joystick, setJoystick] = React.useState<{ x: number; y: number } | null>(null);

  const onpointstart = (e: React.MouseEvent | React.TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e as React.MouseEvent;
    setJoystick({ x: touch.clientX, y: touch.clientY });
  };

  const onpointend = () => {
    setJoystick(null);
    world.worldStore.setIsMoving(false);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!joystick) return;
    const touch = 'touches' in e ? e.touches[0] : e as React.MouseEvent;
    const distance = getDistance(joystick.x, joystick.y, touch.clientX, touch.clientY);
    if (distance < size/2) return;
    world.worldStore.setIsMoving(true);
    const direction = getDirectionInRadians(joystick.x, joystick.y, touch.clientX, touch.clientY); 
    world.worldStore.setDirection(direction);
  };

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
      }}
      onTouchStart={onpointstart}
      onMouseDown={onpointstart}
      onTouchEnd={onpointend}
      onMouseUp={onpointend}
      onTouchMove={handleMove}
      onMouseMove={handleMove}
    >
      {joystick && (
            <div
            style={{
              position: 'absolute',
              left: joystick.x - (size / 2),
              top: joystick.y - (size / 2),
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              backgroundColor: 'rgba(200, 200, 200, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}

          />
      )}
    </div>
  );
};

