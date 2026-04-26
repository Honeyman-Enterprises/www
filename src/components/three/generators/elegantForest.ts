/**
 * Cyberpunk Grid Floor Generator - 3D tiled floor with glowing edges
 * Creates perspective grid with individual tile panels and missing tiles
 */

class SeededRandom {
  private state: number;
  constructor(seed: number) { this.state = seed; }
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

interface TileData {
  edges: number[];      // Line segments for glowing edges
  center: number[];     // Center point for tile panel
  missing: boolean;     // Whether tile is removed
}

// Generate cyberpunk grid floor with 3D tiles
export function generateElegantForest(): {
  nearPositions: Float32Array;
  nearRandoms: Float32Array;
  midPositions: Float32Array;
  midRandoms: Float32Array;
  farPositions: Float32Array;
  farRandoms: Float32Array;
} {
  const rng = new SeededRandom(12345);
  
  // Grid parameters
  const gridWidth = 40;        // Total width
  const gridDepth = 80;        // Total depth (extends into distance)
  const tileSize = 2.0;        // Size of each tile
  const tileHeight = 0.1;      // Raised border height
  const startZ = -5;           // Start position
  const gridY = -2;            // Floor level
  const missingTileChance = 0.15; // 15% tiles missing
  
  const edgePositions: number[] = [];
  const edgeRandoms: number[] = [];
  const tilePositions: number[] = [];
  const tileRandoms: number[] = [];
  
  // Generate grid of tiles
  for (let z = startZ; z >= startZ - gridDepth; z -= tileSize) {
    for (let x = -gridWidth / 2; x <= gridWidth / 2; x += tileSize) {
      
      // Random missing tiles for visual interest
      if (rng.next() < missingTileChance) {
        continue; // Skip this tile
      }
      
      // Calculate tile corners (raised border)
      const x1 = x;
      const x2 = x + tileSize * 0.95; // Slight gap between tiles
      const z1 = z;
      const z2 = z - tileSize * 0.95;
      const y = gridY + tileHeight;
      
      // Create 4 glowing edges (each edge is a line segment)
      // Bottom edge
      edgePositions.push(x1, y, z1, x2, y, z1);
      edgeRandoms.push(rng.next(), rng.next());
      
      // Right edge
      edgePositions.push(x2, y, z1, x2, y, z2);
      edgeRandoms.push(rng.next(), rng.next());
      
      // Top edge
      edgePositions.push(x2, y, z2, x1, y, z2);
      edgeRandoms.push(rng.next(), rng.next());
      
      // Left edge
      edgePositions.push(x1, y, z2, x1, y, z1);
      edgeRandoms.push(rng.next(), rng.next());
      
      // Add tile center point (for dark panel if needed)
      const centerX = (x1 + x2) / 2;
      const centerZ = (z1 + z2) / 2;
      tilePositions.push(centerX, gridY, centerZ);
      tileRandoms.push(rng.next());
    }
  }
  
  // Add atmospheric particles floating above grid
  const particleCount = 800;
  for (let i = 0; i < particleCount; i++) {
    tilePositions.push(
      rng.range(-gridWidth / 2, gridWidth / 2),
      rng.range(gridY, gridY + 8),
      rng.range(startZ, startZ - gridDepth)
    );
    tileRandoms.push(rng.next());
  }
  
  console.log('✨ Cyberpunk grid generated:', {
    edges: edgePositions.length / 6, // Each edge is 2 points (6 values)
    tiles: tilePositions.length / 3 - particleCount,
    particles: particleCount
  });
  
  return {
    nearPositions: new Float32Array(edgePositions),
    nearRandoms: new Float32Array(edgeRandoms),
    midPositions: new Float32Array(tilePositions),
    midRandoms: new Float32Array(tileRandoms),
    farPositions: new Float32Array([]),
    farRandoms: new Float32Array([]),
  };
}
