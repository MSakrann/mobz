"use client";

/**
 * Raymarched WebGL "lava lamp" backdrop behind the content sections — a
 * straight port of lava.js. The canvas stretches over the whole content
 * wrapper, renders at a capped internal resolution (it sits under a heavy
 * blur, so low-res is indistinguishable), is throttled to ~30fps on the
 * shared ticker, and only renders while on screen.
 */

import { useEffect, useRef } from "react";

import { useLoop } from "@/hooks/animation/use-render-loop";
import { LavaConfig } from "@/data/mocks/home";

export interface LavaBackgroundProps {
  config: LavaConfig;
}

const MAX_RENDER_PIXELS = 400000;
const FRAME_MS = 1000 / 30;

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_blend;
  uniform vec3 u_col1;
  uniform vec3 u_col2;
  uniform vec3 u_col3;
  uniform vec3 u_col4;
  uniform vec3 u_col5;

  // smooth metaball blending
  float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
  }

  // capsule SDF — the stretched lava blobs
  float sdCapsule( vec3 p, vec3 a, vec3 b, float r ) {
      vec3 pa = p - a, ba = b - a;
      float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
      return length( pa - ba*h ) - r;
  }

  float map(vec3 p) {
      float t = u_time * u_speed;

      // warp space so the capsules flow organically
      vec3 q = p;
      q.x += sin(p.y * 0.5 + t) * 1.0;
      q.z += cos(p.x * 0.4 + t * 0.8) * 1.0;

      float d = 100.0;
      float k = u_blend;

      // central dense column — guarantees no empty void
      vec3 a0 = vec3(sin(t*0.2)*1.0, -100.0, cos(t*0.3)*1.0);
      vec3 b0 = vec3(sin(t*0.4)*1.0, 100.0, cos(t*0.5)*1.0);
      d = smin(d, sdCapsule(q, a0, b0, 2.0), k);

      // drifting blobs spawn far outside the screen (-40..+40 vertical loop)
      vec3 a1 = vec3(sin(t*0.5)*3.0, -40.0 + fract(t*0.15 + 0.0)*80.0, sin(t*0.6)*2.0);
      vec3 b1 = a1 + vec3(cos(t*0.7)*3.0, 6.0, sin(t*0.5)*-2.0);
      d = smin(d, sdCapsule(q, a1, b1, 1.8), k);

      vec3 a2 = vec3(cos(t*0.6)*-4.0, -40.0 + fract(t*0.17 + 0.3)*80.0, cos(t*0.4)*1.5);
      vec3 b2 = a2 + vec3(sin(t*0.9)*2.5, 4.5, cos(t*0.8)*2.5);
      d = smin(d, sdCapsule(q, a2, b2, 1.5), k);

      vec3 a3 = vec3(sin(t*0.4)*-3.5, -40.0 + fract(t*0.16 + 0.6)*80.0, 0.0);
      vec3 b3 = a3 + vec3(sin(t*0.8)*1.5, 7.0, cos(t*0.5)*-1.5);
      d = smin(d, sdCapsule(q, a3, b3, 1.0), k);

      vec3 a4 = vec3(cos(t*0.8)*4.5, -40.0 + fract(t*0.18 + 0.8)*80.0, sin(t*0.9)*-2.5);
      vec3 b4 = a4 + vec3(cos(t*1.1)*-2.0, 3.5, sin(t*1.2)*2.0);
      d = smin(d, sdCapsule(q, a4, b4, 1.2), k);

      vec3 a5 = vec3(sin(t*1.1)*-1.5, -40.0 + fract(t*0.2 + 0.1)*80.0, cos(t*0.7)*-1.5);
      vec3 b5 = a5 + vec3(4.0, 1.0 + sin(t)*2.0, 0.0);
      d = smin(d, sdCapsule(q, a5, b5, 1.3), k);

      vec3 a6 = vec3(cos(t*1.3)*-2.5, -40.0 + fract(t*0.19 + 0.5)*80.0, sin(t*1.2)*1.5);
      vec3 b6 = a6 + vec3(0.0, 5.0, 0.0);
      d = smin(d, sdCapsule(q, a6, b6, 2.0), k);

      vec3 a7 = vec3(sin(t*0.9)*2.5, -40.0 + fract(t*0.21 + 0.4)*80.0, cos(t*1.4)*-1.0);
      vec3 b7 = a7 + vec3(0.0, 3.0, 0.0);
      d = smin(d, sdCapsule(q, a7, b7, 0.8), k);

      vec3 a8 = vec3(cos(t*0.7)*3.5, -40.0 + fract(t*0.14 + 0.7)*80.0, sin(t*0.5)*1.5);
      vec3 b8 = a8 + vec3(sin(t*1.5)*-2.0, 4.0, cos(t*0.9)*2.0);
      d = smin(d, sdCapsule(q, a8, b8, 1.6), k);

      // compensate the space warp to avoid raymarch artefacts
      return d * 0.6;
  }

  // tetrahedral normals — 4 map() calls instead of 6
  vec3 calcNormal(vec3 p) {
      vec2 e = vec2(0.01, -0.01);
      return normalize(
          e.xyy * map(p + e.xyy) +
          e.yyx * map(p + e.yyx) +
          e.yxy * map(p + e.yxy) +
          e.xxx * map(p + e.xxx)
      );
  }

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);

      vec3 ro = vec3(0.0, 0.0, 9.0);
      vec3 rd = normalize(vec3(uv, -1.0));

      // 48 steps + early exit is enough — shapes are soft and sit under blur
      float dO = 0.0;
      vec3 p;
      for(int i = 0; i < 48; i++) {
          p = ro + rd * dO;
          float dS = map(p);
          dO += dS;
          if(dS < 0.02 || dO > 20.0) break;
      }

      vec3 col = vec3(0.0);

      if(dO < 20.0) {
          vec3 n = calcNormal(p);

          vec3 baseColor = mix(u_col1, u_col2, smoothstep(-5.0, 5.0, p.y));
          baseColor = mix(baseColor, u_col4, smoothstep(-2.0, 4.0, p.x));
          baseColor = mix(baseColor, u_col5, smoothstep(2.0, 6.0, p.x + p.y));
          baseColor = mix(baseColor, u_col3, smoothstep(3.0, 6.0, -p.x));

          vec3 lightDir1 = normalize(vec3(1.0, 1.0, 1.0));
          vec3 lightDir2 = normalize(vec3(-1.0, -1.0, -0.5));
          vec3 lightDir3 = normalize(vec3(0.0, 1.0, -1.0));

          float diff = max(dot(n, lightDir1), 0.0);
          float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
          float ao = clamp(map(p + n * 0.5) / 0.5, 0.0, 1.0);

          col = baseColor * (diff * 0.7 + 0.5) * ao;
          col += u_col4 * max(dot(n, lightDir2), 0.0) * fresnel * 1.2;
          col += u_col3 * max(dot(n, lightDir3), 0.0) * fresnel * 1.0;
      }

      col = pow(col, vec3(1.0/1.8));

      gl_FragColor = vec4(col, 1.0);
  }
