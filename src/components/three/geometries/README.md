# Tree and Facet Geometry System

Complete implementation of the Three.js geometric forest tree generation and facet extraction system.

## Overview

This system generates low-poly geometric trees using stacked cone geometries and extracts individual triangular facets for scatter/reassemble animations.

## File Structure

```
geometries/
├── TreeGeometry.ts      # Low-poly tree generation (trunk + foliage tiers)
├── FacetGeometry.ts     # Individual facet extraction and utilities
└── README.md            # This file
```

## Quick Start

### Generate a Single Tree

```typescript
import { createLowPolyTree } from './geometries/TreeGeometry';
import { BRAND_COLORS } from '../../../utils/three/colors';

const tree = createLowPolyTree({
  segments: 6,          // Low-poly aesthetic (4-8)
  height: 4,            // World units
  foliageTiers: 3,      // Stacked cone layers
  trunkColor: BRAND_COLORS.teal,
  foliageColor: BRAND_COLORS.gold,
  randomness: 0.1       // Slight variation (0-1)
});

// tree.geometry is ready to render
// tree.boundingBox contains dimensions
// tree.parts contains individual trunk/foliage geometries
```

### Extract Facets for Animation

```typescript
import { extractFacets } from './geometries/FacetGeometry';

const facets = extractFacets(tree.geometry, 'tree-1', {
  includeNormals: true,
  includeColors: true,
  calculateCentroids: true
});

// Each facet is an independent mesh
facets.forEach(facet => {
  scene.add(facet.mesh);
});

console.log(`Extracted ${facets.length} facets from tree`);
```

### Generate Complete Forest with Hook

```typescript
import { useForestGeometry } from '../../../hooks/useForestGeometry';

function ForestScene() {
  const { facets, boundingBox, treeCount, facetCount, regenerate, cleanup } = useForestGeometry({
    treeCount: 7,
    segments: 6,
    heightRange: [3, 5],
    foliageTiers: 3,
    depthRange: [-10, -30],
    widthRange: 8
  });

  useEffect(() => {
    // Add facets to scene
    facets.forEach(facet => scene.add(facet.mesh));

    // Cleanup on unmount
    return cleanup;
  }, [facets, cleanup]);

  return (
    <div>
      <p>Trees: {treeCount}, Facets: {facetCount}</p>
      <button onClick={regenerate}>Regenerate Forest</button>
    </div>
  );
}
```

### Responsive Forest (Mobile/Tablet/Desktop)

```typescript
import { useResponsiveForestGeometry } from '../../../hooks/useForestGeometry';

function ResponsiveForest() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const { facets } = useResponsiveForestGeometry(viewport, {
    heightRange: [3, 5],
    foliageTiers: 3
  });

  // Mobile: 3 trees @ 4 segments
  // Tablet: 5 trees @ 6 segments
  // Desktop: 7 trees @ 8 segments
}
```

## Tree Structure

Trees are composed of stacked cone geometries:

```
        /\          <- Foliage Tier 3 (smallest)
       /  \
      /____\

      /    \        <- Foliage Tier 2 (medium)
     /      \
    /________\

    /        \      <- Foliage Tier 1 (largest)
   /          \
  /____________\

      ||            <- Trunk (narrow cone)
      ||
```

### Proportions

- **Trunk**: 30% of total height, narrow radius (8% of height)
- **Foliage**: 70% of total height, divided among tiers
- **Tier radius**: Decreases from base to top (35% → 20% of height)
- **Overlap**: Foliage starts at 70% of trunk height for seamless connection

### Low-Poly Aesthetic

- **Segments**: 4-8 radial segments per cone
  - 4 segments = very angular (square cross-section)
  - 6 segments = hexagonal (good balance)
  - 8 segments = octagonal (smoother but still geometric)
- **Flat shading**: Each triangle face has uniform color (no smooth interpolation)
- **Vertex colors**: Colors assigned per-vertex from trunk/foliage colors

## Facet System

### What is a Facet?

A facet is a single triangular face extracted from the tree geometry. Each facet becomes an independent mesh that can be animated separately.

```typescript
interface Facet {
  id: string;                      // Unique identifier
  treeId: string;                  // Parent tree identifier
  originalPosition: THREE.Vector3; // Original world position
  originalRotation: THREE.Euler;   // Original rotation
  currentPosition: THREE.Vector3;  // Current animated position
  currentRotation: THREE.Euler;    // Current animated rotation
  velocity: THREE.Vector3;         // Physics velocity
  mesh: THREE.Mesh;                // Renderable mesh
  isScattered: boolean;            // Animation state
}
```

### Extraction Process

1. **Read vertices**: Get position/normal/color from BufferGeometry
2. **Group triangles**: Every 3 vertices = 1 triangle
3. **Calculate centroid**: Average of 3 vertex positions
4. **Create local geometry**: Vertices relative to centroid
5. **Create mesh**: Independent mesh at centroid position
6. **Store metadata**: Original position/rotation for reassembly

### Facet Utilities

```typescript
// Reassemble all facets to original positions
reassembleFacets(facets);

// Find facets near a point (for interaction)
const nearbyFacets = getFacetsInRadius(facets, mousePosition, 150);

// Calculate bounding sphere
const boundingSphere = calculateFacetBoundingSphere(facets);

// Cleanup (dispose geometries/materials)
disposeFacets(facets);

// Clone for duplicating trees
const clonedFacets = cloneFacets(facets, 'tree-2');
```

## Performance Considerations

### Tree Generation

- **Complexity**: O(n) where n = number of trees
- **Memory**: ~1-2KB per tree geometry (before facet extraction)
- **Time**: <5ms for 7 trees on modern hardware

