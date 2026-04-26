/**
 * Forest Geometry Hook
 * Generates multiple trees and extracts facets for scatter animation
 *
 * @module useForestGeometry
 */

import { useMemo, useCallback, useState } from 'react';
import * as THREE from 'three';
import { createLowPolyTree, type TreeGenerationParams } from '../components/three/geometries/TreeGeometry';
import { extractFacets, disposeFacets } from '../components/three/geometries/FacetGeometry';
import { BRAND_COLORS } from '../utils/three/colors';
import type { Facet } from '../types/three';

/**
 * Configuration for forest generation
 */
export interface ForestConfig {
  /** Number of trees to generate */
  treeCount: number;
  /** Number of segments per tree (4-8 for low-poly) */
  segments: number;
  /** Height range for trees [min, max] */
  heightRange: [number, number];
  /** Number of foliage tiers per tree */
  foliageTiers: number;
  /** Trunk color (hex string) */
  trunkColor?: string;
  /** Foliage color (hex string) */
  foliageColor?: string;
  /** Depth range for tree positioning [near, far] */
  depthRange: [number, number];
  /** Width range for tree positioning [-x, +x] */
  widthRange: number;
  /** Randomness factor (0-1) */
  randomness?: number;
}

/**
 * Result from forest generation
 */
export interface ForestGeometryResult {
  /** All facets from all trees */
  facets: Facet[];
  /** Bounding box containing entire forest */
  boundingBox: THREE.Box3;
  /** Number of trees generated */
  treeCount: number;
  /** Total number of facets */
  facetCount: number;
  /** Regenerate forest with new random positions */
  regenerate: () => void;
  /** Cleanup function (dispose geometries) */
  cleanup: () => void;
}

/**
 * Default forest configuration
 */
const DEFAULT_CONFIG: ForestConfig = {
  treeCount: 7,
  segments: 6,
  heightRange: [3, 5],
  foliageTiers: 3,
  trunkColor: BRAND_COLORS.teal,
  foliageColor: BRAND_COLORS.gold,
  depthRange: [-10, -30],
  widthRange: 8,
  randomness: 0.15,
};

/**
 * Hook for generating forest geometry with facets
 *
 * Generates multiple low-poly trees at random positions and extracts
 * individual facets for scatter animation. Handles cleanup automatically.
 *
 * @param config - Forest configuration (merged with defaults)
 * @returns Forest geometry result with facets and utilities
 *
 * @example
 * ```typescript
 * const { facets, regenerate, cleanup } = useForestGeometry({
 *   treeCount: 5,
 *   segments: 6,
 *   heightRange: [3, 5],
 *   foliageTiers: 3,
 *   depthRange: [-10, -30],
 *   widthRange: 8
 * });
 *
 * // Add facets to scene
 * facets.forEach(facet => scene.add(facet.mesh));
 *
 * // Regenerate on demand
 * regenerate();
 *
 * // Cleanup on unmount
 * useEffect(() => cleanup, [cleanup]);
 * ```
 */
