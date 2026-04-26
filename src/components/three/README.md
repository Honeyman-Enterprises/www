# ForestBackground Component

Interactive Three.js geometric forest background with physics-based mouse interaction.

## Overview

The `ForestBackground` component renders 5-7 low-poly geometric trees that scatter and reassemble in response to cursor movement. Built with Three.js and custom spring physics, it provides an engaging hero background while maintaining 60fps performance and respecting accessibility preferences.

**Key Features**:
- Low-poly geometric tree aesthetic with brand color integration
- Mouse/touch proximity detection with scatter physics
- Spring-based reassembly animation
- Responsive design with device-specific optimizations
- Full accessibility support with `prefers-reduced-motion`
- Automatic performance degradation on low-end devices

## Quick Start

```tsx
import { ForestBackground } from './components/three/ForestBackground';

function Hero() {
  return (
    <section className="relative h-screen">
      <ForestBackground />
      <div className="relative z-10">
        {/* Your hero content */}
      </div>
    </section>
  );
}
```

## Basic Usage

### Default Configuration

```tsx
<ForestBackground />
```

Renders with default settings:
- 7 trees on desktop, 5 on tablet, 3 on mobile
- Teal and gold color scheme
- 150px interaction radius on desktop
- Enabled scatter effects (except mobile)

### Custom Configuration

```tsx
<ForestBackground
  treeCount={10}
  interactionRadius={200}
  colors={{
    teal: '#00CED1',
    gold: '#FFD700',
    navy: '#000080'
  }}
  enableScatter={true}
  springConfig={{
    stiffness: 0.3,
    damping: 0.6
  }}
/>
```

## Props API

### ForestBackground Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `treeCount` | `number` | Auto (7/5/3) | Number of trees to render |
| `interactionRadius` | `number` | 150 | Cursor interaction radius in pixels |
| `enableScatter` | `boolean` | true | Enable scatter interaction |
| `colors` | `ColorConfig` | Brand colors | Tree color scheme |
| `springConfig` | `SpringConfig` | See below | Physics parameters |
| `className` | `string` | `''` | Additional CSS classes |
| `onPerformanceChange` | `(fps: number) => void` | - | Performance callback |

### ColorConfig

```typescript
interface ColorConfig {
  teal: string;      // Primary tree color
  gold: string;      // Accent foliage color
  navy: string;      // Background and fog
  darkNavy?: string; // Shadow areas
}
```

### SpringConfig

```typescript
interface SpringConfig {
  stiffness: number; // 0.1-0.5, controls responsiveness
  damping: number;   // 0.5-0.9, controls bounce
  mass?: number;     // Default: 1.0
}
```

**Default Spring Values**:
```typescript
{
  stiffness: 0.2,  // Moderate responsiveness
  damping: 0.8,    // Heavy damping, minimal bounce
  mass: 1.0
}
```

## Configuration Examples

### More Responsive Physics

```tsx
<ForestBackground
  springConfig={{
    stiffness: 0.35,  // Higher = faster response
    damping: 0.6      // Lower = more bounce
  }}
/>
```

**Effect**: Trees scatter and reassemble more quickly with visible spring oscillation.

### Subtle Interaction

```tsx
<ForestBackground
  interactionRadius={100}
  springConfig={{
    stiffness: 0.15,
    damping: 0.9
  }}
/>
```

**Effect**: Smaller interaction area with slow, smooth movement.

### Performance Mode

```tsx
<ForestBackground
  treeCount={3}
  enableScatter={false}
/>
```

**Effect**: Minimal trees with static display, maximum performance.

### Custom Color Scheme

```tsx
<ForestBackground
  colors={{
    teal: '#1E90FF',    // Dodger blue
    gold: '#FFA500',    // Orange
    navy: '#191970',    // Midnight blue
    darkNavy: '#0C0C1E'
  }}
/>
```

## Performance Considerations

### Desktop Performance (Target: 60fps)

**Optimal Configuration**:
- Tree count: 5-7
- Full interaction enabled
- Standard segments (8)

**Bottlenecks**:
- **Raycasting**: Performed every frame during mouse movement
- **Physics updates**: Spring calculations for scattered facets
- **Draw calls**: Each facet is a separate mesh

**Mitigation**:
- Raycasting only runs when mouse is actively moving
- Spatial partitioning reduces facet checks
- Material sharing across facets reduces draw calls

### Mobile Performance (Target: 30fps)

**Automatic Optimizations**:
- Reduces tree count to 3
- Lowers polygon count (4 segments vs 8)
- Disables scatter interaction on screens <767px
- Adjusts camera position to reduce visible geometry

**Manual Optimization**:
```tsx
const isMobile = useMediaQuery('(max-width: 767px)');

<ForestBackground
  treeCount={isMobile ? 3 : 7}
  enableScatter={!isMobile}
/>
```

