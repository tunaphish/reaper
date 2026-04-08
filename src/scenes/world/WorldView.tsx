
import * as React from 'react';
import classNames from './world.module.css';
import { World } from './World';
import { observer } from 'mobx-react-lite';
import { Window } from '../ui/Window';


export const WorldView = observer((props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      <StartBar world={world}/>
    </div>
)
});

export const StartBar = observer(({world}: {world: World}) => {

  return (
    <Window onClick={() => world.openSystemMenu()} style={{ position: 'relative' }}>
      start    
    </Window>
  )
});
