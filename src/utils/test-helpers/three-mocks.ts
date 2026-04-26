/**
 * Three.js Testing Mocks and Utilities
 *
 * Provides mock implementations of Three.js objects and utilities for testing
 * components that use Three.js without requiring WebGL context.
 */

import { vi } from 'vitest';

/**
 * Mock WebGL rendering context for tests
 */
export const mockWebGLContext = {
  canvas: document.createElement('canvas'),
  drawingBufferWidth: 800,
  drawingBufferHeight: 600,
  getParameter: vi.fn(() => 16),
  getExtension: vi.fn(() => null),
  createProgram: vi.fn(() => ({})),
  createShader: vi.fn(() => ({})),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  useProgram: vi.fn(),
  getProgramParameter: vi.fn(() => true),
  getShaderParameter: vi.fn(() => true),
  enableVertexAttribArray: vi.fn(),
  vertexAttribPointer: vi.fn(),
  createBuffer: vi.fn(() => ({})),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  clear: vi.fn(),
  clearColor: vi.fn(),
  viewport: vi.fn(),
  drawArrays: vi.fn(),
  drawElements: vi.fn(),
};

/**
 * Mock Three.js Vector3 class
 */
export class MockVector3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  clone() {
    return new MockVector3(this.x, this.y, this.z);
  }

  copy(v: MockVector3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  add(v: MockVector3) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v: MockVector3) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  multiplyScalar(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  distanceTo(v: MockVector3) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const len = this.length();
    if (len > 0) {
      this.multiplyScalar(1 / len);
    }
    return this;
  }

  subVectors(a: MockVector3, b: MockVector3) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
}

/**
 * Mock Three.js Euler class
 */
export class MockEuler {
  x: number;
  y: number;
  z: number;
  order: string;

  constructor(x = 0, y = 0, z = 0, order = 'XYZ') {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  clone() {
    return new MockEuler(this.x, this.y, this.z, this.order);
  }

  copy(euler: MockEuler) {
    this.x = euler.x;
    this.y = euler.y;
    this.z = euler.z;
    this.order = euler.order;
    return this;
  }
}

/**
 * Mock Three.js Scene
 */
export class MockScene {
  children: any[] = [];
  add = vi.fn((object: any) => {
    this.children.push(object);
  });
  remove = vi.fn((object: any) => {
    const index = this.children.indexOf(object);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  });
}

/**
 * Mock Three.js Camera
 */
export class MockCamera {
  position = new MockVector3(0, 0, 5);
  rotation = new MockEuler();
  aspect = 1;
  fov = 75;
  near = 0.1;
  far = 1000;

  updateProjectionMatrix = vi.fn();
}

/**
 * Mock Three.js Renderer
 */
export class MockRenderer {
  domElement = document.createElement('canvas');

  setSize = vi.fn();
  setPixelRatio = vi.fn();
  render = vi.fn();
  dispose = vi.fn();
  forceContextLoss = vi.fn();

  getContext() {
    return mockWebGLContext;
  }
}

/**
 * Mock Three.js Mesh
 */
export class MockMesh {
  position = new MockVector3();
  rotation = new MockEuler();
  scale = new MockVector3(1, 1, 1);
  visible = true;
  geometry: any = null;
  material: any = null;

  constructor(geometry?: any, material?: any) {
    this.geometry = geometry;
    this.material = material;
  }
}

/**
 * Mock Three.js BufferGeometry
 */
export class MockBufferGeometry {
  attributes: Record<string, any> = {};
  dispose = vi.fn();

  setAttribute(name: string, attribute: any) {
    this.attributes[name] = attribute;
  }
}

/**
 * Mock Three.js Material
 */
export class MockMaterial {
  color = { r: 1, g: 1, b: 1 };
  dispose = vi.fn();
}

/**
 * Mock Three.js Raycaster
 */
export class MockRaycaster {
  ray = { origin: new MockVector3(), direction: new MockVector3() };

