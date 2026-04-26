/**
 * Performance monitoring and optimization utilities for Three.js scenes
 *
 * Provides FPS tracking, frame time measurement, memory monitoring,
 * and automatic quality adjustment based on performance metrics.
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  averageFrameTime: number;
  minFps: number;
  maxFps: number;
  memoryUsage?: number;
  isLowPerformance: boolean;
}

export interface PerformanceThresholds {
  targetFps: number;
  lowFpsThreshold: number;
  criticalFpsThreshold: number;
  highFrameTimeThreshold: number;
  memoryWarningMB?: number;
}

export interface QualityLevel {
  name: 'high' | 'medium' | 'low' | 'minimal';
  treeCount: number;
  segments: number;
  enableInteraction: boolean;
  enablePhysics: boolean;
  enableFog: boolean;
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  targetFps: 60,
  lowFpsThreshold: 30,
  criticalFpsThreshold: 20,
  highFrameTimeThreshold: 33.33, // 30fps in ms
  memoryWarningMB: 75,
};

/**
 * FPS counter with rolling average calculation
 */
export class FPSCounter {
  private frameTimes: number[] = [];
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private maxSamples: number;

  private minFps: number = Infinity;
  private maxFps: number = 0;

  constructor(maxSamples: number = 60) {
    this.maxSamples = maxSamples;
  }

  /**
   * Record a new frame and calculate FPS
   */
  recordFrame(currentTime: number): number {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = currentTime;
      return 60; // Initial default
    }

    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Store frame time in ms
    this.frameTimes.push(deltaTime);

    // Keep only recent samples
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }

    this.frameCount++;

    // Calculate current FPS
    const currentFps = 1000 / deltaTime;

    // Track min/max
    if (currentFps < this.minFps) this.minFps = currentFps;
    if (currentFps > this.maxFps) this.maxFps = currentFps;

    return currentFps;
  }

  /**
   * Get average FPS over recent samples
   */
  getAverageFPS(): number {
    if (this.frameTimes.length === 0) return 60;

    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    return Math.round(1000 / avgFrameTime);
  }

  /**
   * Get current frame time in milliseconds
   */
  getCurrentFrameTime(): number {
    if (this.frameTimes.length === 0) return 16.67;
    return this.frameTimes[this.frameTimes.length - 1];
  }

  /**
   * Get average frame time in milliseconds
   */
  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 16.67;
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
  }

  /**
   * Get minimum FPS recorded
   */
  getMinFPS(): number {
    return this.minFps === Infinity ? 0 : Math.round(this.minFps);
  }

  /**
   * Get maximum FPS recorded
   */
  getMaxFPS(): number {
    return Math.round(this.maxFps);
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.frameTimes = [];
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.minFps = Infinity;
    this.maxFps = 0;
  }

  /**
   * Get total frame count
   */
  getFrameCount(): number {
    return this.frameCount;
  }
}

/**
 * Memory usage monitor
 */
export class MemoryMonitor {
  private initialMemory: number = 0;
  private peakMemory: number = 0;

  /**
   * Get current memory usage in MB (if available)
   */
  getCurrentMemoryMB(): number | undefined {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMemoryMB = memory.usedJSHeapSize / (1024 * 1024);

      if (usedMemoryMB > this.peakMemory) {
        this.peakMemory = usedMemoryMB;
      }

      if (this.initialMemory === 0) {
        this.initialMemory = usedMemoryMB;
      }

      return usedMemoryMB;
    }
    return undefined;
  }

  /**
   * Get peak memory usage in MB
   */
  getPeakMemoryMB(): number {
    return this.peakMemory;
  }

  /**
   * Get memory increase since initialization
   */
  getMemoryIncreaseMB(): number {
    const current = this.getCurrentMemoryMB();
    if (current === undefined || this.initialMemory === 0) return 0;
    return current - this.initialMemory;
  }

  /**
   * Check if memory usage is concerning
   */
  isMemoryHigh(thresholdMB: number = 75): boolean {
    const current = this.getCurrentMemoryMB();
    return current !== undefined && current > thresholdMB;
  }

  /**
   * Reset peak tracking
   */
  reset(): void {
    this.initialMemory = 0;
    this.peakMemory = 0;
  }
}

/**
 * Performance degradation detector
 */
export class PerformanceDegradationDetector {
  private lowFpsCount: number = 0;
  private criticalFpsCount: number = 0;
  private consecutiveLowFrames: number = 0;
  private readonly maxConsecutiveFrames: number = 30; // ~0.5 seconds at 60fps
  private thresholds: PerformanceThresholds;
  private hasWarned: boolean = false;

  constructor(thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS) {
    this.thresholds = thresholds;
  }

