import { createSignal, onCleanup } from 'solid-js';
import styles from './icons.module.css';

export default function CopyIcon() {
  const [angle, setAngle] = createSignal(0);
  let animationFrame: number;

  const animate = () => {
    setAngle(prev => (prev + 0.2) % 360);
    animationFrame = requestAnimationFrame(animate);
  };

  onCleanup(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });

  return (
    <div class={styles.iconWrapper} onMouseEnter={() => animate()} onMouseLeave={() => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      setAngle(0);
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ '--angle': `${angle()}deg` }}>
        <path d="M5.99901 1L5.52646 11.8804C5.51097 12.237 5.75771 12.5516 6.10769 12.6216L7 12.8001M16 18.5L7.89384 15.6393C7.64958 15.5531 7.46999 15.343 7.42291 15.0883L7 12.8001M3.49901 2L12.9736 4.84223C13.2846 4.93551 13.4954 5.2244 13.4894 5.54899L13.444 8M14.9996 19L15.4705 10.0427C15.4874 9.72118 15.2899 9.42712 14.9858 9.32116L13.4013 8.76898M17.4995 18L8.05558 15.167C7.73043 15.0694 7.51674 14.759 7.54165 14.4205L7.65129 12.9303M1.5 2.5L12.5437 5.41922M5.49955 3L5.04303 12.1387C5.0183 12.6336 5.35976 13.072 5.84567 13.1691L12.5 14.5M15.499 18L15.9695 9.52319C15.9868 9.211 15.8018 8.92297 15.5106 8.80899L13.444 8M13.444 8L13.4013 8.76898M13.4013 8.76898L13.0621 13.1854C13.0289 13.6185 12.6243 13.925 12.1984 13.8398L7.65129 12.9303M7.65129 12.9303L7 12.8001" 
          class={styles.iconStroke} 
          stroke-width="1.25" 
          stroke-linecap="round"/>
        <defs>
          <linearGradient id="paint0_linear_2229_1406" x1="17.4996" y1="1" x2="14.5333" y2="20.9389" gradientUnits="userSpaceOnUse">
            <stop stop-color="#004CFF"/>
            <stop offset="0.18" stop-color="#0049F5"/>
            <stop offset="0.26" stop-color="#0048F0"/>
            <stop offset="0.33" stop-color="#0045E6"/>
            <stop offset="0.44" stop-color="#0042DB"/>
            <stop offset="0.5" stop-color="#003FD1"/>
            <stop offset="0.56" stop-color="#003DCC"/>
            <stop offset="0.61" stop-color="#003AC2"/>
            <stop offset="0.67" stop-color="#0037B8"/>
            <stop offset="0.74" stop-color="#0035B3"/>
            <stop offset="0.82" stop-color="#0031A3"/>
            <stop offset="1" stop-color="#012E99"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
