import { Component } from 'solid-js';
import { BlueGradient } from './BlueGradient';

interface MenuIconProps {
  class?: string;
  ref?: (el: SVGPathElement) => void;
}

export const MenuIcon: Component<MenuIconProps> = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="23" 
      height="21" 
      viewBox="0 0 23 21" 
      fill="none"
      class={props.class}
    >
      <BlueGradient />
      <path 
        ref={props.ref}
        d="M19.7689 17.604L5.23231 12.8459C4.46264 12.5939 4.62435 11.461 5.43377 11.4344L14.8068 11.127C15.5652 11.1021 15.7791 10.0754 15.0938 9.74969L2.39852 3.71533C1.71788 3.39181 1.92305 2.37322 2.67587 2.33844L15.2286 1.75846M21.5 15.7997L6.38609 13.6421C5.58435 13.5276 5.54688 12.3838 6.33942 12.2171L15.5058 10.2894C16.2484 10.1332 16.2809 9.08508 15.5494 8.88321L2.03131 5.15229C1.30487 4.9518 1.33014 3.9131 2.06546 3.74816L14.3175 1M1.86665 16.6814L21.0446 19.4191M2.22375 2.63148L21.4017 5.36919M6.56701 9.37779L21.2139 11.4687" 
        stroke="url(#blue-gradient)" 
        stroke-width="1.25" 
        stroke-linecap="round"
      />
    </svg>
  );
};