  /**
   * Check current FPS and detect degradation
   */
  checkPerformance(currentFps: number): boolean {
    // Track low FPS occurrences
    if (currentFps < this.thresholds.lowFpsThreshold) {
      this.lowFpsCount++;
      this.consecutiveLowFrames++;

      if (currentFps < this.thresholds.criticalFpsThreshold) {
        this.criticalFpsCount++;
      }
    } else {
      this.consecutiveLowFrames = 0;
    }

    // Detect sustained low performance
    const isSustainedLowPerformance = this.consecutiveLowFrames > this.maxConsecutiveFrames;

    return isSustainedLowPerformance;
  }

  /**
   * Check if performance is critically low
   */
  isCriticalPerformance(currentFps: number): boolean {
    return currentFps < this.thresholds.criticalFpsThreshold;
  }

  /**
   * Get low FPS occurrence count
   */
  getLowFpsCount(): number {
    return this.lowFpsCount;
  }

  /**
   * Get critical FPS occurrence count
   */
  getCriticalFpsCount(): number {
    return this.criticalFpsCount;
  }

  /**
   * Reset detection state
   */
  reset(): void {
    this.lowFpsCount = 0;
    this.criticalFpsCount = 0;
    this.consecutiveLowFrames = 0;
    this.hasWarned = false;
  }

  /**
   * Log performance warning (only once)
   */
  warnIfNeeded(currentFps: number, isDevelopment: boolean = false): void {
    if (this.hasWarned || !isDevelopment) return;

    if (this.isCriticalPerformance(currentFps)) {
      console.warn(
        `[Performance] Critical FPS detected: ${currentFps.toFixed(1)}fps. ` +
        `Consider reducing quality or disabling effects.`
      );
      this.hasWarned = true;
    } else if (this.consecutiveLowFrames > this.maxConsecutiveFrames / 2) {
      console.warn(
        `[Performance] Low FPS detected: ${currentFps.toFixed(1)}fps. ` +
        `Quality may be automatically reduced.`
      );
      this.hasWarned = true;
    }
  }
}

/**
 * Auto quality adjustment based on performance
 */
export class QualityAdjuster {
  private currentLevel: QualityLevel['name'] = 'high';
  private qualityLevels: Record<QualityLevel['name'], QualityLevel>;
  private adjustmentCooldown: number = 0;
  private readonly cooldownDuration: number = 3000; // 3 seconds between adjustments

  constructor(
    baseTreeCount: number = 7,
    baseSegments: number = 8
  ) {
    this.qualityLevels = {
      high: {
        name: 'high',
        treeCount: baseTreeCount,
        segments: baseSegments,
        enableInteraction: true,
        enablePhysics: true,
        enableFog: true,
      },
      medium: {
        name: 'medium',
        treeCount: Math.max(5, Math.floor(baseTreeCount * 0.7)),
        segments: Math.max(6, Math.floor(baseSegments * 0.75)),
        enableInteraction: true,
        enablePhysics: true,
        enableFog: true,
      },
      low: {
        name: 'low',
        treeCount: Math.max(3, Math.floor(baseTreeCount * 0.5)),
        segments: Math.max(4, Math.floor(baseSegments * 0.5)),
        enableInteraction: false,
        enablePhysics: false,
        enableFog: true,
      },
      minimal: {
        name: 'minimal',
        treeCount: 3,
        segments: 4,
        enableInteraction: false,
        enablePhysics: false,
        enableFog: false,
      },
    };
  }

  /**
   * Adjust quality based on current FPS
   */
  adjustQuality(currentFps: number, timestamp: number): QualityLevel | null {
    // Check cooldown
    if (timestamp - this.adjustmentCooldown < this.cooldownDuration) {
      return null;
    }

    let newLevel: QualityLevel['name'] | null = null;

    // Determine if adjustment is needed
    if (currentFps < 20 && this.currentLevel !== 'minimal') {
      newLevel = 'minimal';
    } else if (currentFps < 30 && this.currentLevel === 'high') {
      newLevel = 'medium';
    } else if (currentFps < 25 && this.currentLevel === 'medium') {
      newLevel = 'low';
    } else if (currentFps < 20 && this.currentLevel === 'low') {
      newLevel = 'minimal';
    }

    // Apply adjustment if needed
    if (newLevel && newLevel !== this.currentLevel) {
      this.currentLevel = newLevel;
      this.adjustmentCooldown = timestamp;
      return this.qualityLevels[newLevel];
    }

    return null;
  }

  /**
   * Get current quality level settings
   */
  getCurrentQuality(): QualityLevel {
    return this.qualityLevels[this.currentLevel];
  }

  /**
   * Manually set quality level
   */
  setQuality(level: QualityLevel['name']): QualityLevel {
    this.currentLevel = level;
    return this.qualityLevels[level];
  }

  /**
   * Reset to high quality
   */
  reset(): void {
    this.currentLevel = 'high';
    this.adjustmentCooldown = 0;
  }
}

/**
 * Comprehensive performance monitor
 */
export class PerformanceMonitor {
  private fpsCounter: FPSCounter;
  private memoryMonitor: MemoryMonitor;
  private degradationDetector: PerformanceDegradationDetector;
  private qualityAdjuster: QualityAdjuster;
  private isDevelopment: boolean;
  private thresholds: PerformanceThresholds;

