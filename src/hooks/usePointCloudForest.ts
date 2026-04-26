/**
 * Point Cloud Forest Rendering Hook
 * Creates 3 depth-layered point clouds with curl-noise motion
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { generateElegantForest } from '../components/three/generators/elegantForest';

// Inline shaders (temporary fix for import issues)
const vertexShader = `
// Vertex shader for wireframe-dot forest
// Note: position is automatically provided by Three.js
attribute float rand;

uniform float uTime;
uniform float uBaseSizePx;
uniform float uDevicePixelRatio;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uCurlStrength;
uniform float uDepthFadeStart;
uniform float uDepthFadeEnd;
uniform vec3 uDisruptCenter;
uniform float uDisruptRadius;
uniform float uDisruptStrength;
uniform float uDisruptDecay;
uniform float uDisruptStartTime;

varying float vAlpha;

// Simplex noise 3D
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 curlNoise(vec3 p) {
  float e = 0.1;
  float n1 = snoise(p + vec3(0.0, e, 0.0));
  float n2 = snoise(p - vec3(0.0, e, 0.0));
  float n3 = snoise(p + vec3(0.0, 0.0, e));
  float n4 = snoise(p - vec3(0.0, 0.0, e));
  float n5 = snoise(p + vec3(e, 0.0, 0.0));
  float n6 = snoise(p - vec3(e, 0.0, 0.0));
  float x = (n1 - n2) - (n3 - n4);
  float y = (n3 - n4) - (n5 - n6);
  float z = (n5 - n6) - (n1 - n2);
  return normalize(vec3(x, y, z)) * uCurlStrength;
}

void main() {
  vec3 noisePos = position * uNoiseFreq + vec3(0.0, uTime * 0.09, 0.0);
  vec3 curlVector = curlNoise(noisePos);
  float variation = mix(0.85, 1.15, rand);
  vec3 baseDisplacement = curlVector * uNoiseAmp * variation;
  vec3 totalDisplacement = baseDisplacement;

  float distToDisrupt = distance(position, uDisruptCenter);
  if (distToDisrupt < uDisruptRadius) {
    float timeSinceDisrupt = max(0.0, uTime - uDisruptStartTime);
    float envelope = exp(-timeSinceDisrupt / uDisruptDecay);
    vec3 radial = normalize(position - uDisruptCenter);
    vec3 tangent = normalize(cross(curlVector, vec3(0.0, 1.0, 0.0)));
    float distanceFactor = smoothstep(uDisruptRadius, 0.0, distToDisrupt);
    vec3 disruptImpulse = (radial * 0.6 + tangent * 0.4) * distanceFactor * envelope;
    totalDisplacement += disruptImpulse * (uDisruptStrength * 0.02);
  }

  // DEBUG: Disable displacement to see base tree structure
  vec3 finalPosition = position; // Was: position + totalDisplacement
  vAlpha = 1.0; // Full opacity for now

  float sizeFactor = mix(0.8, 1.2, rand);
  float pointSize = uBaseSizePx * uDevicePixelRatio * sizeFactor;
  gl_PointSize = pointSize;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  vec2 centerOffset = gl_PointCoord - vec2(0.5);
  float distance = length(centerOffset);
  float alpha = vAlpha * smoothstep(0.6, 0.0, distance);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(uColor, alpha);
}
`;

// Line shader for glowing edges (no point-based rendering)
const lineFragmentShader = `
uniform vec3 uColor;
uniform float uGlowIntensity;

void main() {
  gl_FragColor = vec4(uColor * uGlowIntensity, 1.0);
}
`;

const lineVertexShader = `
uniform float uTime;

void main() {
  vec3 pos = position;
  
  // Subtle pulse effect
  float pulse = sin(uTime * 2.0) * 0.05 + 0.95;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

/**
 * Layer configuration for depth bands
 */
interface LayerConfig {
  name: string;
  noiseAmp: number;
  noiseFreq: number;
  curlStrength: number;
  depthFadeStart: number;
  depthFadeEnd: number;
  baseSizePx: number;
}

const LAYER_CONFIGS: LayerConfig[] = [
  {
    name: 'edges',
    noiseAmp: 0,
    noiseFreq: 0,
    curlStrength: 0,
    depthFadeStart: -5,
    depthFadeEnd: -85,
    baseSizePx: 0,
  },
  {
    name: 'particles',
    noiseAmp: 0.008,
    noiseFreq: 0.5,
    curlStrength: 0.6,
    depthFadeStart: -5,
    depthFadeEnd: -85,
    baseSizePx: 2.5,
  },
];

/**
 * Create glowing line segments for tile edges
 */
function createGlowingLines(
  positions: Float32Array,
  config: LayerConfig
): THREE.LineSegments {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.ShaderMaterial({
    vertexShader: lineVertexShader,
    fragmentShader: lineFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00FFFF) }, // Cyan glow
      uGlowIntensity: { value: 1.5 },
    },
    transparent: false,
    blending: THREE.AdditiveBlending, // Glow effect
    depthWrite: true,
    depthTest: true,
  });
  
  const lines = new THREE.LineSegments(geometry, material);
  lines.name = 'grid-edges';
  
  return lines;
}

