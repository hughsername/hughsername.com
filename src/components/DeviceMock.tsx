import { Component } from 'solid-js';
import styles from './DeviceMock.module.css';

interface Props {
  class?: string;
  imageSrc: string;
  children?: any;
}

const DeviceMock: Component<Props> = (props) => {
  return (
    <div class={`${styles.deviceFrame} ${props.class || ''}`}>
      <div class={styles.screen}>
        <div class={styles.imageContainer}>
          <img
            src={props.imageSrc}
            alt="Mountain landscape"
            class={styles.image}
          />
          <div class={styles.gradient} />
          <div class={styles.content}>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceMock;
