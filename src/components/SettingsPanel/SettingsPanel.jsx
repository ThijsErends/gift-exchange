import { useState } from 'react';
import './SettingsPanel.css';

/**
 * Settings panel modal for managing participant names and game resets.
 */
export function SettingsPanel({
  isOpen,
  onClose,
  names,
  onAddName,
  onRemoveName,
  onResetGame,
  onResetNames,
}) {
  const [newName, setNewName] = useState('');

  if (!isOpen) return null;

  const handleAddName = (e) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    if (trimmedName && !names.includes(trimmedName)) {
      onAddName(trimmedName);
      setNewName('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddName(e);
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-content" onClick={(e) => e.stopPropagation()}>
        <button className="settings-close" onClick={onClose} aria-label="Sluiten">
          ✕
        </button>

        <div className="settings-header">
          <span className="settings-icon">⚙️</span>
          <h2 className="settings-title">Instellingen</h2>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Deelnemers</h3>

          <div className="settings-add-name">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Naam toevoegen..."
              className="settings-input"
              maxLength={30}
            />
            <button
              onClick={handleAddName}
              className="settings-add-button"
              disabled={!newName.trim() || names.includes(newName.trim())}
            >
              +
            </button>
          </div>

          <ul className="settings-names-list">
            {names.map((name) => (
              <li key={name} className="settings-name-item">
                <span className="settings-name-text">{name}</span>
                <button
                  onClick={() => onRemoveName(name)}
                  className="settings-remove-button"
                  aria-label={`Verwijder ${name}`}
                  disabled={names.length <= 1}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Reset Opties</h3>
          <div className="settings-buttons">
            <button onClick={onResetGame} className="settings-button settings-button-reset">
              Reset Spel
            </button>
            <button onClick={onResetNames} className="settings-button settings-button-names">
              Reset Namen
            </button>
          </div>
          <p className="settings-hint">
            "Reset Spel" start het spel opnieuw met dezelfde namen.
            "Reset Namen" herstelt de originele namenlijst.
          </p>
        </div>

        <p className="settings-footer">
          Namen worden opgeslagen in je browser sessie.
        </p>
      </div>
    </div>
  );
}
