// Fragment shader for wireframe-dot forest
// Renders soft circular points with additive blending

uniform vec3 uColor;
varying float vAlpha;

void main() {
  // Distance from center of point sprite
  vec2 centerOffset = gl_PointCoord - vec2(0.5);
  float distance = length(centerOffset);

  // Soft circular falloff
  float alpha = vAlpha * smoothstep(0.6, 0.0, distance);

  // Discard fully transparent fragments for performance
  if (alpha < 0.01) discard;

  // Pure white with alpha for additive glow
  gl_FragColor = vec4(uColor, alpha);
}
