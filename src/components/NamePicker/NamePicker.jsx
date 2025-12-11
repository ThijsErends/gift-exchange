import { useState, useEffect, useCallback } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useNamePicker } from '../../hooks/useNamePicker';
import { useAudio } from '../../hooks/useAudio';
import { Timer } from './Timer';
import { TimesUpModal } from './TimesUpModal';
import { RulesPanel } from '../RulesPanel/RulesPanel';
import './NamePicker.css';

// Audio file path - place your countdown music at this location
const COUNTDOWN_MUSIC_PATH = '/countdown-music.mp3';

/**
 * Game phases:
 * - idle: Waiting for user to click pick button
 * - spinning: Animation is playing
 * - revealed: Name has been revealed, waiting before timer
 * - waiting: 5 second countdown before main timer
 * - countdown: 15 second main timer with music
 * - modal: Showing "times up" modal
 */

const WAIT_TIME = 5;
const COUNTDOWN_TIME = 15;

/**
 * Main name picker component that orchestrates the game flow.
 * Designed for full-screen big-screen collaborative play.
 *
 * @param {object} props
 * @param {React.ComponentType} props.AnimationComponent - Slot machine component
 * @param {string[]} props.names - Array of participant names
 */
export function NamePicker({ AnimationComponent, names }) {
  const [phase, setPhase] = useState('idle');
  const [targetName, setTargetName] = useState(null);

  const {
    availableNames,
    pickedNames,
    currentName,
    protectedNames,
    pickName,
    confirmPick,
    protectGift,
    reset: resetNames,
    startNextRound,
    isRoundComplete,
    isGameComplete,
    currentRound,
    canProtect,
    totalNames,
    unprotectedCount,
  } = useNamePicker(names);

  const waitTimer = useTimer(WAIT_TIME, () => {
    setPhase('countdown');
    countdownTimer.reset(COUNTDOWN_TIME);
    countdownTimer.start();
    audio.play();
  });

  const countdownTimer = useTimer(COUNTDOWN_TIME, () => {
    audio.stop();
    setPhase('modal');
  });

  const audio = useAudio(COUNTDOWN_MUSIC_PATH, { loop: true, volume: 0.5 });

  // Determine if this is the first pick (no one has been picked yet)
  const isFirstPick = pickedNames.length === 0 && !targetName;

  // Handle spin button click
  const handlePickName = useCallback(() => {
    if (phase !== 'idle' || isRoundComplete) return;

    const name = pickName();
    if (name) {
      setTargetName(name);
      setPhase('spinning');
    }
  }, [phase, isRoundComplete, pickName]);

  // Handle animation complete
  const handleSpinComplete = useCallback(() => {
    // Confirm the pick - this adds to pickedNames list
    confirmPick();
    setPhase('revealed');

    // After 1 second of showing the name, start wait timer
    setTimeout(() => {
      setPhase('waiting');
      waitTimer.reset(WAIT_TIME);
      waitTimer.start();
    }, 1000);
  }, [waitTimer, confirmPick]);

  // Handle modal next player button
  const handleNextPlayer = useCallback(() => {
    setPhase('idle');
    setTargetName(null);
    waitTimer.reset();
    countdownTimer.reset();

    // If round is complete and game not over, start next round
    if (isRoundComplete && !isGameComplete) {
      startNextRound();
    }
    // If game is fully complete (all protected), reset
    else if (isGameComplete) {
      resetNames();
    }
  }, [isRoundComplete, isGameComplete, resetNames, startNextRound, waitTimer, countdownTimer]);

  // Handle protect gift button in modal
  const handleProtectGift = useCallback(() => {
    protectGift();
    // Then proceed to next player
    setPhase('idle');
    setTargetName(null);
    waitTimer.reset();
    countdownTimer.reset();

    // If round is complete and game not over, start next round
    // Note: We need to check with unprotectedCount - 1 since protection just happened
    if (isRoundComplete && unprotectedCount > 1) {
      startNextRound();
    }
  }, [protectGift, isRoundComplete, unprotectedCount, startNextRound, waitTimer, countdownTimer]);

  // Cleanup audio on phase change
  useEffect(() => {
    if (phase !== 'countdown') {
      audio.stop();
    }
  }, [phase, audio]);

  // Get button text based on game state
  const getButtonText = () => {
    if (isRoundComplete) return 'Ronde voltooid!';
    if (isFirstPick) return 'Wie begint?';
    return 'Volgende speler';
  };

  // Check if slot machine should show the selected name (keep it visible)
  const showSelectedInSlot = phase !== 'idle' && targetName;

  return (
    <div className="name-picker">
      {/* Left Panel - Rules */}
      <aside className="picker-sidebar picker-sidebar-left">
        <RulesPanel />
      </aside>

      {/* Center Panel - Main Game Area */}
      <div className="picker-center">
        {/* Current player prompt (only after first pick, when idle) */}
        {!isFirstPick && phase === 'idle' && currentName && (
          <div className="current-player-prompt">
            <span className="prompt-label">Nu aan de beurt:</span>
            <span className="prompt-name">{currentName}</span>
          </div>
        )}

        {/* Animation component - name stays visible in the slot after spinning */}
        <div className="picker-animation">
          <AnimationComponent
            names={availableNames.length > 0 ? availableNames : names}
            isSpinning={phase === 'spinning'}
            targetName={targetName}
            onSpinComplete={handleSpinComplete}
            showResult={showSelectedInSlot}
          />
        </div>

        {/* Timer display */}
        {(phase === 'waiting' || phase === 'countdown') && (
          <div className="picker-timer">
            {phase === 'waiting' && (
              <Timer
                seconds={waitTimer.time}
                totalSeconds={WAIT_TIME}
                label="Maak je klaar..."
                type="wait"
              />
            )}
            {phase === 'countdown' && (
              <Timer
                seconds={countdownTimer.time}
                totalSeconds={COUNTDOWN_TIME}
                label="Kies nu!"
                type="countdown"
              />
            )}
          </div>
        )}

        {/* Pick name button */}
        <div className="picker-action">
          <button
            className={`pick-button ${isFirstPick ? 'pick-button-first' : ''}`}
            onClick={handlePickName}
            disabled={phase !== 'idle' || isRoundComplete}
          >
            {getButtonText()}
          </button>
        </div>
      </div>

      {/* Right Panel - Progress */}
      <aside className="picker-sidebar picker-sidebar-right">
        <div className="progress-panel">
          <h3 className="progress-title">Voortgang</h3>

          {/* Round indicator */}
          <div className="round-indicator">
            <span className="round-label">Ronde</span>
            <span className="round-number">{currentRound}</span>
          </div>

          <div className="progress-stats">
            <div className="stat-box stat-remaining">
              <span className="stat-number">{availableNames.length}</span>
              <span className="stat-label">Nog te gaan</span>
            </div>
            <div className="stat-box stat-picked">
              <span className="stat-number">{pickedNames.length}</span>
              <span className="stat-label">Geweest</span>
            </div>
          </div>

          <div className="progress-bar-vertical">
            <div
              className="progress-fill-vertical"
              style={{ width: `${(pickedNames.length / totalNames) * 100}%` }}
            />
          </div>

          {pickedNames.length > 0 && (
            <div className="picked-list">
              <h4 className="picked-title">Al geweest:</h4>
              <ul className="picked-names">
                {pickedNames.map((name, index) => (
                  <li key={index} className="picked-name">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {protectedNames.length > 0 && (
            <div className="protected-list">
              <h4 className="protected-title">Beschermd (mag weg):</h4>
              <ul className="protected-names">
                {protectedNames.map((name, index) => (
                  <li key={index} className="protected-name">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* Times up modal */}
      <TimesUpModal
        isOpen={phase === 'modal'}
        onNextPlayer={handleNextPlayer}
        isGameComplete={isGameComplete}
        canProtect={canProtect}
        onProtectGift={handleProtectGift}
        currentPlayerName={currentName}
      />
    </div>
  );
}
