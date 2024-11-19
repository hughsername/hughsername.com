import { Component } from 'solid-js';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

const Card: Component<CardProps> = (props) => {
  const isDev = import.meta.env.DEV;
  
  return (
    <div 
      class={styles.card}
      {...(isDev && { 'data-debug': 'card' })}
    >
      <article class={styles.container}>
        {props.imageUrl && (
          <div class={styles.image}>
            <img src={props.imageUrl} alt="" />
          </div>
        )}
        <div class={styles.content}>
          <h2 class={styles.title}>{props.title}</h2>
          <p>{props.description}</p>
        </div>
      </article>
    </div>
  );
};

export default Card;