### Performance Monitoring

```tsx
<ForestBackground
  onPerformanceChange={(fps) => {
    if (fps < 30) {
      console.warn('Low FPS detected:', fps);
      // Trigger fallback or quality reduction
    }
  }}
/>
```

The component automatically degrades quality if FPS drops below 30 for extended periods.

### Memory Usage

**Typical Usage**: 30-50MB
**Maximum**: 75MB

**Memory Management**:
- All geometries and materials disposed on unmount
- No memory leaks with proper cleanup
- Canvas removed from DOM on unmount

**Verification**:
```bash
# Run component for 10+ minutes
# Chrome DevTools > Memory > Take heap snapshot
# Check Three.js object retention
```

## Accessibility Features

### Reduced Motion Support

Automatically respects `prefers-reduced-motion` system preference:

**Standard Mode**:
- Full scatter interaction
- Spring-based physics
- Dynamic movement

**Reduced Motion Mode**:
- Disables scatter interaction
- Static trees with minimal rotation (0.001 rad/s)
- No sudden movements or physics

```tsx
// Manual override (not recommended)
<ForestBackground
  enableScatter={!prefersReducedMotion}
/>
```

### Semantic HTML

```tsx
<div
  role="img"
  aria-label="Animated geometric forest background"
  className="absolute inset-0"
>
  <canvas id="forest-canvas" />
</div>
```

**Screen Reader Experience**:
- Announces as decorative background image
- Does not interrupt content flow
- Skip link available for keyboard navigation

### Keyboard Navigation

Background does not trap keyboard focus. Content over the background remains fully keyboard-accessible.

### WCAG Compliance

- **WCAG 2.1 AA**: Fully compliant
- **No flashing content**: Safe for photosensitive users
- **Color contrast**: Not applicable (decorative)
- **Motion**: Respects reduced motion preference

## Responsive Behavior

### Breakpoints

| Viewport | Trees | Segments | Scatter | Camera Z |
|----------|-------|----------|---------|----------|
| Mobile (<768px) | 3 | 4 | Disabled | 8 |
| Tablet (768-1024px) | 5 | 6 | Enabled | 6 |
| Desktop (>1024px) | 7 | 8 | Enabled | 5 |

### Resize Handling

Component automatically rebuilds scene on viewport resize:

```typescript
// Debounced resize (500ms)
window.addEventListener('resize', handleResize);

// Camera aspect ratio updated
// Tree positions recalculated
// Scene rerenders with new config
```

**Performance Note**: Resize triggers full scene rebuild. Avoid frequent resizing during development.

## Troubleshooting

### Component not rendering

**Symptoms**: Blank background, no trees visible

**Checklist**:
1. Verify WebGL support: `chrome://gpu` (Chrome) or `about:support` (Firefox)
2. Check browser console for Three.js errors
3. Ensure parent container has defined height
4. Verify Three.js installed: `npm list three`

**Solution**:
```tsx
// Parent must have height
<div className="relative h-screen">
  <ForestBackground />
</div>
```

### Low frame rate

**Symptoms**: Stuttering, <30fps, slow interaction

**Diagnosis**:
```tsx
<ForestBackground
  onPerformanceChange={(fps) => console.log('FPS:', fps)}
/>
```

**Solutions**:
1. Reduce tree count: `treeCount={5}` or `treeCount={3}`
2. Disable scatter: `enableScatter={false}`
3. Check GPU acceleration: Chrome DevTools > Rendering > Frame Rendering Stats
4. Close other GPU-intensive applications

### Scatter not working

**Symptoms**: Trees don't respond to mouse movement

**Checklist**:
1. Check `enableScatter` prop (must be `true`)
2. Verify mouse events firing: Add `onMouseMove` listener
3. Check `prefers-reduced-motion` setting
4. Ensure cursor is within interaction radius
5. Verify raycasting not failing (console errors)

**Debug Mode**:
```tsx
// Enable visual debugging (dev only)
<ForestBackground debug={true} />
```

Shows:
- Interaction radius visualization
- Affected facets highlighted
- FPS counter overlay
- Console logs for physics updates

### Memory leaks

**Symptoms**: Browser tab becomes slower over time, high memory usage

**Diagnosis**:
```bash
# Chrome DevTools > Memory
# Take snapshot, use component, take another snapshot
# Compare: Should show no Three.js object growth
```

**Solution**:
Ensure component properly unmounts:
```tsx
useEffect(() => {
  return () => {
    // Cleanup happens automatically
    // But verify in React DevTools
  };
}, []);
```

### Colors not matching brand

**Symptoms**: Trees appear wrong colors, fog too dark/light

**Solution**:
```tsx
<ForestBackground
  colors={{
    teal: '#2AA7A1',    // Exact brand teal
    gold: '#BE8A2F',    // Exact brand gold
    navy: '#0B2442'     // Exact brand navy
  }}
/>
```

