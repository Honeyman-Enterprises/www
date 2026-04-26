/**
 * Procedural Tree and Root Generation
 * L-system-like branching for skeletal tree structures
 * Outputs dense point clouds from spline sampling
 */

/**
 * Seeded pseudo-random number generator (mulberry32)
 * Deterministic for reproducible tree generation
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

/**
 * 3D Vector utility
 */
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function vec3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

function add(a: Vec3, b: Vec3): Vec3 {
  return vec3(a.x + b.x, a.y + b.y, a.z + b.z);
}

function scale(v: Vec3, s: number): Vec3 {
  return vec3(v.x * s, v.y * s, v.z * s);
}

function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (len === 0) return vec3(0, 1, 0);
  return scale(v, 1 / len);
}

function rotateY(v: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return vec3(
    v.x * cos + v.z * sin,
    v.y,
    -v.x * sin + v.z * cos
  );
}

function rotateZ(v: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return vec3(
    v.x * cos - v.y * sin,
    v.x * sin + v.y * cos,
    v.z
  );
}

/**
 * Tree branch representation
 */
interface Branch {
  start: Vec3;
  end: Vec3;
  level: number;
}

/**
 * Catmull-Rom spline interpolation
 * Smooth curves through control points
 */
function catmullRom(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const t2 = t * t;
  const t3 = t2 * t;

  const v0 = scale(add(p2, scale(p0, -1)), 0.5);
  const v1 = add(
    add(scale(p0, -2.5), scale(p1, 2)),
    add(scale(p2, -1.5), scale(p3, 0.5))
  );
  const v2 = add(
    add(scale(p0, 2), scale(p1, -5)),
    add(scale(p2, 4), scale(p3, -1))
  );
  const v3 = add(
    add(scale(p0, -0.5), scale(p1, 1.5)),
    add(scale(p2, -1.5), scale(p3, 0.5))
  );

  return add(
    add(add(scale(v0, t), p1), scale(v1, t2)),
    scale(add(v2, scale(v3, t)), t3 * 0.5)
  );
}

/**
 * Sample a spline densely into discrete points
 */
function sampleSpline(
  points: Vec3[],
  samplesPerSegment: number
): Vec3[] {
  if (points.length < 2) return points;

  const result: Vec3[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    for (let j = 0; j < samplesPerSegment; j++) {
      const t = j / samplesPerSegment;
      result.push(catmullRom(p0, p1, p2, p3, t));
    }
  }

  // Add final point
  result.push(points[points.length - 1]);

  return result;
}

/**
 * Generate L-system-like tree skeleton
 * Recursive branching with angle variation
 */
function generateTreeSkeleton(
  seed: number,
  position: Vec3,
  height: number,
  maxLevel: number
): Branch[] {
  const rng = new SeededRandom(seed);
  const branches: Branch[] = [];

  /**
   * Recursive branch generation
   */
  function growBranch(
    start: Vec3,
    direction: Vec3,
    length: number,
    level: number
  ): void {
    if (level > maxLevel) return;

    // Calculate end position
    const end = add(start, scale(direction, length));
    branches.push({ start, end, level });

    // Branch probability and count decrease with level
    const branchProb = Math.pow(0.85, level);
    if (rng.next() > branchProb) return;

    // Number of child branches (2-4 for lower levels, 1-2 for upper)
    const numBranches = level < 3 ? Math.floor(rng.range(2, 5)) : Math.floor(rng.range(1, 3));

    for (let i = 0; i < numBranches; i++) {
      // Length reduction (70-85% of parent)
      const childLength = length * rng.range(0.7, 0.85);

      // Branching angles
      const angleY = rng.range(-Math.PI / 3, Math.PI / 3); // Horizontal spread
      const angleZ = rng.range(Math.PI / 6, Math.PI / 3); // Upward angle

      // Rotate direction
      let childDir = normalize(direction);
      childDir = rotateY(childDir, angleY);
      childDir = rotateZ(childDir, angleZ);

      // Slight upward bias
      childDir = normalize(add(childDir, vec3(0, 0.3, 0)));

      // Recurse
      growBranch(end, childDir, childLength, level + 1);
    }
  }

  // Start trunk
  const trunkLength = height * 0.3; // Trunk is 30% of total height
  const trunkDir = vec3(0, 1, 0);

  growBranch(position, trunkDir, trunkLength, 0);

  return branches;
}

/**
 * Generate ground roots for a tree
 * Curved polylines arcing outward and downward
 */
function generateRoots(
  seed: number,
  trunkBase: Vec3,
  numRoots: number
): Vec3[][] {
  const rng = new SeededRandom(seed + 1000); // Offset seed for roots
  const roots: Vec3[][] = [];

  for (let i = 0; i < numRoots; i++) {
    const root: Vec3[] = [];

    // Root direction (radial from trunk)
    const angle = (i / numRoots) * Math.PI * 2 + rng.range(-0.3, 0.3);
    const rootDir = vec3(Math.cos(angle), 0, Math.sin(angle));

    // Root length (1.5-3 units)
    const rootLength = rng.range(1.5, 3);

    // Control points for root curve
    const p0 = trunkBase;
    const p1 = add(trunkBase, scale(rootDir, rootLength * 0.3));
    p1.y = -0.05; // Slight downward

    const p2 = add(trunkBase, scale(rootDir, rootLength * 0.7));
    p2.y = -0.1; // More downward

    const p3 = add(trunkBase, scale(rootDir, rootLength));
    p3.y = 0; // Return to ground level

    root.push(p0, p1, p2, p3);
    roots.push(root);
  }

  return roots;
}

