import { Component } from 'solid-js';
import styles from './CodeBlock.module.css';

interface Props {
  language?: string;
  code: string;
}

const CodeBlock: Component<Props> = (props) => {
  return (
    <div class={styles.container}>
      <div class={styles.header}>
        <span class={styles.language}>{props.language || 'javascript'}</span>
        <div class={styles.dots}>
          <span class={styles.dot} />
          <span class={styles.dot} />
          <span class={styles.dot} />
        </div>
      </div>
      <pre class={styles.pre}>
        <code class={styles.code}>{props.code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
