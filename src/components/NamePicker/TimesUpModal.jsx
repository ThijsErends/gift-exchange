import './TimesUpModal.css';

/**
 * Modal popup shown when the countdown timer ends.
 * Displays "Tijd is om!" with a button to proceed to next player.
 * After round 1, also shows option to protect gift.
 */
export function TimesUpModal({
  isOpen,
  onNextPlayer,
  isGameComplete,
  canProtect,
  onProtectGift,
  currentPlayerName
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isGameComplete ? (
          <>
            <div className="modal-icon">🎉</div>
            <h2 className="modal-title">Klaar!</h2>
            <p className="modal-message">
              Alle namen zijn getrokken. Bedankt voor het spelen!
            </p>
            <button className="modal-button modal-button-complete" onClick={onNextPlayer}>
              Opnieuw beginnen
            </button>
          </>
        ) : (
          <>
            <div className="modal-icon">⏰</div>
            <h2 className="modal-title">Tijd is om!</h2>
            <p className="modal-message">
              Pak je een cadeautje af of pak je een nieuw cadeautje uit?
            </p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={onNextPlayer}>
                Volgende speler
              </button>
              {canProtect && (
                <button
                  className="modal-button modal-button-protect"
                  onClick={onProtectGift}
                >
                  Bescherm mijn cadeau
                </button>
              )}
            </div>
            {canProtect && (
              <p className="modal-hint">
                {currentPlayerName}, wil je je cadeau beschermen? Dan mag je eerder weg!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
