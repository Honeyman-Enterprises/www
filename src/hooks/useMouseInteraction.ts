/**
 * useMouseInteraction Hook
 *
 * Tracks mouse/touch position and converts to normalized device coordinates (NDC)
 * for Three.js raycasting and facet interaction detection.
 *
 * Features:
 * - Screen to NDC coordinate conversion
 * - Touch event support for mobile
 * - Throttling to maintain 60fps performance
 * - Mouse leave detection
 * - Respects enabled flag (reduced motion)
 *
 * @module hooks/useMouseInteraction
 */

import { useState, useEffect, useCallback, useRef, RefObject } from 'react';
import * as THREE from 'three';

/**
 * Mouse interaction state interface
 */
interface MouseInteractionState {
  position: THREE.Vector2;
  isHovering: boolean;
  lastUpdate: number;
}

/**
 * Hook return interface
 */
interface UseMouseInteractionReturn {
  mousePosition: THREE.Vector2;
  isHovering: boolean;
  resetMouse: () => void;
}

/**
 * Throttle interval in milliseconds (60fps = ~16.67ms)
 */
const THROTTLE_MS = 16;

/**
 * Initial mouse state (centered, not hovering)
 */
const INITIAL_STATE: MouseInteractionState = {
  position: new THREE.Vector2(0, 0),
  isHovering: false,
  lastUpdate: 0,
};

/**
 * Hook for tracking mouse position in normalized device coordinates
 *
 * @param containerRef - Reference to the canvas container element
 * @param enabled - Whether interaction tracking is enabled (false for reduced motion)
 * @returns Mouse position, hover state, and reset function
 *
 * @example
 * ```typescript
 * const canvasRef = useRef<HTMLDivElement>(null);
 * const { mousePosition, isHovering, resetMouse } = useMouseInteraction(canvasRef, true);
 *
 * // Use mousePosition with Three.js Raycaster
 * raycaster.setFromCamera(mousePosition, camera);
 * ```
 */
export const useMouseInteraction = (
  containerRef: RefObject<HTMLElement>,
  enabled: boolean = true
): UseMouseInteractionReturn => {
  // State for mouse position and hover status
  const [state, setState] = useState<MouseInteractionState>(INITIAL_STATE);

  // Ref for throttling updates
  const throttleRef = useRef<number>(0);

  /**
   * Convert screen coordinates to normalized device coordinates (NDC)
   * NDC range: x and y from -1 to 1
   *
   * @param clientX - Screen X coordinate
   * @param clientY - Screen Y coordinate
   * @param bounds - Container bounding rect
   * @returns Vector2 in NDC space
   */
  const screenToNDC = useCallback(
    (clientX: number, clientY: number, bounds: DOMRect): THREE.Vector2 => {
      const x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
      const y = -((clientY - bounds.top) / bounds.height) * 2 + 1;
      return new THREE.Vector2(x, y);
    },
    []
  );

  /**
   * Check if enough time has passed since last update (throttling)
   */
  const shouldUpdate = useCallback((now: number): boolean => {
    if (now - throttleRef.current >= THROTTLE_MS) {
      throttleRef.current = now;
      return true;
    }
    return false;
  }, []);

  /**
   * Handle mouse move events
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enabled || !containerRef.current) return;

      const now = performance.now();
      if (!shouldUpdate(now)) return;

      const bounds = containerRef.current.getBoundingClientRect();
      const position = screenToNDC(event.clientX, event.clientY, bounds);

      setState({
        position,
        isHovering: true,
        lastUpdate: now,
      });
    },
    [enabled, containerRef, screenToNDC, shouldUpdate]
  );

  /**
   * Handle touch move events (mobile support)
   * Uses first touch point only
   */
  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!enabled || !containerRef.current || event.touches.length === 0) return;

      const now = performance.now();
      if (!shouldUpdate(now)) return;

      const touch = event.touches[0];
      const bounds = containerRef.current.getBoundingClientRect();
      const position = screenToNDC(touch.clientX, touch.clientY, bounds);

      setState({
        position,
        isHovering: true,
        lastUpdate: now,
      });
    },
    [enabled, containerRef, screenToNDC, shouldUpdate]
  );

  /**
   * Handle mouse leave events (cursor exits canvas)
   */
  const handleMouseLeave = useCallback(() => {
    if (!enabled) return;

    setState((prev) => ({
      ...prev,
      isHovering: false,
    }));
  }, [enabled]);

  /**
   * Handle touch end events (touch released)
   */
  const handleTouchEnd = useCallback(() => {
    if (!enabled) return;

    setState((prev) => ({
      ...prev,
      isHovering: false,
    }));
  }, [enabled]);

  /**
   * Reset mouse to initial state (centered, not hovering)
   * Useful for cleanup or manual reset
   */
  const resetMouse = useCallback(() => {
    setState(INITIAL_STATE);
    throttleRef.current = 0;
  }, []);

  /**
   * Setup event listeners on mount and cleanup on unmount
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Cleanup function
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [
    containerRef,
    enabled,
    handleMouseMove,
    handleMouseLeave,
    handleTouchMove,
    handleTouchEnd,
  ]);

  /**
   * Reset mouse when disabled (e.g., reduced motion activated)
   */
  useEffect(() => {
    if (!enabled) {
      resetMouse();
    }
  }, [enabled, resetMouse]);

  return {
    mousePosition: state.position,
    isHovering: state.isHovering,
    resetMouse,
  };
};

export default useMouseInteraction;
