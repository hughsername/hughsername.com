import { Component, JSX } from 'solid-js';
import styles from './MaskedImage.module.css';

interface Props {
  src: string;
  alt: string;
  class?: string;
  /** Horizontal position offset in pixels */
  positionX?: number;
  /** Vertical position offset in pixels */
  positionY?: number;
}

export const MaskedImage: Component<Props> = (props) => {
  const position = () => `${props.positionX ?? 0}% ${props.positionY ?? -450}px`;

  return (
    <div class={`${styles.container} ${props.class}`}>
      <svg 
        width="717" 
        height="373" 
        class={styles.svg}
        viewBox="-20 -20 717 373"
      >
        <defs>
          <filter id="shadow">
            <fedropshadow
              dx="0"
              dy="4"
              std-deviation="10"
              flood-opacity="0.25"
            />
          </filter>
          <mask id="imageMask">
            <path 
              fill="white"
              d="M146.333 29.3403C184.314 29.3403 183.781 -0.0752263 219.229 0.00238732L457.874 1.84284e-05C493.218 -0.026851 492.723 29.338 530.666 29.3379L673 29.3402C675.209 29.3403 677 31.1311 677 33.3402V328.502C677 330.712 675.209 332.502 673 332.502H530.666C492.723 332.502 493.218 303.138 457.874 303.165H219.229C183.781 303.087 184.314 332.502 146.333 332.502H4C1.79086 332.502 0 330.712 0 328.502V33.3403C0 31.1312 1.79086 29.3403 4 29.3403H146.333Z" 
            />
          </mask>
          <path 
            id="shadowPath"
            d="M146.333 29.3403C184.314 29.3403 183.781 -0.0752263 219.229 0.00238732L457.874 1.84284e-05C493.218 -0.026851 492.723 29.338 530.666 29.3379L673 29.3402C675.209 29.3403 677 31.1311 677 33.3402V328.502C677 330.712 675.209 332.502 673 332.502H530.666C492.723 332.502 493.218 303.138 457.874 303.165H219.229C183.781 303.087 184.314 332.502 146.333 332.502H4C1.79086 332.502 0 330.712 0 328.502V33.3403C0 31.1312 1.79086 29.3403 4 29.3403H146.333Z"
            fill="black"
            filter="url(#shadow)"
          />
        </defs>
        <use href="#shadowPath" />
      </svg>
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
}
