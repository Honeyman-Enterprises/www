/**
 * Simple Tree Generator - Creates clear, vertical trees with organized branching
 * Matches the reference image aesthetic: clear trunks, organized branches, ground roots
 */

class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

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

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function vec3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

/**
 * Create a simple tree with clear vertical trunk and organized branches
 */
function createSimpleTree(
  basePosition: Vec3,
  height: number,
  rng: SeededRandom
): { positions: number[]; randoms: number[] } {
  const positions: number[] = [];
  const randoms: number[] = [];

  const pointsPerUnit = 40; // Very dense point sampling

  // Helper to add a cylindrical segment with outline edges
  const addCylindricalSegment = (start: Vec3, end: Vec3, startRadius: number, endRadius: number) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dz = end.z - start.z;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const numSegments = Math.max(4, Math.floor(length * pointsPerUnit));

    // Create direction vector
    const dirX = dx / length;
    const dirY = dy / length;
    const dirZ = dz / length;

    // Create perpendicular vectors for cylinder cross-section
    let perpX = 1, perpY = 0, perpZ = 0;
    if (Math.abs(dirY) < 0.99) {
      perpX = 0;
      perpY = 1;
      perpZ = 0;
    }

    // Cross product to get perpendicular vector
    const crossX = perpY * dirZ - perpZ * dirY;
    const crossY = perpZ * dirX - perpX * dirZ;
    const crossZ = perpX * dirY - perpY * dirX;
    const crossLen = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);
    const perp1X = crossX / crossLen;
    const perp1Y = crossY / crossLen;
    const perp1Z = crossZ / crossLen;

    // Second perpendicular (cross product of direction and first perp)
    const perp2X = dirY * perp1Z - dirZ * perp1Y;
    const perp2Y = dirZ * perp1X - dirX * perp1Z;
    const perp2Z = dirX * perp1Y - dirY * perp1X;

    // Draw 6 outline edges around the cylinder
    const numOutlines = 6;
    for (let outline = 0; outline < numOutlines; outline++) {
      const angle = (outline / numOutlines) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        const radius = startRadius * (1 - t) + endRadius * t;

        const centerX = start.x + dx * t;
        const centerY = start.y + dy * t;
        const centerZ = start.z + dz * t;

        const offsetX = (perp1X * cosA + perp2X * sinA) * radius;
        const offsetY = (perp1Y * cosA + perp2Y * sinA) * radius;
        const offsetZ = (perp1Z * cosA + perp2Z * sinA) * radius;

        positions.push(
          centerX + offsetX,
          centerY + offsetY,
          centerZ + offsetZ
        );
        randoms.push(rng.next());
      }
    }

    // Add center line for extra density
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;
      positions.push(
        start.x + dx * t,
        start.y + dy * t,
        start.z + dz * t
      );
      randoms.push(rng.next());
    }
  };

  // 1. Create vertical trunk with cylindrical volume
  const trunkRadius = height * 0.08; // Trunk thickness proportional to height
  const trunkTop = vec3(basePosition.x, basePosition.y + height, basePosition.z);
  addCylindricalSegment(basePosition, trunkTop, trunkRadius, trunkRadius * 0.6);

  // 2. Create ground roots (4-6 roots spreading horizontally)
  const numRoots = Math.floor(rng.range(4, 7));
  for (let i = 0; i < numRoots; i++) {
    const angle = (i / numRoots) * Math.PI * 2;
    const rootLength = rng.range(height * 0.3, height * 0.5);
    const rootEnd = vec3(
      basePosition.x + Math.cos(angle) * rootLength,
      basePosition.y - rng.range(0.3, 0.6), // Slightly below ground
      basePosition.z + Math.sin(angle) * rootLength
    );
    const rootRadius = trunkRadius * 0.5;
    addCylindricalSegment(basePosition, rootEnd, rootRadius, rootRadius * 0.3);
  }

  // 3. Create branches at regular intervals up the trunk
  const numBranchLevels = Math.floor(rng.range(4, 7));
  for (let level = 1; level <= numBranchLevels; level++) {
    const heightRatio = level / (numBranchLevels + 1);
    const branchStart = vec3(
      basePosition.x,
      basePosition.y + height * heightRatio,
      basePosition.z
    );

    // 2-4 branches per level, arranged in a whorl
    const numBranches = Math.floor(rng.range(2, 5));
    const angleOffset = rng.range(0, Math.PI * 2);

    for (let b = 0; b < numBranches; b++) {
      const angle = angleOffset + (b / numBranches) * Math.PI * 2;
      const branchLength = height * rng.range(0.2, 0.4) * (1.0 - heightRatio * 0.5);

      // Primary branch with tapering radius
      const upwardAngle = rng.range(0.3, 0.6); // Angle upward
      const branchEnd = vec3(
        branchStart.x + Math.cos(angle) * branchLength,
        branchStart.y + branchLength * upwardAngle,
        branchStart.z + Math.sin(angle) * branchLength
      );
      const branchStartRadius = trunkRadius * 0.3 * (1.0 - heightRatio * 0.5);
      const branchEndRadius = branchStartRadius * 0.2;
      addCylindricalSegment(branchStart, branchEnd, branchStartRadius, branchEndRadius);

      // Secondary branches (smaller subdivisions)
      if (branchLength > 1.0) {
        const numSecondary = Math.floor(rng.range(1, 3));
        for (let s = 0; s < numSecondary; s++) {
          const secondaryStart = vec3(
            branchStart.x + (branchEnd.x - branchStart.x) * rng.range(0.4, 0.8),
            branchStart.y + (branchEnd.y - branchStart.y) * rng.range(0.4, 0.8),
            branchStart.z + (branchEnd.z - branchStart.z) * rng.range(0.4, 0.8)
          );

          const subAngle = angle + rng.range(-Math.PI / 3, Math.PI / 3);
          const subLength = branchLength * rng.range(0.3, 0.5);
          const secondaryEnd = vec3(
            secondaryStart.x + Math.cos(subAngle) * subLength,
            secondaryStart.y + subLength * rng.range(0.2, 0.5),
            secondaryStart.z + Math.sin(subAngle) * subLength
          );
          const subStartRadius = branchEndRadius * 0.6;
          const subEndRadius = subStartRadius * 0.2;
          addCylindricalSegment(secondaryStart, secondaryEnd, subStartRadius, subEndRadius);
        }
      }
    }
  }

  return { positions, randoms };
}

