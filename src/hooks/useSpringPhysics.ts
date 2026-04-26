/**
 * useSpringPhysics Hook
 *
 * Implements spring-damper physics system for facet scatter and reassemble behavior.
 * Uses Hooke's Law for spring forces and Euler integration for smooth motion.
 *
 * Physics Model:
 * - Spring Force: F = -k * (x - x0) - d * v
 *   - k = stiffness (spring constant)
 *   - d = damping (friction coefficient)
 *   - x = current position
 *   - x0 = original position (target)
 *   - v = velocity
 *
 * - Scatter Force: Inverse square falloff from mouse position
 *   - Direction: Away from cursor
 *   - Magnitude: (1 - distance/radius)^2 * strength
 *
 * - Integration: Euler method (frame-independent timing)
 *   - velocity += force * deltaTime / mass
 *   - position += velocity * deltaTime
 */

import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import type { Facet, SpringConfig } from '../types/three';

interface UseSpringPhysicsReturn {
  updatePhysics: (deltaTime: number) => void;
  resetPhysics: () => void;
}

/**
 * Default spring configuration for balanced, natural motion
 */
const DEFAULT_SPRING_CONFIG: Required<SpringConfig> = {
  stiffness: 0.1,
  damping: 0.9,
  mass: 1.0,
  restDistance: 0.01,
};

/**
 * Default scatter configuration
 */
interface ScatterConfig {
  radius: number;
  strength: number;
}

const DEFAULT_SCATTER_CONFIG: ScatterConfig = {
  radius: 2.0,
  strength: 5.0,
};

/**
 * Calculate world-space position from normalized device coordinates (NDC)
 * Projects mouse position from 2D screen to 3D world space
 */
function calculateMouseWorldPosition(
  mouseNDC: THREE.Vector2,
  camera: THREE.Camera,
  distance: number = 10
): THREE.Vector3 {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouseNDC, camera);

  // Get point along ray at specified distance
  const worldPos = new THREE.Vector3();
  raycaster.ray.at(distance, worldPos);

  return worldPos;
}

/**
 * Calculate scatter force based on distance from cursor
 * Uses inverse square falloff for natural repulsion
 */
function calculateScatterForce(
  facetPosition: THREE.Vector3,
  cursorPosition: THREE.Vector3,
  config: ScatterConfig
): THREE.Vector3 {
  const direction = new THREE.Vector3()
    .subVectors(facetPosition, cursorPosition);

  const distance = direction.length();

  // No force if outside radius
  if (distance > config.radius) {
    return new THREE.Vector3(0, 0, 0);
  }

  // Normalize direction
  direction.normalize();

  // Inverse square falloff for natural feel
  const falloff = 1 - (distance / config.radius);
  const strength = Math.pow(falloff, 2) * config.strength;

  return direction.multiplyScalar(strength);
}

/**
 * Calculate spring-damper force toward original position
 * F = -k * displacement - d * velocity
 */
function calculateSpringForce(
  facet: Facet,
  springConfig: Required<SpringConfig>
): THREE.Vector3 {
  // Spring force (Hooke's Law)
  const displacement = new THREE.Vector3()
    .subVectors(facet.currentPosition, facet.originalPosition);

  const springForce = displacement
    .clone()
    .multiplyScalar(-springConfig.stiffness);

  // Damping force (opposes velocity)
  const dampingForce = facet.velocity
    .clone()
    .multiplyScalar(-springConfig.damping);

  // Total force
  return springForce.add(dampingForce);
}

/**
 * Check if facet has reached rest position
 */
function isAtRest(
  facet: Facet,
  restDistance: number
): boolean {
  const displacement = new THREE.Vector3()
    .subVectors(facet.currentPosition, facet.originalPosition);

  const distance = displacement.length();
  const velocityMagnitude = facet.velocity.length();

  return distance < restDistance && velocityMagnitude < 0.01;
}

