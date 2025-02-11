import { Component, JSX } from 'solid-js';
import styles from './GridItem.module.css';

interface Props {
  children: JSX.Element;
  minSpan?: number;
  maxSpan?: number;
  class?: string;
  rowHeight?: number; // Height in grid units (32px each)
}

const GridItem: Component<Props> = (props) => {
  // Calculate how many columns are available
  const totalColumns = Math.floor((1400 - 64) / 32); // (max-width - 2*padding) / column-width

  return (
    <div 
      class={`${styles.gridItem} ${props.class || ''}`}
      style={{
        'grid-column': '1 / -1', // Full width by default
        'grid-row': props.rowHeight ? `span ${props.rowHeight}` : 'span auto',
      }}
    >
      {props.children}
    </div>
  );
};

export default GridItem;
