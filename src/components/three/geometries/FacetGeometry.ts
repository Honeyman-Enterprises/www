/**
 * Facet Geometry Extractor
 * Breaks BufferGeometry into individual triangle facets for scatter animation
 *
 * @module FacetGeometry
 */

import * as THREE from 'three';
import type { Facet } from '../../../types/three';

/**
 * Options for facet extraction
 */
export interface FacetExtractionOptions {
  /** Include normals in facet data (required for lighting) */
  includeNormals?: boolean;
  /** Include colors in facet data (required for vertex colors) */
  includeColors?: boolean;
  /** Calculate centroid for each facet (useful for proximity detection) */
  calculateCentroids?: boolean;
}

/**
 * Facet data structure (simplified for extraction)
 * Contains vertices and metadata for a single triangle
 */
export interface FacetData {
  id: string;
  vertices: THREE.Vector3[];
  normal: THREE.Vector3;
  centroid: THREE.Vector3;
  color?: THREE.Color;
}

/**
 * Extract individual facets from BufferGeometry
 *
 * Takes a merged BufferGeometry and breaks it into separate triangles.
 * Each facet becomes an independent mesh that can be animated individually.
 *
 * @param geometry - Source BufferGeometry to extract facets from
 * @param treeId - Unique identifier for the tree (for tracking)
 * @param options - Extraction options
 * @returns Array of Facet objects ready for physics simulation
 *
 * @example
 * ```typescript
 * const tree = createLowPolyTree({...});
 * const facets = extractFacets(tree.geometry, 'tree-1');
 *
 * // Each facet is now an independent mesh
 * facets.forEach(facet => {
 *   scene.add(facet.mesh);
 * });
 * ```
 */
export function extractFacets(
  geometry: THREE.BufferGeometry,
  treeId: string,
  options: FacetExtractionOptions = {}
): Facet[] {
  const {
    includeNormals = true,
    includeColors = true,
    calculateCentroids = true,
  } = options;

  const facets: Facet[] = [];

  // Get position attribute (required)
  const positionAttribute = geometry.getAttribute('position');
  if (!positionAttribute) {
    console.warn('Geometry has no position attribute, cannot extract facets');
    return facets;
  }

  // Get optional attributes
  const normalAttribute = includeNormals ? geometry.getAttribute('normal') : null;
  const colorAttribute = includeColors ? geometry.getAttribute('color') : null;

  // Ensure normals are computed if needed
  if (includeNormals && !normalAttribute) {
    geometry.computeVertexNormals();
  }

  // Get index (if indexed geometry)
  const index = geometry.index;
  const isIndexed = index !== null;

  // Calculate number of triangles
  const triangleCount = isIndexed
    ? index.count / 3
    : positionAttribute.count / 3;

  // Extract each triangle as a facet
  for (let i = 0; i < triangleCount; i++) {
    // Get vertex indices for this triangle
    const i0 = isIndexed ? index!.getX(i * 3) : i * 3;
    const i1 = isIndexed ? index!.getX(i * 3 + 1) : i * 3 + 1;
    const i2 = isIndexed ? index!.getX(i * 3 + 2) : i * 3 + 2;

    // Extract vertex positions
    const v0 = new THREE.Vector3(
      positionAttribute.getX(i0),
      positionAttribute.getY(i0),
      positionAttribute.getZ(i0)
    );
    const v1 = new THREE.Vector3(
      positionAttribute.getX(i1),
      positionAttribute.getY(i1),
      positionAttribute.getZ(i1)
    );
    const v2 = new THREE.Vector3(
      positionAttribute.getX(i2),
      positionAttribute.getY(i2),
      positionAttribute.getZ(i2)
    );

    // Calculate face normal (cross product of edges)
    const edge1 = new THREE.Vector3().subVectors(v1, v0);
    const edge2 = new THREE.Vector3().subVectors(v2, v0);
    const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

    // Calculate centroid (average of vertices)
    const centroid = calculateCentroids
      ? new THREE.Vector3()
          .addVectors(v0, v1)
          .add(v2)
          .divideScalar(3)
      : new THREE.Vector3();

    // Extract color (use first vertex color, or white if not present)
    let color = new THREE.Color(0xffffff);
    if (colorAttribute) {
      color = new THREE.Color(
        colorAttribute.getX(i0),
        colorAttribute.getY(i0),
        colorAttribute.getZ(i0)
      );
    }

    // Create facet mesh
    const facetGeometry = createFacetGeometry(v0, v1, v2, normal, color);
    const facetMaterial = new THREE.MeshLambertMaterial({
      color: color,
      flatShading: true,
      vertexColors: includeColors,
    });
    const facetMesh = new THREE.Mesh(facetGeometry, facetMaterial);

    // Position mesh at centroid
    facetMesh.position.copy(centroid);

    // Create Facet data structure
    const facet: Facet = {
      id: `${treeId}-facet-${i}`,
      treeId,
      originalPosition: centroid.clone(),
      originalRotation: facetMesh.rotation.clone(),
      currentPosition: centroid.clone(),
      currentRotation: facetMesh.rotation.clone(),
      velocity: new THREE.Vector3(0, 0, 0),
      mesh: facetMesh,
      isScattered: false,
    };

    facets.push(facet);
  }

  return facets;
}