  setFromCamera = vi.fn();
  intersectObjects = vi.fn(() => []);
}

/**
 * Mock HTMLCanvasElement.getContext to return mock WebGL context
 */
export function mockCanvasGetContext() {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.getContext = vi.fn((contextType: string) => {
    if (contextType === 'webgl' || contextType === 'webgl2') {
      return mockWebGLContext;
    }
    return originalGetContext.call(this, contextType);
  }) as any;

  return () => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  };
}

/**
 * Mock requestAnimationFrame for synchronous testing
 */
export function mockRequestAnimationFrame() {
  let frameId = 0;
  const callbacks = new Map<number, FrameRequestCallback>();

  const mockRAF = vi.fn((callback: FrameRequestCallback) => {
    frameId++;
    callbacks.set(frameId, callback);
    return frameId;
  });

  const mockCAF = vi.fn((id: number) => {
    callbacks.delete(id);
  });

  global.requestAnimationFrame = mockRAF;
  global.cancelAnimationFrame = mockCAF;

  // Helper to manually trigger frames
  const triggerFrame = (timestamp = performance.now()) => {
    callbacks.forEach((callback) => callback(timestamp));
  };

  return {
    requestAnimationFrame: mockRAF,
    cancelAnimationFrame: mockCAF,
    triggerFrame,
    restore: () => {
      callbacks.clear();
    },
  };
}

/**
 * Mock prefers-reduced-motion media query
 */
export function mockReducedMotion(enabled: boolean) {
  const query = `(prefers-reduced-motion: ${enabled ? 'reduce' : 'no-preference'})`;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((q: string) => ({
      matches: q === query && enabled,
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Test fixtures for common Three.js scenarios
 */
export const fixtures = {
  /**
   * Basic scene setup with camera and renderer
   */
  basicScene: () => ({
    scene: new MockScene(),
    camera: new MockCamera(),
    renderer: new MockRenderer(),
  }),

  /**
   * Tree facet data structure
   */
  facet: (id = 'facet-1', treeId = 'tree-1') => ({
    id,
    treeId,
    originalPosition: new MockVector3(0, 0, 0),
    originalRotation: new MockEuler(0, 0, 0),
    currentPosition: new MockVector3(0, 0, 0),
    currentRotation: new MockEuler(0, 0, 0),
    velocity: new MockVector3(0, 0, 0),
    mesh: new MockMesh(),
    isScattered: false,
  }),

  /**
   * Tree configuration
   */
  treeConfig: () => ({
    id: 'tree-1',
    position: new MockVector3(0, 0, -15),
    scale: 1,
    rotation: new MockEuler(0, 0, 0),
    color: '#2AA7A1',
    segments: 8,
  }),

  /**
   * Spring physics configuration
   */
  springConfig: () => ({
    stiffness: 0.2,
    damping: 0.8,
    mass: 1.0,
    restDistance: 0,
  }),

  /**
   * Mouse event data
   */
  mouseEvent: (clientX = 400, clientY = 300) => ({
    clientX,
    clientY,
    type: 'mousemove',
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as any),

  /**
   * Touch event data
   */
  touchEvent: (touches: Array<{ clientX: number; clientY: number }> = [{ clientX: 400, clientY: 300 }]) => ({
    touches,
    type: 'touchmove',
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as any),
};

/**
 * Helper to wait for async operations in tests
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper to create a mock performance observer
 */
export function mockPerformanceObserver() {
  const entries: PerformanceEntry[] = [];

  const MockPerformanceObserver = vi.fn((callback: PerformanceObserverCallback) => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(() => entries),
  }));

  (global as any).PerformanceObserver = MockPerformanceObserver;

  return {
    addEntry: (entry: Partial<PerformanceEntry>) => {
      entries.push(entry as PerformanceEntry);
    },
    clear: () => {
      entries.length = 0;
    },
  };
}

/**
 * Setup function to initialize all mocks before tests
 */
export function setupThreeMocks() {
  const restoreGetContext = mockCanvasGetContext();
  const rafMock = mockRequestAnimationFrame();

  return () => {
    restoreGetContext();
    rafMock.restore();
  };
}
