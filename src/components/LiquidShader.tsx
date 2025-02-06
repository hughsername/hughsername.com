import { createSignal, onCleanup, onMount } from 'solid-js';

const vertexShader = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;

  float hash(vec2 p) {
    float h = dot(p,vec2(127.1,311.7));
    return fract(sin(h)*43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    f = f*f*(3.0-2.0*f);
    
    float n = mix(mix(hash(i + vec2(0.0,0.0)), 
                      hash(i + vec2(1.0,0.0)), f.x),
                  mix(hash(i + vec2(0.0,1.0)), 
                      hash(i + vec2(1.0,1.0)), f.x), f.y);
    return n;
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      f += w * noise(p * freq);
      freq *= 2.0;
      w *= 0.5;
    }
    return f;
  }

  void main() {
    // Maintain aspect ratio
    vec2 uv = gl_FragCoord.xy / min(resolution.x, resolution.y);
    // Center the effect
    uv = uv + vec2(0.5) - vec2(resolution.x, resolution.y) / min(resolution.x, resolution.y) * 0.5;
    float t = time * 0.15; // Slightly slower base time for smoother motion
    
    // Create rotating UV coordinates for swirling
    float angle = t * 0.2;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 rotUV = (uv - 0.5) * rot + 0.5;
    
    // Create base flow field with larger scale
    vec2 p = rotUV * 0.8;
    float flow = fbm(p + t * 0.5); // Increased flow speed
    
    // Add dynamic turbulence
    vec2 shift1 = vec2(sin(t * 0.3) * 0.4, cos(t * 0.4) * 0.4); // Circular motion
    vec2 shift2 = vec2(cos(t * 0.4) * 0.3, sin(t * 0.3) * 0.3);
    
    float f1 = fbm(p + flow + shift1);
    float f2 = fbm(p + flow * 2.5 + shift2); // Increased flow multiplication
    
    // Create ink-like effect with more movement
    vec2 inkOffset = vec2(cos(t * 0.2), sin(t * 0.3)) * 0.3;
    float ink = fbm(p + vec2(f1, f2) * 2.5 + inkOffset);
    
    // Add fine detail with adjusted scale
    float detail = fbm(p * 2.5 + ink);
    
    // Navy gradient blues
    vec3 brightBlue = vec3(0.0/255.0, 55.0/255.0, 235.0/255.0);    // #0037EB
    vec3 midBlue = vec3(0.0/255.0, 45.0/255.0, 205.0/255.0);      // #002DCD
    vec3 darkBlue = vec3(0.0/255.0, 35.0/255.0, 175.0/255.0);     // #0023AF
    vec3 accentBlue = vec3(0.0/255.0, 25.0/255.0, 145.0/255.0);   // #001991
    
    // Create dynamic color blend
    float blend = smoothstep(0.2, 0.8, ink + detail * 0.4);
    vec3 baseColor = mix(darkBlue, brightBlue, blend);
    
    // Add color variation from gradient
    float variation = smoothstep(0.4, 0.9, detail);
    baseColor = mix(baseColor, midBlue, variation * 0.4);
    
    // Add brighter accents
    float highlights = smoothstep(0.6, 0.95, detail);
    baseColor = mix(baseColor, brightBlue * 1.2, highlights * 0.3);
    
    // Ensure dark areas stay vibrant
    float shadows = smoothstep(0.3, 0.7, 1.0 - ink);
    vec3 color = mix(baseColor, accentBlue, shadows * 0.5);
    
    // Add subtle bright bloom
    float bloom = smoothstep(0.7, 0.9, ink + detail);
    color += bloom * brightBlue * 0.15;
    
    gl_FragColor = vec4(color, 0.95);
  }
`;

export function LiquidShader() {
  if (typeof window === 'undefined') return null;
  let canvasRef: HTMLCanvasElement | undefined;
  let gl: WebGLRenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let animationFrame: number;
  const [time, setTime] = createSignal(0);

  const createShader = (type: number, source: string) => {
    const shader = gl!.createShader(type);
    if (!shader) return null;
    
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error(gl!.getShaderInfoLog(shader));
      gl!.deleteShader(shader);
      return null;
    }
    
    return shader;
  };

  const initGL = () => {
    if (!canvasRef) return;
    
    gl = canvasRef.getContext('webgl');
    if (!gl) return;

    const vShader = createShader(gl.VERTEX_SHADER, vertexShader);
    const fShader = createShader(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vShader || !fShader) return;

    program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  };

  const render = (timestamp: number) => {
    if (!gl || !program) return;

    setTime(timestamp / 1000);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    
    gl.uniform1f(timeLocation, time());
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    animationFrame = requestAnimationFrame(render);
  };

  const handleResize = () => {
    if (!canvasRef || !gl) return;
    
    const rect = canvasRef.getBoundingClientRect();
    const width = rect.width * window.devicePixelRatio;
    const height = rect.height * window.devicePixelRatio;
    
    if (canvasRef.width !== width || canvasRef.height !== height) {
      canvasRef.width = width;
      canvasRef.height = height;
      gl.viewport(0, 0, width, height);
    }
  };

  onMount(() => {
    initGL();
    handleResize();
    window.addEventListener('resize', handleResize);
    animationFrame = requestAnimationFrame(render);
  });

  onCleanup(() => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationFrame);
  });

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        "position": "absolute",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "border-radius": "inherit",
        "display": "block", /* Prevent layout issues */
        "background": "transparent"
      }}
    />
  );
}
