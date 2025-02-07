import { createSignal } from 'solid-js';
import styles from './CrouwelCalendar.module.css';

export default function CrouwelCalendar() {
  const monthLayout = [
    { letter: 'm', startColumn: 0, clipColumns: 2, scale: 1, xOffset: '0' },
    { letter: 'a', startColumn: 2, clipColumns: 1, scale: 1, xOffset: '0' },
    { letter: 'y', startColumn: 4, clipColumns: 1, scale: 1, xOffset: '0' }
  ];

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
    <div class={styles.calendar}>
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
