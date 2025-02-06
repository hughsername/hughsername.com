import { createSignal, onMount, Show } from 'solid-js';
import styles from './Navigation.module.css';
import { MenuIcon } from './MenuIcon';
import { CloseIcon } from './CloseIcon';
import { PostsIcon } from './PostsIcon';
import { WorkIcon } from './WorkIcon';
import { HughIcon } from './HughIcon';
import { JoinIcon } from './JoinIcon';
import { LiquidShader } from './LiquidShader';
import gsap from 'gsap';

export default function Navigation() {
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => {
    setIsClient(true);
  });
  const [isOpen, setIsOpen] = createSignal(false);
  let menuIconRef: HTMLDivElement;
  let closeIconRef: HTMLDivElement;

  onMount(() => {
    gsap.set(closeIconRef, { 
      opacity: 0,
      scale: 0.8,
      rotate: -45
    });
  });

  const toggleMenu = (e: MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen());

    const duration = 0.4;
    const ease = "power2.inOut";

    if (isOpen()) {
      // Animate to close icon
      gsap.to(menuIconRef, {
        opacity: 0,
        scale: 0.8,
        rotate: 45,
        duration,
        ease
      });
      gsap.to(closeIconRef, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration,
        ease
      });
    } else {
      // Animate to menu icon
      gsap.to(menuIconRef, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration,
        ease
      });
      gsap.to(closeIconRef, {
        opacity: 0,
        scale: 0.8,
        rotate: -45,
        duration,
        ease
      });
    }
  };

  return (
    <nav class={styles.nav} aria-label="Main">
      <div class={styles.shaderContainer}>
        <Show when={isClient()}>
          <LiquidShader />
        </Show>
      </div>
      <div 
        class={styles.menuTrigger}
        onClick={toggleMenu}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen()}
        aria-controls="nav-menu"
      />
      <ul class={styles.navList}>
        <li>
          <div 
            class={styles.menuLink}
            aria-expanded={isOpen()}
            aria-controls="nav-menu"
          >
            <div class={styles.iconWrapper}>
              <div ref={menuIconRef}>
                <MenuIcon />
              </div>
              <div ref={closeIconRef} class={styles.closeIcon}>
                <CloseIcon />
              </div>
            </div>
            <span class={styles.menuLabel}>
              {isOpen() ? 'close' : 'menu'}
            </span>
          </div>
        </li>
        <li 
          class={`${styles.iconGroup} ${isOpen() ? styles.open : ''}`}
          id="nav-menu"
          aria-hidden={!isOpen()}
        >
          <ul>
            <li>
              <a href="/blog" class={styles.iconLink} aria-label="Blog">
                <PostsIcon />
                <span class={styles.iconLabel}>blog</span>
              </a>
            </li>
            <li>
              <a href="/work" class={styles.iconLink} aria-label="Work">
                <WorkIcon />
                <span class={styles.iconLabel}>work</span>
              </a>
            </li>
            <li>
              <a href="/hugh" class={styles.iconLink} aria-label="Hugh">
                <HughIcon />
                <span class={styles.iconLabel}>hugh</span>
              </a>
            </li>
            <li>
              <a href="/join" class={styles.iconLink} aria-label="Join">
                <JoinIcon />
                <span class={styles.iconLabel}>join</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
