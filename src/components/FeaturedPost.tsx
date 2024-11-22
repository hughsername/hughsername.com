import { Component } from 'solid-js';
import { MaskedImage } from './MaskedImage';
import styles from './FeaturedPost.module.css';

interface FeaturedPostProps {
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  href: string;
}

export const FeaturedPost: Component<FeaturedPostProps> = (props) => {
  return (
    <a href={props.href} class={styles.container}>
      <MaskedImage src={props.src} alt={props.alt} />
      <div class={styles.content}>
        <p class="eyebrow">{props.category}</p>
        <h2 class={styles.title}>{props.title}</h2>
        <p class={styles.description}>{props.description}</p>
      </div>
    </a>
  );
};
