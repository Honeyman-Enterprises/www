/**
 * Tree Geometry Generator
 * Creates low-poly geometric trees using stacked cones
 *
 * @module TreeGeometry
 */

import * as THREE from 'three';
import { hexToNumber } from '../../../utils/three/colors';

/**
 * Parameters for tree generation
 */
export interface TreeGenerationParams {
  /** Number of radial segments for cone geometry (4-8 for low-poly look) */
  segments: number;
  /** Total tree height in world units */
  height: number;
  /** Number of foliage tiers (2-3 typically) */
  foliageTiers: number;
  /** Trunk color (hex string) */
  trunkColor: string;
  /** Foliage color (hex string) */
  foliageColor: string;
  /** Scale factor for randomization (0-1, 0 = uniform) */
  randomness?: number;
}

/**
 * Individual tree part (trunk or foliage tier)
 */
interface TreePart {
  geometry: THREE.BufferGeometry;
  color: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

/**
 * Result of tree generation
 */
export interface TreeGeometryResult {
  /** Merged buffer geometry ready for facet extraction */
  geometry: THREE.BufferGeometry;
  /** Individual parts before merging (for debugging) */
  parts: TreePart[];
  /** Bounding box of complete tree */
  boundingBox: THREE.Box3;
}

/**
 * Create a low-poly geometric tree
 *
 * Trees are composed of stacked cone geometries:
 * - 1 trunk cone (narrow, teal color)
 * - 2-3 foliage tiers (wider, gold color, decreasing size upward)
 *
 * @param params - Tree generation parameters
 * @returns Tree geometry result with merged geometry and metadata
 *
 * @example
 * ```typescript
 * const tree = createLowPolyTree({
 *   segments: 6,
 *   height: 4,
 *   foliageTiers: 3,
 *   trunkColor: '#2AA7A1',
 *   foliageColor: '#BE8A2F'
 * });
 *
 * // Use merged geometry for rendering
 * const mesh = new THREE.Mesh(tree.geometry, material);
 * ```
 */
export function createLowPolyTree(params: TreeGenerationParams): TreeGeometryResult {
  const {
    segments,
    height,
    foliageTiers,
    trunkColor,
    foliageColor,
    randomness = 0.1,
  } = params;

  const parts: TreePart[] = [];
  const trunkColorNum = hexToNumber(trunkColor);
  const foliageColorNum = hexToNumber(foliageColor);

  // Proportions (adjust for aesthetic)
  const trunkHeight = height * 0.3; // 30% of total height
  const trunkRadius = height * 0.08; // Narrow trunk
  const foliageHeight = height * 0.7; // 70% of total height
  const foliageStartY = trunkHeight * 0.7; // Overlap slightly with trunk

  // Create trunk cone (pointed upward)
  const trunkGeometry = new THREE.ConeGeometry(
    trunkRadius,
    trunkHeight,
    segments,
    1, // height segments (flat sides)
    false // not open-ended
  );

  const trunkPosition = new THREE.Vector3(
    0,
    trunkHeight / 2, // Position so base is at y=0
    0
  );

  parts.push({
    geometry: trunkGeometry,
    color: trunkColorNum,
    position: trunkPosition,
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
  });

  // Create foliage tiers (stacked cones, decreasing size upward)
  const tierHeight = foliageHeight / foliageTiers;

  for (let i = 0; i < foliageTiers; i++) {
    const tierIndex = i; // 0, 1, 2
    const tierProgress = tierIndex / foliageTiers; // 0, 0.33, 0.66

    // Radius decreases as we go up (creates tapered effect)
    const tierRadius = height * (0.35 - tierProgress * 0.15); // 0.35 → 0.2

    // Add slight randomness to radius (if enabled)
    const randomRadiusFactor = 1 + (Math.random() - 0.5) * randomness * 0.2;
    const finalRadius = tierRadius * randomRadiusFactor;

    // Create cone for this tier
    const tierGeometry = new THREE.ConeGeometry(
      finalRadius,
      tierHeight,
      segments,
      1,
      false
    );

    // Position tier (stack vertically)
    const tierY = foliageStartY + tierIndex * tierHeight * 0.7 + tierHeight / 2;
    const tierPosition = new THREE.Vector3(
      0,
      tierY,
      0
    );

    // Slight random rotation for organic feel
    const randomRotation = Math.random() * Math.PI * 2 * randomness;

    parts.push({
      geometry: tierGeometry,
      color: foliageColorNum,
      position: tierPosition,
      rotation: new THREE.Euler(0, randomRotation, 0),
      scale: new THREE.Vector3(1, 1, 1),
    });
  }

  // Merge all parts into single BufferGeometry
  const mergedGeometry = mergeTreeParts(parts);

  // Calculate bounding box
  mergedGeometry.computeBoundingBox();
  const boundingBox = mergedGeometry.boundingBox!;

  return {
    geometry: mergedGeometry,
    parts,
    boundingBox,
  };
}

/**
 * Merge multiple tree parts into single BufferGeometry
 * Applies transformations (position, rotation, scale) and preserves colors
 *
 * @param parts - Array of tree parts to merge
 * @returns Merged BufferGeometry with color attribute
 */
function mergeTreeParts(parts: TreePart[]): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = [];