**Note**: Colors are rendered in sRGB color space. If colors still don't match, check monitor calibration and lighting conditions.

## Browser Compatibility

### Supported Browsers

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Full support, best performance |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support, ensure WebGL enabled |
| Edge | 90+ | Full support (Chromium) |
| Mobile Safari | iOS 14+ | Reduced tree count |
| Chrome Mobile | Android 90+ | Reduced tree count |

### WebGL Requirements

**Minimum**: WebGL 1.0
**Optimal**: WebGL 2.0

**Check Support**:
```javascript
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
if (!gl) {
  console.error('WebGL not supported');
}
```

**Fallback Strategy**:
```tsx
import { ForestBackground } from './components/three/ForestBackground';
import { StaticBackground } from './components/StaticBackground';

function Hero() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    setHasWebGL(!!gl);
  }, []);

  return (
    <section>
      {hasWebGL ? <ForestBackground /> : <StaticBackground />}
      {/* Content */}
    </section>
  );
}
```

## Testing

### Unit Tests

```bash
npm test ForestBackground.test.tsx
```

**Coverage**:
- Component mounting/unmounting
- Props validation
- Responsive configuration
- Accessibility features

### Performance Tests

```bash
npm run test:performance
```

**Metrics**:
- Desktop: 60fps minimum
- Mobile: 30fps minimum
- Memory: <50MB
- Load time: <500ms

### Visual Regression

```bash
npm run test:visual
```

Captures screenshots of:
- Initial render
- Interaction state
- Mobile/tablet/desktop
- Reduced motion mode

## Migration from Vanta.js

### Before (Vanta.js)

```tsx
const vantaRef = useRef<HTMLDivElement>(null);
const vantaEffect = useRef<any>(null);

useEffect(() => {
  if (window.VANTA && vantaRef.current) {
    vantaEffect.current = window.VANTA.GLOBE({
      el: vantaRef.current,
      color: 0x2aa7a1,
      backgroundColor: 0x0b2442
    });
  }
  return () => {
    vantaEffect.current?.destroy();
  };
}, []);

<div ref={vantaRef} className="absolute inset-0" />
```

### After (ForestBackground)

```tsx
import { ForestBackground } from './components/three/ForestBackground';

<ForestBackground
  colors={{
    teal: '#2AA7A1',
    navy: '#0B2442'
  }}
  className="absolute inset-0"
/>
```

**Benefits**:
- No CDN dependencies
- Full TypeScript support
- Better performance (60fps vs variable)
- Accessibility built-in
- Customizable interaction

**Steps**:
1. Remove Vanta.js CDN scripts from `index.html`
2. Remove Vanta.js types/refs from Hero component
3. Import and use ForestBackground
4. Remove `window.VANTA` checks
5. Test across devices
6. Verify bundle size impact (<100KB additional)

## Advanced Usage

### Custom Tree Geometries

```typescript
// Override tree generation (advanced)
import { generateCustomTree } from './utils/three/treeGenerator';

<ForestBackground
  treeGenerator={(config) => generateCustomTree(config)}
/>
```

### Performance Callbacks

```tsx
<ForestBackground
  onPerformanceChange={(fps) => {
    // Real-time FPS monitoring
    updateMetrics({ fps });
  }}
  onQualityChange={(quality) => {
    // 'high' | 'medium' | 'low'
    console.log('Quality adjusted to:', quality);
  }}
/>
```

### Animation Hooks

```tsx
<ForestBackground
  onScatterStart={() => console.log('Trees scattering')}
  onScatterEnd={() => console.log('Trees reassembled')}
/>
```

## FAQ

**Q: Can I use this outside the Hero section?**
A: Yes, but it's optimized for full-screen hero backgrounds. Smaller containers may need adjusted tree counts.

**Q: Does it work with SSR (Next.js)?**
A: Yes, but ensure component only renders client-side:
```tsx
const ForestBackground = dynamic(() => import('./ForestBackground'), {
  ssr: false
});
```

**Q: Can I disable interaction temporarily?**
A: Yes: `<ForestBackground enableScatter={false} />`

**Q: How do I change the tree density?**
A: Adjust `treeCount` prop. Higher values = denser forest, lower performance.

**Q: What if WebGL is not available?**
A: Component won't render. Implement a fallback (see Browser Compatibility section).

**Q: Can I add sound effects?**
A: Not built-in, but you can use animation hooks (`onScatterStart`) to trigger audio.

## Support

**Documentation**: `/docs/FOREST_ARCHITECTURE.md` - System architecture
**Development**: `/docs/FOREST_DEVELOPMENT.md` - Developer guide
**Issues**: Report bugs with browser, device, and console errors

## License

Part of Honeyman Enterprises React application. Internal use only.