/**
 * Create point cloud geometry and material for particles
 */
function createPointCloud(
  positions: Float32Array,
  randoms: Float32Array,
  config: LayerConfig,
  devicePixelRatio: number
): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('rand', new THREE.BufferAttribute(randoms, 1));
  
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uBaseSizePx: { value: config.baseSizePx },
      uDevicePixelRatio: { value: devicePixelRatio },
      uNoiseAmp: { value: config.noiseAmp },
      uNoiseFreq: { value: config.noiseFreq },
      uCurlStrength: { value: config.curlStrength },
      uDepthFadeStart: { value: config.depthFadeStart },
      uDepthFadeEnd: { value: config.depthFadeEnd },
      uDisruptCenter: { value: new THREE.Vector3(0, 0, -100) },
      uDisruptRadius: { value: 1.25 },
      uDisruptStrength: { value: 1.0 },
      uDisruptDecay: { value: 1.2 },
      uDisruptStartTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00CCFF) }, // Cyan-blue particles
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
  });
  
  const points = new THREE.Points(geometry, material);
  points.name = `grid-${config.name}`;
  
  return points;
}

/**
 * Hook for managing cyberpunk grid floor
 */
export function usePointCloudForest() {
  const [pointClouds, setPointClouds] = useState<(THREE.Points | THREE.LineSegments)[]>([]);
  const timeRef = useRef<number>(0);
  const disruptionRef = useRef<{
    center: THREE.Vector3;
    startTime: number;
    active: boolean;
  }>({
    center: new THREE.Vector3(0, 0, -100),
    startTime: 0,
    active: false,
  });

  // Generate grid data once
  const forestData = useMemo(() => {
    const data = generateElegantForest();
    console.log('🌐 Grid generated:', {
      edges: data.nearPositions.length / 6,
      particles: data.midPositions.length / 3,
    });
    return data;
  }, []);

  // Create line segments and point clouds
  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    console.log('🎨 Creating grid with DPR:', dpr);

    const objects: (THREE.LineSegments | THREE.Points)[] = [];
    
    // Create glowing edge lines
    if (forestData.nearPositions.length > 0) {
      objects.push(createGlowingLines(forestData.nearPositions, LAYER_CONFIGS[0]));
    }
    
    // Create atmospheric particles
    if (forestData.midPositions.length > 0) {
      objects.push(
        createPointCloud(
          forestData.midPositions,
          forestData.midRandoms,
          LAYER_CONFIGS[1],
          dpr
        )
      );
    }

    console.log('✨ Grid objects created:', objects.length);

    setPointClouds(objects);

    // Cleanup
    return () => {
      objects.forEach(obj => {
        obj.geometry.dispose();
        (obj.material as THREE.ShaderMaterial).dispose();
      });
    };
  }, [forestData]);

  /**
   * Update animation time and uniforms
   */
  const updateTime = (deltaTime: number) => {
    timeRef.current += deltaTime;

    pointClouds.forEach(obj => {
      const material = obj.material as THREE.ShaderMaterial;
      if (material.uniforms.uTime) {
        material.uniforms.uTime.value = timeRef.current;
      }
    });
  };

  /**
   * Trigger mouse/touch disruption at world position
   */
  const triggerDisruption = (worldPosition: THREE.Vector3) => {
    disruptionRef.current = {
      center: worldPosition.clone(),
      startTime: timeRef.current,
      active: true,
    };

    // Update all layers (only if uniforms exist)
    pointClouds.forEach(cloud => {
      const material = cloud.material as THREE.ShaderMaterial;
      if (material.uniforms.uDisruptCenter) {
        material.uniforms.uDisruptCenter.value.copy(worldPosition);
      }
      if (material.uniforms.uDisruptStartTime) {
        material.uniforms.uDisruptStartTime.value = timeRef.current;
      }
    });
  };

  /**
   * Update disruption strength (for reduced motion)
   */
  const setDisruptionStrength = (strength: number) => {
    pointClouds.forEach(cloud => {
      const material = cloud.material as THREE.ShaderMaterial;
      if (material.uniforms.uDisruptStrength) {
        material.uniforms.uDisruptStrength.value = strength;
      }
    });
  };

  /**
   * Update noise amplitude (for reduced motion)
   */
  const setNoiseAmplitude = (scale: number) => {
    pointClouds.forEach((cloud, index) => {
      const material = cloud.material as THREE.ShaderMaterial;
      if (material.uniforms.uNoiseAmp) {
        const baseAmp = LAYER_CONFIGS[index].noiseAmp;
        material.uniforms.uNoiseAmp.value = baseAmp * scale;
      }
    });
  };

  /**
   * Get statistics about the forest
   */
  const getStats = () => {
    const stats = {
      near: forestData.nearPositions.length / 3,
      mid: forestData.midPositions.length / 3,
      far: forestData.farPositions.length / 3,
      total: 0,
    };
    stats.total = stats.near + stats.mid + stats.far;
    return stats;
  };

  return {
    pointClouds,
    updateTime,
    triggerDisruption,
    setDisruptionStrength,
    setNoiseAmplitude,
    getStats,
  };
}
