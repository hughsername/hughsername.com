import { Component, createSignal } from 'solid-js';
import styles from './CodeBlock.module.css';
import CopyIcon from './icons/CopyIcon';

interface Props {
  language?: string;
  code: string;
  variant?: 'light' | 'dark';
  html?: string; // For Astro's syntax highlighted HTML
}

const CodeBlock: Component<Props> = (props) => {
  const variant = props.variant || 'dark';
  const [copied, setCopied] = createSignal(false);
  
  const copyToClipboard = async () => {
    const textToCopy = props.code;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <div class={`${styles.container} ${styles[variant]}`}>
      <div class={styles.header}>
        <span class={styles.language}>{props.language || 'javascript'}</span>
        <div class={styles.actions}>
          <button
            class={styles.copyButton}
            onClick={copyToClipboard}
            title="Copy to clipboard"
            aria-label="Copy code to clipboard"
          >
            <CopyIcon />
            <span class={styles.copyText}>{copied() ? 'Copied!' : ''}</span>
          </button>
          <div class={styles.dots}>
            <span class={styles.dot} />
            <span class={styles.dot} />
            <span class={styles.dot} />
          </div>
        </div>
      </div>
      <pre class={styles.pre}>
        {props.html ? (
          <code class={styles.code} innerHTML={props.html} />
        ) : (
          <code class={styles.code}>{props.code}</code>
        )}
      </pre>
    </div>
  );
};

export default CodeBlock;
