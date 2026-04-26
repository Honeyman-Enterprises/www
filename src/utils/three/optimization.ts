/**
 * Optimization utilities for Three.js scenes
 *
 * Provides geometry instancing, frustum culling, LOD management,
 * and memory cleanup utilities for optimal performance.
 */

import * as THREE from 'three';

/**
 * Geometry instancing helper for repeated meshes
 */
export class GeometryInstancer {
  private geometry: THREE.BufferGeometry;
  private material: THREE.Material;
  private instancedMesh: THREE.InstancedMesh;
  private count: number;
  private nextIndex: number = 0;

  constructor(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    maxCount: number
  ) {
    this.geometry = geometry;
    this.material = material;
    this.count = maxCount;
    this.instancedMesh = new THREE.InstancedMesh(geometry, material, maxCount);
  }

  /**
   * Add instance with transform matrix
   */
  addInstance(matrix: THREE.Matrix4): number | null {
    if (this.nextIndex >= this.count) {
      console.warn('GeometryInstancer: Maximum instance count reached');
      return null;
    }

    const index = this.nextIndex;
    this.instancedMesh.setMatrixAt(index, matrix);
    this.nextIndex++;

    // Mark for update
    this.instancedMesh.instanceMatrix.needsUpdate = true;

    return index;
  }

  /**
   * Update instance transform
   */
  updateInstance(index: number, matrix: THREE.Matrix4): void {
    if (index < 0 || index >= this.nextIndex) {
      console.warn(`GeometryInstancer: Invalid index ${index}`);
      return;
    }

    this.instancedMesh.setMatrixAt(index, matrix);
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  /**
   * Get instanced mesh for adding to scene
   */
  getMesh(): THREE.InstancedMesh {
    return this.instancedMesh;
  }

  /**
   * Get current instance count
   */
  getCount(): number {
    return this.nextIndex;
  }

  /**
   * Reset all instances
   */
  reset(): void {
    this.nextIndex = 0;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.geometry.dispose();
    if (Array.isArray(this.material)) {
      this.material.forEach(mat => mat.dispose());
    } else {
      this.material.dispose();
    }
  }
}

/**
 * LOD (Level of Detail) manager
 */
export class LODManager {
  private lods: Map<string, THREE.LOD> = new Map();

  /**
   * Create LOD group with multiple quality levels
   */
  createLOD(
    id: string,
    levels: Array<{ distance: number; geometry: THREE.BufferGeometry; material: THREE.Material }>
  ): THREE.LOD {
    const lod = new THREE.LOD();

    levels.forEach(level => {
      const mesh = new THREE.Mesh(level.geometry, level.material);
      lod.addLevel(mesh, level.distance);
    });

    this.lods.set(id, lod);
    return lod;
  }

  /**
   * Get LOD group by ID
   */
  getLOD(id: string): THREE.LOD | undefined {
    return this.lods.get(id);
  }

  /**
   * Update all LODs based on camera
   */
  update(camera: THREE.Camera): void {
    this.lods.forEach(lod => {
      lod.update(camera);
    });
  }

  /**
   * Dispose all LOD resources
   */
  dispose(): void {
    this.lods.forEach(lod => {
      lod.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    });
    this.lods.clear();
  }
}

/**
 * Frustum culling helper
 */
export class FrustumCuller {
  private frustum: THREE.Frustum = new THREE.Frustum();
  private projScreenMatrix: THREE.Matrix4 = new THREE.Matrix4();

  /**
   * Update frustum from camera
   */
  update(camera: THREE.Camera): void {
    camera.updateMatrixWorld();
    this.projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
  }

  /**
   * Check if object is in view frustum
   */
  isInView(object: THREE.Object3D): boolean {
    if (object instanceof THREE.Mesh && object.geometry.boundingSphere) {
      // Use bounding sphere for quick culling
      const sphere = object.geometry.boundingSphere.clone();
      sphere.applyMatrix4(object.matrixWorld);
      return this.frustum.intersectsSphere(sphere);
    }

    if (object instanceof THREE.Mesh && object.geometry.boundingBox) {
      // Use bounding box
      const box = object.geometry.boundingBox.clone();
      box.applyMatrix4(object.matrixWorld);
      return this.frustum.intersectsBox(box);
    }

    // Fallback to point check
    return this.frustum.containsPoint(object.position);
  }