### Facet Extraction

- **Complexity**: O(f) where f = number of faces (triangles)
- **Face count**:
  - 6 segments × 3 tiers = ~54 faces per tree
  - 7 trees × 54 faces = ~378 facets total
- **Memory**: ~200 bytes per facet mesh
- **Time**: <10ms for 7 trees (378 facets)

### Optimization Tips

1. **Lower segments on mobile**: 4 segments vs 8 on desktop
2. **Fewer trees on mobile**: 3 trees vs 7 on desktop
3. **Reuse materials**: Share materials across facets (not currently implemented)
4. **Instanced rendering**: Use InstancedMesh for repeated geometry (future enhancement)
5. **Frustum culling**: Let Three.js cull off-screen facets automatically

## Color System

### Brand Colors

```typescript
BRAND_COLORS = {
  teal: '#2AA7A1',     // Trunk highlights
  gold: '#BE8A2F',     // Foliage accents
  navy: '#0B2442',     // Background
  darkNavy: '#1a3a5a'  // Depth gradient
}
```

### Depth-Based Gradients

Trees further away can have darker colors for atmospheric perspective:

```typescript
import { getDepthBasedColor } from '../../../utils/three/colors';

const depthAdjustedColor = getDepthBasedColor(
  BRAND_COLORS.gold,
  treePosition.z,
  -10, // near
  -30  // far
);
```

## Geometry Details

### ConeGeometry Parameters

```typescript
new THREE.ConeGeometry(
  radius,          // Base radius
  height,          // Cone height
  radialSegments,  // Number of sides (4-8 for low-poly)
  heightSegments,  // Vertical divisions (always 1 for flat sides)
  openEnded        // false = capped top/bottom
);
```

### BufferGeometry Attributes

Each geometry has these attributes:

- **position**: Float32Array of x,y,z vertex coordinates
- **normal**: Float32Array of x,y,z normal vectors
- **color**: Float32Array of r,g,b vertex colors (0-1 range)
- **index**: Uint16Array of vertex indices (if indexed geometry)

## Integration with Physics

Once facets are extracted, they can be used with spring physics:

```typescript
import { useSpringPhysics } from '../../../hooks/useSpringPhysics';

const { updatePhysics } = useSpringPhysics({
  stiffness: 0.2,
  damping: 0.8,
  mass: 1.0
});

// In animation loop
function animate() {
  updatePhysics(facets, deltaTime);
  renderer.render(scene, camera);
}
```

## Testing

Each module has comprehensive tests:

```bash
# Run all geometry tests
npm test -- geometries

# Run specific test file
npm test TreeGeometry.test.ts
npm test FacetGeometry.test.ts

# Watch mode during development
npm test -- --watch geometries
```

## Future Enhancements

### Planned Features

1. **Material pooling**: Share materials across facets (reduce memory)
2. **Geometry caching**: Cache tree geometries for reuse
3. **LOD system**: Lower detail for distant trees
4. **Tree variations**: Pine, birch, oak geometries
5. **Instanced rendering**: InstancedMesh for better performance
6. **Procedural textures**: Bark and leaf textures

### Extension Points

```typescript
// Custom tree generator
export function createPineTree(params: TreeParams): TreeGeometryResult {
  // Narrow cone shape, many tiers
}

// Custom facet material
export function createGlowingFacetMaterial(color: string): THREE.Material {
  // Emissive material for night mode
}
```

## Troubleshooting

### Issue: Trees look too smooth (not angular enough)

**Solution**: Reduce `segments` parameter to 4-6

```typescript
createLowPolyTree({ segments: 4, ... }) // Very angular
```

### Issue: Facets render as single color (no vertex colors)

**Solution**: Ensure `vertexColors: true` in material

```typescript
new THREE.MeshLambertMaterial({
  color: 0xffffff,
  vertexColors: true, // Enable vertex colors
  flatShading: true
});
```

### Issue: Facets scattered but never reassemble

**Solution**: Reset `isScattered` flag and copy original positions

```typescript
import { reassembleFacets } from './FacetGeometry';
reassembleFacets(facets); // Resets all facets
```

### Issue: Performance drops with many facets

**Solution**: Reduce tree count or segments

```typescript
// Mobile preset
useForestGeometry(getForestPreset('minimal')); // 3 trees, 4 segments
```

## API Reference

### TreeGeometry.ts

- `createLowPolyTree(params)` - Generate single tree
- `createTreeForest(count, params, range)` - Generate multiple trees
- `validateTreeParams(params)` - Validate parameters
- `mergeTreeParts(parts)` - Merge geometries (internal)
- `mergeBufferGeometries(geometries)` - Merge utility (internal)

### FacetGeometry.ts

- `extractFacets(geometry, treeId, options)` - Extract facets from geometry
- `reassembleFacets(facets)` - Reset facets to original positions
- `getFacetsInRadius(facets, point, radius)` - Proximity query
- `calculateFacetBoundingSphere(facets)` - Bounding volume
- `disposeFacets(facets)` - Cleanup resources
- `cloneFacets(facets, newTreeId)` - Duplicate facets

### useForestGeometry.ts

- `useForestGeometry(config)` - Generate forest with hook
- `useResponsiveForestGeometry(viewport, config)` - Responsive generation
- `getForestPreset(preset)` - Get preset configuration

## Examples in Codebase

See these files for usage examples:

- `/src/components/three/ForestBackground.tsx` - Main component integration
- `/src/hooks/useMouseInteraction.ts` - Facet interaction (to be implemented)
- `/src/hooks/useSpringPhysics.ts` - Facet physics (to be implemented)

## License

Part of Honeyman Enterprises React Application
Brand colors and design system proprietary