export function useForestGeometry(config: Partial<ForestConfig> = {}): ForestGeometryResult {
  const [regenerateKey, setRegenerateKey] = useState(0);

  // Merge with defaults
  const fullConfig = useMemo<ForestConfig>(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  // Generate forest geometry
  const forestData = useMemo(() => {
    const allFacets: Facet[] = [];
    const boundingBox = new THREE.Box3();

    // Generate each tree
    for (let i = 0; i < fullConfig.treeCount; i++) {
      // Random height within range
      const [minHeight, maxHeight] = fullConfig.heightRange;
      const height = minHeight + Math.random() * (maxHeight - minHeight);

      // Generate tree
      const treeParams: TreeGenerationParams = {
        segments: fullConfig.segments,
        height,
        foliageTiers: fullConfig.foliageTiers,
        trunkColor: fullConfig.trunkColor!,
        foliageColor: fullConfig.foliageColor!,
        randomness: fullConfig.randomness,
      };

      const tree = createLowPolyTree(treeParams);

      // Random position in forest
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * fullConfig.widthRange * 2,
        0,
        fullConfig.depthRange[0] + Math.random() * (fullConfig.depthRange[1] - fullConfig.depthRange[0])
      );

      // Random rotation around Y axis
      const rotation = Math.random() * Math.PI * 2;

      // Extract facets from tree
      const treeFacets = extractFacets(tree.geometry, `tree-${i}`, {
        includeNormals: true,
        includeColors: true,
        calculateCentroids: true,
      });

      // Apply position and rotation to each facet
      for (const facet of treeFacets) {
        // Rotate around Y axis
        const rotatedPosition = facet.originalPosition.clone();
        rotatedPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);

        // Translate to tree position
        rotatedPosition.add(position);

        // Update facet
        facet.originalPosition.copy(rotatedPosition);
        facet.currentPosition.copy(rotatedPosition);
        facet.mesh.position.copy(rotatedPosition);
        facet.mesh.rotation.y = rotation;

        // Expand bounding box
        boundingBox.expandByPoint(rotatedPosition);
      }

      allFacets.push(...treeFacets);

      // Cleanup tree geometry (facets have their own copies)
      tree.geometry.dispose();
    }

    return {
      facets: allFacets,
      boundingBox,
      treeCount: fullConfig.treeCount,
      facetCount: allFacets.length,
    };
  }, [fullConfig, regenerateKey]); // Regenerate when key changes

  // Regenerate function
  const regenerate = useCallback(() => {
    // Cleanup old facets
    disposeFacets(forestData.facets);
    // Trigger regeneration
    setRegenerateKey(prev => prev + 1);
  }, [forestData.facets]);

  // Cleanup function
  const cleanup = useCallback(() => {
    disposeFacets(forestData.facets);
  }, [forestData.facets]);

  return {
    ...forestData,
    regenerate,
    cleanup,
  };
}

/**
 * Hook for responsive forest geometry
 * Automatically adjusts tree count based on viewport size
 *
 * @param viewport - Current viewport dimensions
 * @param baseConfig - Base forest configuration
 * @returns Forest geometry result with responsive tree count
 *
 * @example
 * ```typescript
 * const viewport = { width: window.innerWidth, height: window.innerHeight };
 * const { facets } = useResponsiveForestGeometry(viewport, {
 *   segments: 6,
 *   heightRange: [3, 5]
 * });
 * ```
 */
export function useResponsiveForestGeometry(
  viewport: { width: number; height: number },
  baseConfig: Partial<ForestConfig> = {}
): ForestGeometryResult {
  // Determine tree count based on viewport
  const treeCount = useMemo(() => {
    if (viewport.width < 768) {
      return 3; // Mobile
    } else if (viewport.width < 1024) {
      return 5; // Tablet
    } else {
      return 7; // Desktop
    }
  }, [viewport.width]);

  // Adjust segments based on viewport (lower poly on mobile)
  const segments = useMemo(() => {
    if (viewport.width < 768) {
      return 4; // Mobile (very low-poly)
    } else if (viewport.width < 1024) {
      return 6; // Tablet (low-poly)
    } else {
      return 8; // Desktop (medium-poly)
    }
  }, [viewport.width]);

  const config: Partial<ForestConfig> = {
    ...baseConfig,
    treeCount,
    segments,
  };

  return useForestGeometry(config);
}

/**
 * Get forest configuration preset by name
 * Useful for quick setup with different aesthetics
 *
 * @param preset - Preset name
 * @returns Forest configuration
 */
export function getForestPreset(preset: 'minimal' | 'balanced' | 'dense'): ForestConfig {
  const presets: Record<string, ForestConfig> = {
    minimal: {
      treeCount: 3,
      segments: 4,
      heightRange: [2.5, 4],
      foliageTiers: 2,
      trunkColor: BRAND_COLORS.teal,
      foliageColor: BRAND_COLORS.gold,
      depthRange: [-10, -25],
      widthRange: 6,
      randomness: 0.1,
    },
    balanced: {
      ...DEFAULT_CONFIG,
    },
    dense: {
      treeCount: 10,
      segments: 8,
      heightRange: [3, 6],
      foliageTiers: 4,
      trunkColor: BRAND_COLORS.teal,
      foliageColor: BRAND_COLORS.gold,
      depthRange: [-10, -35],
      widthRange: 12,
      randomness: 0.2,
    },
  };

  return presets[preset] || presets.balanced;
}
