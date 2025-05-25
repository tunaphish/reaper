import * as React from 'react';
import styles from './battle.module.css';


export const Meter = (props: { value: number, max: number, className?: string }) => {
  const { className, value, max } = props;

  return (
    <div className={[styles.meterBackground, className].join(' ')}>
      <div className={styles.meter} style={{ width: Math.min(Math.round(value/max * 100), 100) + "%" }}/>
    </div>
  )
}
