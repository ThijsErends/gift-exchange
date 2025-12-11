import { useState, useEffect, useCallback } from 'react';
import { NamePicker } from './components/NamePicker/NamePicker';
import { SlotMachine } from './components/NamePicker/SlotMachine';
import { Snow } from './components/Snow/Snow';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { PARTICIPANTS } from './data/participants';
import './App.css';

const STORAGE_KEY = 'giftExchange_participants';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [names, setNames] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Invalid JSON, use defaults
      }
    }
    return [...PARTICIPANTS];
  });

  // Save names to session storage when they change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  }, [names]);

  const handleAddName = useCallback((name) => {
    setNames((prev) => [...prev, name]);
    // Increment key to reset game when names change
    setGameKey((prev) => prev + 1);
  }, []);

  const handleRemoveName = useCallback((name) => {
    setNames((prev) => prev.filter((n) => n !== name));
    // Increment key to reset game when names change
    setGameKey((prev) => prev + 1);
  }, []);

  const handleResetGame = useCallback(() => {
    // Increment key to force NamePicker to remount and reset
    setGameKey((prev) => prev + 1);
    setIsSettingsOpen(false);
  }, []);

  const handleResetNames = useCallback(() => {
    setNames([...PARTICIPANTS]);
    sessionStorage.removeItem(STORAGE_KEY);
    // Increment key to reset game with new names
    setGameKey((prev) => prev + 1);
    setIsSettingsOpen(false);
  }, []);

  return (
    <div className="app">
      <Snow count={60} />
      <header className="header">
        <h1>Gift Exchange.</h1>
        <button
          className="settings-toggle"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open instellingen"
        >
          ⚙️
        </button>
      </header>

      <main className="main">
        <NamePicker key={gameKey} AnimationComponent={SlotMachine} names={names} />
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        names={names}
        onAddName={handleAddName}
        onRemoveName={handleRemoveName}
        onResetGame={handleResetGame}
        onResetNames={handleResetNames}
      />
    </div>
  );
}

export default App;
