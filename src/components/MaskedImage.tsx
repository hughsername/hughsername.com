import { Component } from 'solid-js';
import styles from './MaskedImage.module.css';

interface Props {
  src: string;
  alt: string;
  class?: string;
  positionX?: number;
  positionY?: number;
}

export const MaskedImage: Component<Props> = (props) => {
  const position = () => `${props.positionX ?? 0}% ${props.positionY ?? -450}px`;

  return (
    <div class={`${styles.container} masked-image ${props.class ?? ''}`}>
      <div class={styles.imageContainer}>
        <div class={styles.gradient} />
        <img
          src={props.src}
          alt={props.alt}
          class={styles.image}
          style={`object-position: ${position()};`}
        />
      </div>
    </div>
  );
};
