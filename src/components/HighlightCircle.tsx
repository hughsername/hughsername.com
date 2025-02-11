import { Component } from 'solid-js';

// Centralize the gradient definition by making it a reusable component
export const HighlightCircle: Component = () => {
  // Use a unique ID for the gradient to avoid conflicts when multiple circles are rendered
  const gradientId = `highlight-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        'pointer-events': 'none',
        'z-index': 1
      }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="41.6838"
          y1="5.70361"
          x2="36.0366"
          y2="46.9805"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#004CFF" />
          <stop offset="0.18" stop-color="#0049F5" />
          <stop offset="0.26" stop-color="#0048F0" />
          <stop offset="0.33" stop-color="#0045E6" />
          <stop offset="0.44" stop-color="#0042DB" />
          <stop offset="0.5" stop-color="#003FD1" />
          <stop offset="0.56" stop-color="#003DCC" />
          <stop offset="0.61" stop-color="#003AC2" />
          <stop offset="0.67" stop-color="#0037B8" />
          <stop offset="0.74" stop-color="#0035B3" />
          <stop offset="0.82" stop-color="#0031A3" />
          <stop offset="1" stop-color="#012E99" />
        </linearGradient>
      </defs>
      <path
        d="M15.0532 7.52614C26.6322 2.89456 37.6322 11.7675 37.6322 21.9993C37.6322 32.2311 28.7587 38.7893 18.5269 38.7893C8.29513 38.7893 2.31641 32.2311 2.31641 21.9993C2.31641 12.9548 7.5282 2.89407 30.6848 1.15771"
        stroke={`url(#${gradientId})`}
        stroke-width="1.2"
        stroke-linecap="round"
      />
      <path
        d="M31.8411 1.15771C8.68445 2.89407 3.47266 12.9548 3.47266 21.9993C3.47266 32.2311 9.45138 38.7893 19.6832 38.7893C29.915 38.7893 38.7884 32.2311 38.7884 21.9993C38.7884 15.9828 35.2691 9.05642 32.42 5.78929"
        stroke={`url(#${gradientId})`}
        stroke-width="1.2"
        stroke-linecap="round"
      />
      <path
        d="M19.1088 6.36789C30.6877 1.73631 41.1088 12.9251 41.1088 23.1569C41.1088 33.3887 32.2353 39.9468 22.0035 39.9468C11.7717 39.9468 5.79297 33.3887 5.79297 23.1569C5.79297 17.0613 7.10634 11.1709 15.0516 7.52596"
        stroke={`url(#${gradientId})`}
        stroke-width="1.2"
        stroke-linecap="round"
      />
      <path
        d="M41.0838 22.4967C41.0838 27.4094 38.53 32.3491 34.6823 36.0754C30.8349 39.8013 25.767 42.2422 20.8417 42.2422C15.9412 42.2422 12.3565 39.9917 9.97413 36.4989C7.57637 32.9835 6.38906 28.1908 6.38906 23.158C6.38906 17.2441 8.76765 10.9442 16.4422 7.41738C22.0043 5.19874 28.1622 6.48407 32.9592 9.61017C37.7726 12.7469 41.0838 17.6471 41.0838 22.4967Z"
        stroke={`url(#${gradientId})`}
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </svg>
  );
};
