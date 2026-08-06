
import * as React from 'react';
import classNames from './world.module.css';
import { World } from './World';
import { observer } from 'mobx-react-lite';
import { Window } from '../ui/Window';


export const WorldView = observer((props: { world: World }): JSX.Element => {
  const { world } = props
  return (
    <div className={classNames.container}>
      <MenuBar world={world}/>
    </div>
)
});


const MenuBar = observer(({world}: {world: World}) => {
  const style: React.CSSProperties = {
    width: '100%',
    color: 'var(--paper-offwhite)',
  }
  
  const onClick = () => {
    // world.openSystemMenu()
    world.openTalkEncounter();
  }

  return (
    <Window onClick={onClick} style={style}>Menu</Window>
  )
});
