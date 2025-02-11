import styles from './CrouwelCalendar.module.css';
import { HighlightCircle } from './HighlightCircle';

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
  highlightDate?: Date;
}

export default function CrouwelCalendar(props: Props) {
  // Test highlighting the 10th
  const testDate = new Date();
  //testDate.setDate(10);
  const date = props.highlightDate || testDate;
  const monthIndex = date.getMonth();
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const;
  const monthLayout = MONTH_LAYOUTS[monthNames[monthIndex]];

  // Calculate calendar data
  const year = date.getFullYear();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

  // Create a fixed 6x7 grid (42 cells)
  const grid: (number | null)[] = Array(42).fill(null);
  
  // Calculate starting position in the grid
  let currentPos = startOffset;
  
  // Fill in the actual dates
  for (let date = 1; date <= daysInMonth; date++) {
    grid[currentPos] = date;
    currentPos++;
  }

  // Create the display grid and filter out empty rows
  const displayGrid: (number | null)[][] = [];
  for (let row = 0; row < 6; row++) {
    const weekRow: (number | null)[] = [];
    for (let col = 0; col < 7; col++) {
      weekRow.push(grid[row * 7 + col]);
    }
    // Only add the row if it contains at least one non-null value
    if (weekRow.some(cell => cell !== null)) {
      displayGrid.push(weekRow);
    }
  }

  // Get the day we want to highlight
  const highlightDay = props.highlightDate ? props.highlightDate.getDate() : date.getDate();
  console.log('Looking for day:', highlightDay, 'in grid:', grid);

  // Calculate highlight position
  let highlightPosition = { row: 0, col: 0 };
  if (highlightDay) {
    const index = grid.findIndex(date => date === highlightDay);
    console.log('Grid:', grid);
    console.log('Looking for day:', highlightDay);
    console.log('Found at index:', index);
    if (index !== -1) {
      highlightPosition = {
        row: Math.floor(index / 7),
        col: index % 7
      };
      console.log('Position:', highlightPosition);
    }
  }
  let leftOffset = highlightDay < 10 ? 0 : highlightDay < 20 ? 3 : 4;

  return (
    <div class={`${styles.calendar} ${props.variant === 'light' ? styles.light : ''}`}>
      {highlightPosition && (
        <div 
          style={{ 
            position: 'absolute',
            // Each column is 72px (504px / 7)
            // Each column is 72px (504px / 7)
            left: `${highlightPosition.col * 72 + leftOffset + 9}px`,
            // Vertical positioning breakdown:
            // - Month container: 306px
            // - Day headers: 45px
            // - Row height per grid: 36px
            // - Additional offset: 72px (2 grid units) to align with date
            top: `${428 + ((highlightPosition.row-1) * 45)}px`,
            'z-index': 10
          }}
        >
          <HighlightCircle />
        </div>
      )}
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
        <div class={styles.dayHeaders}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
            <div class={styles.dayHeader}>{day}</div>
          ))}
        </div>
        <div class={styles.dayGrid}>
          {displayGrid.map((week, weekIndex) => (
            <div class={styles.weekRow}>
              {week.map((date, dayIndex) => (
                <div class={styles.dateCell}>{date}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
