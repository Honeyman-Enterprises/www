/**
 * React hook for monitoring Three.js performance
 *
 * Tracks FPS, memory usage, and automatically adjusts quality settings
 * based on performance metrics to maintain smooth user experience.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PerformanceMonitor,
  PerformanceMetrics,
  PerformanceThresholds,
  QualityLevel,
  detectLowEndDevice,
  getRecommendedQuality,
} from '../utils/three/performance';

export interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  isDevelopment?: boolean;
  thresholds?: PerformanceThresholds;
  baseTreeCount?: number;
  baseSegments?: number;
  enableAutoQuality?: boolean;
  onQualityChange?: (quality: QualityLevel) => void;
}

export interface UsePerformanceMonitorReturn {
  metrics: PerformanceMetrics;
  quality: QualityLevel;
  isLowEndDevice: boolean;
  recordFrame: (timestamp: number) => void;
  setQuality: (level: QualityLevel['name']) => void;
  reset: () => void;
  getReport: () => string;
}

const DEFAULT_METRICS: PerformanceMetrics = {
  fps: 60,
  frameTime: 16.67,
  averageFrameTime: 16.67,
  minFps: 60,
  maxFps: 60,
  memoryUsage: undefined,
  isLowPerformance: false,
};

/**
 * Hook for performance monitoring in Three.js scenes
 *
 * @example
 * ```tsx
 * const { metrics, quality, recordFrame } = usePerformanceMonitor({
 *   enabled: true,
 *   isDevelopment: import.meta.env.DEV,
 *   enableAutoQuality: true,
 *   onQualityChange: (newQuality) => {
 *     console.log('Quality adjusted to:', newQuality.name);
 *   }
 * });
 *
 * // In animation loop
 * useEffect(() => {
 *   function animate(timestamp: number) {
 *     recordFrame(timestamp);
 *     // ... render scene
 *     requestAnimationFrame(animate);
 *   }
 *   animate(performance.now());
 * }, []);
 * ```
 */
