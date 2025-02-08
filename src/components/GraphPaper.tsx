import { onMount, onCleanup } from 'solid-js';
import type { WebGLRenderer, Scene, OrthographicCamera, Vector2, ShaderMaterial } from 'three';
import styles from './GraphPaper.module.css';

// Import Three.js only after component mounts
let THREE: typeof import('three');

// GLSL Shader
const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// Simple fragment shader to test basic hover effect
const fragmentShader = `
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse[16];
  uniform float u_prevStrengths[16];
  uniform float u_time;
  uniform float u_gridSize;
  uniform float u_lineWidth;
  uniform float u_isDesktop;
  uniform float u_isBlue;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float getHoverStrength(vec2 st, vec2 mousePos) {
    vec2 mouseSpace = (st - mousePos);
    
    float xDist = mouseSpace.x / u_gridSize;
    float yDist = mouseSpace.y / u_gridSize;
    
    // Faster wave distortion
    float xWave = sin(xDist * 4.0 + u_time * 4.0) * 0.15;
    float yWave = cos(yDist * 4.0 + u_time * 3.4) * 0.15;
    
    // Faster blob animation
    float angle = atan(mouseSpace.y, mouseSpace.x);
    float blobFactor = sin(angle * 3.0 + u_time * 2.0) * 0.2 + 
                      cos(angle * 2.0 - u_time * 1.4) * 0.15;
    
    float dist = length(vec2(
      xDist * (1.0 + xWave + blobFactor),
      yDist * (1.0 + yWave + blobFactor)
    ));
    
    float radius = 7.2;
    return 1.0 - smoothstep(0.0, radius, dist);
  }

  float getTrailStrength(vec2 st, vec2 mousePos, float baseStrength) {
    vec2 mouseSpace = (st - mousePos);
    
    float xDist = mouseSpace.x / u_gridSize;
    float yDist = mouseSpace.y / u_gridSize;
    
    // Faster trail waves
    float xWave = sin(xDist * 3.0 + u_time * 3.0) * 0.12;
    float yWave = cos(yDist * 3.0 + u_time * 2.6) * 0.12;
    
    float angle = atan(mouseSpace.y, mouseSpace.x);
    float blobFactor = sin(angle * 2.0 + u_time * 1.6) * 0.15 + 
                      cos(angle * 3.0 - u_time * 1.2) * 0.1;
    
    float dist = length(vec2(
      xDist * (1.0 + xWave + blobFactor),
      yDist * (1.0 + yWave + blobFactor)
    ));
    
    float radius = 4.8;
    float strength = 1.0 - smoothstep(0.0, radius, dist);
    return strength * baseStrength;
  }

  void main() {
    vec2 st = gl_FragCoord.xy;
    vec2 grid = fract(st / u_gridSize);
    
    // Choose grid color based on u_isBlue uniform
    vec3 gridColor = u_isBlue > 0.5 ? 
      vec3(0.3, 0.5, 1.0) :  // Blue variant
      vec3(0.87);            // Grey variant
    
    // Royal blue variations - all brighter and more saturated
    vec3 baseBlue = vec3(0.45, 0.55, 1.0);      // More saturated royal blue
    vec3 lightBlue = vec3(0.5, 0.65, 1.0);      // Lighter royal blue
    vec3 trailColor = vec3(0.55, 0.7, 1.0);     // Even lighter royal blue
    vec3 brightBlue = vec3(0.6, 0.8, 1.0);      // Brightest royal blue for pulsing
    
    vec3 color = gridColor;
    float alpha = 0.0;

    bool isVerticalLine = grid.x < u_lineWidth || grid.x > (1.0 - u_lineWidth);
    bool isHorizontalLine = grid.y < u_lineWidth || grid.y > (1.0 - u_lineWidth);
    
    if (isVerticalLine || isHorizontalLine) {
      alpha = 1.0;
    }

    if (alpha > 0.0 && u_isDesktop > 0.5) {
      float hoverStrength = getHoverStrength(st, u_mouse * u_resolution);
      
      float trailStrength = 0.0;
      for (int i = 0; i < 16; i++) {
        float strength = getTrailStrength(st, u_prevMouse[i] * u_resolution, u_prevStrengths[i]);
        trailStrength = max(trailStrength, strength);
      }
      
      vec3 finalColor = gridColor;
      if (trailStrength > 0.0) {
        float trailPulse = sin(u_time * 4.0) * 0.15 + 1.15;
        vec3 pulsingTrailColor = mix(trailColor, brightBlue, trailPulse - 1.0);
        finalColor = mix(gridColor, pulsingTrailColor, trailStrength);
      }
      if (hoverStrength > 0.0) {
        float hoverPulse = sin(u_time * 3.0) * 0.2 + 1.2;
        vec3 pulsingBaseBlue = mix(baseBlue, brightBlue, hoverPulse - 1.0);
        finalColor = mix(finalColor, pulsingBaseBlue, hoverStrength);
      }
      
      if (isVerticalLine) {
        float verticalWave = sin(st.y * 0.02 + u_time * 3.0) * 0.15;
        finalColor *= 1.0 + verticalWave * max(hoverStrength, trailStrength);
      } else {
        float horizontalWave = cos(st.x * 0.02 + u_time * 3.0) * 0.15;
        finalColor *= 1.0 + horizontalWave * max(hoverStrength, trailStrength);
      }
      
      color = finalColor;
    }
    
    gl_FragColor = vec4(color, alpha);
  }
`;