/**
 * Generate a forest of simple trees across depth bands
 */
export function generateSimpleForest(): {
  nearPositions: Float32Array;
  nearRandoms: Float32Array;
  midPositions: Float32Array;
  midRandoms: Float32Array;
  farPositions: Float32Array;
  farRandoms: Float32Array;
} {
  const nearData: number[] = [];
  const nearRandomData: number[] = [];
  const midData: number[] = [];
  const midRandomData: number[] = [];
  const farData: number[] = [];
  const farRandomData: number[] = [];

  // Near layer: 6 trees (z: -6 to -12)
  const nearRng = new SeededRandom(12345);
  for (let i = 0; i < 6; i++) {
    const x = nearRng.range(-4, 4);
    const z = nearRng.range(-6, -12);
    const height = nearRng.range(8, 11);
    const tree = createSimpleTree(vec3(x, 0, z), height, nearRng);
    nearData.push(...tree.positions);
    nearRandomData.push(...tree.randoms);
  }

  // Mid layer: 12 trees (z: -12 to -30)
  const midRng = new SeededRandom(54321);
  for (let i = 0; i < 12; i++) {
    const x = midRng.range(-6, 6);
    const z = midRng.range(-12, -30);
    const height = midRng.range(6, 9);
    const tree = createSimpleTree(vec3(x, 0, z), height, midRng);
    midData.push(...tree.positions);
    midRandomData.push(...tree.randoms);
  }

  // Far layer: 18 trees (z: -30 to -60)
  const farRng = new SeededRandom(99999);
  for (let i = 0; i < 18; i++) {
    const x = farRng.range(-8, 8);
    const z = farRng.range(-30, -60);
    const height = farRng.range(4, 7);
    const tree = createSimpleTree(vec3(x, 0, z), height, farRng);
    farData.push(...tree.positions);
    farRandomData.push(...tree.randoms);
  }

  console.log('🌲 Simple forest generated:', {
    near: nearData.length / 3,
    mid: midData.length / 3,
    far: farData.length / 3,
    total: (nearData.length + midData.length + farData.length) / 3,
  });

  return {
    nearPositions: new Float32Array(nearData),
    nearRandoms: new Float32Array(nearRandomData),
    midPositions: new Float32Array(midData),
    midRandoms: new Float32Array(midRandomData),
    farPositions: new Float32Array(farData),
    farRandoms: new Float32Array(farRandomData),
  };
}
