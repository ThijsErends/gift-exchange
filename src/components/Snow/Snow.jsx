import { useMemo } from 'react';
import './Snow.css';

/**
 * Animated snowfall effect component.
 * Generates multiple snowflakes that fall from top to bottom.
 */
export function Snow({ count = 50 }) {
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = Math.random() * 1 + 0.5; // 0.5 to 1.5rem
      const left = Math.random() * 100; // 0 to 100%
      const delay = Math.random() * 10; // 0 to 10s delay
      const duration = Math.random() * 10 + 8; // 8 to 18s
      const opacity = Math.random() * 0.4 + 0.3; // 0.3 to 0.7

      return {
        id: i,
        style: {
          left: `${left}%`,
          fontSize: `${size}rem`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          opacity,
        },
      };
    });
  }, [count]);

  return (
    <div className="snow-container" aria-hidden="true">
      {snowflakes.map((flake) => (
        <span key={flake.id} className="snowflake" style={flake.style}>
          *
        </span>
      ))}
    </div>
  );
}
