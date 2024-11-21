import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav class={styles.nav}>
      {/* Placeholder icons for now */}
      <button class={styles.hamburger} aria-label="Menu">☰</button>
      <div class={styles.icons}>
        <button aria-label="Icon 1">1</button>
        <button aria-label="Icon 2">2</button>
        <button aria-label="Icon 3">3</button>
      </div>
    </nav>
  );
}
