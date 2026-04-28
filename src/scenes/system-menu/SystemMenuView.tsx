
import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import classNames from './system-menu.module.css';
import { SystemMenu } from './SystemMenu';
import { Menu } from './systemMenuStore';
import { observer } from 'mobx-react-lite';
import { Enemy } from '../../model/enemy';
import { Window } from '../ui/Window';
import { ImageWindowContent } from '../ui/ImageWindowContent';
import { EventType, ImageWindow } from '../../model/encounter';
import { MenuOptionsView } from '../ui/MenuOptionsView';
import { PanelWindow } from '../ui/Window';

import { Ticker } from './Ticker';


export const SystemMenuView = observer((props: { systemMenu: SystemMenu }): JSX.Element => {
  const { systemMenu } = props
  return (
    <div className={classNames.container}>
      <AnimatePresence>
        { systemMenu.systemMenuStore.enemyJournalContent && <DisplayedEnemy enemy={systemMenu.systemMenuStore.enemyJournalContent} />}
        <InfoView systemMenu={systemMenu} />
      </AnimatePresence>
      <MenuStack systemMenu={systemMenu}/>
      <ExitBar systemMenu={systemMenu} />
    </div>
)
});

// TODO: Hold to Escape
const ExitBar = observer((props: { systemMenu: SystemMenu }): JSX.Element => {
  const { systemMenu } = props
  const style: React.CSSProperties = {
    width: '100%',
    color: 'var(--paper-offwhite)',
  }
  
  const onClick = () => {
    systemMenu.playChoiceSelectSound();
    systemMenu.endScene();
  }

  return (
    <Window onClick={onClick} style={style}>Exit</Window>
  )
});

const getEnemyImageView = (enemy: Enemy): ImageWindow => {
  return {
    type: EventType.IMAGE,
    layout: {
      x: 100,
      y: 200,
      width: 250,
      height: 250,
    },
    layers: [{
      src: enemy.combatPortraitSrc,
    }]
  }
}

const DisplayedEnemy = (props: { enemy: Enemy }): JSX.Element => {
  const enemyImageWindow: ImageWindow = getEnemyImageView(props.enemy);
  return (
    <>
      <PanelWindow window={enemyImageWindow}>
        <ImageWindowContent imageWindow={enemyImageWindow}/>
      </PanelWindow>
      <Window style={{ position: 'absolute', top: '175px', left: '100px', padding: '5px' }}>{props.enemy.name}</Window>
      <Window style={{ position: 'absolute', top: '400px', left: '75px', width: '300px', padding: '5px'  }}>{props.enemy.journalDescription}</Window>
    </>
  )
}

const InfoView = (props: { systemMenu: SystemMenu }): JSX.Element => (
  <>
    <div className={classNames.infoViewWrapper}>
      <Window style={{ padding: '5px', marginBottom: '5px' }} delay={0.05}>Location: {props.systemMenu.locationName}</Window>
      {props.systemMenu.musicKey && <Window style={{ padding: '5px', width: '200px' }} delay={0.15}><Ticker text={"Now Playing: " + props.systemMenu.musicKey}/></Window>}
    </div>
    <Window style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px' }} delay={0.25}>Spirits: {props.systemMenu.systemMenuStore.playerSave.spirits}</Window>
  </>
)



const MenuView = observer((props: { systemMenu: SystemMenu, menu: Menu, idx: number, verticalOffset: number, horizontalOffset: number }): JSX.Element => {
  const { systemMenu, menu, idx, verticalOffset, horizontalOffset } = props;
  const isTopMenu = systemMenu.systemMenuStore.menus.length-1 === idx;

  const style: React.CSSProperties = {
    position: "absolute",
    top: verticalOffset + "px", 
    left: horizontalOffset + "px",
  }


  const onClickExit = (e) => {
    e.stopPropagation();
    if (!isTopMenu) return;
    systemMenu.popMenu();
  }

  return (
    <Window style={style}>
      <div className={classNames.windowTitleBar} onClick={(e) => onClickExit(e)}>
        <div className={classNames.menuTitleText}>{menu.title}</div>
        <div>X</div>
      </div>
      <div className={classNames.menuContent} style={{ width: 'max-content' }}>
        <MenuOptionsView 
          items={menu.menuOptions}
          getKey={(item) => item.display} 
          renderLabel={(item) => item.display()}
          onSelect={(item) => { 
            if (!isTopMenu) return;
            systemMenu.playChoiceSelectSound(); 
            item.execute();
          }}
          isCursor={menu.isCursor}
        /> 
      </div>
    </Window>
  )
});


const MenuStack = observer((props: { systemMenu: SystemMenu }): JSX.Element => {
  const { systemMenu } = props;
  const { menus } = systemMenu.systemMenuStore;
  const [widths, setWidths] = React.useState({});

  const setWidth = (idx, el) => {
    if (!el) return;
    const w = el.offsetWidth;
    setWidths(prev => (prev[idx] === w ? prev : { ...prev, [idx]: w }));
  };

 return (
    <div className={classNames.menuStackContainer}>
      {menus.map((menu, idx) => {
        const verticalOffset = (-20*idx) + (-20*menus[0].menuOptions.length);

        const prevWidth = widths[idx - 1] || 0;
        const direction = idx % 2 === 0 ? -1 : 1;
        const horizontalOffset = direction * (prevWidth / 2 + 20);

        return (
          <div ref={(el) => setWidth(idx, el)} key={idx}>
            <MenuView
              systemMenu={systemMenu}
              menu={menu}
              verticalOffset={verticalOffset}
              idx={idx}
              horizontalOffset={horizontalOffset}
            />
          </div>
        );
      })}
    </div>
  )
});

// #endregion