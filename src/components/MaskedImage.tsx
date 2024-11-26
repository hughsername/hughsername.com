import { Component, createSignal, onMount } from 'solid-js';
import styles from './MaskedImage.module.css';
import HUDOverlay from './HUDOverlay';

interface Props {
  src: string;
  srcset?: string;
  alt: string;
  class?: string;
  positionX?: number;
  positionY?: number;
  sizes?: string;
}

export const MaskedImage: Component<Props> = (props) => {
  const [yPosition, setYPosition] = createSignal('-450px');
  let containerRef: HTMLDivElement | undefined;

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
      ref={el => { containerRef = el; }}
    >
      <div class={styles.imageContainer}>
        <div class={styles.gradient}>
          <HUDOverlay class={styles.graphPaper} />
        </div>
        <img
          src={props.src}
          srcset={props.srcset}
          alt={props.alt}
          class={styles.image}
          style={`object-position: ${props.positionX ?? 0}% ${yPosition()}`}
          loading="lazy"
          decoding="async"
          sizes={props.sizes}
          fetchpriority="high"
        />
      </div>
    </div>
  );
};
