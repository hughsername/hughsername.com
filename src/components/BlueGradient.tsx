import { Component } from 'solid-js';

export const BlueGradient: Component = () => {
  return (
    <defs>
      <linearGradient 
        id="blue-gradient" 
        x1="0" 
        y1="0" 
        x2="1" 
        y2="1"
        gradientUnits="userSpaceOnUse"
      >
        {/* Exact progression from CSS: dark to light, 45deg */}
        <stop offset="0%" stop-color="hsl(222deg 99% 30%)" />
        <stop offset="8%" stop-color="hsl(222deg 100% 32%)" />
        <stop offset="17%" stop-color="hsl(222deg 100% 33%)" />
        <stop offset="25%" stop-color="hsl(222deg 100% 35%)" />
        <stop offset="33%" stop-color="hsl(222deg 100% 36%)" />
        <stop offset="42%" stop-color="hsl(222deg 100% 38%)" />
        <stop offset="50%" stop-color="hsl(222deg 100% 40%)" />
        <stop offset="58%" stop-color="hsl(222deg 100% 41%)" />
        <stop offset="67%" stop-color="hsl(222deg 100% 43%)" />
        <stop offset="75%" stop-color="hsl(222deg 100% 45%)" />
        <stop offset="83%" stop-color="hsl(222deg 100% 47%)" />
        <stop offset="92%" stop-color="hsl(222deg 100% 48%)" />
        <stop offset="100%" stop-color="hsl(222deg 100% 50%)" />
      </linearGradient>
    </defs>
  );
};

// Example usage in an icon:
export const IconWithGradient: Component = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <BlueGradient />
      <path 
        fill="url(#blue-gradient)" 
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      />
    </svg>
  );
};
