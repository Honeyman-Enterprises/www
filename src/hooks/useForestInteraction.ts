/**
 * Forest Mouse/Touch Interaction Hook
 * Handles raycasting to ground plane and parallax camera movement
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface InteractionConfig {
  enableDisruption: boolean;
  enableParallax: boolean;
  parallaxStrength: number; // 0-1, controls camera rotation amount
}

const DEFAULT_CONFIG: InteractionConfig = {
  enableDisruption: true,
  enableParallax: true,
  parallaxStrength: 0.3,
};

/**
 * Hook for forest interaction (mouse disruption + parallax)
 */
export function useForestInteraction(
  containerRef: React.RefObject<HTMLElement>,
  camera: THREE.PerspectiveCamera | null,
  config: Partial<InteractionConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Mouse state
  const [isHovering, setIsHovering] = useState(false);
  const mouseNDC = useRef(new THREE.Vector2(0, 0)); // Normalized device coordinates
  const worldPosition = useRef(new THREE.Vector3(0, 0, -100));

  // Raycaster for ground plane intersection
  const raycaster = useRef(new THREE.Raycaster());
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // y=0 plane

  // Base camera orientation (for parallax)
  const baseCameraRotation = useRef(new THREE.Euler());
  const targetCameraRotation = useRef(new THREE.Euler());

  // Throttle for performance
  const lastUpdateTime = useRef(0);
  const UPDATE_THROTTLE = 1000 / 60; // 60fps max

  /**
   * Convert screen position to NDC (-1 to +1)
   */
  const screenToNDC = (clientX: number, clientY: number, rect: DOMRect): THREE.Vector2 => {
    return new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
  };

  /**
   * Raycast to ground plane and get world position
   */
  const raycastToGround = (ndc: THREE.Vector2, cam: THREE.PerspectiveCamera): THREE.Vector3 | null => {
    raycaster.current.setFromCamera(ndc, cam);

    const intersectionPoint = new THREE.Vector3();
    const intersects = raycaster.current.ray.intersectPlane(groundPlane.current, intersectionPoint);

    return intersects ? intersectionPoint : null;
  };

  /**
   * Handle mouse/touch move
   */
  const handlePointerMove = (event: MouseEvent | TouchEvent) => {
    if (!containerRef.current || !camera) return;

    // Throttle updates
    const now = Date.now();
    if (now - lastUpdateTime.current < UPDATE_THROTTLE) return;
    lastUpdateTime.current = now;

    const rect = containerRef.current.getBoundingClientRect();

    // Get pointer position
    let clientX: number, clientY: number;
    if ('touches' in event) {
      if (event.touches.length === 0) return;
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Convert to NDC
    const ndc = screenToNDC(clientX, clientY, rect);
    mouseNDC.current.copy(ndc);

    // Raycast to ground
    if (finalConfig.enableDisruption) {
      const worldPos = raycastToGround(ndc, camera);
      if (worldPos) {
        worldPosition.current.copy(worldPos);
      }
    }

    // Update parallax target
    if (finalConfig.enableParallax) {
      // Subtle rotation based on mouse position
      // NDC range: -1 to +1, convert to rotation in radians
      const maxRotation = 0.08; // ~4.5 degrees max
      const targetYaw = -ndc.x * maxRotation * finalConfig.parallaxStrength;
      const targetPitch = ndc.y * maxRotation * finalConfig.parallaxStrength * 0.5; // Less pitch

      targetCameraRotation.current.set(
        baseCameraRotation.current.x + targetPitch,
        baseCameraRotation.current.y + targetYaw,
        baseCameraRotation.current.z
      );
    }
  };

  /**
   * Handle mouse enter
   */
  const handlePointerEnter = () => {
    setIsHovering(true);
  };

  /**
   * Handle mouse leave
   */
  const handlePointerLeave = () => {
    setIsHovering(false);

    // Reset parallax
    if (camera && finalConfig.enableParallax) {
      targetCameraRotation.current.copy(baseCameraRotation.current);
    }

    // Move disruption far away
    worldPosition.current.set(0, 0, -100);
  };

  /**
   * Setup event listeners
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Store base camera rotation
    if (camera) {
      baseCameraRotation.current.copy(camera.rotation);
      targetCameraRotation.current.copy(camera.rotation);
    }

    // Add listeners
    container.addEventListener('mousemove', handlePointerMove as EventListener);
    container.addEventListener('touchmove', handlePointerMove as EventListener, { passive: true });
    container.addEventListener('mouseenter', handlePointerEnter);
    container.addEventListener('mouseleave', handlePointerLeave);
    container.addEventListener('touchstart', handlePointerEnter);
    container.addEventListener('touchend', handlePointerLeave);

    // Cleanup
    return () => {
      container.removeEventListener('mousemove', handlePointerMove as EventListener);
      container.removeEventListener('touchmove', handlePointerMove as EventListener);
      container.removeEventListener('mouseenter', handlePointerEnter);
      container.removeEventListener('mouseleave', handlePointerLeave);
      container.removeEventListener('touchstart', handlePointerEnter);
      container.removeEventListener('touchend', handlePointerLeave);
    };
  }, [containerRef.current, camera, finalConfig.enableDisruption, finalConfig.enableParallax]);

  /**
   * Update parallax (smooth camera rotation)
   * Call this in animation loop
   */
  const updateParallax = (deltaTime: number) => {
    if (!camera || !finalConfig.enableParallax) return;

    // Smooth lerp to target rotation
    const lerpFactor = Math.min(deltaTime * 3.0, 1.0); // 3.0 = speed

    camera.rotation.x += (targetCameraRotation.current.x - camera.rotation.x) * lerpFactor;
    camera.rotation.y += (targetCameraRotation.current.y - camera.rotation.y) * lerpFactor;
  };

  /**
   * Get current world position for disruption
   */
  const getDisruptionPosition = (): THREE.Vector3 => {
    return worldPosition.current.clone();
  };

  /**
   * Get current mouse NDC
   */
  const getMouseNDC = (): THREE.Vector2 => {
    return mouseNDC.current.clone();
  };

  return {
    isHovering,
    getDisruptionPosition,
    getMouseNDC,
    updateParallax,
  };
}