/**
 * Tree generation configuration
 */
interface TreeConfig {
  position: Vec3;
  height: number;
  seed: number;
  branchLevels: number;
  samplesPerSegment: number;
  numRoots: number;
}

/**
 * Generate a complete tree with branches and roots
 * Returns dense point cloud
 */
function generateTree(config: TreeConfig): {
  positions: number[];
  randoms: number[];
} {
  const { position, height, seed, branchLevels, samplesPerSegment, numRoots } = config;
  const rng = new SeededRandom(seed);

  const positions: number[] = [];
  const randoms: number[] = [];

  // Generate skeleton
  const branches = generateTreeSkeleton(seed, position, height, branchLevels);

  // Sample branches into points
  for (const branch of branches) {
    const spline = [branch.start, branch.end];
    const points = sampleSpline(spline, samplesPerSegment);

    for (const point of points) {
      positions.push(point.x, point.y, point.z);
      randoms.push(rng.next());
    }
  }

  // Generate and sample roots
  const roots = generateRoots(seed, position, numRoots);
  for (const root of roots) {
    const points = sampleSpline(root, Math.floor(samplesPerSegment * 0.7));

    for (const point of points) {
      positions.push(point.x, point.y, point.z);
      randoms.push(rng.next());
    }
  }

  return { positions, randoms };
}

/**
 * Depth band configuration
 */
interface DepthBand {
  zMin: number;
  zMax: number;
  treeCount: number;
  heightMin: number;
  heightMax: number;
  branchLevels: number;
  samplesPerSegment: number;
  numRoots: number;
}

/**
 * Generate entire forest across depth bands
 */
export function generateForest(): {
  nearPositions: Float32Array;
  nearRandoms: Float32Array;
  midPositions: Float32Array;
  midRandoms: Float32Array;
  farPositions: Float32Array;
  farRandoms: Float32Array;
} {
  const bands: DepthBand[] = [
    {
      zMin: -6,
      zMax: -12,
      treeCount: 6,
      heightMin: 8,
      heightMax: 11,
      branchLevels: 7,
      samplesPerSegment: 12,
      numRoots: 6,
    },
    {
      zMin: -12,
      zMax: -30,
      treeCount: 12,
      heightMin: 6,
      heightMax: 9,
      branchLevels: 6,
      samplesPerSegment: 10,
      numRoots: 5,
    },
    {
      zMin: -30,
      zMax: -60,
      treeCount: 18,
      heightMin: 4,
      heightMax: 7,
      branchLevels: 5,
      samplesPerSegment: 8,
      numRoots: 4,
    },
  ];

  const nearData: { positions: number[]; randoms: number[] } = {
    positions: [],
    randoms: [],
  };
  const midData: { positions: number[]; randoms: number[] } = {
    positions: [],
    randoms: [],
  };
  const farData: { positions: number[]; randoms: number[] } = {
    positions: [],
    randoms: [],
  };

  // Generate trees for each band
  bands.forEach((band, bandIndex) => {
    const targetData = bandIndex === 0 ? nearData : bandIndex === 1 ? midData : farData;

    for (let i = 0; i < band.treeCount; i++) {
      const seed = bandIndex * 1000 + i;
      const rng = new SeededRandom(seed);

      // Random position within band
      const position = vec3(
        rng.range(-8, 8), // X spread
        0, // Ground level
        rng.range(band.zMin, band.zMax) // Z depth
      );

      const height = rng.range(band.heightMin, band.heightMax);

      const treeData = generateTree({
        position,
        height,
        seed,
        branchLevels: band.branchLevels,
        samplesPerSegment: band.samplesPerSegment,
        numRoots: band.numRoots,
      });

      targetData.positions.push(...treeData.positions);
      targetData.randoms.push(...treeData.randoms);
    }
  });

  return {
    nearPositions: new Float32Array(nearData.positions),
    nearRandoms: new Float32Array(nearData.randoms),
    midPositions: new Float32Array(midData.positions),
    midRandoms: new Float32Array(midData.randoms),
    farPositions: new Float32Array(farData.positions),
    farRandoms: new Float32Array(farData.randoms),
  };
}

/**
 * Get point count statistics
 */
export function getForestStats() {
  const forest = generateForest();

  return {
    near: forest.nearPositions.length / 3,
    mid: forest.midPositions.length / 3,
    far: forest.farPositions.length / 3,
    total: (forest.nearPositions.length + forest.midPositions.length + forest.farPositions.length) / 3,
  };
}
