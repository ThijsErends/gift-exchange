import './Timer.css';

/**
 * Countdown timer display component.
 * Shows remaining time with visual feedback and color changes.
 */
export function Timer({ seconds, totalSeconds, label, type = 'countdown' }) {
  // Calculate progress percentage
  const progress = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;

  // Determine urgency level for styling
  const getUrgencyClass = () => {
    if (type === 'wait') return 'timer-wait';
    if (seconds <= 3) return 'timer-critical';
    if (seconds <= 5) return 'timer-urgent';
    if (seconds <= 10) return 'timer-warning';
    return 'timer-normal';
  };

  return (
    <div className={`timer ${getUrgencyClass()}`}>
      {label && <div className="timer-label">{label}</div>}

      <div className="timer-display">
        <div className="timer-circle">
          {/* Background circle */}
          <svg className="timer-svg" viewBox="0 0 100 100">
            <circle
              className="timer-bg-circle"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
            />
            <circle
              className="timer-progress-circle"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              transform="rotate(-90 50 50)"
            />
          </svg>

          <div className="timer-number">{seconds}</div>
        </div>
      </div>
    </div>
  );
}
