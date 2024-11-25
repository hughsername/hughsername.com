import { Component, createEffect, onMount } from 'solid-js';
import { createSignal } from 'solid-js';
import styles from './MaskedImage.module.css';

interface Props {
  src: string;
  alt: string;
  class?: string;
  positionX?: number;
  positionY?: number;
}

export const MaskedImage: Component<Props> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  const [yPosition, setYPosition] = createSignal('-450px');
  
  const updatePosition = () => {
    if (!containerRef) return;
    const containerWidth = containerRef.offsetWidth;
    const scale = containerWidth / 677;
    const basePosition = -450;
    setYPosition(`${basePosition * scale}px`);
  };

  onMount(() => {
    const observer = new ResizeObserver(updatePosition);
    if (containerRef) {
      observer.observe(containerRef);
      updatePosition();
    }
    return () => observer.disconnect();
  });

  return (
    <div 
      class={`${styles.container} masked-image ${props.class ?? ''}`}
      ref={(el) => { containerRef = el; }}
    >
      <div class={styles.imageContainer}>
        <div class={styles.gradient} />
        <img
          src={props.src}
          alt={props.alt}
          class={styles.image}
          style={`object-position: ${props.positionX ?? 0}% ${yPosition()};`}
        />
      </div>
    </div>
  );
};