`;

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

interface GlState {
  gl: WebGLRenderingContext;
  resolutionLocation: WebGLUniformLocation | null;
  timeLocation: WebGLUniformLocation | null;
  startTime: number | null;
}

const compileShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

export const LavaBackground = ({ config }: LavaBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GlState | null>(null);
  const visible = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // static uniforms — set once from config
    gl.uniform1f(gl.getUniformLocation(program, "u_speed"), config.speed);
    gl.uniform1f(gl.getUniformLocation(program, "u_blend"), config.blend);
    config.colors.forEach((hex, i) => {
      gl.uniform3fv(gl.getUniformLocation(program, `u_col${i + 1}`), hexToRgb(hex));
    });

    stateRef.current = {
      gl,
      resolutionLocation: gl.getUniformLocation(program, "u_resolution"),
      timeLocation: gl.getUniformLocation(program, "u_time"),
      startTime: null,
    };

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;
      const scale = Math.min(
        1,
        Math.sqrt(MAX_RENDER_PIXELS / (rect.width * rect.height)),
      );
      canvas.width = Math.max(1, Math.round(rect.width * scale));
      canvas.height = Math.max(1, Math.round(rect.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      stateRef.current = null;
    };
  }, [config]);

  useLoop(
    (time) => {
      const state = stateRef.current;
      const canvas = canvasRef.current;
      if (!state || !canvas || !visible.current) return;
      if (state.startTime === null) state.startTime = time;
      state.gl.uniform2f(state.resolutionLocation, canvas.width, canvas.height);
      state.gl.uniform1f(state.timeLocation, (time - state.startTime) / 1000);
      state.gl.drawArrays(state.gl.TRIANGLES, 0, 6);
    },
    { framerate: FRAME_MS },
  );

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute -left-[5%] -top-[5%] z-0 h-[110%] w-[110%] blur-[2.5rem]"
      aria-hidden
    />
  );
};