  constructor(
    isDevelopment: boolean = false,
    thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS,
    baseTreeCount: number = 7,
    baseSegments: number = 8
  ) {
    this.fpsCounter = new FPSCounter(60);
    this.memoryMonitor = new MemoryMonitor();
    this.degradationDetector = new PerformanceDegradationDetector(thresholds);
    this.qualityAdjuster = new QualityAdjuster(baseTreeCount, baseSegments);
    this.isDevelopment = isDevelopment;
    this.thresholds = thresholds;
  }

  /**
   * Update performance metrics for current frame
   */
  update(timestamp: number): PerformanceMetrics {
    const currentFps = this.fpsCounter.recordFrame(timestamp);
    const averageFps = this.fpsCounter.getAverageFPS();
    const frameTime = this.fpsCounter.getCurrentFrameTime();
    const avgFrameTime = this.fpsCounter.getAverageFrameTime();

    // Check for performance degradation
    const isLowPerformance = this.degradationDetector.checkPerformance(averageFps);

    // Warn in development mode
    if (this.isDevelopment) {
      this.degradationDetector.warnIfNeeded(averageFps, true);

      // Memory warnings
      const memoryUsage = this.memoryMonitor.getCurrentMemoryMB();
      if (memoryUsage && this.thresholds.memoryWarningMB) {
        if (this.memoryMonitor.isMemoryHigh(this.thresholds.memoryWarningMB)) {
          console.warn(
            `[Performance] High memory usage: ${memoryUsage.toFixed(1)}MB`
          );
        }
      }
    }

    return {
      fps: Math.round(currentFps),
      frameTime,
      averageFrameTime: avgFrameTime,
      minFps: this.fpsCounter.getMinFPS(),
      maxFps: this.fpsCounter.getMaxFPS(),
      memoryUsage: this.memoryMonitor.getCurrentMemoryMB(),
      isLowPerformance,
    };
  }

  /**
   * Check if quality should be adjusted and return new settings
   */
  checkQualityAdjustment(timestamp: number, currentFps: number): QualityLevel | null {
    return this.qualityAdjuster.adjustQuality(currentFps, timestamp);
  }

  /**
   * Get current quality settings
   */
  getCurrentQuality(): QualityLevel {
    return this.qualityAdjuster.getCurrentQuality();
  }

  /**
   * Manually set quality level
   */
  setQuality(level: QualityLevel['name']): QualityLevel {
    return this.qualityAdjuster.setQuality(level);
  }

  /**
   * Reset all monitoring data
   */
  reset(): void {
    this.fpsCounter.reset();
    this.memoryMonitor.reset();
    this.degradationDetector.reset();
    this.qualityAdjuster.reset();
  }

  /**
   * Get comprehensive report (development mode)
   */
  getReport(): string {
    const metrics = {
      averageFps: this.fpsCounter.getAverageFPS(),
      minFps: this.fpsCounter.getMinFPS(),
      maxFps: this.fpsCounter.getMaxFPS(),
      avgFrameTime: this.fpsCounter.getAverageFrameTime().toFixed(2),
      frameCount: this.fpsCounter.getFrameCount(),
      memoryUsage: this.memoryMonitor.getCurrentMemoryMB()?.toFixed(1),
      peakMemory: this.memoryMonitor.getPeakMemoryMB().toFixed(1),
      quality: this.qualityAdjuster.getCurrentQuality().name,
      lowFpsCount: this.degradationDetector.getLowFpsCount(),
    };

    return `
Performance Report:
  Average FPS: ${metrics.averageFps}
  FPS Range: ${metrics.minFps} - ${metrics.maxFps}
  Avg Frame Time: ${metrics.avgFrameTime}ms
  Total Frames: ${metrics.frameCount}
  Memory Usage: ${metrics.memoryUsage || 'N/A'}MB
  Peak Memory: ${metrics.peakMemory}MB
  Quality Level: ${metrics.quality}
  Low FPS Events: ${metrics.lowFpsCount}
    `.trim();
  }
}

/**
 * Detect low-end devices based on hardware capabilities
 */
export function detectLowEndDevice(): boolean {
  // Check for low core count
  const cores = navigator.hardwareConcurrency || 4;
  if (cores < 4) return true;

  // Check for low memory (if available)
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory < 4) return true;
  }

  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Check for slower connection
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection && connection.effectiveType) {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return true;
      }
    }
  }

  return isMobile;
}

/**
 * Get recommended initial quality level
 */
export function getRecommendedQuality(
  viewportWidth: number,
  isLowEndDevice: boolean,
  prefersReducedMotion: boolean
): QualityLevel['name'] {
  if (prefersReducedMotion) {
    return 'low';
  }

  if (isLowEndDevice) {
    return 'medium';
  }

  if (viewportWidth < 768) {
    return 'low';
  }

  if (viewportWidth < 1024) {
    return 'medium';
  }

  return 'high';
}
