/**
 * Performance Utility Tests
 *
 * Tests for Three.js performance monitoring utilities including FPS calculation,
 * quality degradation logic, and memory monitoring.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * FPS Monitor utility
 */
export class FPSMonitor {
  private frameTimes: number[] = [];
  private readonly maxSamples = 60;

  recordFrame(deltaTime: number): void {
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
  }

  getAverageFPS(): number {
    if (this.frameTimes.length === 0) return 60;

    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length;
    return Math.round(1000 / avgFrameTime);
  }

  getCurrentFPS(): number {
    if (this.frameTimes.length === 0) return 60;

    const lastFrameTime = this.frameTimes[this.frameTimes.length - 1];
    return Math.round(1000 / lastFrameTime);
  }

  reset(): void {
    this.frameTimes = [];
  }

  getFrameTimeHistory(): number[] {
    return [...this.frameTimes];
  }
}

/**
 * Quality level enum
 */
export enum QualityLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  MINIMAL = 'minimal',
}

/**
 * Quality settings per level
 */
export interface QualitySettings {
  treeCount: number;
  segments: number;
  interactionRadius: number;
  enableScatter: boolean;
  enableFog: boolean;
}

/**
 * Quality degradation manager
 */
export class QualityManager {
  private currentLevel: QualityLevel = QualityLevel.HIGH;
  private lowFPSCount = 0;
  private readonly degradeThreshold = 10; // consecutive low frames

  private readonly qualitySettings: Record<QualityLevel, QualitySettings> = {
    [QualityLevel.HIGH]: {
      treeCount: 7,
      segments: 8,
      interactionRadius: 150,
      enableScatter: true,
      enableFog: true,
    },
    [QualityLevel.MEDIUM]: {
      treeCount: 5,
      segments: 6,
      interactionRadius: 120,
      enableScatter: true,
      enableFog: true,
    },
    [QualityLevel.LOW]: {
      treeCount: 3,
      segments: 4,
      interactionRadius: 100,
      enableScatter: false,
      enableFog: true,
    },
    [QualityLevel.MINIMAL]: {
      treeCount: 1,
      segments: 4,
      interactionRadius: 0,
      enableScatter: false,
      enableFog: false,
    },
  };

  updateQuality(currentFPS: number, targetFPS = 60): boolean {
    const fpsThreshold = targetFPS * 0.5; // 50% of target

    if (currentFPS < fpsThreshold) {
      this.lowFPSCount++;
    } else {
      this.lowFPSCount = 0;
    }

    // Degrade quality if sustained low FPS
    if (this.lowFPSCount >= this.degradeThreshold) {
      const degraded = this.degradeQuality();
      this.lowFPSCount = 0;
      return degraded;
    }

    return false;
  }

  degradeQuality(): boolean {
    const levels = [QualityLevel.HIGH, QualityLevel.MEDIUM, QualityLevel.LOW, QualityLevel.MINIMAL];
    const currentIndex = levels.indexOf(this.currentLevel);

    if (currentIndex < levels.length - 1) {
      this.currentLevel = levels[currentIndex + 1];
      return true;
    }

    return false;
  }

  getCurrentLevel(): QualityLevel {
    return this.currentLevel;
  }

  getSettings(): QualitySettings {
    return { ...this.qualitySettings[this.currentLevel] };
  }

  reset(): void {
    this.currentLevel = QualityLevel.HIGH;
    this.lowFPSCount = 0;
  }
}

/**
 * Memory monitor utility
 */
export class MemoryMonitor {
  getMemoryUsage(): number | null {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return null;
  }

  isMemoryExceeded(thresholdMB = 50): boolean {
    const usage = this.getMemoryUsage();
    return usage !== null && usage > thresholdMB;
  }

  getMemoryInfo() {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      };
    }
    return null;
  }
}

