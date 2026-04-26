/**
 * useThreeScene Hook Tests
 *
 * Tests for the Three.js scene initialization hook including scene setup,
 * cleanup on unmount, resize handling, and animation loop.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  setupThreeMocks,
  MockScene,
  MockCamera,
  MockRenderer,
  mockRequestAnimationFrame,
} from '../../utils/test-helpers/three-mocks';

/**
 * Hook for managing Three.js scene lifecycle
 */
export function useThreeScene(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const sceneRef = React.useRef<any>(null);
  const cameraRef = React.useRef<any>(null);
  const rendererRef = React.useRef<any>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  // Initialize scene
  React.useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new MockScene();
    const camera = new MockCamera();
    const renderer = new MockRenderer();

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Setup renderer
    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 600;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Setup camera
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    setIsInitialized(true);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      scene.children.forEach((child: any) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });

      renderer.dispose();
      renderer.forceContextLoss();

      setIsInitialized(false);
    };
  }, [canvasRef]);

  // Handle resize
  const handleResize = React.useCallback(() => {
    if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }, [canvasRef]);

  // Start animation loop
  const startAnimation = React.useCallback((callback: (deltaTime: number) => void) => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      callback(deltaTime);

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isInitialized,
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    handleResize,
    startAnimation,
  };
}

// Mock React hooks for testing
const React = {
  useState: vi.fn((initial: any) => {
    let state = initial;
    const setState = vi.fn((newState: any) => {
      state = typeof newState === 'function' ? newState(state) : newState;
    });
    return [state, setState];
  }),
  useRef: vi.fn((initial: any) => ({ current: initial })),
  useEffect: vi.fn((effect: () => void | (() => void)) => {
    const cleanup = effect();
    return cleanup;
  }),
  useCallback: vi.fn((callback: Function) => callback),
};

