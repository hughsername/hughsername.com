import { Component } from 'solid-js';
import { MaskedImage } from './MaskedImage';
import styles from './FeaturedPost.module.css';

interface FeaturedPostProps {
  src: string;
  srcset?: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  href: string;
}

export const FeaturedPost: Component<FeaturedPostProps> = (props) => {
  return (
    <article class={styles.container}>
      <MaskedImage 
        src={props.src}
        alt={props.alt}
        srcset={props.srcset}
      />
      <div class={styles.content}>
        <div class={styles.category}>{props.category}</div>
        <h2 class={styles.title}>{props.title}</h2>
        <p class={styles.description}>{props.description}</p>
        <a href={props.href} class={styles.link}>
          Read More
        </a>
      </div>
    </article>
  );
};