describe('FPSMonitor', () => {
  let monitor: FPSMonitor;

  beforeEach(() => {
    monitor = new FPSMonitor();
  });

  describe('recordFrame', () => {
    it('should record frame times', () => {
      monitor.recordFrame(16.67); // 60fps
      monitor.recordFrame(16.67);

      const history = monitor.getFrameTimeHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toBe(16.67);
    });

    it('should limit history to maxSamples', () => {
      // Record 70 frames (max is 60)
      for (let i = 0; i < 70; i++) {
        monitor.recordFrame(16.67);
      }

      const history = monitor.getFrameTimeHistory();
      expect(history).toHaveLength(60);
    });

    it('should maintain FIFO order', () => {
      monitor.recordFrame(10);
      monitor.recordFrame(20);
      monitor.recordFrame(30);

      const history = monitor.getFrameTimeHistory();
      expect(history[0]).toBe(10);
      expect(history[2]).toBe(30);
    });
  });

  describe('getAverageFPS', () => {
    it('should calculate correct average FPS for 60fps', () => {
      for (let i = 0; i < 10; i++) {
        monitor.recordFrame(16.67); // 60fps
      }

      const avgFPS = monitor.getAverageFPS();
      expect(avgFPS).toBe(60);
    });

    it('should calculate correct average FPS for 30fps', () => {
      for (let i = 0; i < 10; i++) {
        monitor.recordFrame(33.33); // 30fps
      }

      const avgFPS = monitor.getAverageFPS();
      expect(avgFPS).toBe(30);
    });

    it('should return 60 when no frames recorded', () => {
      const avgFPS = monitor.getAverageFPS();
      expect(avgFPS).toBe(60);
    });

    it('should calculate average across varying frame times', () => {
      monitor.recordFrame(16.67); // 60fps
      monitor.recordFrame(33.33); // 30fps
      monitor.recordFrame(16.67); // 60fps

      const avgFPS = monitor.getAverageFPS();
      // Average frame time: (16.67 + 33.33 + 16.67) / 3 = 22.22ms
      // FPS: 1000 / 22.22 ≈ 45fps
      expect(avgFPS).toBeGreaterThanOrEqual(44);
      expect(avgFPS).toBeLessThanOrEqual(46);
    });
  });

  describe('getCurrentFPS', () => {
    it('should return FPS based on last frame only', () => {
      monitor.recordFrame(16.67); // 60fps
      monitor.recordFrame(50); // 20fps

      const currentFPS = monitor.getCurrentFPS();
      expect(currentFPS).toBe(20);
    });

    it('should return 60 when no frames recorded', () => {
      const currentFPS = monitor.getCurrentFPS();
      expect(currentFPS).toBe(60);
    });
  });

  describe('reset', () => {
    it('should clear frame history', () => {
      monitor.recordFrame(16.67);
      monitor.recordFrame(16.67);
      monitor.reset();

      const history = monitor.getFrameTimeHistory();
      expect(history).toHaveLength(0);
    });

    it('should return default FPS after reset', () => {
      monitor.recordFrame(50); // 20fps
      monitor.reset();

      const avgFPS = monitor.getAverageFPS();
      expect(avgFPS).toBe(60);
    });
  });
});

describe('QualityManager', () => {
  let manager: QualityManager;

  beforeEach(() => {
    manager = new QualityManager();
  });

  describe('initial state', () => {
    it('should start at HIGH quality', () => {
      expect(manager.getCurrentLevel()).toBe(QualityLevel.HIGH);
    });

    it('should provide HIGH quality settings', () => {
      const settings = manager.getSettings();
      expect(settings.treeCount).toBe(7);
      expect(settings.segments).toBe(8);
      expect(settings.enableScatter).toBe(true);
    });
  });

  describe('updateQuality', () => {
    it('should not degrade on single low FPS frame', () => {
      const degraded = manager.updateQuality(20, 60); // 20fps < 30fps threshold
      expect(degraded).toBe(false);
      expect(manager.getCurrentLevel()).toBe(QualityLevel.HIGH);
    });

    it('should degrade after sustained low FPS', () => {
      // Simulate 10 consecutive low FPS frames
      for (let i = 0; i < 10; i++) {
        manager.updateQuality(20, 60);
      }

      expect(manager.getCurrentLevel()).toBe(QualityLevel.MEDIUM);
    });

    it('should reset counter on good FPS', () => {
      // 5 low frames
      for (let i = 0; i < 5; i++) {
        manager.updateQuality(20, 60);
      }

      // 1 good frame
      manager.updateQuality(60, 60);

      // 10 more low frames needed to degrade
      for (let i = 0; i < 9; i++) {
        manager.updateQuality(20, 60);
      }

      expect(manager.getCurrentLevel()).toBe(QualityLevel.HIGH);
    });

    it('should use 50% of target as threshold', () => {
      // targetFPS = 60, threshold = 30
      manager.updateQuality(31, 60); // Above threshold
      expect(manager.getCurrentLevel()).toBe(QualityLevel.HIGH);

      // Reset and try below threshold
      manager.reset();
      for (let i = 0; i < 10; i++) {
        manager.updateQuality(29, 60); // Below threshold
      }
      expect(manager.getCurrentLevel()).toBe(QualityLevel.MEDIUM);
    });
  });

  describe('degradeQuality', () => {
    it('should degrade from HIGH to MEDIUM', () => {
      const success = manager.degradeQuality();
      expect(success).toBe(true);
      expect(manager.getCurrentLevel()).toBe(QualityLevel.MEDIUM);
    });

    it('should degrade through all levels', () => {
      manager.degradeQuality(); // HIGH → MEDIUM
      expect(manager.getCurrentLevel()).toBe(QualityLevel.MEDIUM);

      manager.degradeQuality(); // MEDIUM → LOW
      expect(manager.getCurrentLevel()).toBe(QualityLevel.LOW);

      manager.degradeQuality(); // LOW → MINIMAL
      expect(manager.getCurrentLevel()).toBe(QualityLevel.MINIMAL);
    });

    it('should not degrade below MINIMAL', () => {
      manager.degradeQuality(); // MEDIUM
      manager.degradeQuality(); // LOW
      manager.degradeQuality(); // MINIMAL
      const success = manager.degradeQuality(); // Can't go lower

      expect(success).toBe(false);
      expect(manager.getCurrentLevel()).toBe(QualityLevel.MINIMAL);
    });

    it('should update settings when degrading', () => {
      const highSettings = manager.getSettings();
      manager.degradeQuality();
      const mediumSettings = manager.getSettings();

      expect(mediumSettings.treeCount).toBeLessThan(highSettings.treeCount);
      expect(mediumSettings.segments).toBeLessThanOrEqual(highSettings.segments);
    });
  });

  describe('getSettings', () => {
    it('should return correct settings for each level', () => {
      const high = manager.getSettings();
      expect(high.treeCount).toBe(7);

      manager.degradeQuality();
      const medium = manager.getSettings();
      expect(medium.treeCount).toBe(5);

      manager.degradeQuality();
      const low = manager.getSettings();
      expect(low.treeCount).toBe(3);
      expect(low.enableScatter).toBe(false);

      manager.degradeQuality();
      const minimal = manager.getSettings();
      expect(minimal.treeCount).toBe(1);
      expect(minimal.enableFog).toBe(false);
    });

    it('should return a copy of settings (not reference)', () => {
      const settings1 = manager.getSettings();
      const settings2 = manager.getSettings();

      settings1.treeCount = 999;
      expect(settings2.treeCount).not.toBe(999);
    });
  });

  describe('reset', () => {
    it('should reset to HIGH quality', () => {
      manager.degradeQuality();
      manager.degradeQuality();
      manager.reset();

      expect(manager.getCurrentLevel()).toBe(QualityLevel.HIGH);
    });

    it('should reset low FPS counter', () => {
      // Accumulate some low FPS frames
      for (let i = 0; i < 5; i++) {
        manager.updateQuality(20, 60);
      }

      manager.reset();

      // Should need full 10 frames to degrade again
      for (let i = 0; i < 9; i++) {
        manager.updateQuality(20, 60);
      }
      expect(manager.getCurrentLevel()).toBe(QualityLevel.HIGH);
    });
  });
});

