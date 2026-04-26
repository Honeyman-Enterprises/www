/**
 * ForestBackground Component
 * Vanta.js NET effect with connected nodes and animated lines
 */

import { useRef, useEffect } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

interface ForestBackgroundProps {
  className?: string;
  onLoad?: () => void;
}

/**
 * ForestBackground Component
 * Renders Vanta NET effect
 */
export function ForestBackground({
  className = '',
  onLoad,
}: ForestBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Vanta NET effect
    // RGB(189, 138, 47) = 0xBD8A2F in hex
    vantaRef.current = NET({
      el: containerRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xbd8a2f, // Gold color: rgb(189, 138, 47)
      backgroundColor: 0x0b2442, // Navy background
      points: 10.00,
      maxDistance: 25.00,
      spacing: 18.00,
      opacity: 0.05, // 5% opacity for lines
    });

    // Call onLoad callback
    if (onLoad) {
      onLoad();
      console.log('✅ Vanta NET loaded');
    }

    // Cleanup
    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
      }
    };
  }, [onLoad]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 ${className}`}
      role="img"
      aria-label="Animated network background"
      style={{
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    />
  );
}

export default ForestBackground;
