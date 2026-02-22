import classNames from './world.module.css';
import * as React from 'react';

export const Ticker = ({ text }: { text: string; }) => (
  <div className={classNames.ticker}>
    <div className={classNames.tickerTrack}>
      <span>{text}&nbsp;&nbsp;</span>
      <span>{text}&nbsp;&nbsp;</span>
    </div>
  </div>
);