  /**
   * Cull objects outside frustum
   */
  cullObjects(objects: THREE.Object3D[]): void {
    objects.forEach(obj => {
      obj.visible = this.isInView(obj);
    });
  }

  /**
   * Get visible objects from array
   */
  getVisibleObjects(objects: THREE.Object3D[]): THREE.Object3D[] {
    return objects.filter(obj => this.isInView(obj));
  }
}

/**
 * Distance-based culling helper
 */
export class DistanceCuller {
  private maxDistance: number;
  private cameraPosition: THREE.Vector3 = new THREE.Vector3();

  constructor(maxDistance: number = 50) {
    this.maxDistance = maxDistance;
  }

  /**
   * Update camera position
   */
  update(camera: THREE.Camera): void {
    camera.getWorldPosition(this.cameraPosition);
  }

  /**
   * Check if object is within distance
   */
  isInRange(object: THREE.Object3D): boolean {
    const distance = this.cameraPosition.distanceTo(object.position);
    return distance <= this.maxDistance;
  }

  /**
   * Cull objects beyond max distance
   */
  cullObjects(objects: THREE.Object3D[]): void {
    objects.forEach(obj => {
      obj.visible = this.isInRange(obj);
    });
  }

  /**
   * Get distance to object
   */
  getDistance(object: THREE.Object3D): number {
    return this.cameraPosition.distanceTo(object.position);
  }

  /**
   * Set max culling distance
   */
  setMaxDistance(distance: number): void {
    this.maxDistance = distance;
  }
}

/**
 * Memory cleanup utilities
 */
export class MemoryManager {
  /**
   * Dispose geometry
   */
  static disposeGeometry(geometry: THREE.BufferGeometry): void {
    geometry.dispose();
  }

  /**
   * Dispose material
   */
  static disposeMaterial(material: THREE.Material | THREE.Material[]): void {
    if (Array.isArray(material)) {
      material.forEach(mat => mat.dispose());
    } else {
      material.dispose();
    }
  }

  /**
   * Dispose texture
   */
  static disposeTexture(texture: THREE.Texture): void {
    texture.dispose();
  }

  /**
   * Dispose mesh completely
   */
  static disposeMesh(mesh: THREE.Mesh): void {
    if (mesh.geometry) {
      this.disposeGeometry(mesh.geometry);
    }
    if (mesh.material) {
      this.disposeMaterial(mesh.material);
    }
  }

  /**
   * Dispose entire scene recursively
   */
  static disposeScene(scene: THREE.Scene): void {
    scene.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        this.disposeMesh(obj);
      }
    });

    // Clear children
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }

  /**
   * Dispose renderer
   */
  static disposeRenderer(renderer: THREE.WebGLRenderer): void {
    renderer.dispose();
    renderer.forceContextLoss();
  }

  /**
   * Full cleanup of Three.js resources
   */
  static fullCleanup(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    additionalObjects: THREE.Object3D[] = []
  ): void {
    // Dispose additional objects
    additionalObjects.forEach(obj => {
      if (obj instanceof THREE.Mesh) {
        this.disposeMesh(obj);
      }
    });

    // Dispose scene
    this.disposeScene(scene);

    // Dispose renderer
    this.disposeRenderer(renderer);
  }
}

/**
 * Material pool for reusing materials
 */
export class MaterialPool {
  private materials: Map<string, THREE.Material> = new Map();

  /**
   * Get or create material
   */
  get(
    key: string,
    factory: () => THREE.Material
  ): THREE.Material {
    if (!this.materials.has(key)) {
      this.materials.set(key, factory());
    }
    return this.materials.get(key)!;
  }

  /**
   * Check if material exists
   */
  has(key: string): boolean {
    return this.materials.has(key);
  }

  /**
   * Remove material
   */
  remove(key: string): void {
    const material = this.materials.get(key);
    if (material) {
      MemoryManager.disposeMaterial(material);
      this.materials.delete(key);
    }
  }

  /**
   * Clear all materials
   */
  clear(): void {
    this.materials.forEach(material => {
      MemoryManager.disposeMaterial(material);
    });
    this.materials.clear();
  }

  /**
   * Get material count
   */
  size(): number {
    return this.materials.size;
  }
}

