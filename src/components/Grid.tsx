import { Component, JSX } from 'solid-js';
import styles from './Grid.module.css';

interface Props {
  children: JSX.Element;
  minSpan?: number; // Minimum number of 32px columns to span
  maxSpan?: number; // Maximum number of 32px columns to span
  class?: string;
}

const Grid: Component<Props> = (props) => {
  const minWidth = props.minSpan ? `${props.minSpan * 32}px` : 'auto';
  const maxWidth = props.maxSpan ? `${props.maxSpan * 32}px` : 'none';
  
  return (
    <div 
      class={`${styles.gridItem} ${props.class || ''}`}
      style={{
        'min-width': minWidth,
        'max-width': maxWidth,
      }}
    >
      {props.children}
    </div>
  );
};

export default Grid;
