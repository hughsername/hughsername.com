import { createSignal, onMount, onCleanup } from 'solid-js';
import styles from './ViewportDebug.module.css';

export default function ViewportDebug() {
  const [width, setWidth] = createSignal(0);

  onMount(() => {
    // Set initial width after component mounts in the browser
    setWidth(window.innerWidth);
    
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    onCleanup(() => window.removeEventListener('resize', handleResize));
  });

  return (
    <div class={styles.debug}>
      <code>{width() === 0 ? 'Loading...' : `${width()}px`}</code>
    </div>
  );
}