/**
 * Spring physics hook for facet scatter/reassemble behavior
 *
 * @param facets - Array of facets to apply physics to
 * @param mousePosition - Normalized device coordinates (-1 to 1)
 * @param camera - Three.js camera for world-space projection
 * @param isEnabled - Whether physics simulation is active
 * @param config - Spring configuration (optional, uses defaults)
 * @returns Physics control functions
 */
export function useSpringPhysics(
  facets: Facet[],
  mousePosition: THREE.Vector2,
  camera: THREE.Camera,
  isEnabled: boolean,
  config?: Partial<SpringConfig & { scatterRadius?: number; scatterStrength?: number }>
): UseSpringPhysicsReturn {
  // Merge with defaults
  const springConfig: Required<SpringConfig> = {
    ...DEFAULT_SPRING_CONFIG,
    ...config,
  };

  const scatterConfig: ScatterConfig = {
    radius: config?.scatterRadius ?? DEFAULT_SCATTER_CONFIG.radius,
    strength: config?.scatterStrength ?? DEFAULT_SCATTER_CONFIG.strength,
  };

  // Store mouse world position
  const mouseWorldPosRef = useRef(new THREE.Vector3());

  /**
   * Update physics simulation for all facets
   * Call this in your animation loop with deltaTime in seconds
   */
  const updatePhysics = useCallback((deltaTime: number) => {
    if (!isEnabled || facets.length === 0) return;

    // Update mouse world position
    mouseWorldPosRef.current = calculateMouseWorldPosition(
      mousePosition,
      camera,
      10 // Project to plane at z = -10
    );

    const mouseWorldPos = mouseWorldPosRef.current;

    // Update each facet
    facets.forEach(facet => {
      // Check if at rest and skip expensive calculations
      if (facet.isScattered === false && isAtRest(facet, springConfig.restDistance)) {
        return;
      }

      // Calculate forces
      let totalForce = new THREE.Vector3();

      // Scatter force (repulsion from cursor)
      const scatterForce = calculateScatterForce(
        facet.currentPosition,
        mouseWorldPos,
        scatterConfig
      );

      // Mark as scattered if receiving scatter force
      if (scatterForce.lengthSq() > 0) {
        facet.isScattered = true;
        totalForce.add(scatterForce);
      } else {
        // No scatter force, apply spring to return home
        const springForce = calculateSpringForce(facet, springConfig);
        totalForce.add(springForce);

        // Check if returned to rest
        if (isAtRest(facet, springConfig.restDistance)) {
          facet.isScattered = false;
          facet.velocity.set(0, 0, 0);
          facet.currentPosition.copy(facet.originalPosition);
          facet.currentRotation.copy(facet.originalRotation);
        }
      }

      // Euler integration: v = v + (F/m) * dt
      const acceleration = totalForce.divideScalar(springConfig.mass);
      facet.velocity.add(acceleration.multiplyScalar(deltaTime));

      // Update position: p = p + v * dt
      const displacement = facet.velocity.clone().multiplyScalar(deltaTime);
      facet.currentPosition.add(displacement);

      // Apply to mesh
      facet.mesh.position.copy(facet.currentPosition);

      // Add subtle rotation based on velocity for visual interest
      const rotationAmount = facet.velocity.length() * 0.01 * deltaTime;
      facet.mesh.rotation.z += rotationAmount;
      facet.currentRotation.copy(facet.mesh.rotation);
    });
  }, [isEnabled, facets, mousePosition, camera, springConfig, scatterConfig]);

  /**
   * Reset all facets to original positions immediately
   * Useful for scene transitions or disable states
   */
  const resetPhysics = useCallback(() => {
    facets.forEach(facet => {
      facet.currentPosition.copy(facet.originalPosition);
      facet.currentRotation.copy(facet.originalRotation);
      facet.velocity.set(0, 0, 0);
      facet.isScattered = false;

      facet.mesh.position.copy(facet.originalPosition);
      facet.mesh.rotation.copy(facet.originalRotation);
    });
  }, [facets]);

  return {
    updatePhysics,
    resetPhysics,
  };
}