describe('MemoryMonitor', () => {
  let monitor: MemoryMonitor;

  beforeEach(() => {
    monitor = new MemoryMonitor();
  });

  describe('getMemoryUsage', () => {
    it('should return null if memory API not available', () => {
      const usage = monitor.getMemoryUsage();
      // In test environment, memory API may not be available
      expect(usage).toBeNull();
    });

    it('should return memory in MB if API available', () => {
      // Mock performance.memory
      const mockMemory = {
        usedJSHeapSize: 50 * 1024 * 1024, // 50MB
        totalJSHeapSize: 100 * 1024 * 1024,
        jsHeapSizeLimit: 200 * 1024 * 1024,
      };

      Object.defineProperty(performance, 'memory', {
        value: mockMemory,
        configurable: true,
      });

      const usage = monitor.getMemoryUsage();
      expect(usage).toBe(50);

      // Cleanup
      delete (performance as any).memory;
    });
  });

  describe('isMemoryExceeded', () => {
    it('should return false if memory API not available', () => {
      const exceeded = monitor.isMemoryExceeded(50);
      expect(exceeded).toBe(false);
    });

    it('should return true if usage exceeds threshold', () => {
      // Mock high memory usage
      const mockMemory = {
        usedJSHeapSize: 75 * 1024 * 1024, // 75MB
        totalJSHeapSize: 100 * 1024 * 1024,
        jsHeapSizeLimit: 200 * 1024 * 1024,
      };

      Object.defineProperty(performance, 'memory', {
        value: mockMemory,
        configurable: true,
      });

      const exceeded = monitor.isMemoryExceeded(50);
      expect(exceeded).toBe(true);

      // Cleanup
      delete (performance as any).memory;
    });

    it('should use custom threshold', () => {
      const mockMemory = {
        usedJSHeapSize: 60 * 1024 * 1024, // 60MB
        totalJSHeapSize: 100 * 1024 * 1024,
        jsHeapSizeLimit: 200 * 1024 * 1024,
      };

      Object.defineProperty(performance, 'memory', {
        value: mockMemory,
        configurable: true,
      });

      expect(monitor.isMemoryExceeded(50)).toBe(true);
      expect(monitor.isMemoryExceeded(70)).toBe(false);

      // Cleanup
      delete (performance as any).memory;
    });
  });

  describe('getMemoryInfo', () => {
    it('should return null if memory API not available', () => {
      const info = monitor.getMemoryInfo();
      expect(info).toBeNull();
    });

    it('should return detailed memory info', () => {
      const mockMemory = {
        usedJSHeapSize: 50 * 1024 * 1024,
        totalJSHeapSize: 100 * 1024 * 1024,
        jsHeapSizeLimit: 200 * 1024 * 1024,
      };

      Object.defineProperty(performance, 'memory', {
        value: mockMemory,
        configurable: true,
      });

      const info = monitor.getMemoryInfo();
      expect(info).toEqual({
        used: 50,
        total: 100,
        limit: 200,
      });

      // Cleanup
      delete (performance as any).memory;
    });
  });
});
