/**
 * Three.js Scene Management Hook
 * Handles scene initialization, animation loop, and cleanup
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ThreeScene } from '../types/three';
import { BRAND_COLORS, hexToNumber } from '../utils/three/colors';

interface UseThreeSceneOptions {
  container: HTMLDivElement | null;
  enableFog?: boolean;
  fogNear?: number;
  fogFar?: number;
  cameraPosition?: { x: number; y: number; z: number };
  cameraFOV?: number;
  backgroundColor?: string;
}

interface UseThreeSceneReturn {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  isReady: boolean;
}

/**
 * Hook to initialize and manage Three.js scene
 * Handles setup, resize events, and cleanup
 */
export function useThreeScene(
  options: UseThreeSceneOptions
): UseThreeSceneReturn {
  const {
    container,
    enableFog = true,
    fogNear = 5,
    fogFar = 35,
    cameraPosition = { x: 0, y: 2, z: 5 },
    cameraFOV = 75,
    backgroundColor = BRAND_COLORS.navy,
  } = options;

  const [isReady, setIsReady] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!container) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(hexToNumber(backgroundColor));
    sceneRef.current = scene;

    // Setup fog for atmospheric depth
    if (enableFog) {
      scene.fog = new THREE.Fog(hexToNumber(backgroundColor), fogNear, fogFar);
    }

    // Initialize camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(cameraFOV, aspect, 0.1, 1000);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Handle window resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    setIsReady(true);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);

      // Cancel animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Dispose renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        container.removeChild(rendererRef.current.domElement);
      }

      // Clear scene
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        sceneRef.current.clear();
      }

      setIsReady(false);
    };
  }, [
    container,
    enableFog,
    fogNear,
    fogFar,
    cameraPosition.x,
    cameraPosition.y,
    cameraPosition.z,
    cameraFOV,
    backgroundColor,
  ]);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    isReady,
  };
}

/**
 * Hook to start animation loop
 * @param callback - Function to call on each frame with deltaTime
 * @param enabled - Whether animation loop is active
 */
export function useAnimationLoop(
  callback: (deltaTime: number) => void,
  enabled: boolean = true
) {
  const callbackRef = useRef(callback);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    let isActive = true;

    const animate = (currentTime: number) => {
      if (!isActive) return;

      // Calculate delta time in seconds
      const deltaTime = lastFrameTimeRef.current
        ? (currentTime - lastFrameTimeRef.current) / 1000
        : 0;
      lastFrameTimeRef.current = currentTime;

      // Call user callback
      callbackRef.current(deltaTime);

      // Continue loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isActive = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [enabled]);
}
