import { onMount, onCleanup } from 'solid-js';
import type { WebGLRenderer, Scene, OrthographicCamera, ShaderMaterial } from 'three';
import styles from './HUDOverlay.module.css';

let THREE: typeof import('three');

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_gridSize;
  uniform vec2 u_scale;

  #define PI 3.14159265359
  #define TWO_PI 6.28318530718

  // Convert from normalized coordinates (0-1) to actual pixels
  vec2 normalizedToPixels(vec2 st) {
    return st * u_resolution;
  }

  // Convert from pixels to normalized coordinates (0-1)
  vec2 pixelsToNormalized(vec2 pixels) {
    return pixels / u_resolution;
  }

  // Apply scaling to coordinates
  vec2 applyScale(vec2 st) {
    return st * u_scale;
  }

  float circle(vec2 st, vec2 center, float radius, float thickness) {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 adjusted = (st - center) * aspect;
    float d = length(adjusted);
    float inner = smoothstep(radius - thickness, radius, d);
    float outer = smoothstep(radius, radius + thickness, d);
    return (1.0 - outer) * inner;
  }

  float arc(vec2 st, vec2 center, float radius, float thickness, float startAngle, float endAngle) {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 adjusted = (st - center) * aspect;
    float d = length(adjusted);
    float angle = atan(adjusted.y, adjusted.x);
    if (angle < 0.0) angle += TWO_PI;
    
    float inner = smoothstep(radius - thickness, radius, d);
    float outer = smoothstep(radius, radius + thickness, d);
    float angleRange = step(startAngle, angle) * step(angle, endAngle);
    
    return (1.0 - outer) * inner * angleRange;
  }

  float polygon(vec2 st, vec2 center, float radius, int sides, float rotation) {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 adjusted = (st - center) * aspect;
    float angle = atan(adjusted.y, adjusted.x) + rotation;
    float slice = TWO_PI / float(sides);
    float d = length(adjusted);
    
    float a = mod(angle, slice) - slice/2.0;
    float r = radius * cos(PI/float(sides)) / cos(a);
    
    return step(d, r);
  }

  float hatch(vec2 st, float spacing, float thickness, float angle) {
    vec2 rotated = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * st;
    return step(mod(rotated.x + rotated.y, spacing), thickness);
  }

  // Hash function for pseudo-random numbers
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float animatedBarChart(vec2 st, vec2 center, float time) {
    float result = 0.0;
    float barWidth = 0.006;
    float spacing = 0.008;
    float maxHeight = 0.15;
    
    for(int i = 0; i < 12; i++) {
      float x = center.x + float(i) * spacing - spacing * 5.0;  // Moved further right
      
      // Create unique random seeds for each bar
      float seed1 = hash(float(i) * 123.456);
      float seed2 = hash(float(i) * 789.012);
      float speed = 1.0 + seed1 * 0.5;
      float phase = seed2 * TWO_PI;
      
      // Modified oscillation to allow complete reduction to zero
      float wave1 = sin(time * speed + phase);
      float wave2 = sin(time * speed * 0.7 + phase * 1.3);
      float wave3 = sin(time * speed * 1.3 + phase * 0.7);
      
      float combinedWave = (
        0.4 * wave1 +
        0.3 * wave2 +
        0.3 * wave3
      );
      
      // Square the result to bias towards lower values and ensure it can reach zero
      float height = maxHeight * pow(max(0.0, (combinedWave + 1.0) * 0.5), 2.0);
      
      vec2 bottomLeft = vec2(x - barWidth/2.0, center.y);
      vec2 topRight = vec2(x + barWidth/2.0, center.y + height);
      
      float bar = step(bottomLeft.x, st.x) * step(st.x, topRight.x) * 
                 step(bottomLeft.y, st.y) * step(st.y, topRight.y);
      
      float hatchAngle = time * 0.5 + float(i) * PI/4.0;
      float hatchPattern = hatch(st * 20.0, 0.5, 0.1, hatchAngle);
      
      result += bar * mix(0.5, 1.0, hatchPattern);
    }
    
    return result;
  }

  float radarChart(vec2 st, vec2 center, float time) {
    // Make the radar chart smaller while maintaining proportions
    float baseRadius = min(u_resolution.x, u_resolution.y) * 0.09; 
    float normalizedRadius = baseRadius / min(u_resolution.x, u_resolution.y);
    float result = 0.0;
    
    // Adjust for aspect ratio
    vec2 aspect = vec2(1.0);
    if (u_resolution.x > u_resolution.y) {
        aspect = vec2(u_resolution.y/u_resolution.x, 1.0);
    } else {
        aspect = vec2(1.0, u_resolution.x/u_resolution.y);
    }
    
    // Calculate distance with aspect ratio correction
    vec2 uv = (st - center) * aspect;
    float dist = length(uv);
    
    // Outer circle
    result += circle(st, center, normalizedRadius, 0.002);
    
    // Rotating arcs
    float arcSpeed = time * 0.5;
    for(int i = 0; i < 3; i++) {
      float offset = float(i) * TWO_PI / 3.0;
      float startAngle = mod(arcSpeed + offset, TWO_PI);
      float endAngle = startAngle + PI/3.0;
      result += arc(st, center, normalizedRadius * 0.9, 0.002, startAngle, endAngle) * 0.5;
    }
    
    // Hexagons
    float hexRadius = normalizedRadius * 0.8;
    float hexRotation = time * 0.2;
    result += polygon(st, center, hexRadius, 6, hexRotation) * 0.2;
    result += polygon(st, center, hexRadius * 0.7, 6, -hexRotation) * 0.3;
    
    // Radar sweep
    float sweepAngle = mod(time * 2.0, TWO_PI);
    result += arc(st, center, normalizedRadius, normalizedRadius, sweepAngle - 0.2, sweepAngle) * 0.2;
    
    // Data points
    for(int i = 0; i < 6; i++) {
      float angle = float(i) * TWO_PI / 6.0;
      float dataValue = sin(time + float(i)) * 0.5 + 0.5;
      float pointRadius = normalizedRadius * 0.1;
      vec2 pos = center + vec2(cos(angle), sin(angle)) * normalizedRadius * dataValue;
      result += circle(st, pos, pointRadius, 0.002);
    }
    
    return result;
  }

  // Enhanced oscilloscope that spans full width
  float oscilloscope(vec2 st, vec2 center, float time) {
    vec2 toCenter = st - center;
    float wave = 0.0;
    
    // Multiple overlapping waveforms with varying frequencies
    for(float i = 0.0; i < 3.0; i++) {
        float freq = 15.0 + i * 5.0;
        float speed = 2.0 + i * 0.5;
        float amp = 0.02 - i * 0.005;
        float y = sin(toCenter.x * freq + time * speed) * amp;
        wave += smoothstep(0.002, 0.0, abs(toCenter.y - y));
    }
    
    // Full width rectangle
    float mask = step(-center.x, toCenter.x) * step(toCenter.x, 1.0 - center.x) * 
                 step(-0.04, toCenter.y) * step(toCenter.y, 0.04);
    
    // Add vertical marker lines across full width
    float markers = 0.0;
    float markerSpacing = 0.1;  
    for(float i = -10.0; i <= 10.0; i += 1.0) {
        markers += smoothstep(0.001, 0.0, abs(toCenter.x - i * markerSpacing));
    }
    
    return (wave + markers * 0.3) * mask;
  }

  // Dashed circle generator
  float dashedCircle(vec2 st, float radius, float dashCount, float dashSize, float rotation) {
    float angle = atan(st.y, st.x);
    if(angle < 0.0) angle += TWO_PI;
    
    // Apply rotation
    angle = mod(angle + rotation, TWO_PI);
    
    // Create dashes
    float dashAngle = TWO_PI / dashCount;
    float dash = mod(angle, dashAngle);
    float d = length(st);
    
    float circle = smoothstep(radius - 0.002, radius, d) * 
                  (1.0 - smoothstep(radius, radius + 0.002, d));
                  
    return circle * step(dash, dashAngle * dashSize);
  }

  // Visor circles effect
  float visorCircles(vec2 st, vec2 center, float time) {
    float result = 0.0;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    
    // Move center up more (64px up from previous position)
    vec2 adjusted = (st - (center + vec2(0.0, 64.0/u_resolution.y))) * aspect;
    float baseRadius = 0.7;
    float d = length(adjusted);
    
    // Main static circle
    float centerCircle = smoothstep(baseRadius - 0.004, baseRadius, d) * 
                        (1.0 - smoothstep(baseRadius, baseRadius + 0.004, d));
    result += centerCircle;
    
    // Inner rotating dashed circles
    float[] innerRadii = float[](
      baseRadius - 0.015,
      baseRadius - 0.035,
      baseRadius - 0.05
    );
    
    // Varied dash counts and sizes
    float[] dashCounts = float[](
      3.0,    
      24.0,   
      8.0     
    );
    
    float[] dashSizes = float[](
      0.8,    
      0.3,    
      0.5     
    );
    
    for(int i = 0; i < 3; i++) {
      float speed = 0.3 * (1.0 - float(i) * 0.2);
      // Add some randomness to rotation based on time
      float randomOffset = sin(time * (1.0 + float(i) * 0.5)) * 0.2;
      float rotation = time * speed + randomOffset;
      
      result += dashedCircle(adjusted, innerRadii[i], dashCounts[i], dashSizes[i], rotation) * 0.7;
    }
    
    // Outer rotating dashed circles
    float[] outerRadii = float[](
      baseRadius + 0.02,
      baseRadius + 0.045,
      baseRadius + 0.065
    );
    
    float[] outerDashCounts = float[](
      16.0,   
      5.0,    
      32.0    
    );
    
    float[] outerDashSizes = float[](
      0.4,    
      0.7,    
      0.2     
    );
    
    for(int i = 0; i < 3; i++) {
      float speed = -0.3 * (1.0 - float(i) * 0.2);
      // Different random offset pattern for outer rings
      float randomOffset = cos(time * (0.8 + float(i) * 0.3)) * 0.2;
      float rotation = time * speed + randomOffset;
      
      result += dashedCircle(adjusted, outerRadii[i], outerDashCounts[i], outerDashSizes[i], rotation) * 0.7;
    }
    
    return result;
  }

  // Hatching pattern generator
  float hatchPattern(vec2 st, float angle, float spacing, float thickness) {
    // Rotate the space
    float c = cos(angle);
    float s = sin(angle);
    vec2 rotated = vec2(
      st.x * c - st.y * s,
      st.x * s + st.y * c
    );
    
    // Create lines
    float lines = mod(rotated.x * spacing, 1.0);
    return smoothstep(0.0, thickness, lines) * 
           (1.0 - smoothstep(thickness, thickness * 2.0, lines));
  }

  // Hash function for electrical noise
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 grid = fract(gl_FragCoord.xy / u_gridSize);
    vec4 color = vec4(0.0);
    vec3 gridColor = vec3(0.3, 0.5, 1.0);

    float verticalOffset = 96.0 / u_resolution.y;
    st.y = st.y - verticalOffset;

    float marginX = 16.0 / u_resolution.x;
    float marginY = 16.0 / u_resolution.y;
    
    // Position widgets
    vec2 radarPos = vec2(marginX * 0.5 + 64.0/u_resolution.x, 1.0 - marginY - 0.1 - verticalOffset); 
    vec2 wavePos = vec2(marginX, marginY - verticalOffset);
    vec2 barPos = vec2(1.0 - marginX - 0.1, marginY + 0.1 - verticalOffset);
    vec2 centerPos = vec2(0.5, 0.5);

    // Grid lines
    float line = min(
        smoothstep(0.0, 0.03, grid.x) * (1.0 - smoothstep(0.97, 1.0, grid.x)),
        smoothstep(0.0, 0.03, grid.y) * (1.0 - smoothstep(0.97, 1.0, grid.y))
    );
    color.rgb += gridColor * line * 0.3;
    color.a = line * 0.3;

    // Enhanced scan lines with moderate brightness
    float scanLine = smoothstep(0.0, 0.002, abs(fract(st.y * 20.0 - u_time * 0.5) - 0.5) - 0.48);
    float fuzz = hash(vec2(st.x * 100.0, u_time * 15.0)) * 0.4 + 0.6; 
    vec3 scanColor = gridColor * 1.2; 
    color.rgb += scanColor * scanLine * 0.45 * fuzz; 
    color.a += scanLine * 0.45 * fuzz;

    // Apply widgets
    vec2 offsetSt = st + vec2(0.0, verticalOffset);
    float radar = radarChart(offsetSt, radarPos, u_time);
    float wave = oscilloscope(offsetSt, wavePos, u_time);
    float bars = animatedBarChart(offsetSt, barPos, u_time);
    float visor = visorCircles(offsetSt, centerPos, u_time);
    
    vec3 widgetColor = gridColor * 1.5;
    
    color.rgb += widgetColor * radar;
    color.a += radar * 0.8;
    
    color.rgb += widgetColor * wave;
    color.a += wave * 0.8;
    
    color.rgb += widgetColor * bars;
    color.a += bars * 0.8;

    color.rgb += widgetColor * visor;
    color.a += visor * 0.8;

    gl_FragColor = color;
  }