/**
 * Geometry pool for reusing geometries
 */
export class GeometryPool {
  private geometries: Map<string, THREE.BufferGeometry> = new Map();

  /**
   * Get or create geometry
   */
  get(
    key: string,
    factory: () => THREE.BufferGeometry
  ): THREE.BufferGeometry {
    if (!this.geometries.has(key)) {
      this.geometries.set(key, factory());
    }
    return this.geometries.get(key)!;
  }

  /**
   * Check if geometry exists
   */
  has(key: string): boolean {
    return this.geometries.has(key);
  }

  /**
   * Remove geometry
   */
  remove(key: string): void {
    const geometry = this.geometries.get(key);
    if (geometry) {
      MemoryManager.disposeGeometry(geometry);
      this.geometries.delete(key);
    }
  }

  /**
   * Clear all geometries
   */
  clear(): void {
    this.geometries.forEach(geometry => {
      MemoryManager.disposeGeometry(geometry);
    });
    this.geometries.clear();
  }

  /**
   * Get geometry count
   */
  size(): number {
    return this.geometries.size;
  }
}

/**
 * Object pool for efficient object reuse
 */
export class ObjectPool<T extends THREE.Object3D> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  private factory: () => T;
  private maxSize: number;

  constructor(factory: () => T, maxSize: number = 100) {
    this.factory = factory;
    this.maxSize = maxSize;
  }

  /**
   * Acquire object from pool
   */
  acquire(): T {
    let obj = this.available.pop();

    if (!obj) {
      obj = this.factory();
    }

    this.inUse.add(obj);
    obj.visible = true;
    return obj;
  }

  /**
   * Release object back to pool
   */
  release(obj: T): void {
    if (!this.inUse.has(obj)) {
      console.warn('ObjectPool: Attempting to release object not in use');
      return;
    }

    this.inUse.delete(obj);
    obj.visible = false;

    // Reset object state
    obj.position.set(0, 0, 0);
    obj.rotation.set(0, 0, 0);
    obj.scale.set(1, 1, 1);

    // Only keep if under max size
    if (this.available.length < this.maxSize) {
      this.available.push(obj);
    } else {
      // Dispose if pool is full
      if (obj instanceof THREE.Mesh) {
        MemoryManager.disposeMesh(obj);
      }
    }
  }

  /**
   * Release all objects
   */
  releaseAll(): void {
    this.inUse.forEach(obj => this.release(obj));
  }

  /**
   * Clear pool completely
   */
  clear(): void {
    this.releaseAll();
    this.available.forEach(obj => {
      if (obj instanceof THREE.Mesh) {
        MemoryManager.disposeMesh(obj);
      }
    });
    this.available = [];
  }

  /**
   * Get pool statistics
   */
  getStats(): { available: number; inUse: number; total: number } {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
    };
  }
}

/**
 * Batch update helper for efficient transform updates
 */
export class BatchUpdater {
  private transformUpdates: Map<THREE.Object3D, Partial<{
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  }>> = new Map();

  /**
   * Queue position update
   */
  updatePosition(object: THREE.Object3D, position: THREE.Vector3): void {
    const updates = this.transformUpdates.get(object) || {};
    updates.position = position;
    this.transformUpdates.set(object, updates);
  }

  /**
   * Queue rotation update
   */
  updateRotation(object: THREE.Object3D, rotation: THREE.Euler): void {
    const updates = this.transformUpdates.get(object) || {};
    updates.rotation = rotation;
    this.transformUpdates.set(object, updates);
  }

  /**
   * Queue scale update
   */
  updateScale(object: THREE.Object3D, scale: THREE.Vector3): void {
    const updates = this.transformUpdates.get(object) || {};
    updates.scale = scale;
    this.transformUpdates.set(object, updates);
  }

  /**
   * Apply all queued updates at once
   */
  flush(): void {
    this.transformUpdates.forEach((updates, object) => {
      if (updates.position) object.position.copy(updates.position);
      if (updates.rotation) object.rotation.copy(updates.rotation);
      if (updates.scale) object.scale.copy(updates.scale);
    });
    this.transformUpdates.clear();
  }

  /**
   * Clear all queued updates
   */
  clear(): void {
    this.transformUpdates.clear();
  }
}
