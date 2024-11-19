import { onMount, onCleanup } from 'solid-js';
import type { WebGLRenderer, Scene, OrthographicCamera, Vector2, ShaderMaterial } from 'three';
import styles from './GraphPaper.module.css';

// Import Three.js only after component mounts
let THREE: typeof import('three');

// GLSL Shader
const fragmentShader = `
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float u_gridSize;
  uniform float u_lineWidth;

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

  void main() {
    vec2 st = gl_FragCoord.xy;
    vec2 grid = fract(st / u_gridSize);
    float baseLineWidth = u_lineWidth;
    
    vec3 gridColor = vec3(0.953);
    vec3 baseBlue = vec3(0.6, 0.75, 1.0);
    vec3 lightBlue = vec3(0.6, 0.722, 1.0);
    
    vec3 color = gridColor;
    float alpha = 0.0;

    // Calculate mouse position in screen coordinates
    vec2 mouse = u_mouse * u_resolution;
    // Adjust mouse.y to match document coordinates
    mouse.y = u_resolution.y * u_mouse.y;
    
    vec2 mouseSpace = (st - mouse);
    float dist = length(mouseSpace / u_gridSize);
    
    float noiseTime = u_time * 0.5;
    vec2 noiseCoord = mouseSpace * 0.3 / u_gridSize;
    float noise1 = snoise(noiseCoord + noiseTime);
    float noise2 = snoise(noiseCoord * 2.0 - noiseTime * 0.7);
    float noise3 = snoise(noiseCoord * 0.5 + noiseTime * 0.3);
    
    float noise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    
    // Set base radius to 12.0
    float baseRadius = 12.0;
    float noiseRadius = baseRadius + noise * 3.5;
    float hoverStrength = 1.0 - smoothstep(0.0, noiseRadius, dist);
    
    // Add horizontal pulse with 3s cycle (time * 2.0 * PI / 3.0)
    float horizontalPulse = sin(u_time * 2.094395 + mouseSpace.x * 0.1);
    float pulseStrength = 0.3; // Adjust this to control pulse intensity
    
    float pulse = sin(u_time * 0.7 + noise * 2.0) * 0.1;
    hoverStrength *= 1.0 + pulse;
    
    float flowSpeed = 1.5;
    float horizontalOffset = mouseSpace.x / u_gridSize;
    float flowNoise = snoise(vec2(horizontalOffset * 2.0, u_time));
    float flow = sin(u_time * flowSpeed - horizontalOffset * 0.125 + flowNoise * 0.5 + horizontalPulse * pulseStrength) * 0.5 + 0.5;
    flow = pow(flow, 2.0);
    
    float bulgeAmount = 0.3 * hoverStrength * (1.0 + noise * 0.4);
    float lineWidth = baseLineWidth * (1.0 + bulgeAmount);
    
    bool isVerticalLine = grid.x < lineWidth || grid.x > (1.0 - lineWidth);
    bool isHorizontalLine = grid.y < lineWidth || grid.y > (1.0 - lineWidth);
    
    if (isVerticalLine || isHorizontalLine) {
      alpha = 1.0;
      if (hoverStrength > 0.0) {
        vec3 flowColor = mix(baseBlue, lightBlue, flow);
        float saturationBoost = 1.0 + (0.25 * hoverStrength * (1.0 + noise * 0.25));
        flowColor *= saturationBoost;
        color = mix(gridColor, flowColor, hoverStrength);
        alpha = 1.0 + (0.2 * hoverStrength);
      }
    }
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export default function GraphPaper() {
  let containerRef: HTMLDivElement | undefined;
  let renderer: WebGLRenderer;
  let scene: Scene;
  let camera: OrthographicCamera;
  let uniforms: {
    u_time: { value: number };
    u_resolution: { value: Vector2 };
    u_mouse: { value: Vector2 };
    u_gridSize: { value: number };
    u_lineWidth: { value: number };
  };
  let frameId: number;
  let pixelRatio: number;
  let canvas: HTMLCanvasElement | undefined;

  // Track the last known mouse position
  let lastMouseX = 0;
  let lastMouseY = 0;

  const updateMousePosition = (clientX: number, clientY: number) => {
    if (!uniforms || !containerRef || typeof window === 'undefined') return;

    // Store last known position
    lastMouseX = clientX;
    lastMouseY = clientY;

    const rect = containerRef.getBoundingClientRect();
    
    // Only update when mouse is within container bounds
    if (clientX >= rect.left && clientX <= rect.right && 
        clientY >= rect.top && clientY <= rect.bottom) {
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height;
      
      uniforms.u_mouse.value.x = x;
      uniforms.u_mouse.value.y = y;
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    updateMousePosition(event.clientX, event.clientY);
  };

  const handleScroll = () => {
    if (!containerRef || typeof window === 'undefined') return;
    updateMousePosition(lastMouseX, lastMouseY);
    handleResize();
  };

  const handleResize = () => {
    if (!containerRef || !renderer || !camera || !uniforms || typeof window === 'undefined') return;

    const contentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    
    const width = window.innerWidth;
    const height = contentHeight;
    
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
  };

  const animate = () => {
    if (typeof window === 'undefined') return;
    frameId = requestAnimationFrame(animate);
    
    if (uniforms) {
      uniforms.u_time.value += 0.001;
    }
    
    renderer.render(scene, camera);
  };

  const handleClick = (event: MouseEvent) => {
  };

  onMount(async () => {
    if (typeof window === 'undefined') return;

    THREE = await import('three');
    
    if (!containerRef) return;

    // Setup Three.js
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
      u_gridSize: { value: 48.0 },
      u_lineWidth: { value: 0.0125 },
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

    // Add event listeners to window
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    animate();
  });

  onCleanup(() => {
    if (typeof window === 'undefined') return;
    
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
    
    cancelAnimationFrame(frameId);
    renderer?.dispose();
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