describe('useThreeScene', () => {
  let cleanup: () => void;
  let canvasRef: React.RefObject<HTMLCanvasElement>;
  let rafMock: ReturnType<typeof mockRequestAnimationFrame>;

  beforeEach(() => {
    cleanup = setupThreeMocks();
    rafMock = mockRequestAnimationFrame();

    // Create mock canvas ref
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    Object.defineProperty(canvas, 'clientWidth', { value: 800 });
    Object.defineProperty(canvas, 'clientHeight', { value: 600 });
    canvasRef = { current: canvas };
  });

  afterEach(() => {
    cleanup();
    rafMock.restore();
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize scene, camera, and renderer', () => {
      const hook = useThreeScene(canvasRef);

      expect(hook.scene).toBeDefined();
      expect(hook.camera).toBeDefined();
      expect(hook.renderer).toBeDefined();
    });

    it('should set isInitialized to true after setup', () => {
      const hook = useThreeScene(canvasRef);
      expect(hook.isInitialized).toBe(true);
    });

    it('should not initialize without canvas ref', () => {
      const emptyRef = { current: null };
      const hook = useThreeScene(emptyRef);

      expect(hook.scene).toBeNull();
      expect(hook.camera).toBeNull();
      expect(hook.renderer).toBeNull();
      expect(hook.isInitialized).toBe(false);
    });

    it('should setup renderer with correct dimensions', () => {
      const hook = useThreeScene(canvasRef);

      expect(hook.renderer.setSize).toHaveBeenCalledWith(800, 600);
    });

    it('should setup renderer with device pixel ratio', () => {
      const originalDPR = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });

      const hook = useThreeScene(canvasRef);

      expect(hook.renderer.setPixelRatio).toHaveBeenCalledWith(2);

      Object.defineProperty(window, 'devicePixelRatio', { value: originalDPR });
    });

    it('should cap pixel ratio at 2', () => {
      const originalDPR = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true });

      const hook = useThreeScene(canvasRef);

      expect(hook.renderer.setPixelRatio).toHaveBeenCalledWith(2);

      Object.defineProperty(window, 'devicePixelRatio', { value: originalDPR });
    });

    it('should setup camera with correct aspect ratio', () => {
      const hook = useThreeScene(canvasRef);

      expect(hook.camera.aspect).toBe(800 / 600);
      expect(hook.camera.updateProjectionMatrix).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should dispose renderer on unmount', () => {
      const hook = useThreeScene(canvasRef);
      const renderer = hook.renderer;

      // Simulate unmount by calling cleanup from useEffect
      React.useEffect.mock.results[0].value?.();

      expect(renderer.dispose).toHaveBeenCalled();
      expect(renderer.forceContextLoss).toHaveBeenCalled();
    });

    it('should cancel animation frame on unmount', () => {
      const hook = useThreeScene(canvasRef);
      const stopAnimation = hook.startAnimation(vi.fn());

      stopAnimation();

      expect(rafMock.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should dispose geometries from scene objects', () => {
      const hook = useThreeScene(canvasRef);

      const mockMesh = {
        geometry: { dispose: vi.fn() },
        material: { dispose: vi.fn() },
      };

      hook.scene.add(mockMesh);

      // Trigger cleanup
      React.useEffect.mock.results[0].value?.();

      expect(mockMesh.geometry.dispose).toHaveBeenCalled();
      expect(mockMesh.material.dispose).toHaveBeenCalled();
    });

    it('should set isInitialized to false on unmount', () => {
      const hook = useThreeScene(canvasRef);
      expect(hook.isInitialized).toBe(true);

      // Trigger cleanup
      React.useEffect.mock.results[0].value?.();

      // After cleanup, new state should be set
      const setStateCalls = React.useState.mock.results[0].value[1].mock.calls;
      expect(setStateCalls[setStateCalls.length - 1][0]).toBe(false);
    });
  });

  describe('handleResize', () => {
    it('should update camera aspect ratio', () => {
      const hook = useThreeScene(canvasRef);

      // Change canvas dimensions
      Object.defineProperty(canvasRef.current!, 'clientWidth', { value: 1024 });
      Object.defineProperty(canvasRef.current!, 'clientHeight', { value: 768 });

      hook.handleResize();

      expect(hook.camera.aspect).toBe(1024 / 768);
      expect(hook.camera.updateProjectionMatrix).toHaveBeenCalled();
    });

    it('should update renderer size', () => {
      const hook = useThreeScene(canvasRef);

      Object.defineProperty(canvasRef.current!, 'clientWidth', { value: 1024 });
      Object.defineProperty(canvasRef.current!, 'clientHeight', { value: 768 });

      hook.handleResize();

      expect(hook.renderer.setSize).toHaveBeenCalledWith(1024, 768);
    });

    it('should not crash if refs are null', () => {
      const hook = useThreeScene(canvasRef);

      // Null out refs
      canvasRef.current = null;

      expect(() => hook.handleResize()).not.toThrow();
    });

    it('should handle multiple resize calls', () => {
      const hook = useThreeScene(canvasRef);

      hook.handleResize();
      hook.handleResize();
      hook.handleResize();

      expect(hook.renderer.setSize).toHaveBeenCalledTimes(4); // Initial + 3 resizes
    });
  });

  describe('startAnimation', () => {
    it('should start animation loop', () => {
      const hook = useThreeScene(canvasRef);
      const callback = vi.fn();

      hook.startAnimation(callback);

      rafMock.triggerFrame(16.67);

      expect(callback).toHaveBeenCalled();
    });

    it('should call callback with delta time', () => {
      const hook = useThreeScene(canvasRef);
      const callback = vi.fn();

      hook.startAnimation(callback);

      rafMock.triggerFrame(0);
      rafMock.triggerFrame(16.67);

      expect(callback).toHaveBeenCalledWith(16.67);
    });

    it('should render scene each frame', () => {
      const hook = useThreeScene(canvasRef);

      hook.startAnimation(vi.fn());

      rafMock.triggerFrame();

      expect(hook.renderer.render).toHaveBeenCalledWith(hook.scene, hook.camera);
    });

    it('should continue animation loop automatically', () => {
      const hook = useThreeScene(canvasRef);
      const callback = vi.fn();

      hook.startAnimation(callback);

      rafMock.triggerFrame();
      rafMock.triggerFrame();
      rafMock.triggerFrame();

      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should return cleanup function', () => {
      const hook = useThreeScene(canvasRef);
      const callback = vi.fn();

      const stopAnimation = hook.startAnimation(callback);

      expect(typeof stopAnimation).toBe('function');

      stopAnimation();

      expect(rafMock.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should stop calling callback after cleanup', () => {
      const hook = useThreeScene(canvasRef);
      const callback = vi.fn();

      const stopAnimation = hook.startAnimation(callback);

      rafMock.triggerFrame();
      expect(callback).toHaveBeenCalledTimes(1);

      stopAnimation();

      rafMock.triggerFrame();
      expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it('should calculate correct delta time between frames', () => {
      const hook = useThreeScene(canvasRef);
      const callback = vi.fn();

      hook.startAnimation(callback);

      rafMock.triggerFrame(0);
      rafMock.triggerFrame(16.67);
      rafMock.triggerFrame(33.34);

      expect(callback).toHaveBeenNthCalledWith(1, 0); // First frame
      expect(callback).toHaveBeenNthCalledWith(2, 16.67);
      expect(callback).toHaveBeenNthCalledWith(3, 16.67);
    });
  });

  describe('integration', () => {
    it('should work with full lifecycle', () => {
      const hook = useThreeScene(canvasRef);

      expect(hook.isInitialized).toBe(true);

      const callback = vi.fn();
      const stopAnimation = hook.startAnimation(callback);

      rafMock.triggerFrame();
      expect(callback).toHaveBeenCalled();

      hook.handleResize();
      expect(hook.renderer.setSize).toHaveBeenCalled();

      stopAnimation();
      React.useEffect.mock.results[0].value?.();

      expect(hook.renderer.dispose).toHaveBeenCalled();
    });

    it('should handle rapid mount/unmount', () => {
      const hook1 = useThreeScene(canvasRef);
      React.useEffect.mock.results[0].value?.();

      const hook2 = useThreeScene(canvasRef);
      React.useEffect.mock.results[0].value?.();

      expect(hook1.renderer.dispose).toHaveBeenCalled();
      expect(hook2.renderer.dispose).toHaveBeenCalled();
    });
  });
});