`;

interface Props {
  class?: string;
}

export default function HUDOverlay(props: Props) {
  let container: HTMLDivElement | undefined;
  let canvas: HTMLCanvasElement | undefined;
  let renderer: WebGLRenderer | undefined;
  let scene: Scene | undefined;
  let camera: OrthographicCamera | undefined;
  let material: ShaderMaterial | undefined;
  let startTime = Date.now();
  let cliContainer: HTMLDivElement | undefined;
  let commandIndex = 0;
  let isTyping = false;

  const commands = [
    '> scanning system components...',
    '> initializing neural interface',
    '> loading quantum matrices',
    '> calculating dimensional vectors',
    '> analyzing parallel timelines',
    '> synchronizing temporal flux',
    '> optimizing memory arrays',
    '> calibrating quantum sensors',
    '> loading cybernetic protocols',
    '> initializing defense systems',
    '> scanning dimensional rifts',
    '> compiling quantum data',
    '> processing neural feedback',
    '> analyzing threat matrices',
    '> loading combat protocols',
    '> initializing weapon systems',
    '> scanning temporal anomalies',
    '> processing bio-feedback',
    '> loading stealth systems',
    '> calibrating targeting array'
  ];

  const typeCommand = async (element: HTMLDivElement, text: string) => {
    isTyping = true;
    const chunkSize = 3; 
    let currentText = '';
    
    for (let i = 0; i < text.length; i += chunkSize) {
      currentText += text.slice(i, i + chunkSize);
      element.textContent = currentText;
      await new Promise(resolve => setTimeout(resolve, 30)); 
    }
    
    isTyping = false;
  };

  const addCommand = async () => {
    if (!cliContainer || isTyping) return;
    
    const cmd = commands[commandIndex % commands.length];
    const cmdElement = document.createElement('div');
    cmdElement.className = styles.command;
    cliContainer.appendChild(cmdElement);
    
    await typeCommand(cmdElement, cmd);
    
    // Keep only last 25 commands
    while (cliContainer.children.length > 25) {
      cliContainer.removeChild(cliContainer.firstChild!);
    }
    
    commandIndex++;
  };

  onMount(async () => {
    THREE = await import('three');
    
    if (!container) return;

    renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2() },
        u_gridSize: { value: 24.0 },
        u_scale: { value: new THREE.Vector2(1, 1) }
      },
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    container.appendChild(renderer.domElement);
    
    // Initial resize
    const handleResize = () => {
      if (!container) return;
      
      // Get the actual container size
      const containerRect = container.getBoundingClientRect();
      const { width, height } = containerRect;
      
      // Set the canvas size to match container exactly
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      
      // Set the WebGL viewport size
      const pixelRatio = window.devicePixelRatio;
      renderer.setSize(width * pixelRatio, height * pixelRatio, false);
      material.uniforms.u_resolution.value.set(width * pixelRatio, height * pixelRatio);
      material.uniforms.u_scale.value.set(1, 1); 
    };
    handleResize();
    
    // Add resize observer for more reliable size tracking
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      material.uniforms.u_time.value = (Date.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };
    animate();

    // Start CLI animation
    const addCommandWithInterval = () => {
      addCommand().then(() => {
        setTimeout(addCommandWithInterval, 700);
      });
    };
    addCommandWithInterval();
    
    onCleanup(() => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer?.dispose();
      geometry.dispose();
      material.dispose();
    });
  });

  return (
    <div class={`${styles.container} ${props.class || ''}`} ref={container}>
      <canvas ref={canvas} />
      <div class={styles.cli} ref={cliContainer}></div>
    </div>
  );
}
