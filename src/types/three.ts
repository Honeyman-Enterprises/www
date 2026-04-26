/**
 * Three.js Forest Background Type Definitions
 * Custom types for the geometric forest implementation
 */

import * as THREE from 'three';

/**
 * Configuration for individual tree generation
 */
export interface TreeConfig {
  id: string;
  position: THREE.Vector3;
  scale: number;
  rotation: THREE.Euler;
  color: string;
  segments: number;
}

/**
 * Individual facet (triangle face) data structure
 * Tracks both original and current state for spring physics
 */
export interface Facet {
  id: string;
  treeId: string;
  originalPosition: THREE.Vector3;
  originalRotation: THREE.Euler;
  currentPosition: THREE.Vector3;
  currentRotation: THREE.Euler;
  velocity: THREE.Vector3;
  mesh: THREE.Mesh;
  isScattered: boolean;
}

/**
 * Spring-damper physics configuration
 * Controls how facets scatter and reassemble
 */
export interface SpringConfig {
  stiffness: number; // 0.1 - 0.3, higher = more responsive
  damping: number; // 0.7 - 0.9, higher = less bouncy
  mass: number; // 1.0, affects acceleration
  restDistance: number; // 0, distance to stop spring force
}

/**
 * Responsive configuration per breakpoint
 */
export interface ResponsiveConfig {
  maxWidth?: number;
  treeCount: number;
  interactionRadius: number;
  enableScatter: boolean;
  cameraZ: number;
  segments: number;
}

/**
 * Main forest configuration object
 */
export interface ForestConfig {
  background: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  treeCount: Record<'desktop' | 'tablet' | 'mobile', number>;
  treeDepthRange: [number, number];
  treeScaleRange: [number, number];
  treeSegments: Record<'desktop' | 'tablet' | 'mobile', number>;
  colors: {
    teal: string;
    gold: string;
    navy: string;
    darkNavy: string;
  };
  interactionRadius: Record<'desktop' | 'tablet' | 'mobile', number>;
  enableScatter: Record<'desktop' | 'tablet' | 'mobile', boolean>;
  spring: SpringConfig;
  scatterForceMultiplier: number;
  rotationSpeed: number;
  targetFPS: number;
  lowFPSThreshold: number;
  enableAutoQuality: boolean;
  cameraFOV: number;
  cameraPosition: Record<'desktop' | 'tablet' | 'mobile', { x: number; y: number; z: number }>;
  reducedMotionRotationSpeed: number;
}

/**
 * Performance monitoring data
 */
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  drawCalls?: number;
}

/**
 * Scene initialization return type
 */
export interface ThreeScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cleanup: () => void;
}