export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
): UsePerformanceMonitorReturn {
  const {
    enabled = true,
    isDevelopment = false,
    thresholds,
    baseTreeCount = 7,
    baseSegments = 8,
    enableAutoQuality = true,
    onQualityChange,
  } = options;

  // State
  const [metrics, setMetrics] = useState<PerformanceMetrics>(DEFAULT_METRICS);
  const [quality, setQualityState] = useState<QualityLevel>({
    name: 'high',
    treeCount: baseTreeCount,
    segments: baseSegments,
    enableInteraction: true,
    enablePhysics: true,
    enableFog: true,
  });
  const [isLowEndDevice] = useState(() => detectLowEndDevice());

  // Refs
  const monitorRef = useRef<PerformanceMonitor | null>(null);
  const frameCountRef = useRef(0);
  const lastQualityAdjustmentRef = useRef<number>(0);

  // Initialize monitor
  useEffect(() => {
    if (!enabled) return;

    monitorRef.current = new PerformanceMonitor(
      isDevelopment,
      thresholds,
      baseTreeCount,
      baseSegments
    );

    // Set initial quality based on device capabilities
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const viewportWidth = window.innerWidth;
    const recommendedQuality = getRecommendedQuality(
      viewportWidth,
      isLowEndDevice,
      prefersReducedMotion
    );

    if (recommendedQuality !== 'high') {
      const newQuality = monitorRef.current.setQuality(recommendedQuality);
      setQualityState(newQuality);

      if (isDevelopment) {
        console.log(
          `[Performance] Initial quality set to '${recommendedQuality}' based on device capabilities`
        );
      }
    }

    return () => {
      monitorRef.current = null;
    };
  }, [enabled, isDevelopment, thresholds, baseTreeCount, baseSegments, isLowEndDevice]);

  // Record frame callback
  const recordFrame = useCallback(
    (timestamp: number) => {
      if (!enabled || !monitorRef.current) return;

      frameCountRef.current++;

      // Update metrics every frame
      const newMetrics = monitorRef.current.update(timestamp);
      setMetrics(newMetrics);

      // Check for quality adjustment (with cooldown)
      if (enableAutoQuality && timestamp - lastQualityAdjustmentRef.current > 3000) {
        const newQuality = monitorRef.current.checkQualityAdjustment(
          timestamp,
          newMetrics.fps
        );

        if (newQuality) {
          setQualityState(newQuality);
          lastQualityAdjustmentRef.current = timestamp;

          if (isDevelopment) {
            console.log(
              `[Performance] Quality auto-adjusted to '${newQuality.name}' ` +
              `(FPS: ${newMetrics.fps}, Avg: ${newMetrics.fps})`
            );
          }

          // Notify parent component
          onQualityChange?.(newQuality);
        }
      }

      // Log performance warnings in development
      if (isDevelopment && frameCountRef.current % 300 === 0) {
        if (newMetrics.isLowPerformance) {
          console.warn(
            `[Performance] Low performance detected:`,
            {
              fps: newMetrics.fps,
              avgFrameTime: newMetrics.averageFrameTime.toFixed(2) + 'ms',
              quality: quality.name,
            }
          );
        }
      }
    },
    [enabled, enableAutoQuality, isDevelopment, onQualityChange, quality.name]
  );

  // Manual quality setter
  const setQuality = useCallback(
    (level: QualityLevel['name']) => {
      if (!monitorRef.current) return;

      const newQuality = monitorRef.current.setQuality(level);
      setQualityState(newQuality);

      if (isDevelopment) {
        console.log(`[Performance] Quality manually set to '${level}'`);
      }

      onQualityChange?.(newQuality);
    },
    [isDevelopment, onQualityChange]
  );

  // Reset monitoring
  const reset = useCallback(() => {
    if (!monitorRef.current) return;

    monitorRef.current.reset();
    frameCountRef.current = 0;
    lastQualityAdjustmentRef.current = 0;
    setMetrics(DEFAULT_METRICS);

    if (isDevelopment) {
      console.log('[Performance] Monitor reset');
    }
  }, [isDevelopment]);

  // Get performance report
  const getReport = useCallback((): string => {
    if (!monitorRef.current) {
      return 'Performance monitor not initialized';
    }
    return monitorRef.current.getReport();
  }, []);

  // Log report on unmount in development
  useEffect(() => {
    if (!isDevelopment || !enabled) return;

    return () => {
      if (monitorRef.current) {
        console.log('[Performance] Final Report:\n' + monitorRef.current.getReport());
      }
    };
  }, [isDevelopment, enabled]);

  // Expose window global in development for debugging
  useEffect(() => {
    if (!isDevelopment || !enabled) return;

    (window as any).__performanceMonitor = {
      getMetrics: () => metrics,
      getQuality: () => quality,
      setQuality,
      getReport,
      reset,
    };

    return () => {
      delete (window as any).__performanceMonitor;
    };
  }, [isDevelopment, enabled, metrics, quality, setQuality, getReport, reset]);

  return {
    metrics,
    quality,
    isLowEndDevice,
    recordFrame,
    setQuality,
    reset,
    getReport,
  };
}

/**
 * Hook for device capability detection
 *
 * @example
 * ```tsx
 * const { isLowEndDevice, isMobile, cores, memory } = useDeviceCapabilities();
 * ```
 */
export function useDeviceCapabilities() {
  const [capabilities] = useState(() => {
    const isLowEnd = detectLowEndDevice();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const cores = navigator.hardwareConcurrency || 4;
    const memory = 'deviceMemory' in navigator ? (navigator as any).deviceMemory : undefined;

    return {
      isLowEndDevice: isLowEnd,
      isMobile,
      cores,
      memory,
    };
  });

  return capabilities;
}

/**
 * Hook to get recommended quality settings
 *
 * @example
 * ```tsx
 * const recommendedQuality = useRecommendedQuality();
 * ```
 */
export function useRecommendedQuality(): QualityLevel['name'] {
  const [quality] = useState(() => {
    const isLowEnd = detectLowEndDevice();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const viewportWidth = window.innerWidth;

    return getRecommendedQuality(viewportWidth, isLowEnd, prefersReducedMotion);
  });

  return quality;
}
