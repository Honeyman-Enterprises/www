/**
 * Vitest Test Setup
 *
 * Global test configuration and setup for all test files
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for media query tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  return setTimeout(() => callback(Date.now()), 0) as unknown as number;
});

global.cancelAnimationFrame = vi.fn((id: number) => {
  clearTimeout(id);
});

// Mock IntersectionObserver for useInView tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock WebGL context
const mockWebGLContext = {
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

// Mock HTMLCanvasElement.getContext
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (contextType: string, ...args: any[]) {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return mockWebGLContext as any;
  }
  return originalGetContext.call(this, contextType, ...args);
};

// Suppress console errors during tests (optional, can be configured per test)
const originalError = console.error;
beforeEach(() => {
  console.error = (...args: any[]) => {
    // Only show unexpected errors, not expected test errors
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterEach(() => {
  console.error = originalError;
});

// Custom matchers (optional)
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Add type declaration for custom matcher
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeWithinRange(floor: number, ceiling: number): T;
  }
  interface AsymmetricMatchersContaining {
    toBeWithinRange(floor: number, ceiling: number): any;
  }
}
