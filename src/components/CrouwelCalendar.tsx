import { createSignal } from 'solid-js';
import styles from './CrouwelCalendar.module.css';

const MONTH_LAYOUTS = {
  january: [
    { letter: 'j', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'a', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'n', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'u', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'a', startColumn: 4, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'r', startColumn: 5, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'y', startColumn: 6, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  february: [
    { letter: 'f', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'e', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'b', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'r', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'u', startColumn: 4, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'a', startColumn: 5, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'r', startColumn: 6, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  march: [
    { letter: 'm', startColumn: 0, clipColumns: 2, scale: 1, xOffset: '0' },
    { letter: 'a', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'r', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'c', startColumn: 4, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'h', startColumn: 5, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  april: [
    { letter: 'a', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'p', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'r', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'i', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'l', startColumn: 4, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  may: [
    { letter: 'm', startColumn: 0, clipColumns: 2, scale: 1, xOffset: '-0.9rem' },
    { letter: 'a', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '-0.5rem' },
    { letter: 'y', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  june: [
    { letter: 'j', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'u', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'n', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'e', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  july: [
    { letter: 'j', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'u', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'l', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'y', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  august: [
    { letter: 'a', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'u', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'g', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'u', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 's', startColumn: 4, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 't', startColumn: 5, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  september: [
    { letter: 's', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'e', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'p', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 't', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'e', startColumn: 4, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'm', startColumn: 5, clipColumns: 2, scale: 1, xOffset: '0' }
  ],
  october: [
    { letter: 'o', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'c', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 't', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'o', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'b', startColumn: 4, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'e', startColumn: 5, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'r', startColumn: 6, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  november: [
    { letter: 'n', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'o', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'v', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'e', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'm', startColumn: 4, clipColumns: 2, scale: 1, xOffset: '0' },
    { letter: 'b', startColumn: 6, clipColumns: 1, scale: 1, xOffset: '0' }
  ],
  december: [
    { letter: 'd', startColumn: 0, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'e', startColumn: 1, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'c', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'e', startColumn: 3, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'm', startColumn: 4, clipColumns: 2, scale: 1, xOffset: '0' },
    { letter: 'b', startColumn: 6, clipColumns: 1, scale: 1, xOffset: '0' }
  ]
} as const;

interface Props {
  variant?: 'light' | 'dark';
}

export default function CrouwelCalendar(props: Props) {
  const monthLayout = MONTH_LAYOUTS.may;

  const days = [
    { day: "M", dates: ["1", "8", "15", "22", "29"] },
    { day: "T", dates: ["2", "9", "16", "23", "30"] },
    { day: "W", dates: ["3", "10", "17", "24", "31"] },
    { day: "T", dates: ["4", "11", "18", "25"] },
    { day: "F", dates: ["5", "12", "19", "26"] },
    { day: "S", dates: ["6", "13", "20", "27"] },
    { day: "S", dates: ["7", "14", "21", "28"] }
  ];

  return (
    <div class={`${styles.calendar} ${props.variant === 'light' ? styles.light : ''}`}>
      <div class={styles.gridOverlay}>
        {[...Array(6)].map((_, i) => (
          <div class={styles.gridLine} />
        ))}
      </div>
      <div class={styles.monthContainer}>
        {monthLayout.map((letterConfig, index) => (
          <div 
            class={styles.letterCell}
            style={{
              'grid-column': `${letterConfig.startColumn + 1} / span ${letterConfig.clipColumns}`,
            }}
          >
            <span style={{
              'transform': `scale(${letterConfig.scale})`,
              'left': letterConfig.xOffset
            }}>
              {letterConfig.letter}
            </span>
          </div>
        ))}
      </div>
      <div class={styles.daysContainer}>
        {days.map((column) => (
          <div class={styles.dayColumn}>
            <div class={styles.dayHeader}>{column.day}</div>
            {column.dates.map((date) => (
              <div class={styles.dateCell}>{date}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
