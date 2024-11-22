import { createSignal, onMount } from 'solid-js';
import styles from './Navigation.module.css';
import { MenuIcon } from './MenuIcon';
import { CloseIcon } from './CloseIcon';
import { PostsIcon } from './PostsIcon';
import { WorkIcon } from './WorkIcon';
import { HughIcon } from './HughIcon';
import { JoinIcon } from './JoinIcon';
import gsap from 'gsap';

export default function Navigation() {
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
      <ul class={styles.navList}>
        <li>
          <a 
            href="#" 
            class={styles.menuLink} 
            onClick={toggleMenu}
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
          </a>
        </li>
        <li 
          class={`${styles.iconGroup} ${isOpen() ? styles.open : ''}`}
          id="nav-menu"
          aria-hidden={!isOpen()}
        >
          <ul>
            <li>
              <a href="/posts" class={styles.iconLink} aria-label="Posts">
                <PostsIcon />
                <span class={styles.iconLabel}>posts</span>
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