interface Props {
  class?: string;
  variant?: 'grey' | 'blue';
}

const MOBILE_BREAKPOINT = 768; // px

export default function GraphPaper(props: Props) {
  let containerRef: HTMLDivElement | undefined;
  let renderer: WebGLRenderer;
  let scene: Scene;
  let camera: OrthographicCamera;
  let uniforms: {
    u_time: { value: number };
    u_resolution: { value: Vector2 };
    u_mouse: { value: Vector2 };
    u_prevMouse: { value: Vector2[] };
    u_prevStrengths: { value: number[] };
    u_gridSize: { value: number };
    u_lineWidth: { value: number };
    u_isDesktop: { value: number };
    u_isBlue: { value: number };
  };
  let frameId: number;
  let pixelRatio: number;
  let canvas: HTMLCanvasElement | undefined;
  let prevMouseRef: { x: number; y: number; timestamp: number }[] = [];
  const maxTrailLength = 16;
  const frameRate = 1000 / 60;
  let lastUpdateTime = 0;
  let lastMousePos = { x: 0, y: 0 };
  const minDistanceForUpdate = 0.001;
  const falloffDuration = 700; // 700ms for complete falloff

  const updateMousePosition = (clientX: number, clientY: number) => {
    if (!uniforms || !containerRef || typeof window === 'undefined') return;

    const currentTime = performance.now();
    if (currentTime - lastUpdateTime < frameRate) {
      return;
    }
    lastUpdateTime = currentTime;

    const rect = containerRef.getBoundingClientRect();
    
    // Use clientX/Y directly with getBoundingClientRect since both are viewport-relative
    const x = (clientX - rect.left) / rect.width;
    const y = 1.0 - (clientY - rect.top) / rect.height;

    // Check if mouse has moved enough to record new position
    const dx = x - lastMousePos.x;
    const dy = y - lastMousePos.y;
    const distanceMoved = Math.sqrt(dx * dx + dy * dy);

    uniforms.u_mouse.value.set(x, y);

    if (distanceMoved > minDistanceForUpdate) {
      // Add new position to trail
      prevMouseRef.unshift({ 
        x: x, 
        y: y, 
        timestamp: currentTime
      });
      
      // Keep only maxTrailLength positions
      if (prevMouseRef.length > maxTrailLength) {
        prevMouseRef.pop();
      }

      lastMousePos = { x, y };
    }

    // Update positions and calculate time-based strengths
    const positions = Array(maxTrailLength).fill(null).map((_, i) => {
      if (i < prevMouseRef.length) {
        return new THREE.Vector2(prevMouseRef[i].x, prevMouseRef[i].y);
      }
      return new THREE.Vector2(x, y);
    });

    const strengths = Array(maxTrailLength).fill(0).map((_, i) => {
      if (i >= prevMouseRef.length) return 0;
      
      const timeSincePoint = currentTime - prevMouseRef[i].timestamp;
      const timeStrength = Math.max(0, 1 - (timeSincePoint / falloffDuration));
      
      // Combine with position-based falloff for smoother trail
      const positionStrength = 1.0 - (i / maxTrailLength);
      
      return Math.max(0, timeStrength * positionStrength);
    });

    uniforms.u_prevMouse.value = positions;
    uniforms.u_prevStrengths.value = strengths;
  };

  let lastKnownClientX = 0;
  let lastKnownClientY = 0;

  const handleMouseMove = (event: MouseEvent) => {
    lastKnownClientX = event.clientX;
    lastKnownClientY = event.clientY;
    updateMousePosition(event.clientX, event.clientY);
  };

  const handleScroll = () => {
    // During scroll, update position using last known mouse coordinates
    updateMousePosition(lastKnownClientX, lastKnownClientY);
  };

  const handleResize = () => {
    if (!containerRef || !renderer || !camera || !uniforms || typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    
    containerRef.style.height = `${height}px`;
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    
    const aspect = width / height;
    const frustumSize = 1;
    
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    
    uniforms.u_resolution.value.set(width * pixelRatio, height * pixelRatio);
    
    // Update isDesktop uniform
    uniforms.u_isDesktop.value = window.innerWidth >= MOBILE_BREAKPOINT ? 1.0 : 0.0;

    // Clear trail when switching to mobile
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      prevMouseRef = [];
      uniforms.u_prevStrengths.value = Array(maxTrailLength).fill(0.0);
    }
  };

  const animate = (time: number) => {
    if (typeof window === 'undefined') return;
    
    // Update trail strengths every frame
    if (uniforms && prevMouseRef.length > 0) {
      const currentTime = performance.now();
      const strengths = Array(maxTrailLength).fill(0).map((_, i) => {
        if (i >= prevMouseRef.length) return 0;
        
        const timeSincePoint = currentTime - prevMouseRef[i].timestamp;
        const timeStrength = Math.max(0, 1 - (timeSincePoint / falloffDuration));
        
        // Combine with position-based falloff for smoother trail
        const positionStrength = 1.0 - (i / maxTrailLength);
        
        return Math.max(0, timeStrength * positionStrength);
      });
      
      uniforms.u_prevStrengths.value = strengths;
    }
    
    uniforms.u_time.value = time / 1000;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };

  const isDesktop = () => window.innerWidth >= MOBILE_BREAKPOINT;

  onMount(async () => {
    if (typeof window === 'undefined') return;

    THREE = await import('three');
    
    if (!containerRef) return;

    scene = new THREE.Scene();
    
    const frustumSize = 1;
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000
    );
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    
    canvas = renderer.domElement;
    containerRef.appendChild(canvas);
    
    const width = window.innerWidth;
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    renderer.setSize(width, height);
    containerRef.style.height = `${height}px`;

    uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_prevMouse: { value: Array(maxTrailLength).fill(null).map(() => new THREE.Vector2(0.5, 0.5)) },
      u_prevStrengths: { value: Array(maxTrailLength).fill(0.0) },
      u_gridSize: { value: 35 * pixelRatio },
      u_lineWidth: { value: 0.02 },
      u_isDesktop: { value: isDesktop() ? 1.0 : 0.0 },
      u_isBlue: { value: props.variant === 'blue' ? 1.0 : 0.0 }
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    animate(0);
  });

  onCleanup(() => {
    if (typeof window === 'undefined') return;
    
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
    
    cancelAnimationFrame(frameId);
    renderer.dispose();
  });

  return (
    <div 
      class={styles.container} 
      ref={(el) => containerRef = el}
    >
      <canvas ref={(el) => canvas = el} />
    </div>
  );
}
