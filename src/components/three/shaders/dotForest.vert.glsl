// Vertex shader for wireframe-dot forest
// Implements curl-noise based fluid motion with local mouse disruption

// Attributes per point
attribute vec3 basePosition;  // Original position in world space
attribute float rand;          // Random value [0,1] for per-point variation

// Uniforms - Time and sizing
uniform float uTime;
uniform float uBaseSizePx;
uniform float uDevicePixelRatio;

// Uniforms - Noise motion
uniform float uNoiseAmp;        // Displacement amplitude (0.008-0.012)
uniform float uNoiseFreq;       // Noise frequency (0.75)
uniform float uCurlStrength;    // Curl multiplier (1.0)

// Uniforms - Depth fade
uniform float uDepthFadeStart;  // Start fade distance (-10)
uniform float uDepthFadeEnd;    // End fade distance (-60)

// Uniforms - Mouse disruption
uniform vec3 uDisruptCenter;    // World space disruption center
uniform float uDisruptRadius;   // Disruption radius (1.25)
uniform float uDisruptStrength; // Disruption force multiplier (1.0)
uniform float uDisruptDecay;    // Decay time constant (1.2 seconds)
uniform float uDisruptStartTime; // Time when disruption started

// Varying to fragment shader
varying float vAlpha;

// Simplex noise 3D - GPU-optimized implementation
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Curl noise - creates divergence-free vector field
vec3 curlNoise(vec3 p) {
  float e = 0.1;

  float n1 = snoise(p + vec3(0.0, e, 0.0));
  float n2 = snoise(p - vec3(0.0, e, 0.0));
  float n3 = snoise(p + vec3(0.0, 0.0, e));
  float n4 = snoise(p - vec3(0.0, 0.0, e));
  float n5 = snoise(p + vec3(e, 0.0, 0.0));
  float n6 = snoise(p - vec3(e, 0.0, 0.0));

  float x = (n1 - n2) - (n3 - n4);
  float y = (n3 - n4) - (n5 - n6);
  float z = (n5 - n6) - (n1 - n2);

  return normalize(vec3(x, y, z)) * uCurlStrength;
}

void main() {
  // Compute curl-noise based motion field
  vec3 noisePos = basePosition * uNoiseFreq + vec3(0.0, uTime * 0.09, 0.0);
  vec3 curlVector = curlNoise(noisePos);

  // Base displacement with per-point variation
  float variation = mix(0.85, 1.15, rand);
  vec3 baseDisplacement = curlVector * uNoiseAmp * variation;

  // Mouse disruption effect
  vec3 totalDisplacement = baseDisplacement;

  float distToDisrupt = distance(basePosition, uDisruptCenter);
  if (distToDisrupt < uDisruptRadius) {
    // Time since disruption started
    float timeSinceDisrupt = max(0.0, uTime - uDisruptStartTime);

    // Exponential decay envelope
    float envelope = exp(-timeSinceDisrupt / uDisruptDecay);

    // Swirl direction (tangential to radial)
    vec3 radial = normalize(basePosition - uDisruptCenter);
    vec3 tangent = normalize(cross(curlVector, vec3(0.0, 1.0, 0.0)));

    // Smooth falloff with distance
    float distanceFactor = smoothstep(uDisruptRadius, 0.0, distToDisrupt);

    // Disruption impulse: outward + swirl + noise
    vec3 disruptImpulse = (radial * 0.6 + tangent * 0.4) * distanceFactor * envelope;

    // Add to total displacement
    totalDisplacement += disruptImpulse * (uDisruptStrength * 0.02);
  }

  // Apply displacement
  vec3 finalPosition = basePosition + totalDisplacement;

  // Depth-based fade (fog-like)
  float depthFade = smoothstep(uDepthFadeEnd, uDepthFadeStart, finalPosition.z);
  vAlpha = depthFade;

  // Point size with DPR and depth scaling
  float sizeFactor = mix(1.0, 0.9, rand);
  float pointSize = uBaseSizePx * uDevicePixelRatio * sizeFactor;
  gl_PointSize = clamp(pointSize, 0.8 * uDevicePixelRatio, 2.2 * uDevicePixelRatio);

  // Final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
}
