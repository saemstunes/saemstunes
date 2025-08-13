import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";
import "./DarkVeil.css";

const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uHueShift;

vec3 hueShift(vec3 color, float hue) {
  const vec3 k = vec3(0.57735, 0.57735, 0.57735);
  float cosAngle = cos(hue);
  return vec3(
    color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle)
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  
  // Create dynamic gradient
  vec3 gradient = mix(
    vec3(0.08, 0.03, 0.2),
    vec3(0.02, 0.05, 0.15),
    uv.y
  );
  
  // Add pulsing effect
  float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
  gradient *= pulse;
  
  // Apply hue shift
  vec3 color = hueShift(gradient, uHueShift);
  
  // Add subtle noise
  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
  color += (noise - 0.5) * 0.02;
  
  // Add sparkling effect
  float spark = step(0.998, fract(noise + uTime * 0.5));
  color += spark * vec3(0.8, 0.7, 0.5);
  
  gl_FragColor = vec4(color, 0.92);
}
`;

interface DarkVeilProps {
  hueShift?: number;
  className?: string;
  isVisible?: boolean;
  onClick?: () => void;
}

const DarkVeil = ({ 
  hueShift = 0.5, 
  className = "",
  isVisible = false,
  onClick
}: DarkVeilProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const parent = canvas.parentElement!;
    const renderer = new Renderer({ 
      canvas, 
      dpr: Math.min(window.devicePixelRatio, 2)
    });
    const gl = renderer.gl;
    
    // Create geometry and program
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uHueShift: { value: hueShift }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    
    // Handle resize
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = parent;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
    };
    
    window.addEventListener("resize", resize);
    resize();
    
    // Animation loop
    let frameId: number;
    const animate = (time: number) => {
      program.uniforms.uTime.value = time * 0.001;
      renderer.render({ scene: mesh });
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [hueShift]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`darkveil ${className} ${isVisible ? 'visible' : ''}`}
      onClick={onClick}
      aria-hidden={!isVisible}
    />
  );
};

export default DarkVeil;
