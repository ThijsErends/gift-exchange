import { useState, useEffect, useRef, useCallback } from 'react';
import './SlotMachine.css';

/**
 * Slot machine style name picker animation.
 * Names scroll vertically and slow down to reveal the selected name.
 */
export function SlotMachine({
  names,
  isSpinning,
  targetName,
  onSpinComplete,
  showResult,
}) {
  const [displayNames, setDisplayNames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle, fast, slowing, stopped
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  // Build a shuffled list of names for the animation
  const buildDisplayList = useCallback(() => {
    if (!names.length || !targetName) return [];

    // Create multiple copies for scrolling effect
    const copies = [];
    const totalSlots = 40; // Enough for a good spinning effect

    for (let i = 0; i < totalSlots; i++) {
      copies.push(names[i % names.length]);
    }

    // Shuffle the copies
    for (let i = copies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copies[i], copies[j]] = [copies[j], copies[i]];
    }

    // Ensure target name is at position that will be visible at end
    const targetIndex = totalSlots - 2; // Second to last position
    copies[targetIndex] = targetName;

    return copies;
  }, [names, targetName]);

  // Start spinning animation
  useEffect(() => {
    if (isSpinning && targetName) {
      const list = buildDisplayList();
      setDisplayNames(list);
      setCurrentIndex(0);
      setPhase('fast');
      startTimeRef.current = performance.now();
    }
  }, [isSpinning, targetName, buildDisplayList]);

  // Animation loop
  useEffect(() => {
    if (phase === 'idle' || phase === 'stopped') return;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      // Total animation duration: 3 seconds
      const totalDuration = 3000;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Easing function for deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      // Calculate current index based on progress
      const maxIndex = displayNames.length - 3; // Stop at target position
      const newIndex = Math.floor(eased * maxIndex);

      setCurrentIndex(newIndex);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('stopped');
        // Small delay before calling completion
        setTimeout(() => {
          onSpinComplete?.();
        }, 300);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, displayNames.length, onSpinComplete]);

  // Reset to idle only when showResult becomes false
  useEffect(() => {
    if (!showResult && !isSpinning && phase !== 'idle') {
      setPhase('idle');
    }
  }, [showResult, isSpinning, phase]);

  // Get visible names (show 3 at a time)
  const visibleNames = displayNames.slice(currentIndex, currentIndex + 3);

  // Show the result with the selected name prominently displayed
  if (showResult && targetName && phase === 'stopped') {
    return (
      <div className="slot-machine" ref={containerRef}>
        <div className="slot-window slot-window-result">
          <div className="slot-result">
            <div className="slot-result-name">{targetName}</div>
          </div>
          <div className="slot-highlight" />
        </div>
      </div>
    );
  }

  // If not spinning and no result to show, show placeholder
  if (!isSpinning && phase === 'idle') {
    return (
      <div className="slot-machine">
        <div className="slot-window">
          <div className="slot-placeholder">?</div>
        </div>
      </div>
    );
  }

  return (
    <div className="slot-machine" ref={containerRef}>
      <div className="slot-window">
        <div className="slot-track">
          {visibleNames.map((name, i) => (
            <div
              key={`${currentIndex}-${i}`}
              className={`slot-item ${i === 1 ? 'slot-item-center' : ''}`}
            >
              {name}
            </div>
          ))}
        </div>
        <div className="slot-highlight" />
      </div>
    </div>
  );
}
