/**
 * Three.js Color Utilities
 * Brand color conversion and manipulation for Three.js
 */

import * as THREE from 'three';

/**
 * Brand color constants (Honeyman Enterprises palette)
 */
export const BRAND_COLORS = {
  navy: '#0B2442',
  teal: '#2AA7A1',
  gold: '#BE8A2F',
  cream: '#F7F5F2',
  dark: '#232629',
  darkNavy: '#1a3a5a',
} as const;

/**
 * Convert hex color string to Three.js Color object
 * @param hex - Hex color string (e.g., '#2AA7A1')
 * @returns Three.js Color object
 */
export function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

/**
 * Convert hex color string to numeric color value
 * @param hex - Hex color string (e.g., '#2AA7A1')
 * @returns Numeric color value (e.g., 0x2AA7A1)
 */
export function hexToNumber(hex: string): number {
  return parseInt(hex.replace('#', '0x'), 16);
}

/**
 * Interpolate between two colors based on factor (0-1)
 * @param color1 - First color (hex string)
 * @param color2 - Second color (hex string)
 * @param factor - Interpolation factor (0 = color1, 1 = color2)
 * @returns Interpolated Three.js Color
 */
export function lerpColor(
  color1: string,
  color2: string,
  factor: number
): THREE.Color {
  const c1 = hexToThreeColor(color1);
  const c2 = hexToThreeColor(color2);
  return c1.lerp(c2, factor);
}

/**
 * Get depth-based color gradient
 * Trees further away get more navy tint, closer trees more teal/gold
 * @param baseColor - Base color (hex string)
 * @param depth - Z-position of tree (-10 to -30)
 * @param minDepth - Minimum depth value (-10)
 * @param maxDepth - Maximum depth value (-30)
 * @returns Depth-adjusted Three.js Color
 */
export function getDepthBasedColor(
  baseColor: string,
  depth: number,
  minDepth: number = -10,
  maxDepth: number = -30
): THREE.Color {
  // Normalize depth to 0-1 range
  const normalizedDepth = (depth - minDepth) / (maxDepth - minDepth);

  // Interpolate between base color and darker navy
  return lerpColor(baseColor, BRAND_COLORS.darkNavy, normalizedDepth * 0.5);
}

/**
 * Create material with brand color
 * @param color - Color (hex string or THREE.Color)
 * @param options - Additional material options
 * @returns MeshLambertMaterial with brand color
 */
export function createBrandMaterial(
  color: string | THREE.Color,
  options: Partial<THREE.MeshLambertMaterialParameters> = {}
): THREE.MeshLambertMaterial {
  const threeColor = typeof color === 'string' ? hexToThreeColor(color) : color;

  return new THREE.MeshLambertMaterial({
    color: threeColor,
    flatShading: true, // Low-poly aesthetic
    ...options,
  });
}

/**
 * Get random color from brand palette (excluding navy/dark)
 * @returns Random brand color (teal or gold)
 */
export function getRandomBrandColor(): string {
  const colors = [BRAND_COLORS.teal, BRAND_COLORS.gold];
  return colors[Math.floor(Math.random() * colors.length)];
}
