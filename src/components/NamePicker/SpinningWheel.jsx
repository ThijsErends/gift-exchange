import { useState, useEffect, useRef } from 'react';
import './SpinningWheel.css';

/**
 * Spinning wheel style name picker animation.
 * A circular wheel with names that spins and lands on the selected name.
 */
export function SpinningWheel({ names, isSpinning, targetName, onSpinComplete }) {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const wheelRef = useRef(null);

  // Calculate segment angle based on number of names
  const segmentAngle = 360 / names.length;

  // Calculate the rotation needed to land on target
  useEffect(() => {
    if (isSpinning && targetName && !isAnimating) {
      const targetIndex = names.indexOf(targetName);
      if (targetIndex === -1) return;

      setIsAnimating(true);

      // Calculate final rotation:
      // - Add multiple full rotations for effect (5-8 rotations)
      // - Land so the target is at the top (pointer position)
      const fullRotations = 5 + Math.random() * 3; // 5-8 rotations
      const targetRotation = targetIndex * segmentAngle;

      // We want the segment to be at top (0 degrees from pointer)
      // The wheel rotates clockwise, so we subtract the target position
      // and add a half segment offset to center it
      const finalRotation =
        fullRotations * 360 + (360 - targetRotation - segmentAngle / 2);

      setRotation((prev) => prev + finalRotation);

      // Call completion after animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onSpinComplete?.();
      }, 4000); // Match CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [isSpinning, targetName, names, segmentAngle, isAnimating, onSpinComplete]);

  // Generate colors for segments
  const getSegmentColor = (index) => {
    const colors = [
      'var(--color-primary)',
      'var(--color-secondary)',
      'var(--color-accent)',
      'var(--color-primary-light)',
      'var(--color-secondary-light)',
    ];
    return colors[index % colors.length];
  };

  // If no names, show placeholder
  if (!names.length) {
    return (
      <div className="spinning-wheel">
        <div className="wheel-placeholder">?</div>
      </div>
    );
  }

  return (
    <div className="spinning-wheel">
      <div className="wheel-container">
        {/* Pointer arrow */}
        <div className="wheel-pointer">
          <svg viewBox="0 0 40 50" className="pointer-svg">
            <polygon points="20,50 0,0 40,0" fill="var(--color-error)" />
          </svg>
        </div>

        {/* The wheel */}
        <svg
          ref={wheelRef}
          className={`wheel-svg ${isAnimating ? 'wheel-spinning' : ''}`}
          viewBox="-150 -150 300 300"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Segments */}
          {names.map((name, index) => {
            const startAngle = index * segmentAngle - 90; // -90 to start from top
            const endAngle = startAngle + segmentAngle;

            // Convert to radians
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            // Calculate arc points
            const radius = 140;
            const x1 = Math.cos(startRad) * radius;
            const y1 = Math.sin(startRad) * radius;
            const x2 = Math.cos(endRad) * radius;
            const y2 = Math.sin(endRad) * radius;

            // Large arc flag (0 for segments <= 180 degrees)
            const largeArc = segmentAngle > 180 ? 1 : 0;

            // Path for segment
            const path = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            // Text position (middle of segment)
            const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
            const textRadius = radius * 0.65;
            const textX = Math.cos(midAngle) * textRadius;
            const textY = Math.sin(midAngle) * textRadius;
            const textRotation = (startAngle + endAngle) / 2 + 90;

            return (
              <g key={name}>
                <path
                  d={path}
                  fill={getSegmentColor(index)}
                  stroke="var(--color-bg-primary)"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="wheel-text"
                >
                  {name.length > 8 ? name.slice(0, 7) + '...' : name}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle
            cx="0"
            cy="0"
            r="25"
            fill="var(--color-bg-primary)"
            stroke="var(--color-border)"
            strokeWidth="3"
          />
          <circle cx="0" cy="0" r="8" fill="var(--color-primary)" />
        </svg>
      </div>
    </div>
  );
}