/**
 * Create BufferGeometry for a single triangular facet
 *
 * @param v0 - First vertex position
 * @param v1 - Second vertex position
 * @param v2 - Third vertex position
 * @param normal - Face normal
 * @param color - Facet color
 * @returns BufferGeometry for the facet
 */
function createFacetGeometry(
  v0: THREE.Vector3,
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  normal: THREE.Vector3,
  color: THREE.Color
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  // Calculate centroid for local coordinates
  const centroid = new THREE.Vector3()
    .addVectors(v0, v1)
    .add(v2)
    .divideScalar(3);

  // Convert to local coordinates (relative to centroid)
  const localV0 = new THREE.Vector3().subVectors(v0, centroid);
  const localV1 = new THREE.Vector3().subVectors(v1, centroid);
  const localV2 = new THREE.Vector3().subVectors(v2, centroid);

  // Position array (3 vertices * 3 components)
  const positions = new Float32Array([
    localV0.x, localV0.y, localV0.z,
    localV1.x, localV1.y, localV1.z,
    localV2.x, localV2.y, localV2.z,
  ]);

  // Normal array (same normal for all vertices of flat triangle)
  const normals = new Float32Array([
    normal.x, normal.y, normal.z,
    normal.x, normal.y, normal.z,
    normal.x, normal.y, normal.z,
  ]);

  // Color array (same color for all vertices)
  const colors = new Float32Array([
    color.r, color.g, color.b,
    color.r, color.g, color.b,
    color.r, color.g, color.b,
  ]);

  // Set attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  return geometry;
}

/**
 * Reassemble facets back into tree positions
 * Helper function to reset all facets to original positions
 *
 * @param facets - Array of facets to reassemble
 */
export function reassembleFacets(facets: Facet[]): void {
  for (const facet of facets) {
    facet.currentPosition.copy(facet.originalPosition);
    facet.currentRotation.copy(facet.originalRotation);
    facet.mesh.position.copy(facet.originalPosition);
    facet.mesh.rotation.copy(facet.originalRotation);
    facet.velocity.set(0, 0, 0);
    facet.isScattered = false;
  }
}

/**
 * Calculate bounding sphere for facets
 * Useful for proximity detection and culling
 *
 * @param facets - Array of facets
 * @returns Bounding sphere encompassing all facets
 */
export function calculateFacetBoundingSphere(facets: Facet[]): THREE.Sphere {
  const positions = facets.map(f => f.currentPosition);

  if (positions.length === 0) {
    return new THREE.Sphere(new THREE.Vector3(), 0);
  }

  // Calculate center (average position)
  const center = new THREE.Vector3();
  for (const pos of positions) {
    center.add(pos);
  }
  center.divideScalar(positions.length);

  // Calculate radius (max distance from center)
  let radius = 0;
  for (const pos of positions) {
    const distance = center.distanceTo(pos);
    radius = Math.max(radius, distance);
  }

  return new THREE.Sphere(center, radius);
}

/**
 * Get facets within radius of a point
 * Used for proximity-based interaction
 *
 * @param facets - Array of facets to search
 * @param point - Center point for search
 * @param radius - Search radius
 * @returns Array of facets within radius
 */
export function getFacetsInRadius(
  facets: Facet[],
  point: THREE.Vector3,
  radius: number
): Facet[] {
  return facets.filter(facet => {
    const distance = facet.currentPosition.distanceTo(point);
    return distance < radius;
  });
}

/**
 * Dispose all facet meshes
 * Clean up geometries and materials
 *
 * @param facets - Array of facets to dispose
 */
export function disposeFacets(facets: Facet[]): void {
  for (const facet of facets) {
    facet.mesh.geometry.dispose();
    if (facet.mesh.material instanceof THREE.Material) {
      facet.mesh.material.dispose();
    }
  }
}

/**
 * Clone facets with new tree ID
 * Useful for duplicating trees
 *
 * @param facets - Source facets to clone
 * @param newTreeId - New tree ID for cloned facets
 * @returns Array of cloned facets
 */
export function cloneFacets(facets: Facet[], newTreeId: string): Facet[] {
  return facets.map((facet, index) => {
    const clonedMesh = facet.mesh.clone();

    return {
      id: `${newTreeId}-facet-${index}`,
      treeId: newTreeId,
      originalPosition: facet.originalPosition.clone(),
      originalRotation: facet.originalRotation.clone(),
      currentPosition: facet.currentPosition.clone(),
      currentRotation: facet.currentRotation.clone(),
      velocity: new THREE.Vector3(0, 0, 0),
      mesh: clonedMesh as THREE.Mesh,
      isScattered: false,
    };
  });
}