  for (const part of parts) {
    const geometry = part.geometry.clone();

    // Apply transformations
    geometry.translate(part.position.x, part.position.y, part.position.z);
    geometry.rotateX(part.rotation.x);
    geometry.rotateY(part.rotation.y);
    geometry.rotateZ(part.rotation.z);
    geometry.scale(part.scale.x, part.scale.y, part.scale.z);

    // Add color attribute (per-vertex color)
    const positionAttribute = geometry.getAttribute('position');
    const vertexCount = positionAttribute.count;
    const colors = new Float32Array(vertexCount * 3);

    const color = new THREE.Color(part.color);
    for (let i = 0; i < vertexCount; i++) {
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometries.push(geometry);
  }

  // Merge all geometries using BufferGeometryUtils (manual implementation)
  const mergedGeometry = mergeBufferGeometries(geometries);

  return mergedGeometry;
}

/**
 * Merge multiple BufferGeometries into one
 * Manual implementation (Three.js BufferGeometryUtils not always available)
 *
 * @param geometries - Array of BufferGeometry to merge
 * @returns Single merged BufferGeometry
 */
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();

  // Collect all attribute names
  const attributeNames = new Set<string>();
  for (const geometry of geometries) {
    Object.keys(geometry.attributes).forEach(name => attributeNames.add(name));
  }

  // Merge each attribute
  for (const attributeName of attributeNames) {
    const arrays: Float32Array[] = [];
    let itemSize = 3;

    for (const geometry of geometries) {
      const attribute = geometry.getAttribute(attributeName);
      if (attribute) {
        itemSize = attribute.itemSize;
        arrays.push(attribute.array as Float32Array);
      }
    }

    // Calculate total length
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const mergedArray = new Float32Array(totalLength);

    // Copy arrays
    let offset = 0;
    for (const array of arrays) {
      mergedArray.set(array, offset);
      offset += array.length;
    }

    merged.setAttribute(attributeName, new THREE.BufferAttribute(mergedArray, itemSize));
  }

  // Merge indices if present
  const hasIndex = geometries.some(g => g.index !== null);
  if (hasIndex) {
    const indices: number[] = [];
    let indexOffset = 0;

    for (const geometry of geometries) {
      const index = geometry.index;
      const positionAttribute = geometry.getAttribute('position');
      const vertexCount = positionAttribute.count;

      if (index) {
        for (let i = 0; i < index.count; i++) {
          indices.push(index.getX(i) + indexOffset);
        }
      } else {
        // Generate indices if not present
        for (let i = 0; i < vertexCount; i++) {
          indices.push(i + indexOffset);
        }
      }

      indexOffset += vertexCount;
    }

    merged.setIndex(indices);
  }

  return merged;
}

/**
 * Create multiple trees at random positions
 * Helper function for quick forest generation
 *
 * @param count - Number of trees to generate
 * @param params - Base tree parameters (applied to all trees)
 * @param positionRange - Range for x and z positions
 * @returns Array of tree geometry results
 *
 * @example
 * ```typescript
 * const trees = createTreeForest(5, {
 *   segments: 6,
 *   height: 4,
 *   foliageTiers: 3,
 *   trunkColor: '#2AA7A1',
 *   foliageColor: '#BE8A2F'
 * }, { x: 10, z: 10 });
 * ```
 */
export function createTreeForest(
  count: number,
  params: TreeGenerationParams,
  positionRange: { x: number; z: number }
): TreeGeometryResult[] {
  const trees: TreeGeometryResult[] = [];

  for (let i = 0; i < count; i++) {
    // Create tree with slight variations
    const treeParams: TreeGenerationParams = {
      ...params,
      height: params.height * (0.8 + Math.random() * 0.4), // 80%-120% of base height
      randomness: params.randomness,
    };

    const tree = createLowPolyTree(treeParams);

    // Apply random position (in positionRange)
    // Note: Position should be applied to the mesh, not geometry
    // This function returns geometry only, position applied elsewhere

    trees.push(tree);
  }

  return trees;
}

/**
 * Validate tree generation parameters
 * Ensures parameters are within acceptable ranges
 *
 * @param params - Tree generation parameters to validate
 * @throws Error if parameters are invalid
 */
export function validateTreeParams(params: TreeGenerationParams): void {
  if (params.segments < 3 || params.segments > 16) {
    throw new Error('Tree segments must be between 3 and 16');
  }

  if (params.height <= 0) {
    throw new Error('Tree height must be positive');
  }

  if (params.foliageTiers < 1 || params.foliageTiers > 5) {
    throw new Error('Foliage tiers must be between 1 and 5');
  }

  if (params.randomness !== undefined && (params.randomness < 0 || params.randomness > 1)) {
    throw new Error('Randomness must be between 0 and 1');
  }
}
